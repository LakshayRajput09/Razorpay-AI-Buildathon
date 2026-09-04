"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ArrowRight,
  RefreshCw,
  Search,
  ExternalLink,
  Lock,
  X,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  Smartphone,
  CreditCard,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function RiskDashboardPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filterTier, setFilterTier] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [filterTier]);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const url = filterTier === "ALL" ? "/api/transactions" : `/api/transactions?riskTier=${filterTier}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = (type: string, tx: any) => {
    setActionMessage(`Transaction ${tx.transactionId} marked for ${type}. Decision logged in audit trail.`);
    setTimeout(() => setActionMessage(null), 4000);
    setSelectedTx(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header: Institutional Risk Terminal */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(242,238,229,0.08)] pb-5">
        <div>
          <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#B69A5A] font-semibold mb-1">
            Institutional Risk Terminal
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#F2EEE5]">
            Risk Intelligence
          </h1>
          <p className="text-xs text-[#A5A198] mt-1 font-sans">
            Explainable fraud detection, transaction velocity monitoring, and chargeback defense.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/risk/disputes"
            className="flex items-center gap-2 rounded bg-[#151514] hover:bg-[#1A1917] border border-[rgba(242,238,229,0.10)] px-3 py-1.5 text-xs text-[#F2EEE5] transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-[#B69A5A]" />
            <span>Disputes Center</span>
          </Link>
        </div>
      </div>

      {/* Action Confirmation Banner */}
      {actionMessage && (
        <div className="p-3 rounded bg-[#121412] border border-[#66745D]/40 text-[#8FA383] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#66745D]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 4 Core Financial Risk Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Fraud Exposure"
          value="₹2.13L"
          subValue="Active exposure window"
          trend={{ value: "Shield Active", isPositive: false }}
          icon={ShieldAlert}
          sparkline={[1.2, 1.4, 1.6, 1.9, 2.13]}
        />

        <MetricCard
          title="Transactions Under Review"
          value="12"
          subValue="₹84,500 pending approval"
          trend={{ value: "Review Queue", isPositive: false }}
          icon={AlertTriangle}
          sparkline={[8, 9, 11, 10, 12]}
        />

        <MetricCard
          title="Chargeback Exposure"
          value="₹84K"
          subValue="AI evidence packets drafted"
          trend={{ value: "94.2% defense win rate", isPositive: true }}
          icon={Lock}
          sparkline={[98, 92, 88, 85, 84]}
        />

        <MetricCard
          title="Prevented Loss"
          value="₹3.42L"
          subValue="Trailing 30 days protected"
          trend={{ value: "+₹1.45L this week", isPositive: true }}
          icon={ShieldCheck}
          sparkline={[1.8, 2.2, 2.6, 3.0, 3.42]}
        />
      </div>

      {/* Risk Distribution Bar */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-[#A5A198] text-[10px]">
            Portfolio Risk Distribution (Trailing 7D Volume)
          </span>
          <div className="flex items-center gap-4 text-[11px] font-sans">
            <span className="flex items-center gap-1.5 text-[#F2EEE5]">
              <span className="w-2 h-2 rounded-sm bg-[#66745D]" /> Low Risk (74%)
            </span>
            <span className="flex items-center gap-1.5 text-[#F2EEE5]">
              <span className="w-2 h-2 rounded-sm bg-[#9A7940]" /> Medium (18%)
            </span>
            <span className="flex items-center gap-1.5 text-[#F2EEE5]">
              <span className="w-2 h-2 rounded-sm bg-[#713B3B]" /> High / Critical (8%)
            </span>
          </div>
        </div>

        <div className="h-2 w-full rounded bg-[#1A1917] overflow-hidden flex">
          <div style={{ width: "74%" }} className="bg-[#66745D]" title="Low Risk: 74%" />
          <div style={{ width: "18%" }} className="bg-[#9A7940]" title="Medium: 18%" />
          <div style={{ width: "8%" }} className="bg-[#713B3B]" title="Critical: 8%" />
        </div>
      </div>

      {/* Dense Transaction Table */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,238,229,0.06)] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Transaction Risk Queue</h3>
            <p className="text-[11px] text-[#706E68]">
              Click any transaction row to inspect explainable factors and sign off on actions.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-2.5 py-1 rounded text-[11px] font-sans transition-all cursor-pointer ${
                  filterTier === tier
                    ? "bg-[#1A1917] text-[#F2EEE5] border border-[#B69A5A]/50 font-medium"
                    : "text-[#706E68] hover:text-[#F2EEE5]"
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs fin-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Time / Geo</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="cursor-pointer transition-colors"
                >
                  <td className="font-mono text-[11px] text-[#A5A198] font-medium">
                    {tx.transactionId}
                  </td>
                  <td>
                    <div className="text-[#F2EEE5] font-medium">{tx.customer?.name || "Customer"}</div>
                    <div className="text-[10px] text-[#706E68]">{tx.customer?.email}</div>
                  </td>
                  <td className="font-serif text-[#F2EEE5] text-sm font-medium">
                    {formatINR(tx.amount)}
                  </td>
                  <td className="font-mono text-[11px] text-[#A5A198]">{tx.method}</td>
                  <td>
                    <RiskBadge tier={tx.riskTier} score={tx.riskScore} />
                  </td>
                  <td>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase ${
                        tx.status === "REVIEW"
                          ? "bg-[#9A7940]/15 text-[#D1B56A] border border-[#9A7940]/30"
                          : tx.status === "BLOCKED"
                          ? "bg-[#713B3B]/15 text-[#E08A8A] border border-[#713B3B]/30"
                          : "bg-[#66745D]/15 text-[#8FA383] border border-[#66745D]/30"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="text-[11px] text-[#706E68] truncate max-w-xs">
                    {tx.location || "Bengaluru, IN"}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTx(tx);
                      }}
                      className="text-[11px] text-[#B69A5A] hover:underline"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#706E68]">
                    No transactions matching filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Slide-Over Transaction Inspection Panel */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121211] border-l border-[rgba(242,238,229,0.12)] p-6 flex flex-col justify-between overflow-y-auto space-y-6 shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.08)] pb-3">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#706E68]">
                    Transaction Inspection
                  </div>
                  <h3 className="font-mono text-sm font-semibold text-[#F2EEE5]">
                    {selectedTx.transactionId}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded text-[#706E68] hover:text-[#F2EEE5] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Top Score Box */}
              <div className="p-4 rounded bg-[#151514] border border-[rgba(242,238,229,0.08)] space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase text-[#706E68] font-sans font-semibold">
                    Risk Score
                  </span>
                  <RiskBadge tier={selectedTx.riskTier} score={selectedTx.riskScore} />
                </div>
                <div className="font-serif text-3xl text-[#F2EEE5]">
                  {(selectedTx.riskScore || 87).toFixed(0)} <span className="text-base text-[#706E68] font-sans">/ 100</span>
                </div>
                <p className="text-[11px] text-[#A5A198]">
                  {selectedTx.riskTier === "CRITICAL" || selectedTx.riskTier === "HIGH"
                    ? "High probability of dispute or unauthorized credential usage."
                    : "Operating within normal variance."}
                </p>
              </div>

              {/* Transaction Metadata */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#706E68]">
                  Transaction Telemetry
                </div>
                <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#706E68]">Amount:</span>
                    <span className="font-serif text-[#F2EEE5]">{formatINR(selectedTx.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#706E68]">Customer:</span>
                    <span className="text-[#F2EEE5]">{selectedTx.customer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#706E68]">Payment Method:</span>
                    <span className="font-mono text-[#A5A198]">{selectedTx.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#706E68]">Location:</span>
                    <span className="text-[#A5A198]">{selectedTx.location || "India"}</span>
                  </div>
                </div>
              </div>

              {/* Explainability: "Why?" */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#706E68]">
                  Explainable Risk Factors (SHAP Drivers)
                </div>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#9A7940] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#F2EEE5] text-[11px]">Unusual Amount Ratio</div>
                      <div className="text-[10px] text-[#706E68]">3.1x greater than customer historical 90-day average order value.</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex items-start gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#9A7940] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#F2EEE5] text-[11px]">New Device Hardware Signature</div>
                      <div className="text-[10px] text-[#706E68]">Unrecognized browser canvas fingerprint and operating system.</div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#9A7940] flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-[#F2EEE5] text-[11px]">Velocity Spike</div>
                      <div className="text-[10px] text-[#706E68]">4 transaction attempts recorded in trailing 10 minutes.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="p-3 rounded bg-[#171613] border border-[#B69A5A]/30 space-y-1 text-xs">
                <div className="text-[10px] uppercase font-semibold text-[#B69A5A]">
                  AI Recommendation
                </div>
                <p className="text-[11px] text-[#F2EEE5] leading-relaxed">
                  "Send this transaction for manual merchant review before order fulfillment to prevent unrecoverable chargeback loss."
                </p>
              </div>
            </div>

            {/* Action Buttons: Clearly requiring human approval */}
            <div className="pt-4 border-t border-[rgba(242,238,229,0.08)] space-y-2">
              <div className="text-[10px] text-[#706E68] text-center">
                High-impact financial actions require explicit merchant authorization.
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAction("APPROVED", selectedTx)}
                  className="py-2 px-3 rounded bg-[#1A1917] border border-[rgba(242,238,229,0.12)] text-[#F2EEE5] hover:bg-[#22201D] text-xs font-medium cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction("REVIEW", selectedTx)}
                  className="py-2 px-3 rounded bg-[#9A7940]/20 text-[#D1B56A] border border-[#9A7940]/40 hover:bg-[#9A7940]/30 text-xs font-medium cursor-pointer"
                >
                  Hold Review
                </button>
                <button
                  onClick={() => handleAction("BLOCKED", selectedTx)}
                  className="py-2 px-3 rounded bg-[#713B3B] hover:bg-[#854545] text-white text-xs font-semibold cursor-pointer"
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
