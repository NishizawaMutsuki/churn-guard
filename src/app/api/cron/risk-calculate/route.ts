import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateRiskScore,
  computeFactorsFromVisits,
} from "@/lib/risk-calculator";

/**
 * GET /api/cron/risk-calculate
 * 全テナントの全アクティブ会員のリスクスコアを再計算する日次バッチ。
 * Vercel Cron Jobs から毎日 3:00 AM に呼び出される想定。
 *
 * セキュリティ: CRON_SECRET ヘッダーで認証
 */
export async function GET(request: NextRequest) {
  // Vercel Cron 認証
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenants = await prisma.tenant.findMany({ select: { id: true } });
  let totalProcessed = 0;

  for (const tenant of tenants) {
    const members = await prisma.member.findMany({
      where: { tenantId: tenant.id, status: "ACTIVE" },
      select: { id: true, joinDate: true },
    });

    for (const member of members) {
      const visits = await prisma.visit.findMany({
        where: { memberId: member.id },
        select: { visitedAt: true },
        orderBy: { visitedAt: "desc" },
      });

      const factors = computeFactorsFromVisits(visits, member.joinDate);
      const result = calculateRiskScore(factors);

      await prisma.riskSnapshot.create({
        data: {
          tenantId: tenant.id,
          memberId: member.id,
          riskScore: result.score,
          trend: result.trend,
          factors: result.factors as unknown as Record<string, number>,
        },
      });

      totalProcessed++;
    }
  }

  return Response.json({
    success: true,
    processedMembers: totalProcessed,
    tenantsProcessed: tenants.length,
    timestamp: new Date().toISOString(),
  });
}
