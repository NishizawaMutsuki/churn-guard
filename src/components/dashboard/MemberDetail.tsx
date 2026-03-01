"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Member } from "@/types";
import { RETENTION_ACTIONS, getRiskColor, getRiskLabel } from "@/lib/demo-data";

interface MemberDetailProps {
  member: Member;
  actionSent: Record<string, boolean>;
  onSendAction: (memberId: number, actionId: number) => void;
}

export default function MemberDetail({ member: m, actionSent, onSendAction }: MemberDetailProps) {
  const visitData = [
    { month: "9月", visits: m.avgVisits + 2 },
    { month: "10月", visits: m.avgVisits + 1 },
    { month: "11月", visits: m.avgVisits },
    { month: "12月", visits: Math.max(1, m.avgVisits - 1) },
    { month: "1月", visits: m.visitsLastMonth },
    { month: "2月", visits: m.visitsThisMonth },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-4xl">{m.avatar}</span>
        <div className="flex-1">
          <h3 className="text-white text-[17px] font-semibold m-0">{m.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{m.age}歳 · {m.plan} · ¥{m.monthlyFee.toLocaleString()}/月</p>
        </div>
        <div className="text-center px-3.5 py-2 rounded-lg" style={{ background: `${getRiskColor(m.riskScore)}22` }}>
          <div className="text-2xl font-bold" style={{ color: getRiskColor(m.riskScore) }}>{m.riskScore}</div>
          <div className="text-[10px]" style={{ color: getRiskColor(m.riskScore) }}>{getRiskLabel(m.riskScore)}</div>
        </div>
      </div>

      <div className="mb-5">
        <h4 className="text-slate-200 text-[13px] font-semibold mb-2.5">来店推移</h4>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={visitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }} />
            <Bar dataKey="visits" fill="#818cf8" radius={[4, 4, 0, 0]} name="来店回数" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white/[0.04] rounded-md p-2 text-center">
          <div className="text-white text-base font-bold">{m.visitsThisMonth}</div>
          <div className="text-slate-400 text-[10px]">今月来店</div>
        </div>
        <div className="bg-white/[0.04] rounded-md p-2 text-center">
          <div className="text-white text-base font-bold">{m.visitsLastMonth}</div>
          <div className="text-slate-400 text-[10px]">先月来店</div>
        </div>
        <div className="bg-white/[0.04] rounded-md p-2 text-center">
          <div className="text-slate-400 text-xs">{m.lastVisit.slice(5)}</div>
          <div className="text-slate-400 text-[10px]">最終来店</div>
        </div>
      </div>

      <h4 className="text-slate-200 text-[13px] font-semibold mb-2.5">リテンション施策を送信</h4>
      <div className="flex flex-col gap-1.5">
        {RETENTION_ACTIONS.map(a => {
          const key = `${m.id}-${a.id}`;
          const sent = actionSent[key];
          return (
            <div key={a.id} className="flex items-center gap-2.5 p-2 bg-white/[0.03] rounded-md">
              <span className="text-lg">{a.icon}</span>
              <div className="flex-1">
                <div className="text-slate-200 text-xs font-medium">{a.label}</div>
                <div className="text-slate-400 text-[10px]">{a.desc} · 成功率{a.successRate}%</div>
              </div>
              <button
                onClick={() => !sent && onSendAction(m.id, a.id)}
                className="px-3 py-1 rounded-md border-none text-[11px] font-semibold text-white transition-all"
                style={{
                  background: sent ? "#10b981" : "#6366f1",
                  cursor: sent ? "default" : "pointer",
                  opacity: sent ? 0.7 : 1,
                }}
              >
                {sent ? "送信済 ✓" : "送信"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
