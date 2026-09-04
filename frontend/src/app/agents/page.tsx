"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Landmark,
  ShieldAlert,
  Zap,
  Sliders,
  CheckCircle2,
  Lock,
  Wrench,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { PolicyPill } from "@/components/shared/PolicyPill";

export default function AgentStudioPage() {
  const [maxDiscount, setMaxDiscount] = useState(10);
  const [refundLimit, setRefundLimit] = useState(50000);
  const [autoRetry, setAutoRetry] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [agentAutonomy, setAgentAutonomy] = useState<{ [key: string]: string }>({
    "AI Growth": "POLICY_CONTROLLED",
    "AI Risk Manager": "SUPERVISED",
    "AI Revenue Recovery": "AUTONOMOUS",
    "AI Finance Controller": "MONITORING_ONLY",
  });

  const agents = [
    {
      name: "AI Growth",
      role: "Agentic Commerce & Lifetime Value Optimization",
      icon: TrendingUp,
      status: "ACTIVE • POLICY CONTROLLED",
      statusColor: "text-[#B69A5A] bg-[#B69A5A]/10 border-[#B69A5A]/30",
      autonomyLevel: "Policy Controlled (<= 10% Discount)",
      tools: [
        "get_customer()",
        "get_purchase_history()",
        "predict_purchase()",
        "recommend_product()",
        "generate_offer()",
        "create_campaign()",
        "create_payment_link()",
      ],
      policies: ["MAX_DISCOUNT_CAP", "MARGIN_PRESERVATION", "FREQUENCY_LIMIT"],
      currentMetric: "₹4.18L Predicted GMV",
      lastAction: "Dispatched RECONNECT_8 campaign to at-risk cohort",
    },
    {
      name: "AI Risk Manager",
      role: "Explainable Fraud & Transaction Shield",
      icon: ShieldAlert,
      status: "ACTIVE • ZERO-TRUST GUARDED",
      statusColor: "text-[#9A7940] bg-[#9A7940]/10 border-[#9A7940]/30",
      autonomyLevel: "Supervised (Human Gate Required)",
      tools: [
        "get_transaction()",
        "calculate_fraud_risk()",
        "check_device()",
        "calculate_return_risk()",
        "calculate_chargeback_risk()",
        "flag_for_review()",
        "prepare_dispute_evidence()",
      ],
      policies: ["RULE_RISK_BLOCK", "MULTI_FACTOR_CHALLENGE", "EXPLAINABILITY_REQUIRED"],
      currentMetric: "₹1.45L Fraud Loss Prevented",
      lastAction: "Flagged TXN-2026-CRIT-9901 for human review",
    },
    {
      name: "AI Revenue Recovery",
      role: "Autonomous Dunning & Intelligent Retries",
      icon: RefreshCw,
      status: "ACTIVE • AUTONOMOUS",
      statusColor: "text-[#66745D] bg-[#66745D]/10 border-[#66745D]/30",
      autonomyLevel: "Autonomous (Bank Reset Matrix)",
      tools: [
        "find_failed_payments()",
        "predict_recovery()",
        "generate_payment_link()",
        "schedule_retry()",
        "send_friendly_notice()",
        "draft_legal_notice()",
        "generate_incentive()",
        "mark_recovered()",
      ],
      policies: ["ISSUER_CALENDAR_AWARE", "WHATSAPP_OPTIN_CHECK", "IDEMPOTENCY_LOCK"],
      currentMetric: "₹4.82L Recoverable Pipeline",
      lastAction: "Scheduled smart retry for HDFC gateway timeout",
    },
    {
      name: "AI Finance Controller",
      role: "Liquidity Runway & Burn Governance",
      icon: Landmark,
      status: "ACTIVE • MONITORING ONLY",
      statusColor: "text-[#A5A198] bg-[#A5A198]/10 border-[#A5A198]/30",
      autonomyLevel: "Advisory / What-If Simulations",
      tools: [
        "get_cash_position()",
        "forecast_cashflow()",
        "get_receivables()",
        "get_payables()",
        "get_expenses()",
        "simulate_scenario()",
        "summarize_finances()",
      ],
      policies: ["SAFETY_BUFFER_FLOOR", "COHORT_AGING_ALERT", "CAPITAL_HEALTH_CHECK"],
      currentMetric: "58 Days Liquid Runway",
      lastAction: "Calculated 30-day forecast and safety buffer",
    },
  ];

  function handleSaveGuardrails() {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2EEE5]/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#F2EEE5]">
              RAZORPAY AI AGENT STUDIO
            </h1>
            <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/30">
              4 Domain Agents
            </span>
          </div>
          <p className="text-xs text-[#A5A198] mt-1">
            Enterprise autonomy controls, cryptographic tool permissions, and zero-trust financial guardrails.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#66745D] bg-[#121211] border border-[#66745D]/30 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[#66745D]" />
          <span>All 4 Agents Operational & Governed</span>
        </div>
      </div>

      <AnimatePresence>
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3.5 rounded-lg bg-[#151514] border border-[#66745D]/50 text-[#F2EEE5] text-xs flex items-center gap-2.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4 text-[#66745D]" />
            <span>Enterprise governance parameters updated. New policy thresholds committed to active runtime.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Architecture Topology Bar */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EEE5]/08 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#B69A5A]" />
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Coordinated Multi-Agent Architecture Topology</h3>
          </div>
          <span className="text-[11px] font-mono text-[#706E68]">State-Synchronized Runtime</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {agents.map((ag, i) => {
            const Icon = ag.icon;
            return (
              <div
                key={ag.name}
                className="p-3.5 rounded-lg bg-[#121211] border border-[#F2EEE5]/06 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-[#1A1917] border border-[#F2EEE5]/10">
                        <Icon className="w-4 h-4 text-[#B69A5A]" />
                      </div>
                      <span className="text-xs font-semibold text-[#F2EEE5]">{ag.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#706E68]">0{i + 1}</span>
                  </div>
                  <p className="text-[11px] text-[#706E68] line-clamp-2">{ag.role}</p>
                </div>

                <div className="pt-2 border-t border-[#F2EEE5]/06 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#A5A198]">{ag.tools.length} Tools Bound</span>
                  <span className="text-[#B69A5A]">{ag.policies.length} Policies</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 4 Agent Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((ag) => {
          const Icon = ag.icon;
          return (
            <div
              key={ag.name}
              className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b border-[#F2EEE5]/08 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1A1917] border border-[#F2EEE5]/10">
                      <Icon className="w-5 h-5 text-[#B69A5A]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#F2EEE5]">{ag.name}</h3>
                      <p className="text-xs text-[#706E68]">{ag.role}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${ag.statusColor}`}>
                    {ag.status}
                  </span>
                </div>

                {/* Autonomy Level */}
                <div className="flex items-center justify-between text-xs px-3 py-2 rounded bg-[#121211] border border-[#F2EEE5]/06">
                  <span className="text-[#706E68]">Autonomy Level:</span>
                  <span className="font-mono font-semibold text-[#F2EEE5]">{ag.autonomyLevel}</span>
                </div>

                {/* Available Tools */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#A5A198] font-medium">
                      <Wrench className="w-3.5 h-3.5 text-[#B69A5A]" />
                      <span>Callable Structured APIs ({ag.tools.length}):</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ag.tools.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#121211] border border-[#F2EEE5]/08 text-[#A5A198]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Guardrail Policies */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#706E68] font-mono uppercase tracking-wider">
                    Bound Security Policies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ag.policies.map((p) => (
                      <span
                        key={p}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/25"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2EEE5]/08 text-xs space-y-1.5 mt-2">
                <div className="flex justify-between">
                  <span className="text-[#706E68]">Key Benchmark Metric:</span>
                  <span className="font-mono font-bold text-[#F2EEE5]">{ag.currentMetric}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#706E68]">Latest Execution:</span>
                  <span className="text-[#A5A198] truncate max-w-[240px]">{ag.lastAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configurable Policy Guardrails Panel */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EEE5]/08 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#1A1917] border border-[#B69A5A]/30">
              <ShieldCheck className="w-5 h-5 text-[#B69A5A]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F2EEE5]">
                Fintech Guardrails & Autonomous Policy Rules
              </h3>
              <p className="text-xs text-[#706E68]">
                Deterministic safety guarantees: AI models cannot execute financial transactions outside declared parameters.
              </p>
            </div>
          </div>

          <button
            onClick={handleSaveGuardrails}
            className="rounded-lg bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] px-4 py-2 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            Save Policy Parameters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Max Autonomous Discount */}
          <div className="p-4 rounded-lg bg-[#121211] border border-[#F2EEE5]/06 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#F2EEE5]">Max Autonomous Discount Ceiling</span>
              <span className="font-mono font-bold text-[#B69A5A]">{maxDiscount}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(Number(e.target.value))}
              className="w-full accent-[#B69A5A] cursor-pointer"
            />
            <p className="text-[11px] text-[#706E68]">
              Promotional offers &le; {maxDiscount}% execute autonomously. Higher discounts require merchant sign-off.
            </p>
          </div>

          {/* High Impact Refund Limit */}
          <div className="p-4 rounded-lg bg-[#121211] border border-[#F2EEE5]/06 space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[#F2EEE5]">High-Impact Transaction Approval Threshold</span>
              <span className="font-mono font-bold text-[#B69A5A]">₹{refundLimit.toLocaleString("en-IN")}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={refundLimit}
              onChange={(e) => setRefundLimit(Number(e.target.value))}
              className="w-full accent-[#B69A5A] cursor-pointer"
            />
            <p className="text-[11px] text-[#706E68]">
              Transactions or refunds above this amount strictly route to the human executive approval queue.
            </p>
          </div>

          {/* Smart Retry Autonomy */}
          <div className="p-4 rounded-lg bg-[#121211] border border-[#F2EEE5]/06 flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <span className="text-xs font-semibold text-[#F2EEE5]">Issuer Bank-Aware Retries</span>
              <p className="text-[11px] text-[#706E68]">
                Allow Recovery Agent to autonomously schedule smart retries during bank settlement windows.
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoRetry}
              onChange={(e) => setAutoRetry(e.target.checked)}
              className="h-4 w-4 rounded bg-[#1A1917] border-[#F2EEE5]/20 text-[#B69A5A] focus:ring-[#B69A5A] cursor-pointer accent-[#B69A5A]"
            />
          </div>

          {/* Auto-Block Restriction */}
          <div className="p-4 rounded-lg bg-[#121211] border border-[#F2EEE5]/06 flex items-center justify-between">
            <div className="space-y-0.5 pr-4">
              <span className="text-xs font-semibold text-[#F2EEE5]">Autonomous Card Blacklisting</span>
              <p className="text-[11px] text-[#706E68]">
                Transaction blocking strictly requires human merchant review to prevent false-positive customer attrition.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#9A7940] bg-[#9A7940]/10 border border-[#9A7940]/25 px-2 py-0.5 rounded">
              RESTRICTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
