// ===================== DEMO DATA =====================
// This file contains mock data for the A-1 EXPRESS demo.
// In production, replace with API calls to /api/members, /api/churn, etc.

import type { Member, ChurnDataPoint, RetentionAction, ActionLogEntry, LineMessage, GymConfig } from "@/types";

// ---- Gym Config ----
export const GYM_CONFIG: GymConfig = {
  gymName: "A-1 EXPRESS",
  gymBranch: "つつじヶ丘店",
  plans: [
    { name: "単店会員", fee: 5940 },
    { name: "レギュラー", fee: 6985 },
  ],
  features: ["24時間営業", "パワーラック", "スミスマシン", "ケーブルマシン"],
  lineAccountName: "A-1 EXPRESS つつじヶ丘",
};

// ---- Members ----
export const MEMBERS: Member[] = [
  { id: 1, name: "田中 太郎", age: 32, plan: "単店会員", monthlyFee: 5940, joinDate: "2025-04-15", lastVisit: "2026-02-10", visitsThisMonth: 1, visitsLastMonth: 8, avgVisits: 10, riskScore: 87, trend: "down", avatar: "🏋️" },
  { id: 2, name: "佐藤 花子", age: 28, plan: "レギュラー", monthlyFee: 6985, joinDate: "2025-01-10", lastVisit: "2026-02-25", visitsThisMonth: 5, visitsLastMonth: 7, avgVisits: 8, riskScore: 35, trend: "stable", avatar: "🧘" },
  { id: 3, name: "鈴木 一郎", age: 45, plan: "単店会員", monthlyFee: 5940, joinDate: "2024-11-01", lastVisit: "2026-01-20", visitsThisMonth: 0, visitsLastMonth: 2, avgVisits: 6, riskScore: 95, trend: "down", avatar: "💪" },
  { id: 4, name: "高橋 美咲", age: 24, plan: "レギュラー", monthlyFee: 6985, joinDate: "2025-09-01", lastVisit: "2026-02-27", visitsThisMonth: 10, visitsLastMonth: 12, avgVisits: 11, riskScore: 8, trend: "up", avatar: "🏃" },
  { id: 5, name: "伊藤 健太", age: 38, plan: "レギュラー", monthlyFee: 6985, joinDate: "2025-06-20", lastVisit: "2026-02-15", visitsThisMonth: 2, visitsLastMonth: 6, avgVisits: 7, riskScore: 72, trend: "down", avatar: "🤸" },
  { id: 6, name: "渡辺 あゆみ", age: 31, plan: "単店会員", monthlyFee: 5940, joinDate: "2025-03-05", lastVisit: "2026-02-28", visitsThisMonth: 8, visitsLastMonth: 9, avgVisits: 9, riskScore: 12, trend: "stable", avatar: "🏊" },
  { id: 7, name: "山本 大輔", age: 52, plan: "単店会員", monthlyFee: 5940, joinDate: "2025-08-15", lastVisit: "2026-02-05", visitsThisMonth: 1, visitsLastMonth: 3, avgVisits: 4, riskScore: 81, trend: "down", avatar: "🚴" },
  { id: 8, name: "中村 さくら", age: 27, plan: "レギュラー", monthlyFee: 6985, joinDate: "2025-02-14", lastVisit: "2026-02-26", visitsThisMonth: 7, visitsLastMonth: 8, avgVisits: 8, riskScore: 22, trend: "stable", avatar: "🤾" },
];

// ---- Churn Trend ----
export const MONTHLY_CHURN_DATA: ChurnDataPoint[] = [
  { month: "9月", churnRate: 5.2, retained: 12, churned: 8 },
  { month: "10月", churnRate: 4.8, retained: 15, churned: 7 },
  { month: "11月", churnRate: 4.1, retained: 18, churned: 5 },
  { month: "12月", churnRate: 3.5, retained: 22, churned: 4 },
  { month: "1月", churnRate: 3.9, retained: 20, churned: 6 },
  { month: "2月", churnRate: 3.2, retained: 25, churned: 3 },
];

// ---- Retention Actions ----
export const RETENTION_ACTIONS: RetentionAction[] = [
  { id: 1, type: "message", label: "リマインドメッセージ", desc: "来店を促す通知", icon: "💬", successRate: 32 },
  { id: 2, type: "coupon", label: "ドリンク無料クーポン", desc: "次回来店時ドリンク1杯無料", icon: "🥤", successRate: 48 },
  { id: 3, type: "trial", label: "特別プログラム招待", desc: "新しいクラスを無料体験", icon: "⭐", successRate: 55 },
  { id: 4, type: "discount", label: "翌月割引", desc: "翌月会費20%OFF", icon: "💰", successRate: 62 },
];

