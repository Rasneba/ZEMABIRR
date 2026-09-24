"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND, FAQ } from "@/lib/brand";
import Logo from "./Logo";

export default function Footer() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <footer className="mt-10 border-t border-line/60 pt-8 pb-24 md:pb-10">
      <h3 className="mb-3 text-lg font-bold">FAQ</h3>
      <div className="space-y-2">
        {FAQ.map((f, i) => (
          <div key={f.q} className="overflow-hidden rounded-xl bg-card">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
            >
              {f.q}
              <span className={`text-mute transition-transform ${open === i ? "rotate-180" : ""}`}>▾</span>
            </button>
            {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-mute">{f.a}</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 text-sm sm:grid-cols-3">
        <div>
          <h4 className="mb-2 font-bold">Support</h4>
          <ul className="space-y-1.5 text-mute">
            <li><Link href="/support" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/support#contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-bold">Community</h4>
          <ul className="space-y-1.5 text-mute">
            <li><a href={BRAND.telegram} target="_blank" rel="noreferrer" className="hover:text-white">Telegram Channel</a></li>
            <li><a href={BRAND.telegramSupport} target="_blank" rel="noreferrer" className="hover:text-white">Support Chat</a></li>
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Logo size="sm" />
          <p className="mt-2 text-xs leading-relaxed text-mute">
            {BRAND.name} is owned and operated by {BRAND.name}. Contact us at {BRAND.email}. {BRAND.name} is a leading
            online gaming platform offering exciting games like Sky Jet, Keno, and more. Play, win, and enjoy rewards.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-5 text-xs text-mute">
        <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-white">Terms and Conditions</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-lose text-[11px] font-black text-white">21+</span>
        </div>
      </div>
    </footer>
  );
}
