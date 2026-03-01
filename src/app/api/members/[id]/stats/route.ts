import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";
import type { VisitStats } from "@/types";

/**
 * GET /api/members/[id]/stats
 * 会員の来館統計を返す
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const { id } = await params;

  // テナント所属確認
  const member = await prisma.member.findFirst({
    where: { id, tenantId },
    select: { id: true, joinDate: true },
  });
  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // 全来館記録 (直近90日)
  const visits = await prisma.visit.findMany({
    where: {
      memberId: id,
      tenantId,
      visitedAt: { gte: ninetyDaysAgo },
    },
    orderBy: { visitedAt: "desc" },
  });

  const visitsThisMonth = visits.filter(
    (v) => v.visitedAt >= thisMonthStart
  ).length;

  const visitsLastMonth = visits.filter(
    (v) => v.visitedAt >= lastMonthStart && v.visitedAt <= lastMonthEnd
  ).length;

  // 平均月間来館数
  const totalVisits = await prisma.visit.count({
    where: { memberId: id, tenantId },
  });
  const monthsSinceJoin = Math.max(
    1,
    (now.getFullYear() - member.joinDate.getFullYear()) * 12 +
      (now.getMonth() - member.joinDate.getMonth())
  );
  const avgVisits = Math.round(totalVisits / monthsSinceJoin);

  // 最終来館日
  const lastVisit = visits[0]?.visitedAt;
  const daysSinceLastVisit = lastVisit
    ? Math.floor(
        (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 999;

  // 日別来館数 (直近30日)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const recentVisits = visits.filter((v) => v.visitedAt >= thirtyDaysAgo);
  const dailyMap = new Map<string, number>();
  for (let d = 0; d < 30; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    const key = date.toISOString().split("T")[0];
    dailyMap.set(key, 0);
  }
  for (const v of recentVisits) {
    const key = v.visitedAt.toISOString().split("T")[0];
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
  }
  const dailyVisits = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const stats: VisitStats = {
    visitsThisMonth,
    visitsLastMonth,
    avgVisits,
    daysSinceLastVisit,
    dailyVisits,
  };

  return Response.json(stats);
}
