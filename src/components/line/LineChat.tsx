"use client";

import { useState } from "react";
import { LINE_MESSAGES, GYM_CONFIG } from "@/lib/demo-data";
import type { LineMessage } from "@/types";

// ---- LINE Colors ----
const lc = {
  green: "#06C755",
  bg: "#7494C0",
  botBubble: "#ffffff",
  userBubble: "#06C755",
  timeText: "rgba(255,255,255,0.7)",
  dateBadge: "rgba(0,0,0,0.25)",
  richBorder: "#e5e5e5",
  buttonText: "#06C755",
};

// ---- Bot Message ----
function BotMessage({ msg }: { msg: LineMessage }) {
  const timeStr = msg.time.split(" ")[1] || msg.time;
  const avatar = (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 self-start" style={{ background: lc.green }}>
      A
    </div>
  );

  if (msg.type === "text") {
    return (
      <div className="flex gap-2 mb-2" style={{ maxWidth: "85%" }}>
        {avatar}
        <div>
          <div className="bg-white rounded-[0_16px_16px_16px] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-gray-900 whitespace-pre-wrap shadow-sm">
            {msg.text}
          </div>
          <div className="text-[10px] mt-0.5 ml-1" style={{ color: lc.timeText }}>{timeStr}</div>
        </div>
      </div>
    );
  }

  if (msg.type === "rich") {
    return (
      <div className="flex gap-2 mb-2" style={{ maxWidth: "85%" }}>
        {avatar}
        <div>
          <div className="bg-white rounded-[0_16px_16px_16px] overflow-hidden shadow-sm" style={{ border: `1px solid ${lc.richBorder}` }}>
            <div className="px-4 py-5 text-white" style={{ background: `linear-gradient(135deg, ${lc.green}, #04a04b)` }}>
              <div className="text-[15px] font-bold">{msg.title}</div>
              <div className="text-[11px] mt-1 opacity-90">{msg.desc}</div>
            </div>
            {msg.buttons?.map((btn, i) => (
              <div key={i} className="px-4 py-3 text-center cursor-pointer text-[13px] font-medium" style={{ borderTop: `1px solid ${lc.richBorder}`, color: lc.buttonText }}>
                {btn.label}
              </div>
            ))}
          </div>
          <div className="text-[10px] mt-0.5 ml-1" style={{ color: lc.timeText }}>{timeStr}</div>
        </div>
      </div>
    );
  }

  if (msg.type === "coupon") {
    return (
      <div className="flex gap-2 mb-2" style={{ maxWidth: "85%" }}>
        {avatar}
        <div>
          <div className="bg-white rounded-[0_16px_16px_16px] overflow-hidden shadow-sm" style={{ border: `1px solid ${lc.richBorder}` }}>
            <div className="p-4 text-white text-center" style={{ background: "linear-gradient(135deg, #FFB347, #FF6B6B)" }}>
              <div className="text-base font-bold">{msg.title}</div>
            </div>
            <div className="px-4 py-3.5">
              <div className="text-[12.5px] text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.desc}</div>
              <div className="text-[11px] text-gray-400 mt-2">{msg.expire}</div>
              <div className="mt-3 p-2.5 bg-gray-50 rounded-lg text-center border border-dashed border-gray-300">
                <div className="flex justify-center gap-0.5 mb-1.5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded-[1px]" style={{ width: i % 3 === 0 ? 3 : 1.5, height: 30 }} />
                  ))}
                </div>
                <div className="text-[10px] text-gray-500 font-mono tracking-widest">{msg.code}</div>
              </div>
            </div>
            <div className="px-4 py-3 text-center cursor-pointer text-[13px] font-semibold" style={{ borderTop: `1px solid ${lc.richBorder}`, color: lc.buttonText }}>
              クーポンを使う
            </div>
          </div>
          <div className="text-[10px] mt-0.5 ml-1" style={{ color: lc.timeText }}>{timeStr}</div>
        </div>
      </div>
    );
  }

  return null;
}

