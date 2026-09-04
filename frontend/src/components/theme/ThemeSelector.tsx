"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, ThemeMode } from "./ThemeProvider";
import { Palette, Check, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSelector({ variant = "full" }: { variant?: "full" | "compact" }) {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl glass-pill px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm"
        title="Change UI Theme & Glass Style"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{currentTheme.icon}</span>
          {variant === "full" && (
            <span className="hidden sm:inline font-medium text-slate-200">{currentTheme.name}</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-72 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/[0.15]"
          >
            <div className="px-3 py-2 border-b border-white/[0.08] mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Select Visual Theme
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Glassmorphism</span>
            </div>

            <div className="space-y-1">
              {themes.map((t) => {
                const isActive = t.id === theme;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                      isActive
                        ? "bg-white/[0.1] border border-white/[0.18] shadow-sm"
                        : "hover:bg-white/[0.05] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.previewClass} border border-white/20 flex items-center justify-center text-xs shadow-inner flex-shrink-0`}
                      >
                        {t.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{t.name}</span>
                          {isActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-blue-500/30 border border-blue-400 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-blue-300" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
