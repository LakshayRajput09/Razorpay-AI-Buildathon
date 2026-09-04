"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Clock,
  ChevronRight,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function GrowthPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [activeSegment, setActiveSegment] = useState("ALL");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      if (data.success) {
        const map = new Map();
        data.data.forEach((t: any) => {
          if (t.customer && !map.has(t.customer.id)) {
            map.set(t.customer.id, t.customer);
          }
        });
        setCustomers(Array.from(map.values()));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function launchCampaign() {
    setLaunching(true);
    try {
      const res = await fetch("/api/action/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: "GROWTH",
          actionType: "DISCOUNT_OFFER",
          entityId: "CAMP-AT-RISK-2026",
          reason: "Targeted 8% personalized incentive to at-risk customer segment with 34% predicted repurchase uplift.",
          financialImpact: 418000,
          discountPercentage: 8,
          riskTier: "LOW",
          metadata: { code: "RECONNECT_8", channel: "WHATSAPP_EMAIL" },
          merchantDecision: "AUTO",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaignLaunched(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLaunching(false);
    }
  }

  const segments = ["ALL", "VIP", "High Value", "Growing", "At Risk", "Dormant", "New"];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(242,238,229,0.08)] pb-5">
        <div>
          <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#B69A5A] font-semibold mb-1">
            Customer Intelligence & Lifetime Value
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#F2EEE5]">
            Customer Intelligence
          </h1>
          <p className="text-xs text-[#A5A198] mt-1 font-sans">
            RFM behavioral segmentation, purchase probability forecasting, and margin-safe incentives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/growth/commerce"
            className="flex items-center gap-1.5 rounded bg-[#151514] hover:bg-[#1A1917] border border-[rgba(242,238,229,0.10)] px-3 py-1.5 text-xs text-[#F2EEE5] transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#B69A5A]" />
            <span>Agentic Checkout</span>
          </Link>
        </div>
      </div>

      {/* Campaign Feedback Banner */}
      {campaignLaunched && (
        <div className="p-3.5 rounded bg-[#121412] border border-[#66745D]/40 text-[#8FA383] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#66745D]" />
            <span>Campaign "At-Risk Re-engagement" Dispatched • 8% Margin-Safe Incentive Active</span>
          </div>
          <span className="text-[10px] text-[#66745D] font-mono">CODE: RECONNECT_8</span>
        </div>
      )}

      {/* 4 Core Growth Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          title="Active Customers"
          value="1,842"
          subValue="Purchased within 60 days"
          trend={{ value: "98.4% active", isPositive: true }}
          icon={Users}
          sparkline={[1650, 1720, 1780, 1810, 1842]}
        />

        <MetricCard
          title="High Intent"
          value="312"
          subValue=">70% purchase probability"
          trend={{ value: "+18 this week", isPositive: true }}
          icon={TrendingUp}
          sparkline={[260, 275, 290, 305, 312]}
        />

        <MetricCard
          title="At Risk"
          value="128"
          subValue="Dormant for 45+ days"
          trend={{ value: "Re-engagement ready", isPositive: false }}
          icon={Target}
          sparkline={[160, 150, 142, 135, 128]}
        />

        <MetricCard
          title="Predicted Revenue"
          value="₹6.20L"
          subValue="Next 14-day pipeline"
          trend={{ value: "+34% predicted", isPositive: true }}
          icon={Sparkles}
          sparkline={[4.1, 4.6, 5.0, 5.5, 6.2]}
        />
      </div>

      {/* AI Recommendation Card */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#B69A5A]">
            AI Growth Recommendation
          </div>
          <h3 className="font-serif text-lg text-[#F2EEE5] mt-0.5">
            1,240 customers have &gt;70% probability of purchasing within 14 days.
          </h3>
          <p className="text-xs text-[#706E68] mt-0.5">
            Deploy an automated 8% margin-safe re-engagement code via verified WhatsApp and SMS.
          </p>
        </div>

        <button
          onClick={launchCampaign}
          disabled={launching || campaignLaunched}
          className="self-start md:self-center px-4 py-2 rounded bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          <span>{launching ? "Deploying..." : campaignLaunched ? "Campaign Active" : "Create Campaign →"}</span>
        </button>
      </div>

      {/* Segments & Customer Intelligence Table */}
      <div className="rounded-lg bg-[#121211] border border-[rgba(242,238,229,0.10)] p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(242,238,229,0.06)] pb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Customer Cohort Intelligence</h3>
            <p className="text-[11px] text-[#706E68]">
              Segmented via Recency, Frequency, and Monetary (RFM) clustering models.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {segments.map((seg) => (
              <button
                key={seg}
                onClick={() => setActiveSegment(seg)}
                className={`px-2.5 py-1 rounded text-[11px] font-sans transition-all cursor-pointer ${
                  activeSegment === seg
                    ? "bg-[#1A1917] text-[#F2EEE5] border border-[#B69A5A]/50 font-medium"
                    : "text-[#706E68] hover:text-[#F2EEE5]"
                }`}
              >
                {seg}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs fin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>RFM Segment</th>
                <th>Purchase Probability</th>
                <th>Customer Value</th>
                <th>Churn Risk</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 8).map((c, idx) => {
                const prob = [88, 74, 62, 91, 58, 83, 70, 79][idx % 8];
                const churn = [12, 28, 41, 9, 52, 19, 32, 24][idx % 8];
                const segmentName = ["VIP", "High Value", "Growing", "VIP", "At Risk", "High Value", "Growing", "New"][idx % 8];
                const recAction = ["Send VIP Preview", "Offer 5% Margin Safe", "Trigger WhatsApp Nudge", "Send VIP Preview", "Deploy Re-engagement Code", "Offer 5% Margin Safe", "Trigger Cart Recovery", "Send Welcome Guide"][idx % 8];

                return (
                  <tr key={c.id || idx}>
                    <td>
                      <Link
                        href={`/customers/${c.id || "CUST-IN-8801"}`}
                        className="font-medium text-[#F2EEE5] hover:text-[#B69A5A] transition-colors"
                      >
                        {c.name || `Customer ${idx + 1}`}
                      </Link>
                      <div className="font-mono text-[10px] text-[#706E68]">{c.id || `CUST-IND-${8800 + idx}`}</div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase bg-[#1A1917] border border-[rgba(242,238,229,0.08)] text-[#A5A198]">
                        {segmentName}
                      </span>
                    </td>
                    <td>
                      <span className="font-sans font-medium text-[#66745D]">{prob}%</span>
                    </td>
                    <td className="font-serif text-[#F2EEE5]">
                      ₹{(35000 + idx * 8200).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span className={churn > 35 ? "text-[#D18686] font-medium" : "text-[#706E68]"}>
                        {churn}%
                      </span>
                    </td>
                    <td>
                      <span className="text-[11px] text-[#A5A198]">{recAction}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
