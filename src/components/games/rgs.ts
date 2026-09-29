"use client";

// Exact CSS/JS assets mirrored from the Digitain "Relum Gaming Suite" launcher
// (C:\My Web Sites\game 3). Loaded once, lazily, only on the Baccarat page —
// they power the in-game panel widget styling used by the real game.
const CSS = ["/rgs/css/mobile.css", "/rgs/css/rgscontainer.css", "/rgs/css/tournamentModal.css"];
const JS = [
  "/rgs/js/jquery-3.6.0.js",
  "/rgs/js/relum-front-lib.js",
  "/rgs/js/dayjs.min.js",
  "/rgs/js/jquery-ui.min.js",
  "/rgs/js/jquery.ui.touch-punch.min.js",
  "/rgs/js/crypto-js.js",
  "/rgs/js/msgpack.min.js",
  "/rgs/js/inGamePanel.iife.js",
];

let done: Promise<void> | null = null;

export function loadRgsAssets(): Promise<void> {
  if (done) return done;
  done = new Promise((resolve) => {
    if (typeof document === "undefined") return resolve();
    for (const href of CSS) {
      if (document.querySelector(`link[data-rgs="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.rgs = href;
      document.head.appendChild(link);
    }
    let i = 0;
    const next = () => {
      if (i >= JS.length) return resolve();
      const src = JS[i++];
      if (document.querySelector(`script[data-rgs="${src}"]`)) return next();
      const s = document.createElement("script");
      s.src = src;
      s.dataset.rgs = src;
      s.onload = () => next();
      s.onerror = () => next();
      document.head.appendChild(s);
    };
    next();
  });
  return done;
}