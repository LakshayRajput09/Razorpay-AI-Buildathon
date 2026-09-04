"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Key,
  Cpu,
  CheckCircle2,
  Lock,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const [razorpayKey, setRazorpayKey] = useState("rzp_test_AiNativeDemoKey101");
  const [razorpaySecret, setRazorpaySecret] = useState("••••••••••••••••••••");
  const [llmProvider, setLlmProvider] = useState("anthropic");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-[#F2EEE5]/10 pb-5">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-serif font-bold tracking-tight text-[#F2EEE5]">
            System Settings & Integrations
          </h1>
          <span className="rounded px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/30">
            Enterprise Config
          </span>
        </div>
        <p className="text-xs text-[#A5A198] mt-1">
          Configure Razorpay API gateway credentials, runtime AI model abstractions, and zero-trust policy rules.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-[#151514] border border-[#66745D]/50 text-[#F2EEE5] text-xs flex items-center gap-2.5 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-[#66745D]" />
          <span>System configuration parameters saved and reloaded successfully.</span>
        </div>
      )}

      {/* Razorpay Integration Settings */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#F2EEE5] border-b border-[#F2EEE5]/08 pb-3">
          <Key className="w-4 h-4 text-[#B69A5A]" />
          <span>Razorpay Payment Rails Integration (Sandbox / Production)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A5A198]">Razorpay Key ID</label>
            <input
              type="text"
              value={razorpayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
              className="w-full rounded-lg border border-[#F2EEE5]/10 bg-[#121211] px-3.5 py-2 text-xs font-mono text-[#F2EEE5] focus:border-[#B69A5A] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#A5A198]">Razorpay Key Secret</label>
            <input
              type="password"
              value={razorpaySecret}
              onChange={(e) => setRazorpaySecret(e.target.value)}
              className="w-full rounded-lg border border-[#F2EEE5]/10 bg-[#121211] px-3.5 py-2 text-xs font-mono text-[#F2EEE5] focus:border-[#B69A5A] focus:outline-none"
            />
          </div>
        </div>

        <div className="text-[11px] text-[#706E68] font-mono">
          Bound to automated payment link generation, instant refund dispatch, and bank clearance verification.
        </div>
      </div>

      {/* AI Agent LLM Provider Abstraction */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#151514] p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#F2EEE5] border-b border-[#F2EEE5]/08 pb-3">
          <Cpu className="w-4 h-4 text-[#B69A5A]" />
          <span>AI Intelligence Engine Abstraction (Provider-Agnostic)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { id: "anthropic", label: "Anthropic Claude 3.5 Sonnet", note: "Recommended for tool-calling" },
            { id: "gemini", label: "Google Gemini 1.5 Pro", note: "Extended context & financial analysis" },
            { id: "openai", label: "OpenAI GPT-4o", note: "Standard function calling interface" },
            { id: "mock", label: "Deterministic Autonomous Mode", note: "Zero-dependency offline demo" },
          ].map((prov) => (
            <div
              key={prov.id}
              onClick={() => setLlmProvider(prov.id)}
              className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-1 ${
                llmProvider === prov.id
                  ? "border-[#B69A5A] bg-[#1A1917] text-[#F2EEE5]"
                  : "border-[#F2EEE5]/06 bg-[#121211] text-[#706E68] hover:text-[#A5A198] hover:border-[#F2EEE5]/15"
              }`}
            >
              <div className="text-xs font-semibold">{prov.label}</div>
              <div className="text-[10px] text-[#706E68]">{prov.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Honesty & Verification Declaration */}
      <div className="rounded-lg border border-[#F2EEE5]/10 bg-[#121211] p-5 space-y-3 text-xs text-[#A5A198]">
        <div className="flex items-center gap-2 font-semibold text-[#F2EEE5]">
          <FileText className="w-4 h-4 text-[#B69A5A]" />
          <span>Technical Transparency & Data Integrity Statement</span>
        </div>
        <p className="leading-relaxed">
          • <strong className="text-[#F2EEE5]">Benchmark Data Foundation:</strong> Derived from UCI Online Retail II (CC BY 4.0 license) & IEEE-CIS Fraud Detection datasets, calibrated for Indian commerce patterns.
        </p>
        <p className="leading-relaxed">
          • <strong className="text-[#F2EEE5]">Synthetic Financial Simulator:</strong> Gateway timeouts, 3DS authentication drops, and Indian payment rail anomalies (UPI, IMPS, Netbanking) run through deterministic simulation ensuring strict data isolation.
        </p>
        <p className="leading-relaxed">
          • <strong className="text-[#F2EEE5]">Zero-Trust Guarantee:</strong> High-impact operations (account termination, capex reallocations &gt; ₹50,000) are strictly enforced by human-in-the-loop authorization gates.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-lg bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] px-6 py-2.5 text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          Save All Settings
        </button>
      </div>
    </div>
  );
}
