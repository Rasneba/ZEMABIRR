"use client";

import { useEffect, useState } from "react";
import { api, useApp } from "@/components/AppProvider";
import { SPIN_PRIZES } from "@/lib/games";

const SEG = 360 / SPIN_PRIZES.length;

export default function SpinPage() {
  const { user, requireAuth, toast, refresh } = useApp();
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<string | null>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const calc = () => {
      if (!user?.lastSpinAt) return setLeft(0);
      setLeft(Math.max(0, new Date(user.lastSpinAt).getTime() + 86400000 - Date.now()));
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [user?.lastSpinAt]);

  async function spin() {
    if (!requireAuth()) return;
    setSpinning(true);
    setWon(null);
    const d = await api<{ index: number; prize: { label: string; amount: number } }>("/api/spin", {});
    if (d.error) {
      setSpinning(false);
      return toast(d.error, "error");
    }
    const target = 360 - (d.index * SEG + SEG / 2);
    setRot((r) => r - (r % 360) + 360 * 6 + target);
    setTimeout(() => {
      setSpinning(false);
      setWon(d.prize.amount > 0 ? `You won ${d.prize.label}! 🎉` : "No luck this time — try again tomorrow!");
      if (d.prize.amount > 0) toast(`+${d.prize.label} bonus`, "success");
      refresh();
    }, 5200);
  }

  const gradient = `conic-gradient(${SPIN_PRIZES.map((p, i) => `${p.color} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(",")})`;
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="text-xs font-bold uppercase text-win">Spin &amp; Win</div>
      <h1 className="text-3xl font-black">🎡 Lucky Spin</h1>
      <p className="mt-1 text-sm text-mute">One free spin every 24 hours. Prizes are credited to your bonus balance.</p>
      <div className="relative mx-auto mt-6 aspect-square w-72 sm:w-96">
        <div className="absolute top-[-14px] left-1/2 z-10 -translate-x-1/2 text-4xl text-gold drop-shadow-lg">▼</div>
        <div className="absolute inset-0 rounded-full border-[10px] border-gold shadow-[0_0_60px_rgba(229,178,36,0.35)]" style={{ background: gradient, transform: `rotate(${rot}deg)`, transition: spinning ? "transform 5s cubic-bezier(0.12,0.8,0.2,1)" : "none" }}>
          {SPIN_PRIZES.map((p, i) => (
            <div key={i} className="absolute inset-0 flex justify-center pt-5 text-sm font-black text-white sm:text-base" style={{ transform: `rotate(${i * SEG + SEG / 2}deg)` }}>
              <span style={{ writingMode: "vertical-rl" }}>{p.label}</span>
            </div>
          ))}
        </div>
        <button onClick={spin} disabled={spinning || left > 0} className="btn-gold absolute inset-[38%] rounded-full text-lg font-black">SPIN</button>
      </div>
      {won && <div className="animate-pop mt-6 rounded-xl bg-win/15 px-4 py-3 font-bold text-win">{won}</div>}
      {left > 0 && !spinning && (
        <div className="mt-6 rounded-xl bg-card px-4 py-3 text-sm">Next free spin in <b className="tabular-nums text-gold">{String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</b></div>
      )}
      {!user && <p className="mt-6 text-sm text-mute">Log in to claim your free daily spin.</p>}
    </div>
  );
}
