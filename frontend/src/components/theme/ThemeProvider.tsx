"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "midnight" | "champagne" | "titanium" | "emerald" | "light";

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  description: string;
  badgeColor: string;
  previewClass: string;
  icon: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "midnight",
    name: "Midnight OLED",
    description: "Deep black glass with Razorpay Blue & ice accents",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    previewClass: "from-[#080C14] via-[#0F172A] to-[#1E293B]",
    icon: "🌙",
  },
  {
    id: "champagne",
    name: "Champagne Onyx",
    description: "Private banking warm gold, onyx glass & satin brass borders",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    previewClass: "from-[#0C0A09] via-[#1C1917] to-[#292524]",
    icon: "👑",
  },
  {
    id: "titanium",
    name: "Nordic Titanium",
    description: "Executive slate with institutional sapphire & platinum luster",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    previewClass: "from-[#060C18] via-[#0E1B33] to-[#1E293B]",
    icon: "🏛️",
  },
  {
    id: "emerald",
    name: "Emerald Wealth",
    description: "Prestigious dark slate with Money Green & gold glow",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    previewClass: "from-[#04150E] via-[#06261A] to-[#0D3B29]",
    icon: "💎",
  },
  {
    id: "light",
    name: "Daylight Glass",
    description: "Crisp white frosted glass with diffuse soft shadows",
    badgeColor: "bg-slate-200 text-slate-800 border-slate-300",
    previewClass: "from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]",
    icon: "☀️",
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("midnight");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("razorpay_ai_theme") as ThemeMode;
    const validThemes: ThemeMode[] = ["midnight", "champagne", "titanium", "emerald", "light"];
    if (saved && validThemes.includes(saved)) {
      setThemeState(saved);
      applyThemeToDOM(saved);
    } else {
      setThemeState("midnight");
      applyThemeToDOM("midnight");
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem("razorpay_ai_theme", newTheme);
    applyThemeToDOM(newTheme);
  };

  const applyThemeToDOM = (t: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const allThemeClasses = ["theme-midnight", "theme-champagne", "theme-titanium", "theme-emerald", "theme-light", "theme-cyberpunk"];
    root.classList.remove(...allThemeClasses);
    root.classList.add(`theme-${t}`);

    if (document.body) {
      document.body.classList.remove(...allThemeClasses);
      document.body.classList.add(`theme-${t}`);
    }

    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
