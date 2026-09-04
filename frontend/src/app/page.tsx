"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Landmark,
  ArrowRight,
  Check,
  Sparkles,
  Play,
  Search,
  Lock,
  LayoutDashboard,
} from "lucide-react";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Sticky Navbar background transition on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Early-Access Form State
  const [formOpen, setFormOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 45);
  };

  useEffect(() => {
    if (formOpen && !isSubmitted) {
      runTypewriter("Enter merchant email for early access");
    }
    return () => {
      if (typewriterIntervalRef.current) {
        clearInterval(typewriterIntervalRef.current);
      }
    };
  }, [formOpen]);

  const handleEmailSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !isSubmitted) return;

    setIsSubmitted(true);
    setEmail("");
    runTypewriter("Invitation dispatched to your inbox");

    resetTimeoutRef.current = setTimeout(() => {
      setFormOpen(false);
      setIsSubmitted(false);
      setPlaceholder("");
      setEmail("");
    }, 4000);
  };

  // Interactive 5-Step Process State
  const [activeStep, setActiveStep] = useState(0);

  const decisionSteps = [
    {
      num: "01",
      name: "Understand",
      title: "Real-time Telemetry Ingestion",
      desc: "Continuous synchronization of transaction drops, customer cart activity, and cash outflow across all Razorpay rails.",
      tag: "Live Ingestion",
      metric: "126 failed payments identified (HDFC/SBI gateway timeouts)",
    },
    {
      num: "02",
      name: "Predict",
      title: "Predictive Machine Learning Inference",
      desc: "Specialized models estimate 14-day purchase probabilities, fraud likelihood, and expected dunning recovery rates.",
      tag: "Predictive Layer",
      metric: "88% clearance probability estimated within 45m window",
    },
    {
      num: "03",
      name: "Recommend",
      title: "Multi-Agent Strategy Synthesis",
      desc: "Four domain agents formulate optimal operational plans with margin caps and liquidity safety buffers.",
      tag: "Business Brain",
      metric: "Target ₹96,000 net recovery via Smart Retries + WhatsApp",
    },
    {
      num: "04",
      name: "Act",
      title: "Policy-Governed Execution",
      desc: "Safe operations trigger autonomously. High-impact monetary actions mandate merchant sign-off.",
      tag: "Deterministic Gate",
      metric: "Whitelisted action executed via Razorpay API adapter",
    },
    {
      num: "05",
      name: "Learn",
      title: "Cryptographic Audit & Model Update",
      desc: "Outcomes, verified bank responses, and recovered funds are committed to an immutable ledger for continuous refinement.",
      tag: "Ledger Feedback",
      metric: "₹84,999 recovered into merchant account • 0.0% dispute rate",
    },
  ];

  // Four Agents Story Accordion State
  const [activeAgentStory, setActiveAgentStory] = useState(0);

  const agentStories = [
    {
      id: "growth",
      name: "AI Growth",
      tagline: "Find the customers most likely to buy.",
      desc: "Analyzes purchase recency gaps, RFM customer cohorts, and basket sizes to predict 14-day repurchase intent. Automatically drafts margin-safe re-engagement incentives (up to 10%) without eroding profitability.",
      kpi: "+34% predicted repurchase lift",
      kpiSub: "12 at-risk customer accounts ready for reactivation",
      color: "#B69A5A",
      icon: TrendingUp,
      route: "/growth",
    },
    {
      id: "risk",
      name: "AI Risk Manager",
      tagline: "Detect unusual behavior before it becomes loss.",
      desc: "Evaluates device hardware novelty, transaction velocity bursts, and IP proxy distance in under 12ms. Flags high-risk orders for human review, safeguards Cash-on-Delivery, and auto-drafts chargeback defense packets.",
      kpi: "₹3.42L loss prevented",
      kpiSub: "94.2% dispute defense win rate with calibrated false positives",
      color: "#9A7940",
      icon: ShieldAlert,
      route: "/risk",
    },
    {
      id: "recovery",
      name: "AI Revenue Recovery",
      tagline: "Turn failed payments into recovered revenue.",
      desc: "Distinguishes transient bank issuer downtime from card balance failures. Schedules Smart Retries during optimal issuer clearance windows and delivers 1-click WhatsApp payment links with verified UPI QR codes.",
      kpi: "88% avg recovery rate",
      kpiSub: "₹4.82L recoverable pipeline active across 6 cases",
      color: "#66745D",
      icon: RefreshCw,
      route: "/recovery",
    },
    {
      id: "finance",
      name: "AI Finance Controller",
      tagline: "Know what you can spend, save and grow.",
      desc: "Monitors liquid cash balance against recurring monthly outflows (payroll, logistics, cloud, and gateway MDR). Runs 30-day What-If sensitivity simulations so founders know exactly when capital touches safety buffers.",
      kpi: "58 days safe runway",
      kpiSub: "₹15.00L safety reserve cushion preserved",
      color: "#D1B56A",
      icon: Landmark,
      route: "/finance",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1A18] font-sans selection:bg-[#5A1F28]/15 selection:text-[#5A1F28] relative overflow-x-hidden">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#5A1F28] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />

      {/* =========================================================================
          1. CLEAN STICKY NAVBAR (Cream / Translucent with transition on scroll)
         ========================================================================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          scrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#1B1A18]/10 shadow-sm"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 cursor-pointer group"
            aria-label="Razorpay AI Home"
          >
            {/* Razorpay Iconic Burgundy Mark */}
            <div className="w-8 h-8 rounded-lg bg-[#5A1F28] flex items-center justify-center text-white shadow-sm group-hover:bg-[#732733] transition-colors">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 20L13.5 3L11 20H4Z"
                  fill="currentColor"
                  opacity="0.9"
                />
                <path
                  d="M13 10L19.5 20H12.5L9.5 10H13Z"
                  fill="#D1B56A"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#1B1A18]">
                  Razorpay AI
                </span>
              </div>
              <p className="text-[9px] font-sans font-semibold tracking-wider uppercase text-[#77736B] -mt-0.5">
                AI Merchant Intelligence
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#77736B]">
            <a href="#agents" className="hover:text-[#1B1A18] transition-colors">
              Product
            </a>
            <a href="#agents" className="hover:text-[#1B1A18] transition-colors">
              AI Agents
            </a>
            <a href="#story" className="hover:text-[#1B1A18] transition-colors">
              Use Cases
            </a>
            <a href="#decisions" className="hover:text-[#1B1A18] transition-colors">
              How it Works
            </a>
            <a href="#governance" className="hover:text-[#1B1A18] transition-colors">
              Resources
            </a>
            <Link href="/command-center" className="hover:text-[#1B1A18] transition-colors">
              Developers
            </Link>
          </nav>

          {/* Actions: Enter Command Center + Get Early Access */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/command-center"
              className="px-3.5 py-1.5 rounded-md bg-[#1B1A18] hover:bg-[#2A2825] text-[#FAF7F2] text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border border-[#1B1A18]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#B69A5A]" />
              <span className="hidden sm:inline">Enter</span>
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B69A5A]" />
            </Link>

            <AnimatePresence mode="wait">
              {!formOpen ? (
                <button
                  type="button"
                  onClick={() => setFormOpen(true)}
                  className="px-4 py-2 rounded-md bg-[#5A1F28] hover:bg-[#732733] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get early access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex items-center gap-2 pl-3 pr-1 py-1 text-xs border border-[#5A1F28]/40 rounded-md bg-white shadow-md max-w-[260px]"
                >
                  <input
                    type="email"
                    autoFocus
                    disabled={isSubmitted}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    className="bg-transparent text-[#1B1A18] placeholder-[#77736B] outline-none flex-1 text-xs font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="flex items-center justify-center w-6 h-6 rounded bg-[#5A1F28] hover:bg-[#732733] text-white transition-all cursor-pointer disabled:opacity-80 shrink-0"
                    aria-label="Submit email"
                  >
                    {isSubmitted ? (
                      <Check className="w-3 h-3 text-white" />
                    ) : (
                      <ArrowRight className="w-3 h-3 text-white" />
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION (Warm Cream #FAF7F2 with Authentic Merchant Photo)
         ========================================================================= */}
      <section className="pt-6 sm:pt-10 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Typography & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#5A1F28]">
              BUILT FOR INDIA&apos;S BOLDEST MERCHANTS
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#1B1A18] leading-[1.1]">
              More than payments.
              <br />
              A smarter way to grow.
            </h1>

            <p className="text-sm sm:text-base text-[#55524B] leading-relaxed max-w-lg font-sans">
              Razorpay AI helps you increase revenue, prevent losses, recover failed payments and manage your cash — all through one intelligent platform.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/command-center"
                className="px-6 py-3 rounded-md bg-[#5A1F28] hover:bg-[#732733] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#D1B56A]" />
                <span>Enter Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="px-5 py-3 rounded-md border border-[#1B1A18]/20 bg-white/80 hover:bg-white text-[#1B1A18] text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5A1F28]" />
                <span>Get early access</span>
              </button>

              <a
                href="#agents"
                className="px-4 py-3 rounded-md text-[#77736B] hover:text-[#1B1A18] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 text-[#5A1F28] fill-[#5A1F28]" />
                <span>Watch video</span>
              </a>
            </div>

            {/* Social Proof Avatars Strip */}
            <div className="pt-3 flex items-center gap-3">
              <img
                src="/images/avatars_group.png"
                alt="Trusted merchants"
                className="h-7 w-auto object-contain"
              />
              <div className="text-xs">
                <p className="font-semibold text-[#1B1A18]">Trusted by 10,000+ merchants</p>
                <p className="text-[11px] text-[#77736B]">From startups to enterprises</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Authentic Editorial Photo of Indian Artisan Entrepreneur */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[520px] w-full max-w-[480px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[#1B1A18]/10 bg-[#E8DFD1]">
              <img
                src="/images/hero_merchant_exact_hd.jpg"
                alt="Indian woman entrepreneur smiling warmly while managing orders on laptop in ceramic pottery shop"
                className="w-full h-full object-cover object-center"
              />

              {/* Top Right Italic Script Label */}
              <div className="absolute top-5 right-5 text-right pointer-events-none">
                <span className="font-serif italic text-sm sm:text-base text-[#1B1A18] font-medium tracking-wide drop-shadow-sm">
                  Turning ideas
                  <br />
                  into bigger
                  <br />
                  businesses.
                </span>
                <div className="w-8 h-[2px] bg-[#5A1F28] ml-auto mt-1" />
              </div>

              {/* Floating Metric Card: Online orders +36% */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-6 right-6 p-4 rounded-xl bg-[#FAF7F2]/95 backdrop-blur-md border border-[#1B1A18]/10 shadow-xl space-y-0.5"
              >
                <div className="text-[11px] font-medium text-[#77736B]">Online orders</div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold text-[#5A1F28]">
                    +36%
                  </span>
                  <TrendingUp className="w-4 h-4 text-[#B69A5A]" />
                </div>
                <div className="text-[10px] text-[#77736B]">in the last 3 months</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* 4 Bottom Horizontal Ribbons (Dark Bar Spanning Across) */}
        <div className="mt-14 pt-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0B0B0A] text-[#F2EEE5] border border-[rgba(242,238,229,0.08)] flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded bg-[#191918] flex items-center justify-center text-[#B69A5A]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-[#F2EEE5]">Increase</div>
                <div className="text-[#A5A198] text-[11px]">revenue</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B0B0A] text-[#F2EEE5] border border-[rgba(242,238,229,0.08)] flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded bg-[#191918] flex items-center justify-center text-[#9A7940]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-[#F2EEE5]">Prevent</div>
                <div className="text-[#A5A198] text-[11px]">fraud & losses</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B0B0A] text-[#F2EEE5] border border-[rgba(242,238,229,0.08)] flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded bg-[#191918] flex items-center justify-center text-[#66745D]">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-[#F2EEE5]">Recover</div>
                <div className="text-[#A5A198] text-[11px]">missed payments</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0B0B0A] text-[#F2EEE5] border border-[rgba(242,238,229,0.08)] flex items-center gap-3 shadow-md">
              <div className="w-8 h-8 rounded bg-[#191918] flex items-center justify-center text-[#D1B56A]">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-[#F2EEE5]">Manage</div>
                <div className="text-[#A5A198] text-[11px]">cash flow</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION 1: FOUR AI AGENTS (Dark #0B0B0A)
         ========================================================================= */}
      <section id="agents" className="bg-[#0B0B0A] text-[#F2EEE5] py-20 px-4 sm:px-6 border-t border-[rgba(242,238,229,0.08)]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[rgba(242,238,229,0.08)] pb-8">
            <div>
              <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#B69A5A] mb-2">
                FOUR AI AGENTS. ONE BUSINESS BRAIN.
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#F2EEE5] tracking-tight">
                Specialized AI agents.
                <br />
                Real business outcomes.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A5A198] max-w-md leading-relaxed">
              Each agent focuses on a critical part of your business, working together to give you a complete picture and the right actions.
            </p>
          </div>

          {/* 4 Agent Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: AI Growth */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.0 }}
              className="p-6 rounded-xl bg-[#151514] border border-[rgba(242,238,229,0.08)] hover:border-[#B69A5A]/40 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#1A1917] border border-[#B69A5A]/30 flex items-center justify-center text-[#B69A5A]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#F2EEE5]">AI Growth</h3>
                  <p className="text-xs text-[#A5A198] mt-2 leading-relaxed">
                    Find new customers. Increase conversions. Drive repeat revenue.
                  </p>
                </div>
              </div>
              <Link
                href="/growth"
                className="text-xs font-semibold text-[#B69A5A] group-hover:underline inline-flex items-center gap-1.5 pt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Card 2: AI Risk Manager */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 rounded-xl bg-[#151514] border border-[rgba(242,238,229,0.08)] hover:border-[#9A7940]/40 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#1A1917] border border-[#9A7940]/30 flex items-center justify-center text-[#9A7940]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#F2EEE5]">AI Risk Manager</h3>
                  <p className="text-xs text-[#A5A198] mt-2 leading-relaxed">
                    Detect and prevent fraud. Reduce returns and chargebacks.
                  </p>
                </div>
              </div>
              <Link
                href="/risk"
                className="text-xs font-semibold text-[#B69A5A] group-hover:underline inline-flex items-center gap-1.5 pt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Card 3: AI Revenue Recovery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-xl bg-[#151514] border border-[rgba(242,238,229,0.08)] hover:border-[#66745D]/40 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#1A1917] border border-[#66745D]/30 flex items-center justify-center text-[#66745D]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#F2EEE5]">AI Revenue Recovery</h3>
                  <p className="text-xs text-[#A5A198] mt-2 leading-relaxed">
                    Recover failed payments. Automate follow-ups. Turn lost revenue into growth.
                  </p>
                </div>
              </div>
              <Link
                href="/recovery"
                className="text-xs font-semibold text-[#B69A5A] group-hover:underline inline-flex items-center gap-1.5 pt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Card 4: AI Finance Controller */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-xl bg-[#151514] border border-[rgba(242,238,229,0.08)] hover:border-[#D1B56A]/40 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#1A1917] border border-[#D1B56A]/30 flex items-center justify-center text-[#D1B56A]">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-semibold text-[#F2EEE5]">AI Finance Controller</h3>
                  <p className="text-xs text-[#A5A198] mt-2 leading-relaxed">
                    Understand cash flow. Plan with confidence. Make smarter decisions.
                  </p>
                </div>
              </div>
              <Link
                href="/finance"
                className="text-xs font-semibold text-[#B69A5A] group-hover:underline inline-flex items-center gap-1.5 pt-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. SECTION 2: HUMAN MERCHANT STORY & LIVE DASHBOARD (Warm Cream #F3EEE4)
         ========================================================================= */}
      <section id="story" className="bg-[#F3EEE4] py-20 px-4 sm:px-6 border-b border-[#1B1A18]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative Copy & Bullet Points */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#5A1F28]">
              FROM INSIGHTS TO ACTIONS.
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-[#1B1A18] tracking-tight leading-[1.12]">
              Your business,
              <br />
              fully understood.
            </h2>

            <p className="text-xs sm:text-sm text-[#77736B] leading-relaxed max-w-md">
              Ask questions, get clear answers, and take action — with data, not guesswork.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                "Real-time business insights",
                "Actionable recommendations",
                "Human-in-the-loop for control",
                "Built on secure Razorpay infrastructure",
              ].map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#B69A5A]/20 border border-[#B69A5A] flex items-center justify-center text-[#5A1F28] shrink-0">
                    <Check className="w-3 h-3 text-[#5A1F28]" />
                  </div>
                  <span className="text-xs font-medium text-[#1B1A18]">{bullet}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link
                href="/command-center"
                className="px-6 py-3 rounded-md bg-[#5A1F28] hover:bg-[#732733] text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer group"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#D1B56A]" />
                <span>Enter Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Interactive Razorpay AI Command Center Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl bg-[#121211] border border-[rgba(242,238,229,0.12)] p-6 shadow-2xl space-y-5 text-[#F2EEE5]">
              {/* Dashboard Top Search Bar */}
              <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.08)] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#5A1F28] flex items-center justify-center text-white text-xs font-serif font-bold">
                    R
                  </div>
                  <span className="font-serif text-sm font-semibold text-[#F2EEE5]">Razorpay AI</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#191918] border border-[rgba(242,238,229,0.08)] text-xs text-[#A5A198] w-60">
                  <Search className="w-3.5 h-3.5 text-[#706E68]" />
                  <span className="truncate">Ask your business anything...</span>
                </div>
              </div>

              {/* Greeting & Headline */}
              <div>
                <h3 className="text-xl font-serif text-[#F2EEE5]">Good Afternoon, Priya 👋</h3>
                <p className="text-xs text-[#A5A198] mt-0.5">
                  Your business is performing well. Here&apos;s what&apos;s happening today.
                </p>
              </div>

              {/* Dual Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-1">
                  <div className="text-[11px] text-[#A5A198]">Total Revenue</div>
                  <div className="font-serif text-2xl font-bold text-[#F2EEE5]">₹8,42,320</div>
                  <div className="text-[10px] text-[#66745D] font-medium flex items-center gap-1">
                    <span>↑ 14.2%</span>
                    <span className="text-[#706E68]">vs last month</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-1">
                  <div className="text-[11px] text-[#A5A198]">Active Customers</div>
                  <div className="font-serif text-2xl font-bold text-[#F2EEE5]">3,241</div>
                  <div className="text-[10px] text-[#66745D] font-medium flex items-center gap-1">
                    <span>↑ 12.5%</span>
                    <span className="text-[#706E68]">vs last month</span>
                  </div>
                </div>
              </div>

              {/* Monthly Revenue & Transactions Visual Bar Chart */}
              <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.06)] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F2EEE5]">Revenue & Transactions</span>
                  <div className="flex items-center gap-3 text-[10px] text-[#A5A198]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#B69A5A]" /> Revenue
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#5A1F28]" /> Transactions
                    </span>
                  </div>
                </div>

                {/* SVG Simulated Bar Chart Jan - Sep */}
                <div className="h-28 flex items-end justify-between gap-2 pt-2 px-1 border-b border-[rgba(242,238,229,0.06)]">
                  {[
                    { month: "Jan", val: 35 },
                    { month: "Feb", val: 42 },
                    { month: "Mar", val: 48 },
                    { month: "Apr", val: 56 },
                    { month: "May", val: 62 },
                    { month: "Jun", val: 68 },
                    { month: "Jul", val: 75 },
                    { month: "Aug", val: 82 },
                    { month: "Sep", val: 94 },
                  ].map((d) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div
                        className="w-full bg-[#B69A5A] rounded-t-sm hover:opacity-90 transition-opacity"
                        style={{ height: `${d.val}%` }}
                      />
                      <span className="text-[9px] text-[#706E68] font-mono">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION 3: MERCHANT STORY — AMAN VERMA (Warm Cream #FAF7F2)
         ========================================================================= */}
      <section className="bg-[#FAF7F2] py-20 px-4 sm:px-6 border-b border-[#1B1A18]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Authentic Portrait of Aman Verma */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] max-h-[500px] w-full max-w-[420px] mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[#1B1A18]/10 bg-[#E8DFD1]">
              <img
                src="/images/aman_verma_exact_hd.jpg"
                alt="Aman Verma, founder of The Green Collective, standing confidently with folded arms in workshop"
                className="w-full h-full object-cover object-center"
              />

              {/* Italic Script Caption Badge on Photo */}
              <div className="absolute top-6 right-6 text-right pointer-events-none">
                <span className="font-serif italic text-sm text-[#1B1A18] font-medium tracking-wide drop-shadow-sm">
                  Payments
                  <br />
                  that power
                  <br />
                  what&apos;s next.
                </span>
                <div className="w-6 h-[2px] bg-[#5A1F28] ml-auto mt-1" />
              </div>
            </div>
          </motion.div>

          {/* Right: Large Editorial Quote & Founder Attribution */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#5A1F28]">
              MERCHANT STORIES
            </div>

            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1B1A18] font-normal leading-snug">
              &ldquo;Razorpay AI helped us recover ₹2.3 lakh in failed payments last month. It&apos;s like having a finance team that never sleeps.&rdquo;
            </blockquote>

            <div className="pt-2">
              <div className="font-semibold text-base text-[#1B1A18]">Aman Verma</div>
              <div className="text-xs text-[#77736B]">Founder, The Green Collective</div>
              <div className="text-xs text-[#5A1F28] font-medium mt-0.5">D2C Sustainable Fashion</div>
              <div className="w-10 h-[2px] bg-[#5A1F28] mt-2.5" />
            </div>

            <p className="text-[11px] text-[#77736B] pt-4 font-mono">
              *Illustrative merchant testimonial grounded in live recovery &amp; dunning telemetry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          6. SECTION 4: SEE THE WHOLE BUSINESS — COMMAND CENTER (Dark #0B0B0A)
         ========================================================================= */}
      <section id="command-center" className="bg-[#0B0B0A] text-[#F2EEE5] py-24 px-4 sm:px-6 border-b border-[rgba(242,238,229,0.08)]">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#B69A5A]">
              UNIFIED BUSINESS BRAIN
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#F2EEE5]">
              See the whole business.
              <br />
              At once.
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A198] max-w-xl mx-auto leading-relaxed">
              A single pane of glass uniting transaction flow, risk exposure, and growth levers.
            </p>
          </div>

          {/* Interactive Scaled Command Center Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl mx-auto rounded-2xl bg-[#121211] border border-[rgba(242,238,229,0.12)] p-6 sm:p-8 shadow-2xl text-left space-y-6"
          >
            {/* Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(242,238,229,0.08)] pb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5A1F28] flex items-center justify-center font-serif font-bold text-white text-sm">
                  R
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F2EEE5]">Razorpay AI Command Center</h4>
                  <p className="text-[11px] text-[#A5A198]">Autonomous Safe Mode • 4 Agents Active</p>
                </div>
              </div>

              <Link
                href="/command-center"
                className="self-start sm:self-center px-4 py-2 rounded-md bg-[#B69A5A] hover:bg-[#D1B56A] text-[#0B0B0A] text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Live Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Floating Insight Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] space-y-1">
                <span className="text-[10px] text-[#A5A198] uppercase font-mono">Revenue Opportunity</span>
                <div className="font-serif text-xl sm:text-2xl text-[#F2EEE5]">₹6.20L</div>
                <div className="text-[10px] text-[#66745D] font-medium">+34% predicted lift</div>
              </div>

              <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] space-y-1">
                <span className="text-[10px] text-[#A5A198] uppercase font-mono">Recovery Opportunity</span>
                <div className="font-serif text-xl sm:text-2xl text-[#B69A5A]">₹4.82L</div>
                <div className="text-[10px] text-[#66745D] font-medium">88% recovery rate</div>
              </div>

              <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] space-y-1">
                <span className="text-[10px] text-[#A5A198] uppercase font-mono">Risk Exposure</span>
                <div className="font-serif text-xl sm:text-2xl text-[#F2EEE5]">₹2.13L</div>
                <div className="text-[10px] text-[#9A7940] font-medium">Shield active (3 cases)</div>
              </div>

              <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] space-y-1">
                <span className="text-[10px] text-[#A5A198] uppercase font-mono">Cash Runway</span>
                <div className="font-serif text-xl sm:text-2xl text-[#F2EEE5]">58 Days</div>
                <div className="text-[10px] text-[#66745D] font-medium">Buffer intact (₹15L)</div>
              </div>
            </div>

            {/* AI Reasoning Callout */}
            <div className="p-4 rounded-lg bg-[#181816] border border-[#B69A5A]/30 text-xs text-[#A5A198] space-y-2">
              <div className="flex items-center gap-2 text-[#B69A5A] font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Insight Synthesis (Trailing 7 Days)</span>
              </div>
              <p className="leading-relaxed text-[#F2EEE5]">
                Primary revenue drop was driven by ₹1.24L in transient HDFC &amp; SBI issuer clearance timeouts. AI Revenue Recovery has scheduled bank-aware retries for 126 failed attempts with &gt;75% clearance probability. Expected recovery: <strong className="text-[#B69A5A]">₹96,000</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          7. SECTION 5: FROM DATA TO DECISIONS (Interactive Split-Screen)
         ========================================================================= */}
      <section id="decisions" className="bg-[#FAF7F2] py-20 px-4 sm:px-6 border-b border-[#1B1A18]/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div>
            <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#5A1F28]">
              THE INTELLIGENCE LOOP
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#1B1A18] tracking-tight mt-1">
              From data
              <br />
              to decisions.
            </h2>
            <p className="text-xs sm:text-sm text-[#77736B] max-w-lg mt-2">
              Every recommendation is grounded in real transaction data and bounded by deterministic policy guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: 5 Sequential Steps */}
            <div className="lg:col-span-6 space-y-3">
              {decisionSteps.map((step, idx) => {
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white border-[#5A1F28] shadow-md ring-1 ring-[#5A1F28]/20"
                        : "bg-white/50 border-[#1B1A18]/10 hover:bg-white hover:border-[#1B1A18]/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#5A1F28]">{step.num}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#FAF7F2] text-[#77736B] border border-[#1B1A18]/10">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-bold text-[#1B1A18] mt-2">
                      {step.name} — {step.title}
                    </h3>
                    <p className="text-xs text-[#77736B] mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Reactive Step Visualization */}
            <div className="lg:col-span-6 lg:sticky lg:top-28">
              <div className="rounded-2xl bg-[#121211] border border-[rgba(242,238,229,0.12)] p-6 shadow-2xl space-y-5 text-[#F2EEE5]">
                <div className="flex items-center justify-between border-b border-[rgba(242,238,229,0.08)] pb-3">
                  <span className="text-xs font-mono text-[#B69A5A] uppercase tracking-wider font-semibold">
                    ACTIVE STEP: {decisionSteps[activeStep].num} {decisionSteps[activeStep].name.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono text-[#66745D]">● Live System Synchronized</span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-serif text-[#F2EEE5]">{decisionSteps[activeStep].title}</h4>
                  <p className="text-xs text-[#A5A198] leading-relaxed">
                    {decisionSteps[activeStep].desc}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#181816] border border-[#B69A5A]/30 space-y-1">
                  <span className="text-[10px] text-[#706E68] uppercase font-mono">Live Ground Truth Telemetry</span>
                  <p className="text-xs font-mono text-[#B69A5A]">{decisionSteps[activeStep].metric}</p>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-[#706E68]">
                  <span>Step {activeStep + 1} of 5</span>
                  <div className="flex gap-1.5">
                    {decisionSteps.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveStep(i)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                          activeStep === i ? "bg-[#B69A5A] w-5" : "bg-[rgba(242,238,229,0.2)]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. SECTION 6: FOUR AGENTS STORY (Horizontal Storytelling)
         ========================================================================= */}
      <section className="bg-[#0B0B0A] text-[#F2EEE5] py-20 px-4 sm:px-6 border-b border-[rgba(242,238,229,0.08)]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#B69A5A]">
              DEEP DOMAIN CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#F2EEE5] tracking-tight">
              Four agents. Infinite scale.
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A198]">
              Click on each agent to inspect how it works autonomously while keeping you in continuous control.
            </p>
          </div>

          <div className="space-y-3">
            {agentStories.map((ag, idx) => {
              const isOpen = activeAgentStory === idx;
              const Icon = ag.icon;
              return (
                <div
                  key={ag.id}
                  onClick={() => setActiveAgentStory(idx)}
                  className={`p-6 rounded-xl border transition-all cursor-pointer ${
                    isOpen
                      ? "bg-[#151514] border-[#B69A5A]/50 shadow-xl"
                      : "bg-[#121211] border-[rgba(242,238,229,0.06)] hover:border-[rgba(242,238,229,0.16)]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs"
                        style={{ backgroundColor: `${ag.color}20`, color: ag.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-serif font-semibold text-[#F2EEE5]">{ag.name}</h3>
                        <p className="text-xs text-[#A5A198] mt-0.5">{ag.tagline}</p>
                      </div>
                    </div>
                    <span className="font-serif text-sm font-semibold text-[#B69A5A]">{ag.kpi}</span>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 mt-4 border-t border-[rgba(242,238,229,0.08)] space-y-3"
                      >
                        <p className="text-xs text-[#A5A198] leading-relaxed">{ag.desc}</p>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <span className="text-[11px] font-mono text-[#706E68]">{ag.kpiSub}</span>
                          <Link
                            href={ag.route}
                            className="text-xs font-semibold text-[#B69A5A] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Open {ag.name} dashboard</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. SECTION 7: GOVERNED AI (Dark #0B0B0A)
         ========================================================================= */}
      <section id="governance" className="bg-[#0B0B0A] text-[#F2EEE5] py-20 px-4 sm:px-6 border-b border-[rgba(242,238,229,0.08)]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B69A5A]/30 bg-[#1A1917] text-xs font-mono text-[#B69A5A]">
              <Lock className="w-3.5 h-3.5" />
              <span>FINTECH SAFETY PRINCIPLE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#F2EEE5] tracking-tight">
              Autonomous when it can.
              <br />
              Controlled when it matters.
            </h2>
            <p className="text-xs sm:text-sm text-[#A5A198] leading-relaxed">
              Unconstrained generative models have no place in financial money movement. Every agent tool call passes through deterministic policy guardrails before execution.
            </p>
          </div>

          {/* Horizontal Governed Pipeline */}
          <div className="hidden md:flex items-center justify-between p-4 rounded-xl bg-[#121211] border border-[rgba(242,238,229,0.08)] text-xs font-mono">
            <span className="px-3 py-1.5 rounded bg-[#1A1917] text-[#B69A5A] border border-[#B69A5A]/30 font-semibold">
              PREDICT
            </span>
            <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
            <span className="px-3 py-1.5 rounded bg-[#1A1917] text-[#A5A198] border border-[rgba(242,238,229,0.08)]">
              REASON
            </span>
            <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
            <span className="px-3 py-1.5 rounded bg-[#1A1917] text-[#D1B56A] border border-[#D1B56A]/30 font-semibold">
              POLICY
            </span>
            <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
            <span className="px-3 py-1.5 rounded bg-[#1A1917] text-[#9A7940] border border-[#9A7940]/30">
              APPROVAL
            </span>
            <div className="h-[1px] flex-1 bg-[rgba(242,238,229,0.10)] mx-2" />
            <span className="px-3 py-1.5 rounded bg-[#1A1917] text-[#66745D] border border-[#66745D]/30 font-semibold">
              EXECUTION
            </span>
            <div className="h-[1px] flex-1 bg-[#B69A5A]/40 mx-2" />
            <span className="px-3 py-1.5 rounded bg-[#B69A5A] text-[#0B0B0A] font-bold">
              OUTCOME
            </span>
          </div>

          {/* 4 Concrete Policy Scenarios Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#F2EEE5]">Friendly Recovery Reminder</span>
                <p className="text-[11px] text-[#706E68] mt-0.5">WhatsApp link sent after 3DS issuer drop</p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#66745D]/20 text-[#8FA383] border border-[#66745D]/40 whitespace-nowrap">
                AUTO
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#F2EEE5]">Bank-Aware Smart Retry</span>
                <p className="text-[11px] text-[#706E68] mt-0.5">Scheduled in 45m issuer reset window</p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#B69A5A]/20 text-[#D1B56A] border border-[#B69A5A]/40 whitespace-nowrap">
                POLICY CONTROLLED
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#F2EEE5]">Re-engagement Incentive &gt;10%</span>
                <p className="text-[11px] text-[#706E68] mt-0.5">Aggressive customer reactivation campaign</p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#9A7940]/20 text-[#D4AA5E] border border-[#9A7940]/40 whitespace-nowrap">
                APPROVAL REQUIRED
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[#151514] border border-[rgba(242,238,229,0.08)] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#F2EEE5]">Transaction Block &amp; Account Blacklist</span>
                <p className="text-[11px] text-[#706E68] mt-0.5">Critical fraud probability score (91.4%)</p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#713B3B]/20 text-[#D18686] border border-[#713B3B]/40 whitespace-nowrap">
                HUMAN SIGN-OFF
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. SECTION 8: TRUST & SCALE (Dark #0B0B0A)
         ========================================================================= */}
      <section className="bg-[#0B0B0A] text-[#F2EEE5] py-20 px-4 sm:px-6 border-b border-[rgba(242,238,229,0.08)]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[rgba(242,238,229,0.08)] pb-6">
            <div>
              <div className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#B69A5A] mb-1">
                TRUSTED BY BUSINESSES ACROSS INDIA
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-[#F2EEE5]">
                Powering growth at every stage.
              </h2>
            </div>
            <p className="text-xs text-[#A5A198] max-w-sm">
              From emerging brands to industry leaders, Razorpay AI helps businesses move faster, smarter and more confidently.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F2EEE5] font-normal">
                10,000+
              </div>
              <div className="text-xs text-[#A5A198]">Merchants</div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#B69A5A] font-normal">
                ₹50,000Cr+
              </div>
              <div className="text-xs text-[#A5A198]">Annual Payments Processed</div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F2EEE5] font-normal">
                99.9%
              </div>
              <div className="text-xs text-[#A5A198]">Uptime</div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F2EEE5] font-normal">
                4
              </div>
              <div className="text-xs text-[#A5A198]">AI Agents</div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-[#706E68] text-right">
            *Buildathon Demo / Illustrative telemetry for Razorpay AI Buildathon 2026.
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. SECTION 9: FINAL CALL TO ACTION (Warm Cream #F3EEE4)
         ========================================================================= */}
      <section className="bg-[#F3EEE4] py-24 px-4 sm:px-6 border-b border-[#1B1A18]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-[#5A1F28]">
              BUILT FOR A MORE PROSPEROUS TOMORROW
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#1B1A18] tracking-tight leading-[1.12]">
              Let&apos;s build
              <br />
              the next generation
              <br />
              of commerce.
            </h2>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="w-12 h-[2px] bg-[#5A1F28]" />
            <p className="text-sm text-[#55524B] leading-relaxed max-w-md">
              Join the Razorpay AI early access program and be part of the future of merchant intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <Link
                href="/command-center"
                className="px-6 py-3.5 rounded-md bg-[#5A1F28] hover:bg-[#732733] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer group"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#D1B56A]" />
                <span>Enter Command Center</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="px-6 py-3.5 rounded-md border border-[#1B1A18]/20 bg-white/70 hover:bg-white text-[#1B1A18] text-xs font-medium transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5A1F28]" />
                <span>Get early access</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. MINIMAL PREMIUM FOOTER (Light Cream #FAF7F2)
         ========================================================================= */}
      <footer className="bg-[#FAF7F2] py-12 px-4 sm:px-6 text-xs text-[#77736B]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#1B1A18]/10 pb-8">
            {/* Left Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded bg-[#5A1F28] flex items-center justify-center text-white text-xs font-serif font-bold">
                R
              </div>
              <span className="font-serif font-bold text-base text-[#1B1A18]">Razorpay AI</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-[#77736B]">
              <a href="#agents" className="hover:text-[#1B1A18] transition-colors">Product</a>
              <a href="#agents" className="hover:text-[#1B1A18] transition-colors">AI Agents</a>
              <a href="#story" className="hover:text-[#1B1A18] transition-colors">Use Cases</a>
              <Link href="/command-center" className="hover:text-[#1B1A18] transition-colors">Developers</Link>
              <a href="#governance" className="hover:text-[#1B1A18] transition-colors">Resources</a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-[#77736B]">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1B1A18]" aria-label="LinkedIn">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8Z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1B1A18]" aria-label="X">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1B1A18]" aria-label="YouTube">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-[#77736B]">
            <div>© 2026 Razorpay. All rights reserved. • Razorpay AI Buildathon 2026</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#1B1A18]">Privacy</a>
              <a href="#" className="hover:text-[#1B1A18]">Terms</a>
              <a href="#" className="hover:text-[#1B1A18]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
