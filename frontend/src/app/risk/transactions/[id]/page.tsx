"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Cpu,
  Globe,
  Smartphone,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  XCircle,
  FileCheck,
} from "lucide-react";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { PolicyPill } from "@/components/shared/PolicyPill";
import { PredictionChip } from "@/components/shared/PredictionChip";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function TransactionRiskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const txId = params.id as string;

  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [decisionState, setDecisionState] = useState<string | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchTransaction();
  }, [txId]);

  async function fetchTransaction() {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.success) {
        const found = data.data.find((t: any) => t.transactionId === txId || t.id === txId);
        setTx(found || data.data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecision(action: "APPROVE" | "BLOCK") {
    setExecuting(true);
    try {
      const res = await fetch("/api/action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: "RISK",
          actionType: action === "BLOCK" ? "BLOCK_TRANSACTION" : "APPROVE_TRANSACTION",
          entityId: tx?.transactionId || txId,
          reason:
            action === "BLOCK"
              ? "Merchant authorized block following critical fraud score (91.4%) and geolocation discrepancy."
              : "Merchant verified legitimate customer exception and approved transaction.",
          financialImpact: tx?.amount || 68500,
          riskTier: "CRITICAL",
          merchantDecision: "APPROVE", // Merchant explicit authorization
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDecisionState(action === "BLOCK" ? "BLOCKED" : "APPROVED");
        setShowBlockModal(false);
        setTx((prev: any) => ({ ...prev, status: action === "BLOCK" ? "BLOCKED" : "SUCCESS" }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecuting(false);
    }
  }

  // Pre-configured explainable SHAP breakdown
  const shapFactors = [
    {
      factor: "Geolocation Mismatch: Card Origin vs Connection IP (8,400 km discrepancy)",
      impact: "+0.34",
      direction: "RISK_INCREASE",
      description: "IP routing through Ashburn data center proxy while billing address is Hyderabad.",
    },
    {
      factor: "Velocity Anomaly: 4 transactions in 10-minute sliding window",
      impact: "+0.28",
      direction: "RISK_INCREASE",
      description: "Card tested across multiple merchant endpoints within rapid succession.",
    },
    {
      factor: "Ticket Anomaly: 3.08x higher than customer historical average",
      impact: "+0.19",
      direction: "RISK_INCREASE",
      description: "Customer baseline avg is ₹22,250; this single charge is ₹68,500.",
    },
    {
      factor: "Device Fingerprint: Unrecognized Chromium Linux on headless proxy",
      impact: "+0.15",
      direction: "RISK_INCREASE",
      description: "Canvas fingerprint, WebGL renderer, and user agent match known emulation patterns.",
    },
    {
      factor: "Account Tenancy: Registered account age is > 60 days",
      impact: "-0.05",
      direction: "RISK_DECREASE",
      description: "Customer account created 90 days ago with initial legitimate purchase.",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumbs */}
      <div>
        <Link
          href="/risk"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Risk Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono">{tx?.transactionId || txId}</h1>
              <RiskBadge tier={tx?.riskTier || "CRITICAL"} score={tx?.riskScore || 91.4} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customer: <span className="text-slate-200 font-semibold">{tx?.customer?.name || "Vikram Malhotra"}</span> ({tx?.customer?.email})
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Transaction Amount</span>
            <div className="text-2xl font-bold text-white">{formatINR(tx?.amount || 68500)}</div>
          </div>
        </div>
      </div>

      {/* Decision Status Alert if completed */}
      {decisionState && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            decisionState === "BLOCKED"
              ? "bg-rose-950/40 border-rose-500/40 text-rose-300"
              : "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Transaction status updated to <strong className="font-mono">{decisionState}</strong>. Merchant decision logged to audit trail.
            </span>
          </div>
          <span className="font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
            Policy Enforced
          </span>
        </div>
      )}

      {/* Grid of Context Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>IP Geolocation Analysis</span>
          </div>
          <div className="text-sm font-bold text-white">Ashburn, Virginia (US Proxy)</div>
          <p className="text-[11px] text-slate-400">
            Routing to delivery pin: 500001 (Hyderabad). Geo distance: 8,400 km.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Device Fingerprint</span>
          </div>
          <div className="text-sm font-bold text-white font-mono text-xs">fp_anon_9x92b_chromium</div>
          <p className="text-[11px] text-slate-400">
            Headless Linux container detected. WebRTC IP leak confirmed.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Payment Instrument</span>
          </div>
          <div className="text-sm font-bold text-white">International Visa Card</div>
          <p className="text-[11px] text-slate-400">
            Velocity count: 4 attempts in 10 minutes. 3DS challenge bypassed.
          </p>
        </div>
      </div>

      {/* First-Class Explainable AI: SHAP Factor Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-950 p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Explainable AI: SHAP Factor Contributions</h3>
              <p className="text-xs text-slate-400">
                Trained on IEEE-CIS Fraud Detection benchmark. Each factor displays its marginal impact on fraud probability.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Model Confidence:</span>
            <span className="font-mono text-xs font-bold text-emerald-400">94.2%</span>
          </div>
        </div>

        {/* First-Class Prediction Chip */}
        <PredictionChip
          modelName="XGBoost Fraud Defense v2.4"
          score={91.4}
          scoreSuffix="%"
          confidence={0.942}
          riskTier="CRITICAL"
          topFactors={[
            { factor: "Foreign Proxy Geolocation Mismatch (8,400 km)", weight: "+0.34", direction: "RISK_INCREASE" },
            { factor: "Card Velocity Spike (4 tx in 10 mins)", weight: "+0.31", direction: "RISK_INCREASE" },
            { factor: "High Ticket Outlier vs History (13.7x avg)", weight: "+0.28", direction: "RISK_INCREASE" },
          ]}
          reasoning="International card token presented from headless Chromium proxy container in Ashburn, VA while shipping delivery address is Hyderabad. Exceeds velocity and proxy thresholds."
        />

        <div className="space-y-3">
          {shapFactors.map((f, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      f.direction === "RISK_INCREASE" ? "bg-rose-400" : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-white">{f.factor}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-4">{f.description}</p>
              </div>

              <div className="sm:text-right pl-4 sm:pl-0 flex-shrink-0">
                <span
                  className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                    f.direction === "RISK_INCREASE"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {f.impact} Risk Weight
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guardrail Policy & Merchant Decision Bar */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PolicyPill status="PENDING_APPROVAL" requiresApproval={true} />
            <span className="text-xs font-bold text-white">Fintech Guardrail Enforced</span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous system flagged transaction for manual review. High-impact operations (blocking money or cards) strictly require merchant sign-off.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDecision("APPROVE")}
            disabled={executing || tx?.status === "SUCCESS"}
            className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all disabled:opacity-40"
          >
            Approve Exception
          </button>

          <button
            onClick={() => setShowBlockModal(true)}
            disabled={executing || tx?.status === "BLOCKED"}
            className="rounded-lg bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all disabled:opacity-40 flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Block Transaction</span>
          </button>
        </div>
      </div>

      {/* Explicit Guardrail Authorization Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirm Transaction Block</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You are about to terminate transaction <strong className="font-mono text-white">{tx?.transactionId}</strong> (₹68,500) and blacklist the associated device fingerprint in Razorpay Risk Shield.
            </p>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div>• Policy Rule: <span className="font-mono text-slate-200">RULE_RISK_BLOCK_GUARDRAIL</span></div>
              <div>• Audit Sign-off: <span className="text-emerald-400 font-semibold">Merchant Admin (Human-in-the-Loop)</span></div>
              <div>• Action ID will be permanently recorded in immutable audit log.</div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision("BLOCK")}
                disabled={executing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md"
              >
                {executing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>Authorize Block</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
