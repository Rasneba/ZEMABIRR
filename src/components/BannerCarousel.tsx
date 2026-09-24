"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  { img: "/banners/banner-1.jpg", kicker: "Welcome offer", title: "GET 200% BONUS", sub: "On your first deposit · up to Br 10,000", cta: "Claim now", href: "/bonus" },
  { img: "/banners/banner-2.jpg", kicker: "Crash game", title: "FLY WITH SKY JET", sub: "Cash out before it flies away · up to 1000x", cta: "Play now", href: "/games/sky-jet" },
  { img: "/banners/banner-3.jpg", kicker: "Every 24 hours", title: "FREE LUCKY SPIN", sub: "Spin the wheel and win up to Br 100", cta: "Spin now", href: "/spin" },
];

export default function BannerCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${i * 100}%)` }}>
        {SLIDES.map((s, idx) => (
          <div key={s.img} className="relative aspect-[16/7] w-full shrink-0 sm:aspect-[16/6]">
            <Image src={s.img} alt={s.title} fill priority={idx === 0} sizes="(max-width:768px) 100vw, 900px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[65%] flex-col justify-center gap-1 p-5 sm:gap-2 sm:p-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-win sm:text-xs">{s.kicker}</span>
              <h2 className="text-2xl leading-none font-black sm:text-5xl"><span className="text-shimmer">{s.title}</span></h2>
              <p className="text-xs text-white/80 sm:text-base">{s.sub}</p>
              <Link href={s.href} className="btn-gold mt-2 w-fit rounded-lg px-4 py-2 text-xs sm:text-sm">{s.cta}</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, idx) => (
          <button key={idx} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-gold" : "w-1.5 bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}
