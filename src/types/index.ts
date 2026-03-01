// Prisma 自動生成型の re-export
export type {
  Tenant,
  Plan,
  Member,
  MemberStatus,
  Visit,
  VisitMethod,
  RiskSnapshot,
  Trend,
  RetentionRule,
  ActionLog,
  ActionChannel,
  ActionStatus,
  MonthlyStat,
  User,
  UserRole,
  QrCode,
} from "@prisma/client";

import type { Prisma } from "@prisma/client";

// ============================================================
// API レスポンス用の拡張型
// ============================================================

/** 会員 + 最新リスクスコア + プラン */
export type MemberWithRisk = Prisma.MemberGetPayload<{
  include: {
    plan: true;
    riskSnapshots: true;
  };
}> & {
  visitsThisMonth?: number;
  visitsLastMonth?: number;
  avgVisits?: number;
};

/** 会員詳細 (来館履歴付き) */
export type MemberDetail = Prisma.MemberGetPayload<{
  include: {
    plan: true;
    riskSnapshots: true;
    visits: true;
    actionLogs: true;
  };
}>;

/** ダッシュボード用データ */
export type DashboardData = {
  members: MemberWithRisk[];
  churnStats: MonthlyStatSummary[];
  kpi: KPIData;
};

/** 月次統計サマリー */
export type MonthlyStatSummary = {
  month: string; // "2026-01"
  totalMembers: number;
  churnedMembers: number;
  churnRate: number;
  newMembers: number;
  totalVisits: number;
};

/** KPI カード用データ */
export type KPIData = {
  totalActiveMembers: number;
  currentChurnRate: number;
  highRiskCount: number;
  avgVisitsPerMember: number;
};

/** 来館統計 */
export type VisitStats = {
  visitsThisMonth: number;
  visitsLastMonth: number;
  avgVisits: number;
  daysSinceLastVisit: number;
  dailyVisits: { date: string; count: number }[];
};

/** API エラーレスポンス */
export type ApiError = {
  error: string;
  details?: string;
};
