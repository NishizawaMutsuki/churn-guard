import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/monthly-stats
 * 前月の退会統計を集計する月次バッチ。
 * Vercel Cron Jobs から毎月1日 0:00 に呼び出される想定。
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const monthKey = new Date(lastMonthStart); // 月初日

  const tenants = await prisma.tenant.findMany({ select: { id: true } });
  const results = [];

  for (const tenant of tenants) {
    // 月末時点の会員数
    const totalMembers = await prisma.member.count({
      where: {
        tenantId: tenant.id,
        joinDate: { lte: lastMonthEnd },
        OR: [
          { status: "ACTIVE" },
          { status: "SUSPENDED" },
          // CHURNED でも当月退会なら月初は在籍していた
          {
            status: "CHURNED",
            updatedAt: { gte: lastMonthStart },
          },
        ],
      },
    });

    // 当月の新規入会数
    const newMembers = await prisma.member.count({
      where: {
        tenantId: tenant.id,
        joinDate: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });

    // 当月の退会数
    const churnedMembers = await prisma.member.count({
      where: {
        tenantId: tenant.id,
        status: "CHURNED",
        updatedAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });

    // 当月の来館数
    const totalVisits = await prisma.visit.count({
      where: {
        tenantId: tenant.id,
        visitedAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
    });

    const churnRate = totalMembers > 0 ? churnedMembers / totalMembers : 0;

    const stat = await prisma.monthlyStat.upsert({
      where: {
        tenantId_month: { tenantId: tenant.id, month: monthKey },
      },
      create: {
        tenantId: tenant.id,
        month: monthKey,
        totalMembers,
        newMembers,
        churnedMembers,
        churnRate: Math.round(churnRate * 1000) / 1000,
        totalVisits,
      },
      update: {
        totalMembers,
        newMembers,
        churnedMembers,
        churnRate: Math.round(churnRate * 1000) / 1000,
        totalVisits,
      },
    });

    results.push(stat);
  }

  return Response.json({
    success: true,
    month: lastMonthStart.toISOString().slice(0, 7),
    tenantsProcessed: results.length,
    results,
  });
}
