import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZPlay — Sports, Casino & Live Games",
  description: "Sports betting, live casino and instant games with mobile money deposits and instant payouts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
