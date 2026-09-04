"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Command,
  X,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Landmark,
  Bot,
  FileText,
  Sliders,
  User,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export function TopNav() {
  const router = useRouter();
  const [selectedMerchant, setSelectedMerchant] = useState("Nova Apparel (D2C Lifestyle)");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const merchants = [
    { name: "Nova Apparel (D2C Lifestyle)", type: "D2C Brand • Bengaluru, KA", currency: "INR" },
    { name: "CloudFlow India (B2B SaaS)", type: "SaaS Recurring • Mumbai, MH", currency: "INR" },
    { name: "VoltMart Electronics", type: "High-Ticket Retail • Delhi, DL", currency: "INR" },
  ];

  const quickNav = [
    { label: "AI Command Center", href: "/command-center", icon: Bot, category: "Autonomy" },
    { label: "Revenue Recovery", href: "/recovery", icon: RefreshCw, category: "Intelligence" },
    { label: "AI Risk & Fraud", href: "/risk", icon: ShieldAlert, category: "Intelligence" },
    { label: "Commerce Growth", href: "/growth", icon: TrendingUp, category: "Intelligence" },
    { label: "Finance & Runway", href: "/finance", icon: Landmark, category: "Intelligence" },
    { label: "Agent Studio", href: "/agents", icon: Sliders, category: "Autonomy" },
    { label: "Audit Trail", href: "/activity", icon: FileText, category: "Governance" },
  ];

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredNav = quickNav.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[rgba(242,238,229,0.08)] bg-[#0B0B0A] px-4 md:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/command-center"
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="Razorpay AI Home"
          >
            <div className="w-7 h-7 rounded bg-[#191918] border border-[#5A1F28] flex items-center justify-center shadow-sm">
              <span className="font-serif text-[#B69A5A] text-xs font-bold">R</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif tracking-tight text-base font-bold text-[#F2EEE5]">
                RAZORPAY AI
              </span>
              <span className="hidden lg:inline text-[10px] text-[#706E68] font-mono font-medium">
                MERCHANT OS
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Merchant Selector & System Status */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded border border-[rgba(242,238,229,0.08)] bg-[#141413] px-3 py-1.5 text-xs text-[#F2EEE5] hover:border-[rgba(242,238,229,0.18)] transition-all cursor-pointer"
            >
              <span className="text-[#706E68] text-[11px]">Merchant:</span>
              <div className="text-left">
                <span className="font-medium text-[#F2EEE5] text-xs">Nova Apparel</span>
                <span className="text-[10px] text-[#706E68] ml-1.5 font-sans">(D2C Lifestyle)</span>
              </div>
              <ChevronDown className="h-3 w-3 text-[#706E68]" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-md bg-[#141413] border border-[rgba(242,238,229,0.12)] p-1.5 shadow-2xl z-50">
                <div className="px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#706E68] font-semibold">
                  Switch Merchant Entity
                </div>
                {merchants.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => {
                      setSelectedMerchant(m.name);
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs text-[#A5A198] hover:bg-[#191918] hover:text-[#F2EEE5] transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-[#F2EEE5]">{m.name}</div>
                      <div className="text-[10px] text-[#706E68]">{m.type}</div>
                    </div>
                    {selectedMerchant === m.name && <CheckCircle2 className="h-3.5 w-3.5 text-[#B69A5A]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Institutional Operational Status */}
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[#141413] border border-[rgba(242,238,229,0.06)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#66745D]" />
            <span className="text-[11px] font-sans text-[#A5A198]">AI Systems Operational</span>
          </div>
        </div>

        {/* Right: Landing Page Exit, Quick Search, Merchant Tier, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Direct Navigation to Landing Page */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[rgba(242,238,229,0.12)] bg-[#141413] hover:bg-[#191918] hover:border-[#B69A5A]/50 text-xs text-[#A5A198] hover:text-[#F2EEE5] transition-all cursor-pointer group"
            title="Return to Public Landing Page"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#B69A5A] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-[11px] font-sans font-medium">Landing Page</span>
          </Link>

          {/* Quick Jump Command Palette */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded border border-[rgba(242,238,229,0.08)] bg-[#141413] px-2.5 py-1.5 text-xs text-[#A5A198] hover:text-[#F2EEE5] hover:border-[rgba(242,238,229,0.16)] transition-all cursor-pointer"
            title="Quick Jump (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5 text-[#706E68]" />
            <span className="hidden md:inline text-[11px]">Quick Jump</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 rounded bg-[#191918] px-1 py-0.2 text-[9px] text-[#706E68] border border-[rgba(242,238,229,0.06)] font-mono">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>

          {/* Merchant Tier Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141413] border border-[#B69A5A]/25 text-[11px] font-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B69A5A]" />
            <span className="text-[#B69A5A] font-medium">Emerald Wealth</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-1.5 rounded border border-[rgba(242,238,229,0.08)] bg-[#141413] text-[#A5A198] hover:text-[#F2EEE5] hover:border-[rgba(242,238,229,0.16)] transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#B69A5A]" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-1.5 w-72 rounded-md bg-[#141413] border border-[rgba(242,238,229,0.12)] p-2.5 shadow-2xl z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.06)] pb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A5A198]">
                    Executive Notifications
                  </span>
                  <span className="text-[9px] text-[#B69A5A] font-medium">1 Action Required</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded bg-[#191918] border border-[rgba(242,238,229,0.06)] space-y-0.5">
                    <div className="text-[#F2EEE5] font-medium text-[11px]">High-Value Transaction Review</div>
                    <div className="text-[10px] text-[#706E68]">₹84,999 requires manual sign-off before dispatch.</div>
                  </div>
                  <div className="p-2 rounded bg-[#191918] border border-[rgba(242,238,229,0.06)] space-y-0.5">
                    <div className="text-[#F2EEE5] font-medium text-[11px]">Smart Retry Succeeded</div>
                    <div className="text-[10px] text-[#66745D]">₹8,499 recovered from HDFC issuer timeout.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Merchant Profile Monogram */}
          <div className="flex items-center gap-2 pl-1 border-l border-[rgba(242,238,229,0.08)]">
            <div className="h-7 w-7 rounded bg-[#191918] border border-[rgba(242,238,229,0.12)] flex items-center justify-center text-xs font-serif text-[#F2EEE5]">
              NA
            </div>
          </div>
        </div>
      </header>

      {/* Global Quick Search Command Palette Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-md bg-[#151514] border border-[rgba(242,238,229,0.14)] p-3.5 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.08)] pb-2.5">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-3.5 w-3.5 text-[#B69A5A]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to module (Recovery, Risk, Runway, Audit)..."
                  className="w-full bg-transparent text-xs text-[#F2EEE5] placeholder-[#706E68] focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-[#706E68] hover:text-[#F2EEE5] cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {filteredNav.length > 0 ? (
                filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(item.href);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded text-left hover:bg-[#1A1917] transition-colors text-xs text-[#A5A198] group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 text-[#706E68] group-hover:text-[#B69A5A]" />
                        <span className="font-medium text-[#F2EEE5]">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-[#706E68]">{item.category}</span>
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-[#706E68]">
                  No matching modules found for "{searchQuery}"
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[rgba(242,238,229,0.06)] flex items-center justify-between text-[10px] text-[#706E68]">
              <span>Use arrows or click to select</span>
              <span>ESC to dismiss</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
