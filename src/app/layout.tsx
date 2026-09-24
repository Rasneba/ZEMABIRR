import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import AppShell from "@/components/AppShell";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description: `${BRAND.name} (${BRAND.domain}) is your online casino and sports betting platform. Play Sky Jet, Keno, Mines, Chicken Road and more. Win, and enjoy rewards with our engaging gaming experience.`,
  keywords: ["ZemaBet", "online casino Ethiopia", "sports betting", "crash games", "keno", "birr"],
};

export const viewport: Viewport = {
  themeColor: "#1c1f20",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
