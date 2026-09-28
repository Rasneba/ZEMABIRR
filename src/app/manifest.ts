import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} — ${BRAND.tagline}`,
    short_name: BRAND.first,
    description: `Play casino, sports and mini games on ${BRAND.name}. Deposit with telebirr, CBE Birr, M-Pesa or USDT.`,
    start_url: "/",
    display: "standalone",
    background_color: "#1c1f20",
    theme_color: "#1c1f20",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}