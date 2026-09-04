"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  MessageSquare,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  ExternalLink,
  Printer,
  Copy,
  Clock,
  Building,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export interface NoticeRecipient {
  paymentId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  amount: number;
  failureReason?: string;
  daysOverdue?: number;
}

interface NoticeDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: NoticeRecipient | null;
  onSuccess: (result: { type: "FRIENDLY" | "LEGAL"; ref: string; message: string }) => void;
}

export function NoticeDispatchModal({
  isOpen,
  onClose,
  recipient,
  onSuccess,
}: NoticeDispatchModalProps) {
  const [activeTab, setActiveTab] = useState<"FRIENDLY" | "LEGAL">("FRIENDLY");
  const [channel, setChannel] = useState<"whatsapp" | "email" | "both">("both");
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [dispatchedResult, setDispatchedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !recipient) return null;

  const customerName = recipient.customerName || "Customer";
  const customerEmail = recipient.customerEmail || "customer@example.com";
  const customerPhone = recipient.customerPhone || "+91 98765 43210";
  const amount = recipient.amount || 0;
  const daysOverdue = recipient.daysOverdue || 14;

  const defaultFriendlyCopy = `Hi ${customerName}, your recent payment of ${formatINR(amount)} for Order #${recipient.paymentId.slice(-6)} was not completed due to a banking timeout. We have reserved your items for the next 7 days. Tap here to complete it seamlessly via UPI, Cards, or Netbanking: https://rzp.io/i/plink_rcv_${recipient.paymentId.slice(-4)}`;

  const legalRef = `LEG-${new Date().getFullYear()}-RZP-${recipient.paymentId.slice(-5)}`;

  async function handleDispatch() {
    setIsSending(true);
    try {
      const actionType = activeTab === "FRIENDLY" ? "SEND_FRIENDLY_NOTICE" : "SEND_LEGAL_NOTICE";
      const res = await fetch("/api/action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: "RECOVERY",
          actionType,
          entityId: recipient?.paymentId,
          reason: activeTab === "FRIENDLY"
            ? `Dispatched courtesy customer recovery reminder via ${channel.toUpperCase()} for ${formatINR(amount)}.`
            : `Served formal statutory legal demand notice under Sec 138 NI Act / Indian Contract Act for persistent default of ${formatINR(amount)}.`,
          financialImpact: amount,
          riskTier: activeTab === "LEGAL" ? "HIGH" : "LOW",
          merchantDecision: activeTab === "LEGAL" ? "APPROVE" : "AUTO",
          metadata: {
            customerName,
            customerEmail,
            customerPhone,
            messageCopy: defaultFriendlyCopy,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setDispatchedResult(data.data.result);
        onSuccess({
          type: activeTab,
          ref: data.data.result?.noticeRef || legalRef,
          message: activeTab === "FRIENDLY" ? "Friendly Notice Dispatched" : "Statutory Demand Served",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  }

  function handleCopyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl rounded-2xl glass-panel border border-white/[0.18] shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${activeTab === "FRIENDLY" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"} border border-white/10`}>
              {activeTab === "FRIENDLY" ? <MessageSquare className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Revenue Recovery Notice Dispatch</h2>
              <p className="text-xs text-slate-400">
                Target Payment ID: <span className="font-mono text-blue-400 font-semibold">{recipient.paymentId}</span> ({formatINR(amount)})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 border-b border-white/[0.08] bg-black/20 p-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("FRIENDLY");
              setDispatchedResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "FRIENDLY"
                ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>1. Friendly Courtesy Notice</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              Soft Recovery
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("LEGAL");
              setDispatchedResult(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "LEGAL"
                ? "bg-rose-600/20 text-rose-300 border border-rose-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>2. Statutory Legal Notice</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-400 border border-rose-800">
              Formal Demand
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {dispatchedResult ? (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl glass-card border-emerald-500/30 text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">
                  {activeTab === "FRIENDLY" ? "Friendly Notice Dispatched Successfully" : "Statutory Legal Demand Served"}
                </h3>
                <p className="text-xs text-slate-300">
                  Reference: <span className="font-mono text-emerald-400 font-bold">{dispatchedResult.noticeRef}</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-medium text-white">{dispatchedResult.customerName} ({dispatchedResult.recipient})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount:</span>
                  <span className="font-bold text-emerald-400 font-mono">{formatINR(dispatchedResult.amountDue || dispatchedResult.defaultAmount || amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Status:</span>
                  <span className="text-emerald-400 font-semibold">{dispatchedResult.status}</span>
                </div>
                <div className="pt-2 border-t border-white/[0.08]">
                  <span className="text-slate-400 block mb-1">Delivered via Channels:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dispatchedResult.deliveryChannels?.map((ch: string) => (
                      <span key={ch} className="font-mono text-[10px] glass-pill px-2 py-0.5 rounded text-blue-300">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
              >
                Done & Return to Recovery Queue
              </button>
            </motion.div>
          ) : activeTab === "FRIENDLY" ? (
            /* Friendly Notice Form */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-300">Whitelisted Soft Recovery (Customer Friendly)</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Designed for first-time drops and cart dropoffs. Preserves brand goodwill while delivering a 1-click Razorpay payment link with a 7-day item hold guarantee.
                  </p>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Outreach Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "both", label: "WhatsApp + Email", sub: "Recommended (94% open rate)" },
                    { id: "whatsapp", label: "WhatsApp Only", sub: "+91 verified business" },
                    { id: "email", label: "Email Only", sub: "Interactive payment card" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setChannel(ch.id as any)}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        channel === ch.id
                          ? "bg-blue-600/20 border border-blue-500/40 text-blue-300 shadow-sm"
                          : "glass-card text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="font-bold text-xs">{ch.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ch.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview of Message */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-300">Customer Communication Draft</label>
                  <button
                    type="button"
                    onClick={() => handleCopyText(defaultFriendlyCopy)}
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? "Copied!" : "Copy Text"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/[0.08] space-y-3 font-sans">
                  <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold text-slate-200">Verified Razorpay WhatsApp Dispatch</span>
                    <span className="text-[10px] text-slate-500 ml-auto">To: {customerPhone}</span>
                  </div>

                  <p className="text-slate-300 text-[11.5px] leading-relaxed whitespace-pre-wrap">
                    {defaultFriendlyCopy}
                  </p>

                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-blue-300 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Zero Friction 1-Click UPI / QR Checkout</span>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">{formatINR(amount)}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleDispatch}
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <span>Dispatching to Consumer...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Friendly Courtesy Notice Now</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Statutory Legal Notice Form */
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold text-rose-300">Statutory Demand Notice (Guardrailed Action)</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Formal legal pre-litigation demand under <span className="text-white font-semibold">Section 138 Negotiable Instruments Act / Section 73 Indian Contract Act (1872)</span>. Serves formal 15-day cure notice before civil summary suit & credit bureau reporting.
                  </p>
                </div>
              </div>

              {/* Formal Legal Document Preview */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-300">Formal Legal Demand Preview</label>
                  <span className="font-mono text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    Ref: {legalRef}
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.12] space-y-3 font-serif text-slate-200">
                  <div className="border-b border-white/[0.1] pb-3 text-center space-y-1">
                    <div className="text-[11px] uppercase tracking-widest text-slate-400 font-sans font-bold">
                      Legal Demand Notice For Recovery Of Unpaid Dues
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      Under Provisions of Section 138 of NI Act, 1881 & Section 73 of Indian Contract Act, 1872
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-sans">
                    <p><span className="text-slate-400">Date:</span> {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p><span className="text-slate-400">To:</span> <strong className="text-white">{customerName}</strong> ({customerEmail})</p>
                    <p><span className="text-slate-400">Default Transaction:</span> <span className="font-mono text-blue-300">{recipient.paymentId}</span></p>
                    <p><span className="text-slate-400">Total Outstanding Principal:</span> <strong className="text-emerald-400 font-mono">{formatINR(amount)}</strong></p>
                    <p><span className="text-slate-400">Statutory Notice Period:</span> <strong className="text-rose-400">15 Calendar Days</strong></p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/[0.08] text-[10.5px] font-sans leading-relaxed text-slate-300 space-y-1.5">
                    <p>
                      <strong>TAKE NOTICE:</strong> Despite repeated commercial payment requests, the sum of <strong>{formatINR(amount)}</strong> remains unlawfully unpaid and in default.
                    </p>
                    <p>
                      You are hereby called upon to liquidate and remit the aforementioned outstanding debt of <strong>{formatINR(amount)}</strong> within <strong>fifteen (15) days</strong> of receipt of this notice, failing which our clients have instructed their advocates to initiate civil and criminal proceedings under Order XXXVII of the CPC and report the default to CIBIL / Experian.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] font-sans text-slate-400">
                    <div>
                      <div>Adv. Rajesh V. Ramanathan</div>
                      <div className="text-slate-500">Fintech Counsel • Bar Council of Maharashtra</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">Official Seal & Digital Timestamp</div>
                      <div className="text-slate-500">Razorpay Legal Automated Escrow</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Policy Guardrail Checkbox */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="legal-confirm"
                    checked={legalConfirmed}
                    onChange={(e) => setLegalConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-amber-400/50 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="legal-confirm" className="text-xs text-slate-200 cursor-pointer leading-tight">
                    <strong className="text-amber-300">Merchant Legal Authorization Required:</strong> I certify that this account is persistently delinquent ({daysOverdue}+ days), and I explicitly authorize serving this statutory demand notice via Registered Indian Speed Post & certified legal email.
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleDispatch}
                disabled={!legalConfirmed || isSending}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <span>Filing & Serving Notice...</span>
                ) : (
                  <>
                    <Scale className="w-4 h-4" />
                    <span>Authorize & Serve Statutory Legal Notice</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
