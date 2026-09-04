"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  CreditCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { PRODUCTS } from "@/lib/simulator/merchant-simulator";
import { formatINR } from "@/lib/utils";

export default function AgenticCommercePage() {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [discount, setDiscount] = useState(5);
  const [customerName, setCustomerName] = useState("Aarav Sharma");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [checkoutSimulated, setCheckoutSimulated] = useState(false);
  const [copied, setCopied] = useState(false);

  const finalAmount = Math.round(selectedProduct.price * (1 - discount / 100));

  function handleCreatePaymentLink() {
    const linkId = `rzp_plink_${Math.random().toString(36).substring(2, 9)}`;
    setGeneratedLink(`https://rzp.io/i/${linkId}`);
    setCheckoutSimulated(false);
  }

  function copyLink() {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Agentic Commerce Simulator</h1>
          <span className="rounded-md bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-xs font-semibold text-blue-400">
            Autonomous Selling
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Demonstrates AI product discovery $\rightarrow$ personalized incentive generation $\rightarrow$ instant Razorpay payment link creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Configuration Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Discovery & Deal Structuring</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Target VIP Customer</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Select Recommended Product</label>
            <div className="mt-1.5 space-y-2">
              {PRODUCTS.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedProduct.id === p.id
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.category}</div>
                  </div>
                  <span className="text-xs font-bold">{formatINR(p.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">
                Personalized Incentive ({discount}%)
              </label>
              <span className="text-[11px] text-emerald-400 font-semibold">Policy Compliant ({"<="} 10%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full mt-2"
            />
            {discount > 10 && (
              <p className="text-[11px] text-amber-400 mt-1">
                ⚠️ Warning: Discounts above 10% will trigger manual merchant authorization guardrails.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">Offer Checkout Price:</span>
              <div className="text-lg font-bold text-emerald-400">{formatINR(finalAmount)}</div>
            </div>

            <button
              onClick={handleCreatePaymentLink}
              className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Razorpay Link</span>
            </button>
          </div>
        </div>

        {/* Right Preview & Razorpay Checkout Simulator */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Simulated Customer Checkout Experience</span>
              </div>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Live Preview</span>
            </div>

            {generatedLink ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Generated Payment Link</div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-blue-400 truncate">{generatedLink}</span>
                    <button
                      onClick={copyLink}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Razorpay Checkout Modal Mockup */}
                <div className="rounded-xl border border-blue-900/60 bg-[#0c1f38] p-5 shadow-2xl space-y-4 text-slate-200">
                  <div className="flex items-center justify-between border-b border-blue-800/40 pb-3">
                    <div>
                      <div className="text-xs font-bold text-white">Nova Apparel — VIP Checkout</div>
                      <div className="text-[10px] text-blue-300">Order #ORD-{Math.floor(Math.random() * 90000 + 10000)}</div>
                    </div>
                    <div className="text-sm font-bold text-emerald-400">{formatINR(finalAmount)}</div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span>Item:</span>
                      <span className="font-semibold text-white">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer:</span>
                      <span>{customerName}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>AI VIP Discount ({discount}%):</span>
                      <span>- {formatINR(selectedProduct.price - finalAmount)}</span>
                    </div>
                  </div>

                  {checkoutSimulated ? (
                    <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-emerald-300">Payment Successful!</div>
                      <div className="text-[10px] text-slate-300">Transaction ID: pay_{Math.random().toString(36).substring(2, 10)}</div>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setCheckoutSimulated(true)}
                        className="w-full py-2.5 rounded-lg bg-[#0059e6] hover:bg-[#0047cc] text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pay {formatINR(finalAmount)} via Razorpay UPI / Card</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
                <ShoppingBag className="w-10 h-10 text-slate-700" />
                <p className="text-xs">Configure the recommendation on the left to generate an autonomous payment link.</p>
              </div>
            )}
          </div>

          <div className="mt-4 text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            Simulates end-to-end buyer checkout through Razorpay standard payment links API.
          </div>
        </div>
      </div>
    </div>
  );
}
