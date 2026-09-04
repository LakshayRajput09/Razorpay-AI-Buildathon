import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export function Hero() {
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
    }, 60);
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

  // Clean up any reset timer on unmount
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
    setEmail(""); // clear input so the confirmation placeholder is displayed
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
    <section className="relative flex-1 flex flex-col items-center justify-center px-6">
      <div className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center justify-center w-full gap-12">
        <div>
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-white/80 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase mb-4"
          >
            BUILD A NO-CODE AI APP IN MINUTES
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Instrument Serif', serif" }}
            className="text-4xl md:text-[64px] font-medium tracking-[-0.01em] leading-[1.1] mb-6 bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent max-w-4xl mx-auto"
          >
            A new way to think and create <br className="hidden md:block" /> with computers
          </motion.h1>
        </div>

        {/* CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="min-h-[50px] mt-2 flex flex-col items-center justify-center gap-6"
        >
          <AnimatePresence mode="wait">
            {!formOpen ? (
              <motion.button
                key="cta-button"
                type="button"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setFormOpen(true)}
                className="px-10 py-3 text-[14px] font-medium border border-white/10 rounded-full hover:border-white/30 hover:bg-white/[0.02] transition-all duration-300 text-white/90 backdrop-blur-sm cursor-pointer"
              >
                Get early access
              </motion.button>
            ) : (
              <motion.form
                key="cta-form"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="flex items-center gap-2 pl-5 pr-1.5 py-1.5 text-[14px] font-medium border border-white/20 rounded-full bg-white/[0.02] backdrop-blur-sm w-full max-w-[320px] focus-within:border-white/40 transition-colors duration-300"
              >
                <input
                  type="email"
                  autoFocus
                  disabled={isSubmitted}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  className="bg-transparent text-white placeholder-white/45 outline-none flex-1 text-xs md:text-sm font-sans tracking-normal selection:bg-white selection:text-black"
                />

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer disabled:opacity-80 shrink-0"
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

          {/* Secondary "Play Video Demo" Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a
              href="#demo"
              className="text-white/80 hover:text-white/40 transition-colors duration-300 text-[13px] font-medium tracking-wide cursor-pointer"
            >
              Play Video Demo
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

