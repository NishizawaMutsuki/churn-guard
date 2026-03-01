import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";

/**
 * GET /api/members
 * 会員一覧を取得（最新リスクスコア付き）
 *
 * Query params:
 *   - status: ACTIVE | CHURNED | SUSPENDED (デフォルト: ACTIVE)
 *   - sort: risk | name | lastVisit (デフォルト: risk)
 *   - limit: number (デフォルト: 50)
 */
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const params = request.nextUrl.searchParams;
  const status = params.get("status") ?? "ACTIVE";
  const sort = params.get("sort") ?? "risk";
  const limit = Math.min(parseInt(params.get("limit") ?? "50"), 200);

  const members = await prisma.member.findMany({
    where: {
      tenantId,
      status: status as "ACTIVE" | "CHURNED" | "SUSPENDED",
    },
    include: {
      plan: true,
      riskSnapshots: {
        take: 1,
        orderBy: { calculatedAt: "desc" },
      },
    },
    take: limit,
  });

  // 来館統計を一括取得
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const memberIds = members.map((m) => m.id);

  // 今月の来館数
  const thisMonthVisits = await prisma.visit.groupBy({
    by: ["memberId"],
    where: {
      tenantId,
      memberId: { in: memberIds },
      visitedAt: { gte: thisMonthStart },
    },
    _count: { id: true },
  });

  // 先月の来館数
  const lastMonthVisits = await prisma.visit.groupBy({
    by: ["memberId"],
    where: {
      tenantId,
      memberId: { in: memberIds },
      visitedAt: { gte: lastMonthStart, lte: lastMonthEnd },
    },
    _count: { id: true },
  });

  const thisMonthMap = new Map(
    thisMonthVisits.map((v) => [v.memberId, v._count.id])
  );
  const lastMonthMap = new Map(
    lastMonthVisits.map((v) => [v.memberId, v._count.id])
  );

  // レスポンス組み立て
  const result = members.map((member) => ({
    ...member,
    visitsThisMonth: thisMonthMap.get(member.id) ?? 0,
    visitsLastMonth: lastMonthMap.get(member.id) ?? 0,
  }));

  // ソート
  if (sort === "risk") {
    result.sort(
      (a, b) =>
        (b.riskSnapshots[0]?.riskScore ?? 0) -
        (a.riskSnapshots[0]?.riskScore ?? 0)
    );
  } else if (sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name, "ja"));
  }

  return Response.json(result);
}

/**
 * POST /api/members
 * 新規会員を追加
 */
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const body = await request.json();

  const member = await prisma.member.create({
    data: {
      tenantId,
      name: body.name,
      email: body.email ?? null,
      age: body.age ?? null,
      planId: body.planId ?? null,
      joinDate: body.joinDate ? new Date(body.joinDate) : new Date(),
    },
    include: { plan: true },
  });

  return Response.json(member, { status: 201 });
}
