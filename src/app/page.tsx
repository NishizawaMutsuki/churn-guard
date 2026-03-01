"use client";

import { useState } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import LineChat from "@/components/line/LineChat";

export default function Home() {
  const [view, setView] = useState<"dashboard" | "line">("dashboard");

  return (
    <div className="min-h-screen" style={{ background: view === "dashboard" ? "#0f172a" : "#7494C0" }}>
      {/* View Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setView("dashboard")}
          className="px-4 py-2 rounded-lg border-none cursor-pointer text-[13px] font-semibold text-white transition-all"
          style={{ background: view === "dashboard" ? "#6366f1" : "rgba(255,255,255,0.1)" }}
        >
          📊 オーナー画面
        </button>
        <button
          onClick={() => setView("line")}
          className="px-4 py-2 rounded-lg border-none cursor-pointer text-[13px] font-semibold text-white transition-all"
          style={{ background: view === "line" ? "#6366f1" : "rgba(255,255,255,0.1)" }}
        >
          💬 LINE会員体験
        </button>
      </div>

      {view === "dashboard" ? <Dashboard /> : <LineChat />}
    </div>
  );
}
