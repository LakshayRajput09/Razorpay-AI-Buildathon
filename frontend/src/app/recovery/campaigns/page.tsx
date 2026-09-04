"use client";

import React from "react";
import {
  Sparkles,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Mail,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function RecoveryCampaignsPage() {
  const cohorts = [
    {
      channel: "Smart Bank-Aware Retry",
      icon: RefreshCw,
      color: "text-blue-400",
      cases: 42,
      recoveredINR: 284000,
      recoveryRate: 91.8,
      avgWindow: "45 mins",
      rule: "Auto-retry during issuer queue reset (HDFC/SBI)",
    },
    {
      channel: "WhatsApp Instant Payment Link",
      icon: MessageSquare,
      color: "text-emerald-400",
      cases: 28,
      recoveredINR: 198500,
      recoveryRate: 85.2,
      avgWindow: "12 mins",
      rule: "Dispatched upon 3DS auth drop with 15m countdown",
    },
    {
      channel: "Targeted 5% Incentive Dunning",
      icon: Zap,
      color: "text-amber-400",
      cases: 19,
      recoveredINR: 112000,
      recoveryRate: 72.4,
      avgWindow: "4 hours",
      rule: "Activated when recovery probability is between 40%-60%",
    },
    {
      channel: "Email & SMS Grace Reminder",
      icon: Mail,
      color: "text-indigo-400",
      cases: 15,
      recoveredINR: 84000,
      recoveryRate: 64.1,
      avgWindow: "24 hours",
      rule: "Gentle nudge sent for insufficient balance drops",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Recovery Cohorts & Automation</h1>
          <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-400">
            Performance Analytics
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Historical recovery velocity, channel effectiveness, and autonomous rules across payment failure cohorts.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Recovered (MTD)"
          value="₹6.78 L"
          subValue="104 recovered orders"
          trend={{ value: "+28% vs last month", isPositive: true }}
          icon={TrendingUp}
          iconColor="text-emerald-400"
        />

        <MetricCard
          title="Overall Channel Recovery Rate"
          value="82.4%"
          subValue="Cross-channel blended"
          trend={{ value: "Benchmark Lead", isPositive: true }}
          icon={ShieldCheck}
          iconColor="text-blue-400"
        />

        <MetricCard
          title="Average Recovery Latency"
          value="34 Mins"
          subValue="From initial failure to paid"
          trend={{ value: "Real-time Retries", isPositive: true }}
          icon={Clock}
          iconColor="text-indigo-400"
        />
      </div>

      {/* Channel Cohorts Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Channel Cohort Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cohorts.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.channel}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      <Icon className={`w-4 h-4 ${c.color}`} />
                    </div>
                    <h4 className="text-sm font-bold text-white">{c.channel}</h4>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">{c.recoveryRate}% Win</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-slate-800">
                  <div>
                    <div className="text-[10px] text-slate-400">Cases Handled</div>
                    <div className="text-sm font-bold text-white mt-0.5">{c.cases}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Recovered GMV</div>
                    <div className="text-sm font-bold text-emerald-400 mt-0.5">{formatINR(c.recoveredINR)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Avg Clear Time</div>
                    <div className="text-sm font-bold text-slate-200 mt-0.5">{c.avgWindow}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold">Active Rule:</span> {c.rule}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
