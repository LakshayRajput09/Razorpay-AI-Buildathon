"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Repeat,
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Landmark,
  Bot,
  Sliders,
  Activity,
  FileText,
  ShieldCheck,
  Lock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: string;
  badgeType?: "gold" | "danger" | "success" | "muted" | "burgundy";
}

interface NavSection {
  category: string;
  items: NavItem[];
}

const NAV_ITEMS: NavSection[] = [
  {
    category: "COMMAND CENTER",
    items: [
      { label: "AI Command Center", href: "/command-center", icon: LayoutDashboard },
    ],
  },
  {
    category: "BUSINESS",
    items: [
      { label: "Customers", href: "/growth", icon: Users },
      { label: "Transactions", href: "/risk", icon: CreditCard },
      { label: "Products", href: "/growth", icon: ShoppingBag },
      { label: "Payments", href: "/recovery", icon: DollarSign },
      { label: "Subscriptions", href: "/growth", icon: Repeat },
    ],
  },
  {
    category: "AI INTELLIGENCE",
    items: [
      { label: "Growth", href: "/growth", icon: TrendingUp },
      { label: "Risk", href: "/risk", icon: ShieldAlert, badge: "1 Review", badgeType: "danger" },
      { label: "Revenue Recovery", href: "/recovery", icon: RefreshCw, badge: "₹4.82L", badgeType: "gold" },
      { label: "Finance", href: "/finance", icon: Landmark },
    ],
  },
  {
    category: "AGENTIC OPERATIONS",
    items: [
      { label: "AI Agents", href: "/agents", icon: Bot },
      { label: "Agent Studio", href: "/agents", icon: Sliders },
      { label: "Agent Activity", href: "/activity", icon: Activity },
    ],
  },
  {
    category: "GOVERNANCE",
    items: [
      { label: "Audit Trail", href: "/activity", icon: FileText },
      { label: "Policy Simulator", href: "/#simulator", icon: ShieldCheck },
      { label: "Zero-Trust Rules", href: "/#guardrails", icon: Lock },
    ],
  },
  {
    category: "SETTINGS",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 border-r border-[rgba(242,238,229,0.08)] bg-[#0B0B0A] flex flex-col justify-between p-3.5 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* Top Brand Block */}
        <div className="px-2.5 pt-1 pb-3 border-b border-[rgba(242,238,229,0.08)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#191918] border border-[#5A1F28] flex items-center justify-center shadow-sm">
              <span className="font-serif text-[#B69A5A] text-xs font-bold">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-tight text-sm font-bold text-[#F2EEE5]">
                  RAZORPAY AI
                </span>
              </div>
              <div className="text-[9px] tracking-wider text-[#706E68] uppercase font-sans font-medium">
                AI-POWERED MERCHANT INTELLIGENCE
              </div>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#191918] border border-[rgba(242,238,229,0.08)] text-[9px] font-mono text-[#A5A198]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B69A5A]" />
            <span>AI BUILDATHON 2026</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-4">
          {NAV_ITEMS.map((section) => (
            <div key={section.category}>
              <div className="px-2.5 mb-1 text-[9px] font-semibold tracking-wider text-[#706E68] uppercase font-sans">
                {section.category}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/command-center" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label + item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-1.5 text-xs font-medium transition-all group rounded-md cursor-pointer",
                        isActive
                          ? "bg-[#191918] text-[#F2EEE5] shadow-sm border-l-2 border-[#5A1F28] rounded-l-none"
                          : "text-[#A5A198] hover:bg-[#141413] hover:text-[#F2EEE5]"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={cn(
                            "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                            isActive ? "text-[#B69A5A]" : "text-[#706E68] group-hover:text-[#A5A198]"
                          )}
                        />
                        <span className="truncate text-[12px]">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] px-1.5 py-0.2 rounded font-mono font-medium",
                            item.badgeType === "danger" && "bg-[#713B3B]/20 text-[#D18686] border border-[#713B3B]/40",
                            item.badgeType === "gold" && "bg-[#B69A5A]/15 text-[#D1B56A] border border-[#B69A5A]/30",
                            item.badgeType === "burgundy" && "bg-[#5A1F28]/20 text-[#D18686] border border-[#5A1F28]/40",
                            (!item.badgeType || item.badgeType === "muted") && "bg-[#191918] text-[#A5A198]"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Institutional Guarantee Footer */}
      <div className="rounded-md border border-[rgba(242,238,229,0.08)] bg-[#141413] p-3 text-xs space-y-1.5 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#F2EEE5] font-medium text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#66745D]" />
            <span>Autonomous Safe Mode</span>
          </div>
          <ShieldCheck className="h-3.5 w-3.5 text-[#B69A5A]" />
        </div>
        <p className="text-[10px] leading-tight text-[#706E68] font-sans">
          Zero-Trust active. High-impact operations mandate merchant signature.
        </p>
      </div>
    </aside>
  );
}
