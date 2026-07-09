"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/lib/store/toastStore";

export default function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { addToast } = useToastStore();

  useEffect(() => {
    const isSubscribed = localStorage.getItem("prince-newsletter-subscribed");
    if (!isSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); // 5-second delay (Section 7.1 feedback)
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem("prince-newsletter-subscribed", "true");
      addToast("WELCOME TO THE PRINCE ARCHIVE SYNDICATE", "success");
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-[999] backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[25%] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-md bg-bg-surface border border-border-subtle z-[1000] p-6 md:p-8 text-left shadow-2xl flex flex-col justify-between select-none"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-[10px] text-accent tracking-[0.3em] font-bold uppercase block">
                  SYNDICATE ACCESS
                </span>
                <h3 className="font-display text-2xl tracking-[0.15em] font-semibold uppercase text-text-primary mt-1">
                  JOIN THE PRINCE INDEX
                </h3>
                <p className="text-xs text-chrome leading-relaxed font-mono uppercase tracking-wider">
                  Subscribe to receive notifications when new signature archive batches drop and gain access to private member tiers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-border-subtle/30">
                <div className="space-y-1.5">
                  <label className="text-[9px] text-chrome tracking-wider uppercase block">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL..."
                    className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent-hover text-white py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg shadow-accent/20 cursor-pointer"
                >
                  SECURE ACCESS
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
