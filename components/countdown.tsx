"use client";

import { useEffect, useState } from "react";

const EVENT_DATETIME_LOCAL: string | null = null;

function getTargetDate() {
  if (EVENT_DATETIME_LOCAL) return new Date(EVENT_DATETIME_LOCAL);
  return new Date("2026-11-25T00:00:00-03:00");
}

function getTimeLeft() {
  const remaining = Math.max(0, getTargetDate().getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
    arrived: remaining === 0,
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();
    const timer = window.setInterval(update, 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const units = [
    ["DIAS", timeLeft?.days],
    ["HORAS", timeLeft?.hours],
    ["MIN", timeLeft?.minutes],
    ["SEG", timeLeft?.seconds],
  ] as const;

  return (
    <div aria-live="polite" className="flex flex-wrap items-center gap-2 sm:gap-3">
      {units.map(([label, value]) => (
        <div key={label} className="min-w-[68px] border border-[#39ff88]/15 bg-[#050a08] px-3 py-2 text-center sm:min-w-[78px] sm:px-4">
          <div className="font-mono text-2xl tabular-nums text-[#39ff88] sm:text-3xl">{value === undefined ? "--" : String(value).padStart(2, "0")}</div>
          <div className="mt-1 font-mono text-[8px] tracking-[0.15em] text-[#84968a]">{label}</div>
        </div>
      ))}
      {timeLeft?.arrived && <p className="w-full font-mono text-[10px] tracking-[0.1em] text-[#39ff88] sm:w-auto">O DIA DA DEFESA CHEGOU</p>}
    </div>
  );
}
