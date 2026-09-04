import React from "react";
import { ShieldCheck, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface PolicyPillProps {
  status: "AUTO_APPROVED" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | string;
  requiresApproval?: boolean;
  ruleApplied?: string;
  className?: string;
}

export function PolicyPill({ status, requiresApproval, ruleApplied, className }: PolicyPillProps) {
  const s = status.toUpperCase();

  if (s === "PENDING_APPROVAL" || requiresApproval) {
    return (
      <span
        title={ruleApplied ? `Governed by: ${ruleApplied}` : "Requires Merchant Authorization"}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium font-sans bg-[#9A7940]/15 text-[#D1B56A] border border-[#9A7940]/30",
          className
        )}
      >
        <Clock className="w-3 h-3 text-[#B69A5A]" />
        <span>APPROVAL REQUIRED</span>
      </span>
    );
  }

  if (s === "AUTO_APPROVED" || s === "APPROVED") {
    return (
      <span
        title={ruleApplied ? `Verified: ${ruleApplied}` : "Safe Autonomous Operation"}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium font-sans bg-[#66745D]/15 text-[#8FA383] border border-[#66745D]/30",
          className
        )}
      >
        <ShieldCheck className="w-3 h-3 text-[#66745D]" />
        <span>AUTO APPROVED</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium font-sans bg-[#1A1917] text-[#A5A198] border border-[rgba(242,238,229,0.10)]",
        className
      )}
    >
      <ShieldAlert className="w-3 h-3 text-[#706E68]" />
      <span>{s}</span>
    </span>
  );
}
