// ===================== CORE TYPES =====================
// These types define the data model for the entire app.
// When connecting to a real DB or API, implement these interfaces.

export interface Member {
  id: number;
  name: string;
  age: number;
  plan: string;
  monthlyFee: number;
  joinDate: string;
  lastVisit: string;
  visitsThisMonth: number;
  visitsLastMonth: number;
  avgVisits: number;
  riskScore: number;
  trend: "up" | "down" | "stable";
  avatar: string;
}

export interface ChurnDataPoint {
  month: string;
  churnRate: number;
  retained: number;
  churned: number;
}

export interface RetentionAction {
  id: number;
  type: "message" | "coupon" | "trial" | "discount";
  label: string;
  desc: string;
  icon: string;
  successRate: number;
}

export interface ActionLogEntry {
  date: string;
  member: string;
  action: string;
  status: string;
  result: string;
}

export interface LineMessage {
  id: number;
  sender: "bot" | "user";
  time: string;
  type: "text" | "rich" | "coupon";
  text?: string;
  title?: string;
  desc?: string;
  image?: string | null;
  buttons?: { label: string; action: string }[];
  expire?: string;
  code?: string;
}

// ===================== CONFIG =====================
// Per-gym configuration. Will be loaded from DB in production.

export interface GymConfig {
  gymName: string;
  gymBranch: string;
  plans: { name: string; fee: number }[];
  features: string[];
  lineAccountName: string;
}
