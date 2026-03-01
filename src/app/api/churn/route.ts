import { NextResponse } from "next/server";
import { MONTHLY_CHURN_DATA } from "@/lib/demo-data";

// GET /api/churn - 退会率データ取得
// TODO: Implement real churn prediction algorithm
// Key signals to track:
//   - Visit frequency decline (week-over-week)
//   - Day-of-week pattern changes
//   - Session duration reduction
//   - Membership tenure (first 3 months = highest risk)
export async function GET() {
  return NextResponse.json({ churnData: MONTHLY_CHURN_DATA });
}
