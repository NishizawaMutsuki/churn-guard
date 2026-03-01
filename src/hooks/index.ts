import useSWR from "swr";
import type {
  MemberWithRisk,
  MemberDetail,
  MonthlyStatSummary,
  VisitStats,
  KPIData,
} from "@/types";
import type { Tenant, Plan, RetentionRule, ActionLog } from "@prisma/client";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  });

// ============================================================
// 会員
// ============================================================

export function useMembers(options?: { status?: string; sort?: string }) {
  const params = new URLSearchParams();
  if (options?.status) params.set("status", options.status);
  if (options?.sort) params.set("sort", options.sort);

  const queryString = params.toString();
  const url = `/api/members${queryString ? `?${queryString}` : ""}`;

  const { data, error, isLoading, mutate } = useSWR<MemberWithRisk[]>(
    url,
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    members: data ?? [],
    error,
    isLoading,
    mutate,
  };
}

export function useMember(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<MemberDetail>(
    id ? `/api/members/${id}` : null,
    fetcher
  );

  return { member: data, error, isLoading, mutate };
}

export function useVisitStats(memberId: string | null) {
  const { data, error, isLoading } = useSWR<VisitStats>(
    memberId ? `/api/members/${memberId}/stats` : null,
    fetcher
  );

  return {
    stats: data,
    error,
    isLoading,
  };
}

// ============================================================
// 解約統計
// ============================================================

export function useChurnStats(months: number = 6) {
  const { data, error, isLoading } = useSWR<MonthlyStatSummary[]>(
    `/api/churn?months=${months}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  return {
    churnStats: data ?? [],
    error,
    isLoading,
  };
}

// ============================================================
// テナント設定
// ============================================================

type TenantWithRelations = Tenant & {
  plans: Plan[];
  retentionRules: RetentionRule[];
};

export function useTenant() {
  const { data, error, isLoading, mutate } = useSWR<TenantWithRelations>(
    "/api/tenant",
    fetcher
  );

  return {
    tenant: data,
    error,
    isLoading,
    mutate,
  };
}

// ============================================================
// 施策ログ
// ============================================================

type ActionLogWithRelations = ActionLog & {
  member: { name: string };
  rule: { name: string } | null;
};

export function useActionLogs(limit: number = 50) {
  const { data, error, isLoading } = useSWR<ActionLogWithRelations[]>(
    `/api/actions?limit=${limit}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  return {
    actionLogs: data ?? [],
    error,
    isLoading,
  };
}

// ============================================================
// KPI (ダッシュボード用の集約データ)
// ============================================================

export function useKPI() {
  const { members } = useMembers();
  const { churnStats } = useChurnStats(1);

  const kpi: KPIData = {
    totalActiveMembers: members.length,
    currentChurnRate: churnStats[0]?.churnRate ?? 0,
    highRiskCount: members.filter(
      (m) => (m.riskSnapshots?.[0]?.riskScore ?? 0) >= 70
    ).length,
    avgVisitsPerMember:
      members.length > 0
        ? Math.round(
            members.reduce((sum, m) => sum + (m.visitsThisMonth ?? 0), 0) /
              members.length
          )
        : 0,
  };

  return kpi;
}
