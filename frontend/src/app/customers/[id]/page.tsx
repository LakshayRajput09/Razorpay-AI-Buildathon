"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  User,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  Sparkles,
  Zap,
  RefreshCw,
} from "lucide-react";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function Customer360Page() {
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "transactions" | "subscriptions">("transactions");

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  async function fetchCustomer() {
    try {
      const res = await fetch(`/api/customers/${customerId}`);
      const data = await res.json();
      if (data.success) {
        setCustomer(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-3">
        <p>Customer not found.</p>
        <Link href="/growth" className="text-xs text-blue-400 underline">
          Return to Growth Intelligence
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Back Button */}
      <div>
        <Link
          href="/growth"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Intelligence</span>
        </Link>

        {/* Customer Header Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-white">{customer.name}</h1>
                <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-blue-300">
                  {customer.externalId}
                </span>
                <RiskBadge tier={customer.riskTier} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {customer.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> {customer.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {customer.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-center">
            <div>
              <span className="text-[11px] text-slate-400">Total Lifetime Spend</span>
              <div className="text-xl font-bold text-white mt-0.5">{formatINR(customer.totalSpend)}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Orders Placed</span>
              <div className="text-xl font-bold text-blue-400 mt-0.5">{customer.orderCount}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">RFM Segment</span>
              <div className="text-sm font-bold text-emerald-400 mt-1">{customer.segment}</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner for Customer */}
      <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">AI RECOMMENDED NEXT ACTION</span>
            <p className="text-xs text-slate-200 mt-0.5">
              High purchase probability (85%). Trigger VIP personalized offer code <span className="font-mono font-bold text-emerald-400">VIP_PRIVILEGE_5</span> (5% off) for seasonal catalog refresh.
            </p>
          </div>
        </div>

        <Link
          href="/growth/commerce"
          className="flex-shrink-0 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-semibold text-white shadow"
        >
          Send Autonomous Offer
        </Link>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`pb-2 font-semibold transition-all ${
              activeTab === "transactions"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Transactions ({customer.transactions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-2 font-semibold transition-all ${
              activeTab === "orders"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Orders ({customer.orders?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`pb-2 font-semibold transition-all ${
              activeTab === "subscriptions"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Subscriptions & Invoices
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "transactions" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="py-2 px-3">Transaction ID</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Method</th>
                  <th className="py-2 px-3">Risk Tier</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customer.transactions?.map((t: any) => (
                  <tr key={t.id} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-mono text-blue-400">{t.transactionId}</td>
                    <td className="py-2 px-3 font-bold text-white">{formatINR(t.amount)}</td>
                    <td className="py-2 px-3 font-mono">{t.method}</td>
                    <td className="py-2 px-3">
                      <RiskBadge tier={t.riskTier} score={t.riskScore} />
                    </td>
                    <td className="py-2 px-3 font-semibold text-emerald-400">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                <tr>
                  <th className="py-2 px-3">Order ID</th>
                  <th className="py-2 px-3">Product Name</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customer.orders?.map((o: any) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="py-2 px-3 font-mono text-blue-400">{o.orderId}</td>
                    <td className="py-2 px-3">{o.productName}</td>
                    <td className="py-2 px-3 font-bold text-white">{formatINR(o.amount)}</td>
                    <td className="py-2 px-3 font-semibold text-slate-200">{o.fulfillmentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "subscriptions" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <h4 className="text-xs font-bold text-white">Active Recurring Plans</h4>
            {customer.subscriptions?.length > 0 ? (
              customer.subscriptions.map((s: any) => (
                <div key={s.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{s.planName} Tier</div>
                    <div className="text-slate-400 text-[10px]">Billing Cycle: {s.billingCycle}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400">{formatINR(s.amount)}/mo</div>
                    <div className="text-slate-400 text-[10px]">Status: {s.status}</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No active subscriptions for this customer.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
