"use client";

import { useState } from "react";
import NavHeader from "@/components/NavHeader";

export default function SettingsPage() {
  const [gymName, setGymName] = useState("A-1 EXPRESS");
  const [gymBranch, setGymBranch] = useState("つつじヶ丘店");
  const [lineConnected, setLineConnected] = useState(false);
  const [saved, setSaved] = useState(false);

  const [rules, setRules] = useState([
    { id: 1, label: "高リスク（70〜100）", action: "ドリンク無料クーポン + リマインド", enabled: true },
    { id: 2, label: "中リスク（40〜69）", action: "リマインドメッセージ送信", enabled: true },
    { id: 3, label: "低リスク（0〜39）", action: "施策なし（監視のみ）", enabled: true },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <NavHeader />

      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">設定</h1>

        {/* Toast */}
        {saved && (
          <div className="fixed top-20 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50 animate-pulse">
            ✓ 保存しました
          </div>
        )}

        {/* Gym Info */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">店舗情報</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">ジム名</label>
              <input
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">店舗名</label>
              <input
                value={gymBranch}
                onChange={(e) => setGymBranch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </section>

        {/* LINE Integration */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">LINE連携</h2>
          {lineConnected ? (
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-2xl">✅</span>
              <div>
                <div className="text-emerald-400 font-medium text-sm">LINE公式アカウント連携済み</div>
                <div className="text-slate-400 text-xs mt-0.5">A-1 EXPRESS つつじヶ丘 (@a1express_tsutsuji)</div>
              </div>
              <button onClick={() => setLineConnected(false)} className="ml-auto text-xs text-slate-500 hover:text-red-400 transition-colors">解除</button>
            </div>
          ) : (
            <div>
              <p className="text-slate-400 text-sm mb-4">LINE公式アカウントを連携すると、退会リスクの高い会員に自動でメッセージやクーポンを配信できます。</p>
              <button
                onClick={() => setLineConnected(true)}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                style={{ background: "#06C755" }}
              >
                LINE公式アカウントを連携する
              </button>
            </div>
          )}
        </section>

        {/* Data Source */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">来店データ連携</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
              <span className="text-xl">📂</span>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">CSVインポート</div>
                <div className="text-slate-400 text-xs">入退館データのCSVファイルをアップロード</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors">
                アップロード
              </button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
              <span className="text-xl">🔌</span>
              <div className="flex-1">
                <div className="text-white text-sm font-medium">API連携</div>
                <div className="text-slate-400 text-xs">入退館システムとリアルタイム連携</div>
              </div>
              <span className="px-3 py-1 rounded-md bg-slate-700 text-slate-400 text-xs">近日公開</span>
            </div>
          </div>
        </section>

        {/* Automation Rules */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">自動施策ルール</h2>
          <div className="flex flex-col gap-3">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl">
                <button
                  onClick={() => setRules(rules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${rule.enabled ? "bg-emerald-500" : "bg-slate-600"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${rule.enabled ? "translate-x-4" : "translate-x-0"}`} />
                </button>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{rule.label}</div>
                  <div className="text-slate-400 text-xs">{rule.action}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
          >
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}
