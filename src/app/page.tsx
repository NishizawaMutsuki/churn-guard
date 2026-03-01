"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const features = [
  { icon: "📉", title: "退会リスクを自動検知", desc: "来店頻度・曜日パターン・滞在時間の変化から、退会しそうな会員をAIがスコアリング。" },
  { icon: "💬", title: "LINE自動配信", desc: "既存のLINE公式アカウントを拡張。リスクレベルに応じてメッセージやクーポンを自動送信。" },
  { icon: "📊", title: "効果をリアルタイム可視化", desc: "防いだ退会数・守った売上額をダッシュボードで確認。ツールのROIが一目で分かる。" },
];

const steps = [
  { num: "01", title: "LINE公式アカウントを連携", desc: "既存のLINE公式をそのまま使えます。新しいアカウントは不要。" },
  { num: "02", title: "来店データを接続", desc: "入退館システムのCSVインポート、またはAPI連携で自動取得。" },
  { num: "03", title: "あとは自動で", desc: "退会リスクの検知からLINE配信まで、ChurnGuardが全自動で実行します。" },
];

const stats = [
  { value: "48%", label: "施策後の再来店率" },
  { value: "¥11万+", label: "月あたり守れる売上" },
  { value: "580%", label: "ROI（費用対効果）" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/95 backdrop-blur-md shadow-lg" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">🛡️ ChurnGuard</div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">機能</a>
            <a href="#how" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">導入方法</a>
            <Link href="/login" className="text-sm font-semibold px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors">
              ログイン
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
            月額課金サービス向け 退会防止SaaS
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            退会を、<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">起きる前に</span>止める。
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            来店データからAIが退会リスクを予測し、<br className="hidden sm:block" />
            既存のLINE公式アカウントで自動リテンション施策を実行。<br className="hidden sm:block" />
            今のLINEを賢くするだけで、退会率を下げます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-500/25">
              無料で始める →
            </Link>
            <Link href="/demo" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold text-base transition-colors">
              💬 LINE配信デモを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{s.value}</div>
              <div className="text-sm text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">あなたのLINEを、退会防止エンジンに。</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">新しいアプリ導入は不要。今ある公式LINEアカウントをそのまま活用して、裏側でChurnGuardが自動運用します。</p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">導入は3ステップ</h2>
          <div className="flex flex-col gap-8">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="text-3xl font-bold text-indigo-500/30 min-w-[48px]">{s.num}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-slate-400 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-indigo-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">今のLINE、売上を上げませんか？</h2>
          <p className="text-slate-400 mb-8">まずは無料でダッシュボードをお試しください。</p>
          <Link href="/login" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-colors shadow-lg shadow-indigo-500/25">
            無料で始める →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">© 2026 ChurnGuard. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">利用規約</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">プライバシー</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">お問い合わせ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
