"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ArrowRight, Menu, X, Shield, Cpu, Activity, Lock } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-30 px-4 sm:px-6 py-5 w-full"
    >
      <div className="liquid-glass rounded-full px-5 sm:px-6 py-3 flex items-center justify-between max-w-6xl mx-auto shadow-2xl backdrop-blur-xl border border-white/10">
        {/* Left Side: Brand Logo & Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Razorpay AI Home"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center group-hover:scale-105 group-hover:border-blue-400 transition-all duration-300">
              <Globe className="w-4 h-4 text-blue-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-base sm:text-lg tracking-tight">
                Razorpay <span className="text-blue-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Autonomous OS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-white/80 text-xs sm:text-sm font-medium">
            <a
              href="#simulator"
              className="hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
            >
              <Activity className="w-3.5 h-3.5 text-blue-400/80 group-hover:text-blue-400 transition-colors" />
              <span>Policy Simulator</span>
            </a>
            <a
              href="#agents"
              className="hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
              <span>Four Agents</span>
            </a>
            <a
              href="#pipeline"
              className="hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400/80 group-hover:text-indigo-400 transition-colors" />
              <span>Pipeline</span>
            </a>
            <a
              href="#guardrails"
              className="hover:text-white transition-colors duration-300 flex items-center gap-1.5 group"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
              <span>Zero-Trust</span>
            </a>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/command-center"
            className="liquid-glass rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 border border-white/20 shadow-md shadow-blue-900/20 group cursor-pointer"
          >
            <span>Command Center</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-white/80 hover:text-white transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 liquid-glass rounded-2xl p-4 flex flex-col gap-3 max-w-6xl mx-auto border border-white/10 backdrop-blur-2xl"
          >
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Policy Simulator
            </a>
            <a
              href="#agents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Four Domain Agents
            </a>
            <a
              href="#pipeline"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Governance Pipeline
            </a>
            <a
              href="#guardrails"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              Zero-Trust Rules
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

