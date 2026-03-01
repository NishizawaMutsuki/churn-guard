import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";

/**
 * GET /api/members/[id]
 * 会員詳細 (来館履歴・リスク履歴・施策ログ付き)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const { id } = await params;

  const member = await prisma.member.findFirst({
    where: { id, tenantId },
    include: {
      plan: true,
      riskSnapshots: {
        orderBy: { calculatedAt: "desc" },
        take: 10,
      },
      visits: {
        orderBy: { visitedAt: "desc" },
        take: 90, // 直近90日分
      },
      actionLogs: {
        orderBy: { executedAt: "desc" },
        take: 20,
        include: { rule: true },
      },
    },
  });

  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  return Response.json(member);
}

/**
 * PATCH /api/members/[id]
 * 会員情報を更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const { id } = await params;
  const body = await request.json();

  // テナント所属を確認
  const existing = await prisma.member.findFirst({
    where: { id, tenantId },
  });
  if (!existing) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  const member = await prisma.member.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      age: body.age,
      planId: body.planId,
      status: body.status,
    },
    include: { plan: true },
  });

  return Response.json(member);
}
