import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";

/**
 * GET /api/churn
 * 月次解約統計を取得
 *
 * Query params:
 *   - months: number (デフォルト: 6)
 */
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const months = parseInt(
    request.nextUrl.searchParams.get("months") ?? "6"
  );

  const stats = await prisma.monthlyStat.findMany({
    where: { tenantId },
    orderBy: { month: "desc" },
    take: months,
  });

  const result = stats
    .map((s) => ({
      month: s.month.toISOString().slice(0, 7), // "2026-03"
      totalMembers: s.totalMembers,
      newMembers: s.newMembers,
      churnedMembers: s.churnedMembers,
      churnRate: s.churnRate,
      totalVisits: s.totalVisits,
    }))
    .reverse(); // 古い順に並べ替え

  return Response.json(result);
}
