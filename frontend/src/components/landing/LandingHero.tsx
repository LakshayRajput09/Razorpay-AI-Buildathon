"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Sparkles, Sliders, ChevronDown } from "lucide-react";
import { BackgroundVideo } from "./BackgroundVideo";

export function LandingHero() {
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");

  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect function
  const runTypewriter = (text: string, onComplete?: () => void) => {
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current);
    }
    setPlaceholder("");
    let i = 0;
    typewriterIntervalRef.current = setInterval(() => {
      if (i < text.length) {
        setPlaceholder(text.slice(0, i + 1));
        i++;
      } else {
        if (typewriterIntervalRef.current) {
          clearInterval(typewriterIntervalRef.current);
        }
        if (onComplete) onComplete();
      }
    }, 50);
  };

  // Trigger typewriter when form opens
  useEffect(() => {
    if (formOpen && !isSubmitted) {
      runTypewriter("Enter Your Email Here For Early Access");
    }
    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
    };
  }, [formOpen]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !isSubmitted) return;

    setIsSubmitted(true);
    setEmail("");
    runTypewriter("You Will Receive Notifications By Email");

    // Reset back to button state after 4 seconds
    resetTimeoutRef.current = setTimeout(() => {
      setFormOpen(false);
      setIsSubmitted(false);
      setPlaceholder("");
      setEmail("");
    }, 4000);
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black select-none">
      {/* 1. Mux Background Video */}
      <BackgroundVideo />

      {/* Subtle Dark Gradient Vignettes for Perfect Contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-black/40 to-black/60 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-[#080C14]/90 pointer-events-none z-10" />

      {/* Decorative ambient particle glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none z-10 animate-pulse duration-[8000ms]" />

      {/* Spacer for floating navbar */}
      <div className="h-16 sm:h-20" />

      {/* 2. Hero Centerpiece Content */}
      <div className="relative z-20 px-4 sm:px-6 py-8 flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full">
        {/* Animated Pill Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/15 backdrop-blur-md shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-[0.18em] text-white/90">
            Autonomous Financial Intelligence • Zero-Trust Governed
          </span>
        </motion.div>

        {/* Display Heading with Instrument Serif */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-serif font-normal tracking-[-0.015em] leading-[1.08] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl mx-auto drop-shadow-sm"
        >
          A new way to govern and grow <br className="hidden md:block" /> with autonomous financial AI
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed mb-8 sm:mb-10 text-balance"
        >
          The financial nervous system for high-growth merchants. Four specialized AI agents operating as one coordinated business brain.
        </motion.p>

        {/* 3. Interactive Early Access CTA (Typewriter Form) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[52px] flex flex-col items-center justify-center gap-6 w-full"
        >
          <AnimatePresence mode="wait">
            {!formOpen ? (
              <motion.button
                key="cta-button"
                type="button"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.25 }}
                onClick={() => setFormOpen(true)}
                className="liquid-glass px-8 sm:px-10 py-3.5 text-xs sm:text-sm font-medium border border-white/20 rounded-full hover:border-white/40 hover:bg-white/[0.04] transition-all duration-300 text-white shadow-xl shadow-blue-950/30 backdrop-blur-md cursor-pointer flex items-center gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-12 transition-transform" />
                <span>Get early access</span>
              </motion.button>
            ) : (
              <motion.form
                key="cta-form"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-xs sm:text-sm font-medium border border-white/25 rounded-full bg-black/60 backdrop-blur-xl w-full max-w-[360px] focus-within:border-white/50 transition-all duration-300 shadow-2xl shadow-blue-900/30"
              >
                <input
                  type="email"
                  autoFocus
                  disabled={isSubmitted}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="bg-transparent text-white placeholder-white/50 outline-none flex-1 text-xs sm:text-sm font-sans tracking-normal selection:bg-white selection:text-black"
                />

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all cursor-pointer disabled:opacity-80 shrink-0 shadow-sm"
                  aria-label="Submit email"
                >
                  {isSubmitted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-white" />
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Quick Action Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <Link
              href="/command-center"
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Live Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href="#simulator"
              className="px-5 py-2.5 rounded-full liquid-glass border border-white/15 hover:border-white/35 text-white/85 hover:text-white text-xs font-semibold transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Test Policy Simulator</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* 4. Animated Bouncing Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-20 pb-6 sm:pb-8 flex flex-col items-center justify-center"
      >
        <a
          href="#benchmark"
          className="group flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors text-[10px] font-mono tracking-widest uppercase cursor-pointer"
        >
          <span>Scroll to explore Business Brain</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-7 h-7 rounded-full liquid-glass flex items-center justify-center border border-white/15 group-hover:border-white/35"
          >
            <ChevronDown className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}

