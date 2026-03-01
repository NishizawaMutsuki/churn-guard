"use client";

import NavHeader from "@/components/NavHeader";
import Dashboard from "@/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NavHeader />
      <Dashboard />
    </div>
  );
}
