"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Building2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Landmark,
  ShieldAlert,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState("nova");

  const scenarios = [
    {
      id: "nova",
      name: "Nova Apparel",
      tag: "D2C Fashion & Lifestyle",
      description: "High transaction volume, COD return/RTO risk, seasonal demand spikes, failed payment dropoffs.",
      stats: "₹18.4L Weekly Revenue • ₹4.82L Recoverable",
    },
    {
      id: "cloudflow",
      name: "CloudFlow India",
      tag: "B2B SaaS & Cloud Services",
      description: "Recurring card subscriptions, aging overdue enterprise invoices, high customer lifetime value.",
      stats: "₹42.5L Liquid Cash • 58 Days Runway",
    },
    {
      id: "voltmart",
      name: "VoltMart Electronics",
      tag: "High-Ticket Consumer Tech",
      description: "Elevated average order value, sophisticated fraud attacks, chargeback dispute defense.",
      stats: "1 Critical Fraud Alert • ₹1.45L Saved",
    },
  ];

  function handleEnter() {
    router.push("/command-center");
  }

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center max-w-3xl mx-auto px-4">
      {/* Brand Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Razorpay AI Buildathon 2026</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Razorpay AI-Native Merchant OS
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          "Four AI agents. One business brain. Growth finds the money. Risk protects it. Recovery brings it back. Finance tells you what to do next."
        </p>
      </div>

      {/* Merchant Persona Selection Card */}
      <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl space-y-5 backdrop-blur-md">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
          Select Merchant Environment Scenario
        </div>

        <div className="space-y-3">
          {scenarios.map((sc) => (
            <div
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedScenario === sc.id
                  ? "border-blue-500 bg-blue-500/10 shadow-md"
                  : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Building2 className={`w-4 h-4 ${selectedScenario === sc.id ? "text-blue-400" : "text-slate-400"}`} />
                  <span className="text-sm font-bold text-white">{sc.name}</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-medium">
                    {sc.tag}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">{sc.stats}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 pl-6">{sc.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleEnter}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <span>Enter Merchant Operating System</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Badge */}
      <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Policy Engine & Guardrails active across all 4 product tracks</span>
      </div>
    </div>
  );
}
