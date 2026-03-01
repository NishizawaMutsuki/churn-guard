import { NextResponse } from "next/server";

// POST /api/actions - リテンション施策を実行
// TODO: Integrate with LINE Messaging API to actually send messages/coupons
//
// Flow:
// 1. Dashboard triggers action (message, coupon, trial, discount)
// 2. This API builds the LINE message payload
// 3. Sends via LINE Messaging API (push message)
// 4. Logs result to DB
//
// LINE Messaging API docs:
// https://developers.line.biz/ja/docs/messaging-api/
export async function POST(request: Request) {
  const { memberId, actionType, actionId } = await request.json();

  // TODO: Implement actual LINE message sending
  // const lineResponse = await sendLineMessage(memberId, actionType);

  return NextResponse.json({
    success: true,
    message: `Action ${actionType} queued for member ${memberId}`,
    // TODO: Return actual LINE API response
  });
}

// GET /api/actions - アクションログ取得
export async function GET() {
  // TODO: Fetch from DB
  return NextResponse.json({ log: [] });
}
