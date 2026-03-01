import { NextResponse } from "next/server";

// POST /api/line-webhook - LINE Webhook受信エンドポイント
// LINE公式アカウントからのイベントを受信する
//
// Setup:
// 1. LINE Developers Console でWebhook URLにこのエンドポイントを登録
// 2. Channel Secret でリクエスト署名を検証
// 3. イベントタイプに応じた処理を実装
//
// Events to handle:
// - follow: 友だち追加 → 会員DBと紐付け
// - unfollow: ブロック → リスクスコア最大に
// - message: ユーザーからのメッセージ → 自動応答 or オペレーター転送
// - postback: リッチメニュー/ボタンタップ → アクション実行
export async function POST(request: Request) {
  // TODO: Verify LINE signature
  // const signature = request.headers.get("x-line-signature");
  // const body = await request.text();
  // if (!verifySignature(body, signature)) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const events = body.events || [];

  for (const event of events) {
    switch (event.type) {
      case "follow":
        // TODO: Link LINE userId to member record
        break;
      case "unfollow":
        // TODO: Flag member as high-risk
        break;
      case "message":
        // TODO: Auto-reply or forward to staff
        break;
      case "postback":
        // TODO: Handle button taps (coupon use, class reservation, etc.)
        break;
    }
  }

  return NextResponse.json({ status: "ok" });
}
