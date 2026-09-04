"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Clock,
  Play,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  ArrowRight,
} from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

export type ApprovalState = "PROPOSED" | "PREVIEW" | "APPROVED" | "REJECTED" | "EXECUTING" | "DONE" | "FAILED";

interface ApprovalStateMachineProps {
  actionId: string;
  agent: string;
  actionType: string;
  description: string;
  financialImpact: number;
  policyRule: string;
  requiresApproval: boolean;
  initialState?: ApprovalState;
  onExecute: () => Promise<void>;
  className?: string;
}

export function ApprovalStateMachine({
  actionId,
  agent,
  actionType,
  description,
  financialImpact,
  policyRule,
  requiresApproval,
  initialState = "PROPOSED",
  onExecute,
  className,
}: ApprovalStateMachineProps) {
  const [state, setState] = useState<ApprovalState>(initialState);
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setState("EXECUTING");
    setLoading(true);
    try {
      await onExecute();
      setState("DONE");
    } catch {
      setState("FAILED");
    } finally {
      setLoading(false);
    }
  }

  function handleReject() {
    setState("REJECTED");
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.10)] p-4 text-xs transition-all duration-200 hover:border-[rgba(242,238,229,0.18)] shadow-sm",
        state === "DONE" && "border-[#66745D]/40 bg-[#121412]",
        state === "REJECTED" && "border-[rgba(242,238,229,0.06)] opacity-60",
        state === "PREVIEW" && "border-[#B69A5A]/40 bg-[#171613]",
        className
      )}
    >
      {/* Header Track */}
      <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.06)] pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-sans font-semibold text-[#A5A198] bg-[#1A1917] px-2 py-0.5 rounded border border-[rgba(242,238,229,0.08)]">
            {agent}
          </span>
          <span className="text-[#706E68]">•</span>
          <span className="font-medium text-[12px] text-[#F2EEE5]">{actionType}</span>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-1.5">
          {state === "DONE" && (
            <span className="flex items-center gap-1 text-[#66745D] font-medium text-[11px] bg-[#66745D]/15 px-2 py-0.5 rounded border border-[#66745D]/30">
              <CheckCircle2 className="w-3 h-3" /> Executed & Audited
            </span>
          )}
          {state === "EXECUTING" && (
            <span className="flex items-center gap-1.5 text-[#B69A5A] font-medium text-[11px] bg-[#B69A5A]/15 px-2 py-0.5 rounded border border-[#B69A5A]/30">
              <RefreshCw className="w-3 h-3 animate-spin" /> Authorizing API...
            </span>
          )}
          {state === "REJECTED" && (
            <span className="flex items-center gap-1 text-[#706E68] font-medium text-[11px] bg-[#1A1917] px-2 py-0.5 rounded border border-[rgba(242,238,229,0.06)]">
              <XCircle className="w-3 h-3 text-[#713B3B]" /> Rejected by Merchant
            </span>
          )}
          {state === "PREVIEW" && (
            <span className="flex items-center gap-1 text-[#D1B56A] font-medium text-[11px] bg-[#B69A5A]/15 px-2 py-0.5 rounded border border-[#B69A5A]/30">
              <Eye className="w-3 h-3 text-[#B69A5A]" /> Reviewing Parameters
            </span>
          )}
          {state === "PROPOSED" && (
            <span
              className={cn(
                "flex items-center gap-1.5 font-medium text-[10px] px-2 py-0.5 rounded border uppercase",
                requiresApproval
                  ? "bg-[#9A7940]/15 text-[#D1B56A] border-[#9A7940]/30"
                  : "bg-[#66745D]/15 text-[#8FA383] border-[#66745D]/30"
              )}
            >
              {requiresApproval ? <Clock className="w-3 h-3 text-[#B69A5A]" /> : <ShieldCheck className="w-3 h-3 text-[#66745D]" />}
              {requiresApproval ? "Approval Required" : "Auto Allowed"}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-[#A5A198] text-xs leading-relaxed mb-3 font-normal">
        {description}
      </p>

      {/* Financial Impact & Policy Citation */}
      <div className="flex items-center justify-between text-xs bg-[#121211] border border-[rgba(242,238,229,0.06)] p-2.5 rounded mb-3">
        <div>
          <span className="text-[#706E68] text-[11px]">Expected Value:</span>{" "}
          <span className="font-serif font-medium text-[#F2EEE5] ml-1">
            {formatINR(financialImpact)}
          </span>
        </div>
        <div className="text-[#706E68] text-[10px] flex items-center gap-1">
          <span>Policy:</span>
          <span className="text-[#A5A198] bg-[#1A1917] px-1.5 py-0.5 rounded border border-[rgba(242,238,229,0.08)] font-mono">
            {policyRule}
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex items-center justify-end gap-2 pt-0.5">
        {state === "PROPOSED" && (
          <>
            <button
              onClick={() => setState("PREVIEW")}
              className="px-3 py-1 rounded bg-[#1A1917] border border-[rgba(242,238,229,0.10)] text-[#A5A198] hover:text-[#F2EEE5] hover:border-[rgba(242,238,229,0.20)] transition-colors text-xs font-medium cursor-pointer"
            >
              Inspect Parameters
            </button>
            {requiresApproval ? (
              <button
                onClick={() => setState("PREVIEW")}
                className="px-3.5 py-1 rounded bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] transition-all text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <span>Authorize Action</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-3.5 py-1 rounded bg-[#66745D] hover:bg-[#78886E] text-white transition-all text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <span>Execute Auto-Pass</span>
                <Play className="w-3 h-3 fill-white" />
              </button>
            )}
          </>
        )}

        {state === "PREVIEW" && (
          <div className="w-full space-y-2.5">
            <div className="text-[11px] text-[#A5A198] bg-[#1A1917] p-2.5 rounded border border-[rgba(242,238,229,0.08)] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B69A5A] flex-shrink-0 mt-0.5" />
              <span>
                Deterministic policy verification passed. Executing dispatches the simulated Razorpay API gateway call and registers an immutable entry in the audit trail.
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReject}
                className="px-3 py-1 rounded border border-[#713B3B]/40 text-[#D18686] hover:bg-[#713B3B]/15 transition-colors text-xs font-medium cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-1 rounded bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] transition-all text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <span>Confirm & Dispatch API</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
