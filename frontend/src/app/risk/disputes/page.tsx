"use client";

import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Download,
  CheckCircle2,
  RefreshCw,
  Send,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { PolicyPill } from "@/components/shared/PolicyPill";
import { formatINR } from "@/lib/utils";

export default function DisputesPage() {
  const [evidenceDrafted, setEvidenceDrafted] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleDraftEvidence() {
    setDrafting(true);
    setTimeout(() => {
      setDrafting(false);
      setEvidenceDrafted(true);
    }, 900);
  }

  function handleSubmitDispute() {
    setSubmitted(true);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Returns & Chargeback Disputes</h1>
          <span className="rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-semibold text-amber-400">
            RTO & Representment Center
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Automate dispute evidence compilation, prevent Return-To-Origin (RTO) waste, and recover contested revenue.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Active Chargebacks Under Review"
          value="₹68,500"
          subValue="1 open case (7 days remaining)"
          trend={{ value: "Evidence Ready", isPositive: true }}
          icon={AlertTriangle}
          iconColor="text-amber-400"
        />

        <MetricCard
          title="Prevented RTO Return Value"
          value="₹34,800"
          subValue="COD verification pre-dispatch"
          trend={{ value: "9 orders protected", isPositive: true }}
          icon={ShieldCheck}
          iconColor="text-emerald-400"
        />

        <MetricCard
          title="Dispute Win Rate (Historical)"
          value="84.6%"
          subValue="Visa/Mastercard representment"
          trend={{ value: "+18% vs industry", isPositive: true }}
          icon={FileText}
          iconColor="text-blue-400"
        />
      </div>

      {/* Active Chargeback Representment Workspace */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">OPEN CHARGEBACK DISPUTE</span>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">#CB-2026-5501</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Contested Amount: ₹68,500 (Reason Code 10.4 — Fraudulent Transaction)
            </h3>
            <p className="text-xs text-slate-400">
              Issuing Bank: Standard Chartered • Card Brand: Visa Signature • Representment Deadline: 7 Days Left
            </p>
          </div>

          <PolicyPill status="PENDING_APPROVAL" requiresApproval={true} ruleApplied="RULE_CHARGEBACK_REPRESENTMENT_LEGAL" />
        </div>

        {/* AI Evidence Generator */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">AI Evidence Compilation Engine</span>
            </div>
            {evidenceDrafted && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Evidence Packet Compiled
              </span>
            )}
          </div>

          {evidenceDrafted ? (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300">
                📄 Packet #REP-DOC-9821 Includes:
                <br />1. Verified 3DS Cryptogram & OTP delivery logs from Razorpay Gateway.
                <br />2. Device hardware telemetry and IP proxy detection proving authorized buyer authentication.
                <br />3. Carrier Proof of Delivery with signature match for Pin 500001.
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 text-[11px]">
                  Requires Merchant Sign-off prior to network upload.
                </span>
                {submitted ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Representment Submitted to Card Network
                  </span>
                ) : (
                  <button
                    onClick={handleSubmitDispute}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Authorize & Submit Representment</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-400">
                Risk Agent can automatically compile gateway 3DS logs, IP geolocation traces, and proof of fulfillment into a bank-ready representment packet.
              </p>
              <button
                onClick={handleDraftEvidence}
                disabled={drafting}
                className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all"
              >
                {drafting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Auto-Draft Evidence Packet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prevented RTO Returns Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">RTO Return-Risk Prevention Queue</h3>
        <p className="text-xs text-slate-400">
          Orders evaluated for Cash-on-Delivery (COD) refusal and sizing return variance prior to warehouse dispatch
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[11px] font-semibold uppercase text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Return Risk Score</th>
                <th className="py-2.5 px-3">Risk Driver</th>
                <th className="py-2.5 px-3">Recommended Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-mono font-semibold text-blue-400">ORD-2026-6601</td>
                <td className="py-2.5 px-3">Italian Pebble Grain Oxford Shoes</td>
                <td className="py-2.5 px-3 font-semibold text-amber-400">COD (₹6,999)</td>
                <td className="py-2.5 px-3">
                  <span className="font-bold text-rose-400">74% High RTO</span>
                </td>
                <td className="py-2.5 px-3 text-slate-300">Footwear sizing variance + COD pin code history</td>
                <td className="py-2.5 px-3">
                  <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    Prompt WhatsApp Pre-dispatch Sizing Check
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
