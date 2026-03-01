import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";

/**
 * GET /api/tenant
 * テナント設定を取得 (GymConfig相当)
 */
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      plans: { where: { isActive: true }, orderBy: { fee: "asc" } },
      retentionRules: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!tenant) {
    return Response.json({ error: "Tenant not found" }, { status: 404 });
  }

  return Response.json(tenant);
}

/**
 * PATCH /api/tenant
 * テナント設定を更新
 */
export async function PATCH(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const body = await request.json();

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      name: body.name,
      branch: body.branch,
      features: body.features,
      lineAccountName: body.lineAccountName,
      lineChannelAccessToken: body.lineChannelAccessToken,
      lineChannelSecret: body.lineChannelSecret,
    },
  });

  return Response.json(tenant);
}
