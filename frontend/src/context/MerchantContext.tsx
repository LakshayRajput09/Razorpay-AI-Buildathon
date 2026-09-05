"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Merchant {
  id: string;
  name: string;
  type: string;
  category: string;
  city: string;
  mid: string;
  currency: string;
  monthlyGmv: string;
  status: "Active" | "Pending KYC" | "Review";
}

export const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: "m_nova",
    name: "Nova Apparel",
    type: "D2C Brand • Bengaluru, KA",
    category: "D2C Lifestyle & Apparel",
    city: "Bengaluru, KA",
    mid: "acc_Nova98124",
    currency: "INR",
    monthlyGmv: "₹45,00,000",
    status: "Active",
  },
  {
    id: "m_cloudflow",
    name: "CloudFlow India",
    type: "SaaS Recurring • Mumbai, MH",
    category: "B2B SaaS & Cloud",
    city: "Mumbai, MH",
    mid: "acc_Cloud8819",
    currency: "INR",
    monthlyGmv: "₹18,50,000",
    status: "Active",
  },
  {
    id: "m_voltmart",
    name: "VoltMart Electronics",
    type: "High-Ticket Retail • Delhi, DL",
    category: "Consumer Electronics Retail",
    city: "Delhi, DL",
    mid: "acc_Volt99201",
    currency: "INR",
    monthlyGmv: "₹72,00,000",
    status: "Active",
  },
  {
    id: "m_thegreencollective",
    name: "The Green Collective",
    type: "D2C Sustainable Fashion • Jaipur, RJ",
    category: "D2C Sustainable Fashion",
    city: "Jaipur, RJ",
    mid: "acc_Green7721",
    currency: "INR",
    monthlyGmv: "₹24,80,000",
    status: "Active",
  },
];

interface MerchantContextType {
  merchants: Merchant[];
  selectedMerchant: Merchant;
  setSelectedMerchant: (merchant: Merchant) => void;
  addMerchant: (merchant: Omit<Merchant, "id" | "status">) => Merchant;
  isAddMerchantOpen: boolean;
  setIsAddMerchantOpen: (open: boolean) => void;
}

const MerchantContext = createContext<MerchantContextType | undefined>(undefined);

export function MerchantProvider({ children }: { children: React.ReactNode }) {
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [selectedMerchant, setSelectedMerchantState] = useState<Merchant>(INITIAL_MERCHANTS[0]);
  const [isAddMerchantOpen, setIsAddMerchantOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedMerchants = localStorage.getItem("razorpay_merchants");
      const storedActiveId = localStorage.getItem("razorpay_active_merchant_id");

      let currentList = INITIAL_MERCHANTS;
      if (storedMerchants) {
        const parsed = JSON.parse(storedMerchants);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentList = parsed;
          setMerchants(parsed);
        }
      }

      if (storedActiveId) {
        const found = currentList.find((m) => m.id === storedActiveId);
        if (found) {
          setSelectedMerchantState(found);
        } else {
          setSelectedMerchantState(currentList[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load merchants from storage", e);
    }
  }, []);

  const setSelectedMerchant = (merchant: Merchant) => {
    setSelectedMerchantState(merchant);
    try {
      localStorage.setItem("razorpay_active_merchant_id", merchant.id);
    } catch (e) {
      console.error(e);
    }
  };

  const addMerchant = (newMerchantData: Omit<Merchant, "id" | "status">): Merchant => {
    const id = "m_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newMerchant: Merchant = {
      ...newMerchantData,
      id,
      status: "Active",
    };

    const updatedList = [...merchants, newMerchant];
    setMerchants(updatedList);
    setSelectedMerchant(newMerchant);

    try {
      localStorage.setItem("razorpay_merchants", JSON.stringify(updatedList));
      localStorage.setItem("razorpay_active_merchant_id", newMerchant.id);
    } catch (e) {
      console.error(e);
    }

    return newMerchant;
  };

  return (
    <MerchantContext.Provider
      value={{
        merchants,
        selectedMerchant,
        setSelectedMerchant,
        addMerchant,
        isAddMerchantOpen,
        setIsAddMerchantOpen,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchant() {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error("useMerchant must be used within a MerchantProvider");
  }
  return context;
}
