import { prisma } from "./prisma";

/**
 * テナントスコープ付き Prisma Client を返す。
 * 全クエリに WHERE tenant_id = ? を自動注入する。
 *
 * 使い方:
 *   const db = withTenant("tenant_abc123");
 *   const members = await db.member.findMany(); // 自動で tenantId フィルタ
 */
export function withTenant(tenantId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }: { args: any; query: any }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async findFirst({ args, query }: { args: any; query: any }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async create({ args, query }: { args: any; query: any }) {
          args.data = { ...args.data, tenantId };
          return query(args);
        },
        async updateMany({ args, query }: { args: any; query: any }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async deleteMany({ args, query }: { args: any; query: any }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
        async count({ args, query }: { args: any; query: any }) {
          args.where = { ...args.where, tenantId };
          return query(args);
        },
      },
    },
  });
}

/** withTenant の返り値の型 */
export type TenantScopedClient = ReturnType<typeof withTenant>;
