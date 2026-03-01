import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";
import { randomUUID } from "crypto";

/**
 * POST /api/qr
 * 会員用のQRコードを生成 (または再発行)
 *
 * Body: { memberId: string }
 * Returns: { code: string, checkInUrl: string }
 */
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const body = await request.json();

  if (!body.memberId) {
    return Response.json(
      { error: "memberId is required" },
      { status: 400 }
    );
  }

  // テナント所属確認
  const member = await prisma.member.findFirst({
    where: { id: body.memberId, tenantId },
    select: { id: true, name: true },
  });
  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  const code = randomUUID();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const checkInUrl = `${appUrl}/check-in?code=${code}`;

  // upsert: 既存があれば更新、なければ新規作成
  const qrCode = await prisma.qrCode.upsert({
    where: { memberId: body.memberId },
    create: {
      tenantId,
      memberId: body.memberId,
      code,
    },
    update: {
      code,
      isActive: true,
    },
  });

  return Response.json({
    qrCode,
    checkInUrl,
    memberName: member.name,
  });
}

/**
 * GET /api/qr
 * テナントの全QRコード一覧
 */
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const qrCodes = await prisma.qrCode.findMany({
    where: { tenantId, isActive: true },
    include: {
      tenant: { select: { name: true, branch: true } },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const result = qrCodes.map((qr) => ({
    ...qr,
    checkInUrl: `${appUrl}/check-in?code=${qr.code}`,
  }));

  return Response.json(result);
}
