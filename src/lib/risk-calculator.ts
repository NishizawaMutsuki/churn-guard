import type { Trend } from "@prisma/client";

export interface RiskFactors {
  visitsThisMonth: number;
  visitsLastMonth: number;
  avgMonthlyVisits: number;
  daysSinceLastVisit: number;
}

export interface RiskResult {
  score: number; // 0-100
  trend: Trend;
  factors: RiskFactors;
}

/**
 * ルールベースのリスクスコア計算。
 *
 * スコアリングルール:
 *   ルール1 (最大40点): 今月の来館回数 vs 平均の低下率
 *   ルール2 (最大35点): 最終来館からの経過日数
 *   ルール3 (最大25点): 前月比のトレンド悪化
 *
 * 将来 AI モデルに置き換える場合はこのファイルだけ差し替える。
 */
export function calculateRiskScore(factors: RiskFactors): RiskResult {
  let score = 0;

  // ルール1: 来館頻度の低下 (最大40点)
  if (factors.avgMonthlyVisits > 0) {
    const dropRate = 1 - factors.visitsThisMonth / factors.avgMonthlyVisits;
    score += Math.min(40, Math.max(0, Math.round(dropRate * 60)));
  }

  // ルール2: 最終来館からの経過日数 (最大35点)
  if (factors.daysSinceLastVisit > 30) {
    score += 35;
  } else if (factors.daysSinceLastVisit > 14) {
    score += 25;
  } else if (factors.daysSinceLastVisit > 7) {
    score += 15;
  } else if (factors.daysSinceLastVisit > 3) {
    score += 5;
  }

  // ルール3: 前月比トレンド (最大25点)
  if (factors.visitsLastMonth > 0) {
    const ratio = factors.visitsThisMonth / factors.visitsLastMonth;
    if (ratio < 0.5) {
      score += 25;
    } else if (ratio < 0.75) {
      score += 15;
    }
  }

  score = Math.min(100, score);

  // トレンド判定
  const trend: Trend =
    factors.visitsThisMonth > factors.visitsLastMonth
      ? "DOWN" // リスク低下 (来館増)
      : factors.visitsThisMonth < factors.visitsLastMonth
        ? "UP" // リスク上昇 (来館減)
        : "STABLE";

  return { score, trend, factors };
}

/**
 * 会員の来館記録からRiskFactorsを算出するヘルパー
 */
export function computeFactorsFromVisits(
  visits: { visitedAt: Date }[],
  joinDate: Date
): RiskFactors {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const visitsThisMonth = visits.filter(
    (v) => v.visitedAt >= thisMonthStart
  ).length;

  const visitsLastMonth = visits.filter(
    (v) => v.visitedAt >= lastMonthStart && v.visitedAt <= lastMonthEnd
  ).length;

  // 平均月間来館数 (在籍月数で割る)
  const monthsSinceJoin = Math.max(
    1,
    (now.getFullYear() - joinDate.getFullYear()) * 12 +
      (now.getMonth() - joinDate.getMonth())
  );
  const avgMonthlyVisits = Math.round(visits.length / monthsSinceJoin);

  // 最終来館からの経過日数
  const lastVisit = visits
    .map((v) => v.visitedAt)
    .sort((a, b) => b.getTime() - a.getTime())[0];
  const daysSinceLastVisit = lastVisit
    ? Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
    : 999; // 来館記録なし

  return {
    visitsThisMonth,
    visitsLastMonth,
    avgMonthlyVisits,
    daysSinceLastVisit,
  };
}
