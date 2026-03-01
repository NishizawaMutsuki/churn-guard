import { NextResponse } from "next/server";
import { MEMBERS } from "@/lib/demo-data";

// GET /api/members - 会員一覧取得
// TODO: Replace with DB query (e.g. Prisma + PlanetScale / Supabase)
export async function GET() {
  return NextResponse.json({ members: MEMBERS });
}

// POST /api/members - 会員データCSVインポート
// TODO: Implement CSV import & IC card data sync
export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: "Not implemented yet", received: body }, { status: 501 });
}
