"use client";

import React, { useState, useEffect } from "react";
import {
  Landmark,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  LineChart,
  ShieldCheck,
  CreditCard,
  Building,
  Server,
  Truck,
  Users,
  ArrowUpRight,
  Send,
  Clock,
} from "lucide-react";
import { MetricCard } from "@/components/shared/MetricCard";
import { formatINR } from "@/lib/utils";
import Link from "next/link";

export default function FinancePage() {
  const [cashflowData, setCashflowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCashflow();
  }, []);

  async function fetchCashflow() {
    try {
      const res = await fetch("/api/finance/cashflow?days=30");
      const data = await res.json();
      if (data.success) {
        setCashflowData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const expenses = [
    { category: "PAYROLL", name: "Engineering & Operations Payroll", amount: 820000, icon: Users, color: "text-[#B69A5A]" },
    { category: "MARKETING", name: "Performance Acquisition (Meta / Google)", amount: 260000, icon: TrendingUp, color: "text-[#A5A198]" },
    { category: "LOGISTICS", name: "Freight & Surface Delivery (Delhivery)", amount: 185000, icon: Truck, color: "text-[#A5A198]" },
    { category: "CLOUD & INFRA", name: "Compute, DB & Edge (AWS / Cloudflare)", amount: 145000, icon: Server, color: "text-[#A5A198]" },
    { category: "GATEWAY MDR", name: "Razorpay Standard Processing Fees (1.9%)", amount: 48000, icon: CreditCard, color: "text-[#66745D]" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F2EEE5]/10 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#F2EEE5]">
              AI Finance Controller
            </h1>
            <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/30">
              Liquidity & Runway
            </span>
          </div>
          <p className="text-xs text-[#A5A198] mt-1">
            Institutional liquidity intelligence, burn rate tracking, and automated working capital governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/finance/forecast"
            className="flex items-center gap-2 rounded-lg bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] px-4 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Open 30-Day Scenario Forecast</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Cash Balance"
          value="₹42.50 L"
          subValue="Liquid commercial accounts"
          trend={{ value: "58 Days Safe Runway", isPositive: true }}
          icon={Landmark}
          iconColor="text-[#B69A5A]"
          sparkline={[48, 47, 46.2, 45, 43.8, 42.5]}
        />

        <MetricCard
          title="Safety Buffer Threshold"
          value="₹15.00 L"
          subValue="Minimum liquidity buffer"
          trend={{ value: "+₹27.5L Buffer Surplus", isPositive: true }}
          icon={ShieldCheck}
          iconColor="text-[#66745D]"
          sparkline={[15, 15, 15, 15, 15, 15]}
        />

        <MetricCard
          title="Trailing 7D Inflow"
          value="₹18.42 L"
          subValue="vs ₹22.50L benchmark"
          trend={{ value: "-18% Dip (Gateway Timeout)", isPositive: false }}
          icon={TrendingDown}
          iconColor="text-[#713B3B]"
          sparkline={[22.5, 22.1, 21.4, 20.8, 19.5, 18.9, 18.42]}
        />

        <MetricCard
          title="Overdue Receivables"
          value="₹2.10 L"
          subValue="2 outstanding corporate invoices"
          trend={{ value: "Collections Required", isPositive: false }}
          icon={AlertTriangle}
          iconColor="text-[#9A7940]"
          sparkline={[1.6, 1.8, 1.9, 2.0, 2.1]}
        />
      </div>

      {/* Expense Commitments Breakdown */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#F2EEE5]/08 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Committed Outflows & Cost Structure</h3>
            <p className="text-xs text-[#706E68]">Recurring monthly enterprise obligations: ₹14.58 Lakhs</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#A5A198]">
            <Clock className="w-3.5 h-3.5 text-[#B69A5A]" />
            <span>Next Major Settlement: 1st of Month (Payroll)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {expenses.map((exp) => {
            const Icon = exp.icon;
            return (
              <div
                key={exp.category}
                className="p-3.5 rounded-lg bg-[#121211] border border-[#F2EEE5]/06 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-[#706E68]">
                    {exp.category}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${exp.color}`} />
                </div>
                <div className="text-base font-serif font-bold text-[#F2EEE5]">
                  {formatINR(exp.amount)}
                </div>
                <p className="text-[11px] text-[#A5A198] truncate">{exp.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Receivables & Overdue Invoices Queue */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#F2EEE5]">Receivables & Aging Invoices Pipeline</h3>
            <p className="text-xs text-[#706E68]">Active collections monitored autonomously by Finance Agent</p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#9A7940] px-2.5 py-1 rounded bg-[#9A7940]/10 border border-[#9A7940]/25">
            ₹2,10,000 Total Overdue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A5A198]">
            <thead className="border-b border-[#F2EEE5]/10 text-[11px] font-mono uppercase tracking-wider text-[#706E68]">
              <tr>
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Corporate Account</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Issue Date</th>
                <th className="py-2.5 px-3">Aging Status</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3 text-right">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE5]/06">
              <tr className="hover:bg-[#1A1917]/50 transition-colors">
                <td className="py-3 px-3 font-mono text-[#F2EEE5] font-semibold">INV-2026-3301</td>
                <td className="py-3 px-3 text-[#F2EEE5]">
                  <div className="font-medium">DesignHaus Retail LLP</div>
                  <div className="text-[11px] text-[#706E68]">Ananya Deshmukh</div>
                </td>
                <td className="py-3 px-3 font-serif font-bold text-[#F2EEE5]">₹85,000</td>
                <td className="py-3 px-3 text-[#A5A198]">12 Days Ago</td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[#713B3B] font-semibold">12 Days Overdue</span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#713B3B]/15 text-[#F2EEE5] border border-[#713B3B]/30">
                    OVERDUE
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#B69A5A]/15 hover:bg-[#B69A5A]/25 border border-[#B69A5A]/30 text-[#B69A5A] text-xs font-medium transition-colors cursor-pointer">
                    <Send className="w-3 h-3" />
                    <span>Send Razorpay Link</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#1A1917]/50 transition-colors">
                <td className="py-3 px-3 font-mono text-[#F2EEE5] font-semibold">INV-2026-3302</td>
                <td className="py-3 px-3 text-[#F2EEE5]">
                  <div className="font-medium">InfoTech Enterprise Solutions</div>
                  <div className="text-[11px] text-[#706E68]">Sneha Reddy</div>
                </td>
                <td className="py-3 px-3 font-serif font-bold text-[#F2EEE5]">₹1,25,000</td>
                <td className="py-3 px-3 text-[#A5A198]">In 10 Days</td>
                <td className="py-3 px-3">
                  <span className="font-mono text-[#66745D] font-semibold">Current</span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#66745D]/15 text-[#F2EEE5] border border-[#66745D]/30">
                    SCHEDULED
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <span className="text-[11px] text-[#706E68] font-mono">
                    Auto-Reminder D-3
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
