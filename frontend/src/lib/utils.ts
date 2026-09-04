import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getRiskBadgeClasses(tier: string): { bg: string; text: string; border: string } {
  switch (tier.toUpperCase()) {
    case "CRITICAL":
      return { bg: "bg-red-950/60", text: "text-red-400", border: "border-red-800" };
    case "HIGH":
      return { bg: "bg-orange-950/60", text: "text-orange-400", border: "border-orange-800" };
    case "MEDIUM":
      return { bg: "bg-amber-950/60", text: "text-amber-400", border: "border-amber-800" };
    case "LOW":
    default:
      return { bg: "bg-emerald-950/60", text: "text-emerald-400", border: "border-emerald-800" };
  }
}
