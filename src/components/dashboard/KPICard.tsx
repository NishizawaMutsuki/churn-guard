"use client";

interface KPICardProps {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
}

export default function KPICard({ label, value, sub, icon, color }: KPICardProps) {
  return (
    <div className="bg-dashboard-card rounded-xl p-[18px] border border-dashboard-border" style={{ borderLeft: `3px solid ${color}` }}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-slate-400 text-xs mb-1">{label}</div>
          <div className="text-white text-2xl font-bold">{value}</div>
          <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
