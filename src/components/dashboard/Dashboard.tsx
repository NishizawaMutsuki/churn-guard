"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MEMBERS, MONTHLY_CHURN_DATA, ACTION_LOG, GYM_CONFIG, getRiskColor, getRiskLabel, getTrendIcon } from "@/lib/demo-data";
import KPICard from "./KPICard";
import MemberDetail from "./MemberDetail";
import type { Member } from "@/types";

function AutoRule({ score, label, action, color, active }: { score: string; label: string; action: string; color: string; active: boolean }) {
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all"
      style={{
        background: active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? color : "#334155"}`,
        opacity: active ? 1 : 0.5,
      }}
    >
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <div className="flex-1">
        <div className="text-slate-200 text-[13px] font-medium">スコア {score}（{label}）</div>
        <div className="text-slate-400 text-[11px] mt-0.5">{action}</div>
      </div>
      <span className="text-[11px]" style={{ color: active ? "#10b981" : "#94a3b8" }}>{active ? "有効" : "無効"}</span>
    </div>
  );
}

function ImpactCard({ label, value, period, color }: { label: string; value: string; period: string; color: string }) {
  return (
    <div className="bg-white/[0.03] rounded-lg p-4 text-center">
      <div className="text-[28px] font-bold" style={{ color }}>{value}</div>
      <div className="text-slate-200 text-[13px] font-medium mt-1">{label}</div>
      <div className="text-slate-400 text-[11px] mt-0.5">{period}</div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [actionSent, setActionSent] = useState<Record<string, boolean>>({});
  const [automationOn, setAutomationOn] = useState(true);

  const highRisk = MEMBERS.filter(m => m.riskScore >= 70);
  const atRiskRevenue = highRisk.reduce((s, m) => s + m.monthlyFee, 0);

  const handleSendAction = (memberId: number, actionId: number) => {
    setActionSent(prev => ({ ...prev, [`${memberId}-${actionId}`]: true }));
  };

  const riskDistribution = [
    { name: "高リスク", value: MEMBERS.filter(m => m.riskScore >= 70).length, color: "#ef4444" },
    { name: "中リスク", value: MEMBERS.filter(m => m.riskScore >= 40 && m.riskScore < 70).length, color: "#f59e0b" },
    { name: "低リスク", value: MEMBERS.filter(m => m.riskScore < 40).length, color: "#10b981" },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-[28px] font-bold m-0">
          🛡️ ChurnGuard <span className="text-base font-normal text-slate-400">for</span>{" "}
          <span className="text-cyan-400 text-[22px]">{GYM_CONFIG.gymName} {GYM_CONFIG.gymBranch}</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">退会リスク予測 & リテンション自動化ダッシュボード｜24時間ジム特化</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPICard label="総会員数" value={`${MEMBERS.length}名`} sub="アクティブ会員" icon="👥" color="#6366f1" />
        <KPICard label="高リスク会員" value={`${highRisk.length}名`} sub={`全体の${Math.round(highRisk.length / MEMBERS.length * 100)}%`} icon="⚠️" color="#ef4444" />
        <KPICard label="リスク売上" value={`¥${atRiskRevenue.toLocaleString()}`} sub="月額損失リスク" icon="💸" color="#f59e0b" />
        <KPICard label="今月退会率" value="3.2%" sub="先月比 -0.7pt" icon="📉" color="#10b981" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-6">
        <div className="bg-dashboard-card rounded-xl p-5 border border-dashboard-border">
          <h3 className="text-white text-[15px] font-semibold mb-4">退会率推移</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MONTHLY_CHURN_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} unit="%" />
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
              <Line type="monotone" dataKey="churnRate" stroke="#22d3ee" strokeWidth={2} dot={{ fill: "#22d3ee", r: 4 }} name="退会率" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-dashboard-card rounded-xl p-5 border border-dashboard-border">
          <h3 className="text-white text-[15px] font-semibold mb-4">リスク分布</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 mt-2">
            {riskDistribution.map((r, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-slate-400 text-[11px]">{r.name}: {r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member List + Detail/Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-dashboard-card rounded-xl p-5 border border-dashboard-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-[15px] font-semibold">会員リスク一覧</h3>
            <span className="text-slate-400 text-xs">リスクスコア順</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {[...MEMBERS].sort((a, b) => b.riskScore - a.riskScore).map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMember(selectedMember?.id === m.id ? null : m)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all"
                style={{
                  background: selectedMember?.id === m.id ? "rgba(99,102,241,0.15)" : "transparent",
                  border: selectedMember?.id === m.id ? "1px solid #6366f1" : "1px solid transparent",
                }}
              >
                <span className="text-[22px]">{m.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-200 text-[13px] font-medium">{m.name}</div>
                  <div className="text-slate-400 text-[11px]">{m.plan} · 今月{m.visitsThisMonth}回来店</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ color: getRiskColor(m.riskScore) }}>{m.riskScore}</div>
                  <div className="text-slate-400 text-[10px]">{getTrendIcon(m.trend)} {getRiskLabel(m.riskScore)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dashboard-card rounded-xl p-5 border border-dashboard-border">
          {selectedMember ? (
            <MemberDetail member={selectedMember} actionSent={actionSent} onSendAction={handleSendAction} />
          ) : (
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-white text-[15px] font-semibold">自動施策設定</h3>
                <button
                  onClick={() => setAutomationOn(!automationOn)}
                  className="px-4 py-1.5 rounded-full border-none text-xs font-semibold text-white cursor-pointer transition-all"
                  style={{ background: automationOn ? "#10b981" : "#334155" }}
                >
                  {automationOn ? "✓ 自動ON" : "自動OFF"}
                </button>
              </div>
              <div className="flex flex-col gap-3 mb-6">
                <AutoRule score="70〜100" label="高リスク" action="ドリンク無料クーポン + リマインド" color="#ef4444" active={automationOn} />
                <AutoRule score="40〜69" label="中リスク" action="リマインドメッセージ送信" color="#f59e0b" active={automationOn} />
                <AutoRule score="0〜39" label="低リスク" action="施策なし（監視のみ）" color="#10b981" active={automationOn} />
              </div>
              <h4 className="text-white text-sm font-semibold mb-3">最近のアクション</h4>
              <div className="flex flex-col gap-1.5">
                {ACTION_LOG.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-2 bg-white/[0.03] rounded-md text-xs">
                    <span className="text-slate-400 min-w-[36px]">{log.date}</span>
                    <span className="text-slate-200 flex-1">{log.member}</span>
                    <span className="text-slate-400 flex-1">{log.action}</span>
                    <span className={`text-[11px] ${log.result.includes("✓") ? "text-emerald-500" : "text-slate-400"}`}>{log.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Retention Impact */}
      <div className="bg-dashboard-card rounded-xl p-5 border border-dashboard-border">
        <h3 className="text-white text-[15px] font-semibold mb-4">💰 リテンション効果（推定）</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ImpactCard label="防止した退会数" value="18名" period="過去6ヶ月" color="#10b981" />
          <ImpactCard label="守った月額売上" value="¥113,580" period="月あたり平均" color="#22d3ee" />
          <ImpactCard label="施策成功率" value="48%" period="アクション後の再来店率" color="#818cf8" />
          <ImpactCard label="ROI" value="580%" period="ツール費用対効果" color="#f59e0b" />
        </div>
      </div>
    </div>
  );
}
