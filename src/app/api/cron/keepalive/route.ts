import { prisma } from "@/lib/prisma";

/**
 * GET /api/cron/keepalive
 * Supabase 無料枠の自動停止を防ぐための定期 ping。
 * 3日に1回実行。
 */
export async function GET() {
  const count = await prisma.tenant.count();

  return Response.json({
    ok: true,
    tenants: count,
    timestamp: new Date().toISOString(),
  });
}
