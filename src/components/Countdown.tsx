"use client";

import { useEffect, useState } from "react";

function msToMidnight() {
  const n = new Date();
  const end = new Date(n);
  end.setHours(24, 0, 0, 0);
  return end.getTime() - n.getTime();
}

export default function Countdown({ big = false }: { big?: boolean }) {
  const [ms, setMs] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setMs(msToMidnight()), 0);
    const i = setInterval(() => setMs(msToMidnight()), 1000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, []);
  const total = Math.floor((ms ?? 0) / 1000);
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map((v) =>
    String(v).padStart(2, "0")
  );
  return (
    <div className="flex items-center gap-1">
      {parts.map((p, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {p.split("").map((d, j) => (
              <span
                key={j}
                className={`flex items-center justify-center rounded-md bg-white/10 font-bold tabular-nums ${
                  big ? "h-9 w-7 text-xl" : "h-7 w-5 text-base"
                }`}
              >
                {ms === null ? "0" : d}
              </span>
            ))}
          </div>
          {i < 2 && <span className="font-bold">:</span>}
        </div>
      ))}
    </div>
  );
}
