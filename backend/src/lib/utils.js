"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.formatINR = formatINR;
exports.formatCompactINR = formatCompactINR;
exports.formatPercent = formatPercent;
exports.getRiskBadgeClasses = getRiskBadgeClasses;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function formatINR(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}
function formatCompactINR(amount) {
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
function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
}
function getRiskBadgeClasses(tier) {
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
