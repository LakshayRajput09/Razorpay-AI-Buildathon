"use client";

import React from "react";
import { Cpu, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Factor {
  factor: string;
  weight: string;
  direction?: "RISK_INCREASE" | "RISK_DECREASE" | "POSITIVE" | "NEGATIVE";
}

interface PredictionChipProps {
  modelName: string;
  score: number | string;
  scoreSuffix?: string;
  confidence: number;
  riskTier?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  topFactors: Factor[];
  reasoning: string;
  className?: string;
}

export function PredictionChip({
  modelName,
  score,
  scoreSuffix = "%",
  confidence,
  riskTier = "LOW",
  topFactors,
  reasoning,
  className,
}: PredictionChipProps) {
  let tierColor = "text-money border-money/30 bg-money/10";
  let TierIcon = CheckCircle2;

  if (riskTier === "CRITICAL") {
    tierColor = "text-risk-critical border-risk-critical/40 bg-risk-critical/10";
    TierIcon = ShieldAlert;
  } else if (riskTier === "HIGH") {
    tierColor = "text-risk-high border-risk-high/40 bg-risk-high/10";
    TierIcon = AlertTriangle;
  } else if (riskTier === "MEDIUM") {
    tierColor = "text-risk-medium border-risk-medium/40 bg-risk-medium/10";
    TierIcon = AlertTriangle;
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border bg-surface p-4 text-xs space-y-3",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border/80 pb-2.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-intel" />
          <span className="font-semibold text-text-primary">{modelName}</span>
          <span className="text-[10px] font-mono text-text-muted tabular-nums">
            {(confidence * 100).toFixed(0)}% confidence
          </span>
        </div>

        <div className={cn("px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border flex items-center gap-1", tierColor)}>
          <TierIcon className="w-3 h-3" />
          <span>{score}{scoreSuffix}</span>
        </div>
      </div>

      {/* Inline Top Factors (Explainability first-class UI) */}
      <div className="space-y-1.5">
        <div className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">
          Primary Contributing Factors
        </div>
        <div className="space-y-1">
          {topFactors.slice(0, 3).map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px] bg-canvas/60 border border-surface-border-subtle px-2.5 py-1 rounded"
            >
              <span className="text-text-secondary truncate max-w-[80%]">{f.factor}</span>
              <span
                className={cn(
                  "font-mono font-semibold tabular-nums text-[10px]",
                  f.weight.startsWith("+") ? "text-risk-critical" : "text-money"
                )}
              >
                {f.weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* One-line Reasoning */}
      <p className="text-[11px] leading-relaxed text-text-muted border-t border-surface-border/60 pt-2">
        <strong className="text-text-secondary">Agent Assessment:</strong> {reasoning}
      </p>
    </div>
  );
}
