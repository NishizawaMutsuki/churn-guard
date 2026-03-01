import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/visits/check-in
 * QRコードスキャンによる来館記録。認証不要（QRコード自体がトークン）。
 *
 * Body: { code: string }
 */
export async function POST(request: NextRequest) {
  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.code) {
    return Response.json({ error: "QR code is required" }, { status: 400 });
  }

  // QRコード検索
  const qrCode = await prisma.qrCode.findUnique({
    where: { code: body.code },
    include: {
      tenant: { select: { id: true, name: true, branch: true } },
    },
  });

  if (!qrCode || !qrCode.isActive) {
    return Response.json(
      { error: "Invalid or deactivated QR code" },
      { status: 404 }
    );
  }

  // 同日チェック: 1日1回制限
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingVisit = await prisma.visit.findFirst({
    where: {
      memberId: qrCode.memberId,
      visitedAt: { gte: today },
    },
  });

  if (existingVisit) {
    return Response.json({
      success: true,
      message: "Already checked in today",
      alreadyCheckedIn: true,
      visit: existingVisit,
    });
  }

  // 来館記録作成
  const visit = await prisma.visit.create({
    data: {
      tenantId: qrCode.tenantId,
      memberId: qrCode.memberId,
      method: "QR_CODE",
    },
  });

  // 会員名を取得してレスポンス
  const member = await prisma.member.findUnique({
    where: { id: qrCode.memberId },
    select: { name: true },
  });

  return Response.json({
    success: true,
    message: `${member?.name ?? "会員"}さん、チェックインしました！`,
    alreadyCheckedIn: false,
    visit,
    gym: qrCode.tenant,
  });
}
