"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMerchant } from "@/context/MerchantContext";
import {
  X,
  Building2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Landmark,
  Layers,
} from "lucide-react";

export function AddMerchantModal() {
  const { isAddMerchantOpen, setIsAddMerchantOpen, addMerchant } = useMerchant();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("D2C Lifestyle & Apparel");
  const [city, setCity] = useState("Bengaluru, KA");
  const [mid, setMid] = useState("");
  const [monthlyGmv, setMonthlyGmv] = useState("₹25,00,000");
  const [currency, setCurrency] = useState("INR");
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!mid || mid.startsWith("acc_")) {
      const cleanSlug = val.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      setMid(`acc_${cleanSlug || "Merchant"}${randNum}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedType = `${category.split("&")[0].trim()} • ${city}`;

    const newMerchant = addMerchant({
      name: name.trim(),
      type: formattedType,
      category,
      city,
      mid: mid.trim() || `acc_${Date.now().toString(36)}`,
      currency,
      monthlyGmv,
    });

    setCreatedName(newMerchant.name);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setName("");
      setMid("");
      setIsAddMerchantOpen(false);
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isAddMerchantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl rounded-2xl bg-[#121211] border border-[rgba(242,238,229,0.14)] p-6 sm:p-7 shadow-2xl space-y-6 text-[#F2EEE5] relative"
          >
          {/* Close button */}
          <button
            onClick={() => setIsAddMerchantOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-[#A5A198] hover:text-[#F2EEE5] hover:bg-[#191918] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1.5 border-b border-[rgba(242,238,229,0.08)] pb-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-[#191918] border border-[#B69A5A]/30 text-[10px] font-sans uppercase tracking-[0.16em] text-[#B69A5A] font-semibold">
              <Building2 className="w-3 h-3 text-[#B69A5A]" />
              Merchant Onboarding
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#F2EEE5] tracking-tight">
              Add Merchant Entity
            </h2>
            <p className="text-xs text-[#A5A198]">
              Register a new business account into the Razorpay AI Autonomous Merchant Operating System.
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[#66745D]/20 border border-[#66745D] flex items-center justify-center mx-auto text-[#66745D]">
                <CheckCircle2 className="w-6 h-6 text-[#8FA383]" />
              </div>
              <h3 className="text-lg font-serif text-[#F2EEE5]">
                {createdName} Onboarded Successfully
              </h3>
              <p className="text-xs text-[#A5A198] max-w-sm mx-auto">
                Merchant account provisioned with AI Growth, Risk Shield, Revenue Recovery, and Finance Controller.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Merchant Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A5A198] flex items-center justify-between">
                  <span>Merchant Legal / Brand Name</span>
                  <span className="text-[10px] text-[#706E68]">Required</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Jaipur Crafts Co., CloudFlow India"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-lg border border-[rgba(242,238,229,0.12)] bg-[#191918] px-3.5 py-2.5 text-xs text-[#F2EEE5] placeholder-[#706E68] focus:border-[#B69A5A] focus:outline-none transition-colors"
                />
              </div>

              {/* Grid: Category & Headquarters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A5A198]">Business Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[rgba(242,238,229,0.12)] bg-[#191918] px-3.5 py-2.5 text-xs text-[#F2EEE5] focus:border-[#B69A5A] focus:outline-none cursor-pointer"
                  >
                    <option value="D2C Lifestyle & Apparel">D2C Lifestyle & Apparel</option>
                    <option value="B2B SaaS & Cloud">B2B SaaS & Cloud</option>
                    <option value="Consumer Electronics Retail">Consumer Electronics Retail</option>
                    <option value="Handmade Artisanal & Pottery">Handmade Artisanal & Pottery</option>
                    <option value="Food & Quick Commerce">Food & Quick Commerce</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                    <option value="B2B Industrial & Wholesale">B2B Industrial & Wholesale</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A5A198]">Headquarters (City, State)</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jaipur, RJ or Mumbai, MH"
                    className="w-full rounded-lg border border-[rgba(242,238,229,0.12)] bg-[#191918] px-3.5 py-2.5 text-xs text-[#F2EEE5] placeholder-[#706E68] focus:border-[#B69A5A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Grid: Razorpay MID & Monthly GMV */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A5A198]">
                    Razorpay Merchant ID (MID)
                  </label>
                  <input
                    type="text"
                    value={mid}
                    onChange={(e) => setMid(e.target.value)}
                    placeholder="acc_Nova98124"
                    className="w-full rounded-lg border border-[rgba(242,238,229,0.12)] bg-[#191918] px-3.5 py-2.5 text-xs font-mono text-[#F2EEE5] placeholder-[#706E68] focus:border-[#B69A5A] focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#A5A198]">Estimated Monthly GMV</label>
                  <select
                    value={monthlyGmv}
                    onChange={(e) => setMonthlyGmv(e.target.value)}
                    className="w-full rounded-lg border border-[rgba(242,238,229,0.12)] bg-[#191918] px-3.5 py-2.5 text-xs text-[#F2EEE5] focus:border-[#B69A5A] focus:outline-none cursor-pointer"
                  >
                    <option value="₹5,00,000">₹5 Lakhs - ₹15 Lakhs</option>
                    <option value="₹25,00,000">₹15 Lakhs - ₹50 Lakhs</option>
                    <option value="₹75,00,000">₹50 Lakhs - ₹2 Crores</option>
                    <option value="₹2,50,00,000">₹2 Crores+ (Enterprise)</option>
                  </select>
                </div>
              </div>

              {/* Governed Autonomy Info */}
              <div className="rounded-lg bg-[#191918] border border-[rgba(242,238,229,0.08)] p-3 text-[11px] text-[#A5A198] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#66745D] shrink-0" />
                <span>
                  Initializes in <strong>Autonomous Safe Mode</strong> with zero-trust guardrails active.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddMerchantOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[rgba(242,238,229,0.12)] text-xs text-[#A5A198] hover:text-[#F2EEE5] hover:bg-[#191918] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-5 py-2.5 rounded-lg bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Register &amp; Switch Merchant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