// ---- Action Log ----
export const ACTION_LOG: ActionLogEntry[] = [
  { date: "2/28", member: "田中 太郎", action: "リマインドメッセージ送信", status: "sent", result: "未来店" },
  { date: "2/27", member: "鈴木 一郎", action: "ドリンク無料クーポン配信", status: "sent", result: "未使用" },
  { date: "2/25", member: "伊藤 健太", action: "リマインドメッセージ送信", status: "sent", result: "来店済み ✓" },
  { date: "2/22", member: "山本 大輔", action: "特別プログラム招待", status: "sent", result: "未来店" },
  { date: "2/20", member: "田中 太郎", action: "特別プログラム招待", status: "sent", result: "来店済み ✓" },
];

// ---- LINE Messages ----
export const LINE_MESSAGES: LineMessage[] = [
  {
    id: 1, sender: "bot", time: "2/20 10:00", type: "text",
    text: `佐藤さん、おはようございます！☀️\n${GYM_CONFIG.gymName} ${GYM_CONFIG.gymBranch}です。\n\n最近お忙しいですか？前回のご来店から5日経ちました。`,
  },
  {
    id: 2, sender: "bot", time: "2/20 10:00", type: "rich",
    title: "今週のトレーニング提案",
    desc: "佐藤さんの目標に合わせたメニューをご用意しました！",
    buttons: [
      { label: "パワーラック 空き状況を確認", action: "check_rack" },
      { label: "スミスマシン活用メニュー", action: "smith_menu" },
      { label: "24H いつでもトレーニング →", action: "schedule" },
    ],
  },
  {
    id: 3, sender: "user", time: "2/20 12:15", type: "text",
    text: "ありがとうございます！\n最近ちょっと忙しくて...😅",
  },
  {
    id: 4, sender: "bot", time: "2/20 12:16", type: "text",
    text: "お忙しいところありがとうございます！🙏\n\n実は佐藤さんに特別なプレゼントがあります✨",
  },
  {
    id: 5, sender: "bot", time: "2/20 12:16", type: "coupon",
    title: "🥤 ドリンク1杯無料クーポン",
    desc: "次回ご来店時、プロテインドリンクを1杯プレゼント！",
    expire: "有効期限: 3/7(土)まで",
    code: "DRK-2026-0220",
  },
  {
    id: 6, sender: "user", time: "2/20 18:30", type: "text",
    text: "わー嬉しい！今週中に行きます💪",
  },
  {
    id: 7, sender: "bot", time: "2/20 18:31", type: "text",
    text: "お待ちしています！😊\nフロントでこの画面を見せてくださいね。",
  },
  {
    id: 8, sender: "bot", time: "2/25 09:00", type: "text",
    text: "佐藤さん、昨日のご来店ありがとうございました！🎉\n\n今月の来店回数: 5回\n今月の目標まで: あと3回\n\nいいペースです！この調子で頑張りましょう💪",
  },
  {
    id: 9, sender: "bot", time: "2/28 10:00", type: "rich",
    title: "📊 2月のまとめレポート",
    desc: "佐藤さんの今月の活動をまとめました",
    buttons: [
      { label: "レポートを見る", action: "report" },
      { label: "3月の目標を設定する", action: "goal" },
    ],
  },
  {
    id: 10, sender: "bot", time: "3/1 09:00", type: "text",
    text: "3月スタート！🌸\n\n佐藤さん限定のお知らせです👇",
  },
  {
    id: 11, sender: "bot", time: "3/1 09:00", type: "coupon",
    title: "⭐ 全店利用 1ヶ月無料体験",
    desc: "レギュラー会員へのアップグレードを1ヶ月無料でお試しいただけます！\n町田・笹塚など全8店舗が利用可能に",
    expire: "お申込み期限: 3/15(日)まで",
    code: "UPGRADE-REG-0301",
  },
];

// ---- Risk Helpers ----
export const getRiskColor = (score: number) => score >= 70 ? "#ef4444" : score >= 40 ? "#f59e0b" : "#10b981";
export const getRiskLabel = (score: number) => score >= 70 ? "高リスク" : score >= 40 ? "中リスク" : "低リスク";
export const getTrendIcon = (t: string) => t === "down" ? "📉" : t === "up" ? "📈" : "➡️";
