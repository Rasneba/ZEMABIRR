"use client";

export default function ExternalGame({ url }: { url?: string }) {
  if (!url) {
    return (
      <div className="flex min-h-105 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-card p-8 text-center">
        <div className="text-5xl">🛩️</div>
        <div className="text-lg font-black uppercase">Aviator — not configured</div>
        <p className="max-w-md text-sm text-mute">
          Set the <code className="rounded bg-white/5 px-1.5 py-0.5">SPRIBE_AVIATOR_URL</code> environment variable to
          the Spribe launch URL to enable this game.
        </p>
      </div>
    );
  }
  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border border-line bg-black">
        <iframe src={url} title="Spribe Aviator" allow="fullscreen; autoplay" className="h-[70svh] min-h-115 w-full" />
      </div>
      <p className="mt-2 text-center text-xs text-mute">
        🛩️ Demo session hosted by the provider — wagers inside are not linked to your wallet.
      </p>
    </div>
  );
}