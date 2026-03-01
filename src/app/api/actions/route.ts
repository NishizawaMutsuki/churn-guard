import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTenantId, unauthorizedResponse } from "@/lib/auth";

/**
 * POST /api/actions
 * リテンション施策を実行 (LINE送信等)
 *
 * Body: { memberId: string, ruleId?: string, message: string, channel?: string }
 */
export async function POST(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const body = await request.json();

  if (!body.memberId || !body.message) {
    return Response.json(
      { error: "memberId and message are required" },
      { status: 400 }
    );
  }

  // 会員のテナント所属確認
  const member = await prisma.member.findFirst({
    where: { id: body.memberId, tenantId },
    select: { id: true, name: true },
  });
  if (!member) {
    return Response.json({ error: "Member not found" }, { status: 404 });
  }

  // TODO: Phase 6 で LINE Messaging API 送信を実装
  // const lineResult = await sendLineMessage(member.lineUserId, body.message);

  // アクションログ記録
  const actionLog = await prisma.actionLog.create({
    data: {
      tenantId,
      memberId: body.memberId,
      ruleId: body.ruleId ?? null,
      channel: body.channel ?? "LINE",
      status: "SENT", // TODO: LINE API の結果で SENT/FAILED を分岐
      messageSent: body.message,
    },
  });

  return Response.json({
    success: true,
    actionLog,
    message: `${member.name}さんへのメッセージを記録しました`,
    // TODO: LINE送信が実装されたら実際の送信結果を返す
    note: "LINE API未接続のため、ログ記録のみ実行",
  });
}

/**
 * GET /api/actions
 * 施策実行ログ一覧
 */
export async function GET(request: NextRequest) {
  const tenantId = await getTenantId(request);
  if (!tenantId) return unauthorizedResponse();

  const limit = parseInt(
    request.nextUrl.searchParams.get("limit") ?? "50"
  );

  const logs = await prisma.actionLog.findMany({
    where: { tenantId },
    include: {
      member: { select: { name: true } },
      rule: { select: { name: true } },
    },
    orderBy: { executedAt: "desc" },
    take: limit,
  });

  return Response.json(logs);
}
