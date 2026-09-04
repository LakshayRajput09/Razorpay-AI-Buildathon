"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Clock,
  ShieldCheck,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { PolicyPill } from "@/components/shared/PolicyPill";
import { formatINR } from "@/lib/utils";

export default function ActivityLogPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  async function fetchActivity() {
    try {
      const res = await fetch("/api/agent/activity");
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    selectedAgent === "ALL"
      ? activities
      : activities.filter((a) => a.agent.toUpperCase() === selectedAgent.toUpperCase());

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-[#F2EEE5]/10 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-serif font-bold tracking-tight text-[#F2EEE5]">
              RAZORPAY AI GOVERNANCE
            </h1>
            <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/30">
              Audit Trail & Compliance
            </span>
          </div>
          <p className="text-xs text-[#A5A198] mt-1">
            Complete sequential log of autonomous agent reasonings, zero-trust policy evaluations, and executed transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "GROWTH", "RISK", "RECOVERY", "FINANCE"].map((agent) => (
            <button
              key={agent}
              onClick={() => setSelectedAgent(agent)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                selectedAgent === agent
                  ? "bg-[#1A1917] text-[#B69A5A] border-[#B69A5A]/40"
                  : "bg-[#121211] border-[#F2EEE5]/08 text-[#706E68] hover:text-[#F2EEE5]"
              }`}
            >
              {agent}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F2EEE5]/08 pb-3">
          <span className="text-xs font-mono font-semibold text-[#A5A198] uppercase tracking-wider">
            Showing {filtered.length} Audited Transaction Records
          </span>
          <button
            onClick={fetchActivity}
            className="flex items-center gap-1.5 text-xs text-[#B69A5A] hover:text-[#D1B56A] transition-colors font-medium cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Ledger Feed</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#A5A198]">
            <thead className="border-b border-[#F2EEE5]/10 text-[11px] font-mono uppercase tracking-wider text-[#706E68]">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Action Signature</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Reasoning & Context</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Policy Gate</th>
                <th className="py-2.5 px-3">Financial Impact</th>
                <th className="py-2.5 px-3 text-right">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EEE5]/06">
              {filtered.map((act) => (
                <tr key={act.id} className="hover:bg-[#1A1917]/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-[#706E68] whitespace-nowrap">
                    {new Date(act.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-[#B69A5A]">{act.agent}</td>
                  <td className="py-3 px-3 font-mono text-[#F2EEE5] text-[11px]">{act.action}</td>
                  <td className="py-3 px-3 font-mono text-[#A5A198]">{act.entityId}</td>
                  <td className="py-3 px-3 max-w-sm text-[#F2EEE5]/80 leading-relaxed text-xs" title={act.reason}>
                    {act.reason}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-[#A5A198]">
                    {act.metadata?.confidence ? `${(act.metadata.confidence * 100).toFixed(0)}%` : "94.2%"}
                  </td>
                  <td className="py-3 px-3">
                    <PolicyPill status={act.approval} requiresApproval={act.requiresApproval} />
                  </td>
                  <td className="py-3 px-3 font-serif font-bold text-[#F2EEE5] tabular-nums">
                    {act.financialImpact ? formatINR(act.financialImpact) : "—"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#66745D]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{act.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
