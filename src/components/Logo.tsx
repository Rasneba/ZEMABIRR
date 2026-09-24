import { BRAND } from "@/lib/brand";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const t = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <span className={`inline-flex items-center gap-1 font-black tracking-tight select-none ${t}`}>
      <span className="text-white lowercase" style={{ fontStyle: "italic", letterSpacing: "-0.02em" }}>
        {BRAND.first.toLowerCase()}
      </span>
      <span className="rounded-lg bg-brand-red px-1.5 py-0 leading-tight text-white shadow-[0_0_0_2px_rgba(255,255,255,0.9)]">
        {BRAND.second}
      </span>
    </span>
  );
}
