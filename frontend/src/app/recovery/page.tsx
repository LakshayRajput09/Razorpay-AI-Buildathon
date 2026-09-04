"use client";

import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Scale,
  Sparkles,
  X,
  ShieldCheck,
  Check,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { NoticeDispatchModal, NoticeRecipient } from "@/components/recovery/NoticeDispatchModal";

export default function RevenueRecoveryPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [totalRecoverable, setTotalRecoverable] = useState(482500);
  const [totalFailed, setTotalFailed] = useState(63994);
  const [loading, setLoading] = useState(true);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [executedItems, setExecutedItems] = useState<Record<string, string>>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [campaignExecuted, setCampaignExecuted] = useState(false);
  const [noticeTarget, setNoticeTarget] = useState<NoticeRecipient | null>(null);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    try {
      const res = await fetch("/api/recovery/opportunities");
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.data.opportunities);
        setTotalRecoverable(data.data.totalExpectedRecovery);
        setTotalFailed(data.data.totalFailedAmount);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecuteRecovery(item: any) {
    setExecutingId(item.paymentId);
    try {
      const actionType = item.recommendedAction === "PAYMENT_LINK" ? "SEND_PAYMENT_LINK" : "SMART_RETRY";
      const res = await fetch("/api/action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: "RECOVERY",
          actionType,
          entityId: item.paymentId,
          reason: `Automated recovery executed via ${item.recommendedAction}. Reason: ${item.failureReason}. Recovery prob: ${(item.recoveryProb * 100).toFixed(0)}%.`,
          financialImpact: item.expectedValue,
          riskTier: "LOW",
          merchantDecision: "AUTO",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExecutedItems((prev) => ({
          ...prev,
          [item.paymentId]: actionType === "SEND_PAYMENT_LINK" ? "WhatsApp Link Sent" : "Retry Scheduled (45m)",
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecutingId(null);
    }
  }

  const handleApproveCampaign = () => {
    setCampaignExecuted(true);
    setTimeout(() => {
      setPreviewOpen(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(242,238,229,0.08)] pb-5">
        <div>
          <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#B69A5A] font-semibold mb-1">
            Revenue Recovery Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#F2EEE5]">
            Revenue Recovery
          </h1>
          <p className="text-xs text-[#A5A198] mt-1 font-sans">
            Autonomous dunning, optimal clearance timing, and intelligent retry orchestration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              const topItem = opportunities[0] || {
                paymentId: "pay_failed_sample",
                amount: 18450,
                failureReason: "3DS Authentication Timeout",
              };
              setNoticeTarget({
                paymentId: topItem.paymentId,
                customerName: "Vikram Malhotra",
                customerPhone: "+91 98201 54321",
                customerEmail: "vikram.malhotra@zenithcorp.in",
                amount: topItem.amount || 18450,
                failureReason: topItem.failureReason || "Issuer Timeout",
                daysOverdue: 14,
              });
              setIsNoticeOpen(true);
            }}
            className="px-3 py-1.5 rounded bg-[#151514] border border-[rgba(242,238,229,0.10)] text-xs text-[#A5A198] hover:text-[#F2EEE5] transition-all flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-[#B69A5A]" />
            <span>Notice Draft</span>
          </button>

          <button
            onClick={() => setPreviewOpen(true)}
            className="px-4 py-1.5 rounded bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Run Recovery Campaign</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Metric Banner: Private Banking Style */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-sans uppercase tracking-wider text-[#A5A198] font-semibold">
            Recoverable Revenue Pipeline
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-[#F2EEE5] mt-1.5">
            ₹4.82L
          </div>
          <p className="text-xs text-[#706E68] mt-1 font-sans">
            Calculated as Σ (Failed Amount × Machine Learning Clearance Probability) across active cases.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:border-l md:border-[rgba(242,238,229,0.08)] md:pl-6">
          <div>
            <div className="text-[10px] text-[#706E68] uppercase">Expected Recovery</div>
            <div className="font-serif text-lg text-[#F2EEE5] mt-0.5">₹4.24L</div>
          </div>
          <div>
            <div className="text-[10px] text-[#706E68] uppercase">Recovery Rate</div>
            <div className="font-serif text-lg text-[#66745D] mt-0.5">88%</div>
          </div>
          <div>
            <div className="text-[10px] text-[#706E68] uppercase">Failed Payments</div>
            <div className="font-serif text-lg text-[#F2EEE5] mt-0.5">6 Cases</div>
          </div>
          <div>
            <div className="text-[10px] text-[#706E68] uppercase">Overdue Invoices</div>
            <div className="font-serif text-lg text-[#D1B56A] mt-0.5">₹1.15L</div>
          </div>
        </div>
      </div>

      {/* Opportunity Table */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.06)] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Recoverable Opportunities Queue</h3>
            <p className="text-[11px] text-[#706E68]">
              Automated scoring evaluates issuer clearing windows, card rails, and customer interaction channel.
            </p>
          </div>
          <span className="text-xs text-[#706E68] font-mono">
            {opportunities.length} Recoverable Targets
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs fin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Failure Reason</th>
                <th>Recovery Probability</th>
                <th>Expected Value</th>
                <th>Recommended Action</th>
                <th>Execute</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((item) => {
                const isExecuting = executingId === item.paymentId;
                const executionResult = executedItems[item.paymentId];

                return (
                  <tr key={item.paymentId}>
                    <td>
                      <div className="text-[#F2EEE5] font-medium">{item.customerName}</div>
                      <div className="font-mono text-[10px] text-[#706E68]">{item.paymentId}</div>
                    </td>
                    <td className="font-serif text-[#F2EEE5] text-sm">
                      {formatINR(item.amount)}
                    </td>
                    <td className="text-[#A5A198] text-[11px]">{item.failureReason}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="font-sans font-medium text-[#66745D]">
                          {(item.recoveryProb * 100).toFixed(0)}%
                        </span>
                        <div className="w-12 h-1.5 bg-[#1A1917] rounded overflow-hidden">
                          <div
                            style={{ width: `${item.recoveryProb * 100}%` }}
                            className="h-full bg-[#66745D]"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-serif text-[#B69A5A] text-sm">
                      {formatINR(item.expectedValue)}
                    </td>
                    <td>
                      <span className="text-[10px] font-sans uppercase px-2 py-0.5 rounded bg-[#1A1917] border border-[rgba(242,238,229,0.08)] text-[#A5A198]">
                        {item.recommendedAction === "PAYMENT_LINK" ? "WhatsApp Link" : "Optimal Smart Retry"}
                      </span>
                    </td>
                    <td>
                      {executionResult ? (
                        <span className="text-[#66745D] text-[11px] font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" /> {executionResult}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleExecuteRecovery(item)}
                          disabled={isExecuting}
                          className="px-2.5 py-1 rounded bg-[#1A1917] border border-[rgba(242,238,229,0.12)] text-[#F2EEE5] hover:border-[#B69A5A]/50 text-[11px] font-medium transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {isExecuting ? "Executing..." : "Retry Payment"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.14)] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.08)] pb-3">
              <div>
                <div className="text-[10px] font-sans uppercase tracking-wider text-[#B69A5A] font-semibold">
                  Action Preview
                </div>
                <h3 className="text-base font-serif text-[#F2EEE5]">
                  Automated Recovery Campaign
                </h3>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 rounded text-[#706E68] hover:text-[#F2EEE5] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-0.5">
                <span className="text-[#706E68] text-[10px] uppercase">Estimated Recoverable</span>
                <div className="font-serif text-xl text-[#F2EEE5]">₹1.24L</div>
              </div>
              <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-0.5">
                <span className="text-[#706E68] text-[10px] uppercase">Target Customers</span>
                <div className="font-serif text-xl text-[#F2EEE5]">126</div>
              </div>
              <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-0.5">
                <span className="text-[#706E68] text-[10px] uppercase">Estimated Cost</span>
                <div className="font-serif text-xl text-[#A5A198]">₹3,200</div>
              </div>
              <div className="p-3 rounded bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-0.5">
                <span className="text-[#706E68] text-[10px] uppercase">Expected ROI</span>
                <div className="font-serif text-xl text-[#66745D]">38.7x</div>
              </div>
            </div>

            <div className="text-[11px] text-[#A5A198] bg-[#151514] p-3 rounded border border-[rgba(242,238,229,0.06)] leading-relaxed">
              Dispatches personalized 15-minute validity payment links via verified WhatsApp channel and registers Smart Retries during optimal issuer clearance windows.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[rgba(242,238,229,0.08)]">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-3.5 py-1.5 rounded bg-[#1A1917] border border-[rgba(242,238,229,0.10)] text-[#A5A198] hover:text-[#F2EEE5] text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveCampaign}
                disabled={campaignExecuted}
                className="px-4 py-1.5 rounded bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {campaignExecuted ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Campaign Dispatched</span>
                  </>
                ) : (
                  <>
                    <span>Approve & Execute</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Dispatch Modal */}
      {noticeTarget && (
        <NoticeDispatchModal
          isOpen={isNoticeOpen}
          onClose={() => setIsNoticeOpen(false)}
          recipient={noticeTarget}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
