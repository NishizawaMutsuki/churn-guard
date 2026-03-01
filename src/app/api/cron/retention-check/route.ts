import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/retention-check
 * アクティブなリテンションルールに該当する会員に自動メッセージを送信する日次バッチ。
 * Vercel Cron Jobs から毎日 9:00 AM に呼び出される想定。
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenants = await prisma.tenant.findMany({ select: { id: true } });
  let totalActions = 0;

  for (const tenant of tenants) {
    const rules = await prisma.retentionRule.findMany({
      where: { tenantId: tenant.id, isActive: true },
    });

    for (const rule of rules) {
      const condition = rule.triggerCondition as Record<string, unknown>;
      let targetMembers: { id: string; name: string }[] = [];

      // ルール種別に応じた対象会員の抽出
      if (condition.type === "risk_threshold") {
        const minScore = (condition.minScore as number) ?? 80;
        const highRiskSnapshots = await prisma.riskSnapshot.findMany({
          where: { tenantId: tenant.id },
          distinct: ["memberId"],
          orderBy: { calculatedAt: "desc" },
          select: { memberId: true, riskScore: true },
        });

        const highRiskMemberIds = highRiskSnapshots
          .filter((s) => s.riskScore >= minScore)
          .map((s) => s.memberId);

        targetMembers = await prisma.member.findMany({
          where: {
            id: { in: highRiskMemberIds },
            tenantId: tenant.id,
            status: "ACTIVE",
          },
          select: { id: true, name: true },
        });
      } else if (condition.type === "days_since_last_visit") {
        const threshold = (condition.threshold as number) ?? 14;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - threshold);

        // 閾値以降に来館がない会員を抽出
        const activeMembers = await prisma.member.findMany({
          where: { tenantId: tenant.id, status: "ACTIVE" },
          select: { id: true, name: true },
        });

        for (const member of activeMembers) {
          const recentVisit = await prisma.visit.findFirst({
            where: {
              memberId: member.id,
              visitedAt: { gte: cutoffDate },
            },
          });
          if (!recentVisit) {
            targetMembers.push(member);
          }
        }
      } else if (condition.type === "visit_drop") {
        const dropRate = (condition.dropRate as number) ?? 0.5;
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const activeMembers = await prisma.member.findMany({
          where: { tenantId: tenant.id, status: "ACTIVE" },
          select: { id: true, name: true },
        });

        for (const member of activeMembers) {
          const thisMonth = await prisma.visit.count({
            where: {
              memberId: member.id,
              visitedAt: { gte: thisMonthStart },
            },
          });
          const lastMonth = await prisma.visit.count({
            where: {
              memberId: member.id,
              visitedAt: { gte: lastMonthStart, lte: lastMonthEnd },
            },
          });

          if (lastMonth > 0 && thisMonth / lastMonth < dropRate) {
            targetMembers.push(member);
          }
        }
      }

      // 重複送信防止: 過去7日以内に同じルールで送信済みの会員を除外
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentActions = await prisma.actionLog.findMany({
        where: {
          tenantId: tenant.id,
          ruleId: rule.id,
          executedAt: { gte: sevenDaysAgo },
        },
        select: { memberId: true },
      });
      const recentlySent = new Set(recentActions.map((a) => a.memberId));
      targetMembers = targetMembers.filter((m) => !recentlySent.has(m.id));

      // アクション実行
      for (const member of targetMembers) {
        const message = rule.messageTemplate.replace(
          /\{\{name\}\}/g,
          member.name
        );

        // TODO: Phase 6 で実際の LINE 送信を実装
        await prisma.actionLog.create({
          data: {
            tenantId: tenant.id,
            memberId: member.id,
            ruleId: rule.id,
            channel: rule.channel,
            status: "SENT",
            messageSent: message,
          },
        });

        totalActions++;
      }
    }
  }

  return Response.json({
    success: true,
    totalActionsSent: totalActions,
    timestamp: new Date().toISOString(),
  });
}
