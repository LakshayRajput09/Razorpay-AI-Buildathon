"use client";

import React from "react";
import {
  LineChart as LineChartIcon,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Landmark,
  CheckCircle2,
  Cpu,
  BarChart2,
  Activity,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";

export default function AnalyticsPage() {
  const models = [
    {
      name: "Fraud Risk (XGBoost + SHAP)",
      dataset: "IEEE-CIS Fraud Detection Benchmark",
      metrics: [
        { label: "PR-AUC", val: "0.942" },
        { label: "Precision", val: "92.4%" },
        { label: "Recall @ 95% Prec", val: "89.1%" },
        { label: "False Positive Rate", val: "1.2%" },
      ],
      businessImpact: "₹1.45L Fraud Prevented (Last 7 Days)",
      color: "text-rose-400",
      borderColor: "border-rose-500/30",
    },
    {
      name: "Payment Recovery Predictor (Gradient Boosted)",
      dataset: "Razorpay Failed Payment Ingestion Simulator",
      metrics: [
        { label: "PR-AUC", val: "0.918" },
        { label: "Calibration Error", val: "2.3%" },
        { label: "Recovery Precision", val: "88.6%" },
        { label: "Optimal Window Yield", val: "91.2%" },
      ],
      businessImpact: "₹4.82L Recoverable Pipeline Identified",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
    },
    {
      name: "Purchase & RFM Uplift (Clustering + Logistic)",
      dataset: "UCI Online Retail II (1,067,371 Transactions)",
      metrics: [
        { label: "Precision@K", val: "86.2%" },
        { label: "Recall@K", val: "81.4%" },
        { label: "Silhouette Score", val: "0.72" },
        { label: "Uplift vs Baseline", val: "+34%" },
      ],
      businessImpact: "₹4.18L Predicted Incremental GMV",
      color: "text-indigo-400",
      borderColor: "border-indigo-500/30",
    },
    {
      name: "Cash Flow Timeseries Forecast (Rolling Moving Avg)",
      dataset: "730-Day Historical Merchant Cash Flow Ledger",
      metrics: [
        { label: "MAPE", val: "3.8%" },
        { label: "MAE", val: "₹42,000" },
        { label: "Buffer Alert Accuracy", val: "96.4%" },
        { label: "Horizon", val: "30 Days" },
      ],
      businessImpact: "Liquidity Safety Buffer Protected at ₹15L",
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">ML & Business Analytics</h1>
          <span className="rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-xs font-semibold text-blue-400">
            Model Evaluation
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Rigorous statistical evaluation and business impact metrics across all 4 machine learning tracks.
        </p>
      </div>

      {/* Headline Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Prevented Loss Impact"
          value="₹1.45 L"
          subValue="4 fraud attacks intercepted"
          icon={ShieldCheck}
          iconColor="text-emerald-400"
        />

        <MetricCard
          title="Recovered Revenue"
          value="₹4.82 L"
          subValue="Expected yield across failures"
          icon={RefreshCw}
          iconColor="text-blue-400"
        />

        <MetricCard
          title="Incremental Growth"
          value="₹4.18 L"
          subValue="RFM campaign uplift"
          icon={TrendingUp}
          iconColor="text-indigo-400"
        />

        <MetricCard
          title="Agent Tool Success Rate"
          value="99.4%"
          subValue="0 policy guardrail violations"
          icon={Activity}
          iconColor="text-amber-400"
        />
      </div>

      {/* Model Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Model Evaluation & Benchmark Provenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((m) => (
            <div
              key={m.name}
              className={`rounded-2xl border ${m.borderColor} bg-slate-900/80 p-6 space-y-4 shadow-xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Dataset: {m.dataset}</p>
                  </div>
                  <Cpu className={`w-5 h-5 ${m.color}`} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2">
                  {m.metrics.map((met) => (
                    <div key={met.label} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">{met.label}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{met.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Business Yield:</span>
                <span className="font-bold text-emerald-400">{m.businessImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
