import { NextRequest } from "next/server";

/**
 * リクエストからテナントIDを取得する。
 *
 * Phase 3 (NextAuth.js 導入後) では getServerSession() から取得する。
 * 現段階では以下の順序でフォールバック:
 *   1. x-tenant-id ヘッダー (開発・テスト用)
 *   2. クエリパラメータ ?tenantId= (開発用)
 *   3. 環境変数 DEFAULT_TENANT_ID (デモ用)
 */
export async function getTenantId(
  request: NextRequest
): Promise<string | null> {
  // TODO: Phase 3 で NextAuth.js セッションから取得に置き換え
  // const session = await getServerSession(authOptions);
  // return session?.user?.tenantId ?? null;

  // 開発用フォールバック
  const fromHeader = request.headers.get("x-tenant-id");
  if (fromHeader) return fromHeader;

  const fromQuery = request.nextUrl.searchParams.get("tenantId");
  if (fromQuery) return fromQuery;

  return process.env.DEFAULT_TENANT_ID ?? null;
}

/**
 * テナントIDが取得できない場合に 401 レスポンスを返すヘルパー
 */
export function unauthorizedResponse() {
  return Response.json(
    { error: "Unauthorized: tenant ID required" },
    { status: 401 }
  );
}
