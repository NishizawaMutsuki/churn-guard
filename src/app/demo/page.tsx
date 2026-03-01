"use client";

import Link from "next/link";
import LineChat from "@/components/line/LineChat";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Left: Explanation */}
      <div className="hidden lg:flex flex-col justify-center flex-1 px-12 xl:px-20">
        <Link href="/" className="text-white font-bold text-lg mb-8 hover:opacity-80 transition-opacity inline-block">
          ← 🛡️ ChurnGuard
        </Link>
        <h1 className="text-3xl font-bold text-white mb-4">
          LINE配信デモ
        </h1>
        <p className="text-slate-400 leading-relaxed mb-8">
          右側に表示されているのは、ChurnGuard導入後のLINE公式アカウントのイメージです。
          会員のトーク画面がどのように見えるかをデモしています。
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">📉</div>
            <div>
              <div className="text-white text-sm font-medium">来店が減ると自動検知</div>
              <div className="text-slate-400 text-xs">前回来店から5日経過 → リマインド送信</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🥤</div>
            <div>
              <div className="text-white text-sm font-medium">特典で来店を促す</div>
              <div className="text-slate-400 text-xs">ドリンク無料クーポンをバーコード付きで配信</div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">⭐</div>
            <div>
              <div className="text-white text-sm font-medium">アップセルも自動</div>
              <div className="text-slate-400 text-xs">単店会員 → 全店利用アップグレードの提案</div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/login" className="inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors">
            ダッシュボードを試す →
          </Link>
        </div>
      </div>

      {/* Right: LINE Chat */}
      <div className="flex-1 lg:flex-none lg:w-[430px] bg-[#7494C0] flex items-center justify-center min-h-screen">
        <div className="w-full">
          {/* Mobile back button */}
          <div className="lg:hidden p-3">
            <Link href="/" className="text-white/80 text-sm">← 戻る</Link>
          </div>
          <LineChat />
        </div>
      </div>
    </div>
  );
}
