"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart as LineChartIcon,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
  Legend,
} from "recharts";
import { MetricCard } from "@/components/shared/MetricCard";
import { formatINR, formatCompactINR } from "@/lib/utils";
import Link from "next/link";

export default function CashflowForecastPage() {
  const [revenueChange, setRevenueChange] = useState(-15); // -15% default revenue shock
  const [expenseChange, setExpenseChange] = useState(10); // +10% expense shock
  const [recoveryUplift, setRecoveryUplift] = useState(350000); // +₹3.5L recovery uplift
  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runSimulation();
  }, [revenueChange, expenseChange, recoveryUplift]);

  async function runSimulation() {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCash: 4250000,
          revenueMultiplier: 1 + revenueChange / 100,
          expenseMultiplier: 1 + expenseChange / 100,
          recoveryUpliftINR: recoveryUplift,
          safetyBufferINR: 1500000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSimResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <Link
          href="/finance"
          className="inline-flex items-center gap-1.5 text-xs text-[#A5A198] hover:text-[#F2EEE5] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Finance Controller</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2EEE5]/10 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-serif font-bold tracking-tight text-[#F2EEE5]">
                30-Day Liquidity Forecast & What-If Scenarios
              </h1>
              <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/30">
                Predictive Runway
              </span>
            </div>
            <p className="text-xs text-[#A5A198] mt-1">
              Simulate market shocks, cost fluctuations, and autonomous recovery offsets to evaluate runway solvency.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-[#151514] border border-[#F2EEE5]/10">
            <span className="text-[#706E68]">Safety Reserve:</span>
            <span className="font-mono font-semibold text-[#B69A5A]">₹15.00 Lakhs Minimum</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Baseline Day 30 Balance"
          value={formatCompactINR(simResult?.baselineClosingBalance30d || 5400000)}
          subValue="Without scenario shocks"
          icon={LineChartIcon}
          iconColor="text-[#A5A198]"
        />

        <MetricCard
          title="Simulated Day 30 Balance"
          value={formatCompactINR(simResult?.scenarioClosingBalance30d || 4800000)}
          subValue={`Net delta: ${formatCompactINR(simResult?.netImpactINR || 0)}`}
          trend={{
            value: (simResult?.netImpactINR || 0) >= 0 ? "+ Buffer Surplus" : "Buffer Pressure",
            isPositive: (simResult?.netImpactINR || 0) >= 0,
          }}
          icon={TrendingUp}
          iconColor="text-[#B69A5A]"
        />

        <MetricCard
          title="Simulated Runway"
          value={`${simResult?.runwayDaysScenario || 58} Days`}
          subValue="Before safety threshold breach"
          trend={{
            value: simResult?.shortfallDateScenario ? "Alert Triggered" : "Solvent & Safe",
            isPositive: !simResult?.shortfallDateScenario,
          }}
          icon={ShieldCheck}
          iconColor="text-[#66745D]"
        />

        <MetricCard
          title="Recovery Action Offset"
          value={formatCompactINR(recoveryUplift)}
          subValue="Direct capital reclamation"
          trend={{ value: "+ Stabilized", isPositive: true }}
          icon={Zap}
          iconColor="text-[#B69A5A]"
        />
      </div>

      {/* Interactive Scenario Controls */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EEE5]/08 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#B69A5A]" />
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Executive "What-If" Sensitivity Simulator</h3>
          </div>
          <span className="text-[11px] text-[#706E68] font-mono">Real-time dynamic stress-testing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Change Slider */}
          <div className="space-y-2.5 p-3.5 rounded-lg bg-[#121211] border border-[#F2EEE5]/06">
            <div className="flex justify-between text-xs">
              <span className="text-[#A5A198] font-medium">Top-Line Revenue Shock</span>
              <span className={`font-mono font-bold ${revenueChange < 0 ? "text-[#713B3B]" : "text-[#66745D]"}`}>
                {revenueChange > 0 ? `+${revenueChange}%` : `${revenueChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="20"
              step="5"
              value={revenueChange}
              onChange={(e) => setRevenueChange(Number(e.target.value))}
              className="w-full accent-[#B69A5A] cursor-pointer"
            />
            <p className="text-[11px] text-[#706E68]">Simulates sales dip or payment gateway processing interruptions</p>
          </div>

          {/* Expense Escalation Slider */}
          <div className="space-y-2.5 p-3.5 rounded-lg bg-[#121211] border border-[#F2EEE5]/06">
            <div className="flex justify-between text-xs">
              <span className="text-[#A5A198] font-medium">Operating Burn Escalation</span>
              <span className={`font-mono font-bold ${expenseChange > 0 ? "text-[#713B3B]" : "text-[#66745D]"}`}>
                {expenseChange > 0 ? `+${expenseChange}%` : `${expenseChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-15"
              max="30"
              step="5"
              value={expenseChange}
              onChange={(e) => setExpenseChange(Number(e.target.value))}
              className="w-full accent-[#B69A5A] cursor-pointer"
            />
            <p className="text-[11px] text-[#706E68]">Simulates cloud infra surges, logistics freight, or hiring costs</p>
          </div>

          {/* Recovery Uplift Slider */}
          <div className="space-y-2.5 p-3.5 rounded-lg bg-[#121211] border border-[#F2EEE5]/06">
            <div className="flex justify-between text-xs">
              <span className="text-[#A5A198] font-medium">Autonomous Recovery Inflow</span>
              <span className="font-mono font-bold text-[#B69A5A]">+{formatCompactINR(recoveryUplift)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="600000"
              step="50000"
              value={recoveryUplift}
              onChange={(e) => setRecoveryUplift(Number(e.target.value))}
              className="w-full accent-[#B69A5A] cursor-pointer"
            />
            <p className="text-[11px] text-[#706E68]">Simulates recovered failed checkouts via AI Smart Retries</p>
          </div>
        </div>

        {/* AI Explanation of Scenario */}
        {simResult && (
          <div className="p-4 rounded-lg bg-[#1A1917] border border-[#B69A5A]/30 flex items-start gap-3.5">
            <Sparkles className="w-4 h-4 text-[#B69A5A] mt-0.5 flex-shrink-0" />
            <div className="text-xs space-y-1">
              <span className="font-serif font-bold text-[#F2EEE5]">Finance Controller Synthesis:</span>
              <p className="text-[#A5A198] leading-relaxed font-sans">{simResult.aiRecommendation}</p>
            </div>
          </div>
        )}
      </div>

      {/* 30-Day Recharts Visualization */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2EEE5]/08 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">30-Day Liquidity Trajectory</h3>
            <p className="text-xs text-[#706E68]">
              Comparing baseline treasury trajectory against simulated stress-test curve
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#A5A198]" />
              <span className="text-[#A5A198]">Baseline Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#B69A5A]" />
              <span className="text-[#B69A5A]">Simulated Stress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#713B3B] border-dashed" />
              <span className="text-[#713B3B]">₹15L Safety Reserve</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simResult?.dailyTrajectory || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(242,238,229,0.06)" />
              <XAxis dataKey="day" stroke="#706E68" tickFormatter={(v) => `D${v}`} fontSize={11} />
              <YAxis
                stroke="#706E68"
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                domain={[1000000, 7000000]}
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151514",
                  borderColor: "rgba(242,238,229,0.12)",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  color: "#F2EEE5",
                }}
                formatter={(value: any) => formatINR(value)}
                labelFormatter={(label) => `Day ${label}`}
              />
              <ReferenceLine y={1500000} stroke="#713B3B" strokeDasharray="4 4" label="" />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#A5A198"
                strokeWidth={1.8}
                dot={false}
                name="Baseline"
              />
              <Line
                type="monotone"
                dataKey="scenarioBalance"
                stroke="#B69A5A"
                strokeWidth={2.5}
                dot={false}
                name="Scenario"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