// ---- User Message ----
function UserMessage({ msg }: { msg: LineMessage }) {
  const timeStr = msg.time.split(" ")[1] || msg.time;
  return (
    <div className="flex justify-end mb-2">
      <div style={{ maxWidth: "75%" }}>
        <div className="rounded-[16px_0_16px_16px] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white whitespace-pre-wrap" style={{ background: lc.userBubble }}>
          {msg.text}
        </div>
        <div className="text-[10px] mt-0.5 text-right mr-1" style={{ color: lc.timeText }}>
          <span className="mr-1">既読</span>{timeStr}
        </div>
      </div>
    </div>
  );
}

// ---- Main LINE Chat ----
export default function LineChat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<LineMessage[]>(LINE_MESSAGES);
  const [showMenu, setShowMenu] = useState(false);

  const handleSend = () => {
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1, sender: "user", time: "今", type: "text", text: userInput,
    }]);
    setUserInput("");
  };

  return (
    <div className="max-w-[390px] mx-auto min-h-screen flex flex-col relative" style={{ background: lc.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 sticky top-0 z-10" style={{ background: lc.green }}>
        <div className="text-white text-xl cursor-pointer">←</div>
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ color: lc.green }}>A</div>
        <div className="flex-1">
          <div className="text-white text-[15px] font-semibold">{GYM_CONFIG.lineAccountName}</div>
          <div className="text-white/75 text-[11px]">公式アカウント｜24Hジム</div>
        </div>
        <div className="flex gap-4">
          <span className="text-white text-lg">📞</span>
          <span className="text-white text-lg">☰</span>
        </div>
      </div>

      {/* Powered by */}
      <div className="text-center py-2">
        <span className="bg-black/[0.18] text-white/85 text-[10px] px-2.5 py-0.5 rounded-full">
          🛡️ Powered by ChurnGuard
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 pb-[90px]">
        {messages.map((msg, idx) => {
          const prevMsg = messages[idx - 1];
          const showDate = !prevMsg || msg.time.split(" ")[0] !== prevMsg.time.split(" ")[0];
          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center my-3">
                  <span className="text-white text-[11px] px-3 py-0.5 rounded-full" style={{ background: lc.dateBadge }}>
                    {msg.time.split(" ")[0]}
                  </span>
                </div>
              )}
              {msg.sender === "bot" ? <BotMessage msg={msg} /> : <UserMessage msg={msg} />}
            </div>
          );
        })}
      </div>

      {/* Rich Menu */}
      {showMenu && (
        <div className="grid grid-cols-3" style={{ gap: 1, background: "#e5e5e5", borderTop: "1px solid #e5e5e5" }}>
          {[
            { icon: "🏋️", label: "混雑状況" },
            { icon: "🎫", label: "クーポン" },
            { icon: "📊", label: "来店履歴" },
            { icon: "🏪", label: "全8店舗" },
            { icon: "📍", label: "アクセス" },
            { icon: "💬", label: "お問合せ" },
          ].map((item, i) => (
            <div key={i} className="bg-white py-3.5 px-2 text-center cursor-pointer">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-[10px] text-gray-700 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] bg-gray-100 border-t border-gray-300 px-2.5 py-2 flex items-center gap-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full border-none text-white text-base cursor-pointer flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: showMenu ? lc.green : "#ccc" }}
        >
          {showMenu ? "×" : "≡"}
        </button>
        <div className="flex-1 bg-white rounded-full border border-gray-300 flex items-center px-3">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="メッセージを入力"
            className="flex-1 border-none outline-none py-2 text-sm bg-transparent text-gray-900"
          />
        </div>
        {userInput.trim() ? (
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-full border-none text-white text-sm cursor-pointer flex items-center justify-center flex-shrink-0"
            style={{ background: lc.green }}
          >
            ➤
          </button>
        ) : (
          <span className="text-[22px] flex-shrink-0 cursor-pointer">🎤</span>
        )}
      </div>
    </div>
  );
}
