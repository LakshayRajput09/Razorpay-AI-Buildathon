import React from "react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  tier: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | string;
  score?: number;
  className?: string;
}

export function RiskBadge({ tier, score, className }: RiskBadgeProps) {
  const t = tier.toUpperCase();
  let colorStyle = "bg-[#66745D]/15 text-[#8FA383] border-[#66745D]/30";

  if (t === "CRITICAL") {
    colorStyle = "bg-[#713B3B]/20 text-[#E08A8A] border-[#713B3B]/40";
  } else if (t === "HIGH") {
    colorStyle = "bg-[#9A7940]/20 text-[#D1B56A] border-[#9A7940]/40";
  } else if (t === "MEDIUM") {
    colorStyle = "bg-[#9A7940]/15 text-[#C4A35A] border-[#9A7940]/30";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-semibold border tracking-wider uppercase",
        colorStyle,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{t}</span>
      {score !== undefined && <span className="opacity-70 font-mono">({score.toFixed(0)})</span>}
    </span>
  );
}
