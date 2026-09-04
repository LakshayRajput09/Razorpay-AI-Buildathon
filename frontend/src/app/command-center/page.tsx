"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Landmark,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  X,
  Bot,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { PolicyPill } from "@/components/shared/PolicyPill";
import { ApprovalStateMachine } from "@/components/shared/ApprovalStateMachine";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function CommandCenterPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [orchestrationData, setOrchestrationData] = useState<any>(null);
  const [actionFeed, setActionFeed] = useState<any[]>([]);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [executionBanner, setExecutionBanner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [investigationId, setInvestigationId] = useState<number>(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load initial cross-agent intelligence
  useEffect(() => {
    runOrchestrator("Why did revenue drop this week?");
    fetchActivityLog();
  }, []);

  async function fetchActivityLog() {
    try {
      const res = await fetch("/api/agent/activity");
      const data = await res.json();
      if (data.success) {
        setActionFeed(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function runOrchestrator(q: string) {
    const trimmed = (q || "").trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setQuery(trimmed);

    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to reach AI orchestrator`);
      }
      const json = await res.json();
      if (json.success && json.data) {
        setOrchestrationData(json.data);
        setInvestigationId(Date.now());
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } else {
        throw new Error(json.error || "Failed to complete AI investigation");
      }
    } catch (e: any) {
      console.error("AI Investigation error:", e);
      setError(e.message || "Failed to reach AI reasoning server");
    } finally {
      setLoading(false);
    }
  }

  async function handleExecuteAction(action: any, decision: "APPROVE" | "AUTO") {
    setExecutingActionId(action.id);
    try {
      const res = await fetch("/api/action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: action.agent,
          actionType: action.actionType,
          entityId: action.executionPayload?.entityId || action.id,
          reason: action.description,
          financialImpact: action.financialImpact,
          discountPercentage: action.executionPayload?.discountPercentage || 0,
          riskTier: action.executionPayload?.riskTier || "LOW",
          metadata: action.executionPayload,
          merchantDecision: decision,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExecutionBanner(
          `Executed ${action.actionType} via Razorpay API adapter. Action committed to audit trail.`
        );
        fetchActivityLog();
        setOrchestrationData((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            proposedActions: prev.proposedActions.map((a: any) =>
              a.id === action.id ? { ...a, policyStatus: "EXECUTED", requiresApproval: false } : a
            ),
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingActionId(null);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header: Institutional Financial Control Room */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(242,238,229,0.08)] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#191918] border border-[rgba(242,238,229,0.12)] text-[10px] font-sans uppercase tracking-[0.16em] text-[#B69A5A] font-semibold mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69A5A]" />
            Business Brain
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#F2EEE5]">
            AI Command Center
          </h1>
          <p className="text-xs text-[#A5A198] mt-1 font-sans">
            Understand what is happening, what is at risk, and what your business should do next.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#191918] hover:bg-[#222120] text-xs font-medium text-[#F2EEE5] border border-[rgba(242,238,229,0.14)] hover:border-[#B69A5A]/50 transition-all shadow-sm group cursor-pointer"
            title="Return to Razorpay AI Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B69A5A] group-hover:-translate-x-0.5 transition-transform" />
            <span>Landing Page</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#141413] border border-[rgba(242,238,229,0.08)] text-xs text-[#A5A198]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#66745D]" />
            <span className="text-[11px] font-sans text-[#F2EEE5]">Autonomous Safe Mode</span>
            <span className="text-[10px] text-[#66745D] font-mono">● Active</span>
          </div>
        </div>
      </div>

      {/* Execution Feedback Notification */}
      <AnimatePresence>
        {executionBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center justify-between p-3 rounded-md bg-[#121412] border border-[#66745D]/40 text-[#8FA383] text-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#66745D]" />
              <span>{executionBanner}</span>
            </div>
            <button
              onClick={() => setExecutionBanner(null)}
              className="text-[#706E68] hover:text-[#F2EEE5] text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Five Master KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Trailing 7D Revenue"
          value="₹18.42L"
          subValue="vs ₹22.5L rolling avg"
          trend={{ value: "↓ 18.2%", isPositive: false }}
          icon={TrendingDown}
          sparkline={[22.5, 22.1, 21.4, 20.8, 19.5, 18.9, 18.42]}
        />

        <MetricCard
          title="Recoverable Revenue"
          value="₹4.82L"
          subValue="88% avg recovery probability"
          trend={{ value: "6 cases", isPositive: true }}
          icon={RefreshCw}
          sparkline={[2.1, 2.6, 3.2, 3.8, 4.2, 4.6, 4.82]}
        />

        <MetricCard
          title="Revenue at Risk"
          value="₹2.13L"
          subValue="Critical exposure (3 cases)"
          trend={{ value: "Shield Active", isPositive: false }}
          icon={ShieldAlert}
          sparkline={[1.1, 1.3, 1.2, 1.7, 1.9, 2.13]}
        />

        <MetricCard
          title="Net Cash Position"
          value="₹42.50L"
          subValue="58 days runway (buffer intact)"
          trend={{ value: "58D Runway", isPositive: true }}
          icon={Landmark}
          sparkline={[48, 47, 46.2, 45, 43.8, 42.5]}
        />

        <MetricCard
          title="Growth Opportunity"
          value="₹6.20L"
          subValue="+34% predicted lift (12 accounts)"
          trend={{ value: "+34% predicted", isPositive: true }}
          icon={TrendingUp}
          sparkline={[4.1, 4.6, 5.0, 5.4, 5.8, 6.2]}
        />
      </div>

      {/* 9. Natural Language Assistant: AI BUSINESS ADVISOR */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 shadow-sm space-y-3">
        <div>
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#B69A5A]">
            AI Business Advisor
          </div>
          <p className="text-xs text-[#706E68] mt-0.5">
            Ask a question. Get an answer grounded in your business data.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const target = query.trim() || "Why did revenue drop this week?";
            runOrchestrator(target);
          }}
          className="relative flex items-center"
        >
          <div className="absolute left-3.5 text-[#706E68] pointer-events-none">
            <Search className="w-4 h-4 text-[#706E68]" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question (e.g. 'Why did revenue drop this week?')"
            className="w-full rounded-md bg-[#151514] border border-[rgba(242,238,229,0.10)] py-2.5 pl-10 pr-32 text-xs text-[#F2EEE5] placeholder-[#706E68] focus:border-[#B69A5A]/50 focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-28 text-[#706E68] hover:text-[#F2EEE5] p-1 cursor-pointer transition-colors"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="absolute right-1.5 flex items-center gap-1.5 rounded bg-[#B69A5A] hover:bg-[#D1B56A] px-3.5 py-1.5 text-xs font-semibold text-[#0B0B0A] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Investigate</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Quick Questions */}
        <div className="pt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-[#706E68] uppercase font-sans font-semibold mr-1">
            Questions:
          </span>
          {[
            "Why did revenue drop?",
            "What should I recover today?",
            "Can we afford ₹1.5L expansion?",
            "Which customers are ready to buy?",
            "Show critical risk alerts.",
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => runOrchestrator(prompt)}
              className="rounded px-2.5 py-1 text-[11px] font-sans bg-[#151514] border border-[rgba(242,238,229,0.08)] text-[#A5A198] hover:text-[#F2EEE5] hover:border-[rgba(242,238,229,0.20)] transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="p-3.5 rounded-md bg-[#161212] border border-[#713B3B]/40 text-[#D18686] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#713B3B]" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => runOrchestrator(query || "Why did revenue drop this week?")}
            className="underline text-[#F2EEE5] cursor-pointer text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* 10. AI Response & 11. Cross-Agent Business Analysis */}
      <div ref={resultsRef}>
        <AnimatePresence mode="wait">
          {orchestrationData && (
            <motion.div
              key={investigationId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* 10. AI INSIGHT PANEL */}
              <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.12)] p-6 space-y-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-[rgba(242,238,229,0.06)] pb-4 gap-2">
                  <div>
                    <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#B69A5A]">
                      AI Insight
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#F2EEE5] mt-1">
                      {orchestrationData.executiveSummary?.split(".")[0] || "Analysis Complete"}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-[#706E68] uppercase">Potential Recovery / Yield</span>
                    <div className="text-lg font-serif font-medium text-[#B69A5A]">
                      ₹{((orchestrationData.financialImpactTotal || 482500) / 100000).toFixed(2)}L
                    </div>
                  </div>
                </div>

                {/* Primary Drivers Breakdown */}
                <div>
                  <div className="text-[11px] font-sans uppercase tracking-wider text-[#706E68] font-semibold mb-2.5">
                    Primary Drivers Identified
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-1">
                      <span className="text-[11px] text-[#A5A198]">Failed Payment Drops</span>
                      <div className="text-lg font-serif text-[#F2EEE5]">₹1.24L</div>
                      <p className="text-[10px] text-[#706E68]">HDFC & SBI issuer clearance timeouts</p>
                    </div>
                    <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-1">
                      <span className="text-[11px] text-[#A5A198]">Lower Repeat Purchases</span>
                      <div className="text-lg font-serif text-[#F2EEE5]">₹82,000</div>
                      <p className="text-[10px] text-[#706E68]">14-day inactivity gap in VIP cohort</p>
                    </div>
                    <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-1">
                      <span className="text-[11px] text-[#A5A198]">Checkout Drop-offs</span>
                      <div className="text-lg font-serif text-[#F2EEE5]">₹41,000</div>
                      <p className="text-[10px] text-[#706E68]">Cart friction during peak traffic hours</p>
                    </div>
                  </div>
                </div>

                {/* Direct Executive Summary Text */}
                <div className="rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] p-3.5 text-xs text-[#A5A198] leading-relaxed">
                  <p>{orchestrationData.executiveSummary}</p>
                </div>

                {/* Recommended Action + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[rgba(242,238,229,0.06)]">
                  <div>
                    <span className="text-[11px] text-[#706E68]">Recommended Action:</span>
                    <p className="text-xs font-medium text-[#F2EEE5] mt-0.5">
                      Prioritize 126 failed payments with &gt;75% recovery probability. Expected recovery: <strong className="text-[#B69A5A] font-serif">₹96,000</strong>.
                    </p>
                  </div>
                  <Link
                    href="/recovery"
                    className="self-start sm:self-center px-4 py-2 rounded bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <span>Review Recovery Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 11. CROSS-AGENT BUSINESS ANALYSIS */}
              <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 space-y-4">
                <div>
                  <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.16em] text-[#B69A5A]">
                    RAZORPAY AI BUSINESS INTELLIGENCE
                  </div>
                  <h3 className="text-sm font-medium text-[#F2EEE5] mt-0.5">
                    Four specialized AI agents collaborating on a unified business brain.
                  </h3>
                </div>

                {/* Clean Horizontal Flow */}
                <div className="hidden md:flex items-center justify-between p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] text-xs font-sans">
                  <span className="px-2.5 py-1 rounded bg-[#1A1917] text-[#F2EEE5] font-medium border border-[rgba(242,238,229,0.08)]">
                    MERCHANT QUESTION
                  </span>
                  <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
                  <span className="px-2.5 py-1 rounded bg-[#1A1917] text-[#A5A198] border border-[rgba(242,238,229,0.08)]">
                    GROWTH
                  </span>
                  <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
                  <span className="px-2.5 py-1 rounded bg-[#1A1917] text-[#A5A198] border border-[rgba(242,238,229,0.08)]">
                    RISK
                  </span>
                  <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
                  <span className="px-2.5 py-1 rounded bg-[#1A1917] text-[#A5A198] border border-[rgba(242,238,229,0.08)]">
                    RECOVERY
                  </span>
                  <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
                  <span className="px-2.5 py-1 rounded bg-[#1A1917] text-[#A5A198] border border-[rgba(242,238,229,0.08)]">
                    FINANCE
                  </span>
                  <div className="h-[1px] flex-1 bg-[#B69A5A]/40 mx-2" />
                  <span className="px-2.5 py-1 rounded bg-[#B69A5A] text-[#0B0B0A] font-semibold">
                    RECOMMENDATION
                  </span>
                </div>

                {/* 12. FOUR AGENT CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Growth Agent Card */}
                  <div className="p-3.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#F2EEE5]">GROWTH</span>
                        <span className="text-[9px] uppercase text-[#66745D] font-medium">Active</span>
                      </div>
                      <div className="text-[10px] text-[#706E68]">Find revenue opportunities</div>
                      <div className="text-base font-serif text-[#F2EEE5] mt-2">
                        {orchestrationData.agentFindings?.growth?.metric || "+₹4.18L GMV"}
                      </div>
                      <p className="text-[11px] text-[#A5A198] mt-1 leading-snug">
                        {orchestrationData.agentFindings?.growth?.detail || "12 at-risk customer accounts ready for reactivation."}
                      </p>
                    </div>
                    <Link
                      href="/growth"
                      className="text-[11px] text-[#B69A5A] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View insights</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Risk Agent Card */}
                  <div className="p-3.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#F2EEE5]">RISK</span>
                        <span className="text-[9px] uppercase text-[#9A7940] font-medium">Guarded</span>
                      </div>
                      <div className="text-[10px] text-[#706E68]">Prevent financial loss</div>
                      <div className="text-base font-serif text-[#F2EEE5] mt-2">
                        {orchestrationData.agentFindings?.risk?.metric || "₹1.45L Saved"}
                      </div>
                      <p className="text-[11px] text-[#A5A198] mt-1 leading-snug">
                        {orchestrationData.agentFindings?.risk?.detail || "1 critical fraud attempt held for manual review."}
                      </p>
                    </div>
                    <Link
                      href="/risk"
                      className="text-[11px] text-[#B69A5A] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View insights</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Recovery Agent Card */}
                  <div className="p-3.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#F2EEE5]">RECOVERY</span>
                        <span className="text-[9px] uppercase text-[#66745D] font-medium">88% Prob</span>
                      </div>
                      <div className="text-[10px] text-[#706E68]">Recover missed revenue</div>
                      <div className="text-base font-serif text-[#B69A5A] mt-2">
                        {orchestrationData.agentFindings?.recovery?.metric || "₹4.82L Ready"}
                      </div>
                      <p className="text-[11px] text-[#A5A198] mt-1 leading-snug">
                        {orchestrationData.agentFindings?.recovery?.detail || "6 failed payments ready for optimal clearance retries."}
                      </p>
                    </div>
                    <Link
                      href="/recovery"
                      className="text-[11px] text-[#B69A5A] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View opportunities</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Finance Agent Card */}
                  <div className="p-3.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#F2EEE5]">FINANCE</span>
                        <span className="text-[9px] uppercase text-[#66745D] font-medium">58D Runway</span>
                      </div>
                      <div className="text-[10px] text-[#706E68]">Protect cash flow</div>
                      <div className="text-base font-serif text-[#F2EEE5] mt-2">
                        {orchestrationData.agentFindings?.finance?.metric || "₹42.50L Cash"}
                      </div>
                      <p className="text-[11px] text-[#A5A198] mt-1 leading-snug">
                        {orchestrationData.agentFindings?.finance?.detail || "Core liquidity buffer remains preserved at ₹15L."}
                      </p>
                    </div>
                    <Link
                      href="/finance"
                      className="text-[11px] text-[#B69A5A] hover:underline flex items-center gap-1 pt-1"
                    >
                      <span>View forecast</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recommended Operations / Approval Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F2EEE5]">Recommended Policy-Checked Actions</h3>
                    <p className="text-[11px] text-[#706E68]">
                      Deterministic guardrails applied. High-impact operations require merchant sign-off.
                    </p>
                  </div>
                  <span className="text-[11px] text-[#706E68] font-mono">
                    {orchestrationData.proposedActions?.length || 0} Operations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {orchestrationData.proposedActions?.map((act: any) => (
                    <ApprovalStateMachine
                      key={act.id}
                      actionId={act.id}
                      agent={act.agent}
                      actionType={act.actionType || act.title}
                      description={act.description}
                      financialImpact={act.financialImpact || 0}
                      policyRule={act.ruleApplied || "Standard Policy Guardrail"}
                      requiresApproval={Boolean(act.requiresApproval)}
                      initialState={act.policyStatus === "EXECUTED" ? "DONE" : "PROPOSED"}
                      onExecute={async () => {
                        await handleExecuteAction(act, act.requiresApproval ? "APPROVE" : "AUTO");
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 13. Transaction Intelligence & Audit Trail Table */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Recent Transactions & Autonomous Activity</h3>
            <p className="text-[11px] text-[#706E68]">
              Immutable record of detections, approvals, and executed merchant actions.
            </p>
          </div>
          <Link
            href="/activity"
            className="text-xs text-[#B69A5A] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Complete Audit Trail</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs fin-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Action</th>
                <th>Entity ID</th>
                <th>Reasoning</th>
                <th>Policy Verdict</th>
                <th>Impact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {actionFeed.slice(0, 6).map((act) => (
                <tr key={act.id}>
                  <td className="font-medium text-[#F2EEE5]">{act.agent}</td>
                  <td className="font-sans text-[11px] text-[#A5A198]">{act.action}</td>
                  <td className="font-mono text-[10px] text-[#706E68]">{act.entityId}</td>
                  <td className="max-w-xs truncate text-[#A5A198]" title={act.reason}>
                    {act.reason}
                  </td>
                  <td>
                    <PolicyPill status={act.approval} requiresApproval={act.requiresApproval} />
                  </td>
                  <td className="font-serif text-[#F2EEE5]">
                    {act.financialImpact ? formatINR(act.financialImpact) : "—"}
                  </td>
                  <td className="text-[#A5A198] font-medium text-[11px]">{act.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
