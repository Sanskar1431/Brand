"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("prince-cookie-consent");
    if (!consent) {
      // Delay display slightly for high-end look
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("prince-cookie-consent", "approved");
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("prince-cookie-consent", "essential");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 inset-x-6 md:left-auto md:right-6 md:max-w-lg bg-bg-surface border border-border-subtle p-5 z-[9999] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
        >
          <div className="space-y-1.5 text-left">
            <span className="text-[9px] text-accent tracking-[0.2em] font-bold uppercase block">
              ARCHIVE GATEWAY COOKIES
            </span>
            <p className="text-[10px] text-chrome leading-relaxed uppercase tracking-wider font-mono">
              We utilize cookies to actuate fit recommendations, cache checkout forms, and compile cart details.
            </p>
          </div>
          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none whitespace-nowrap bg-accent hover:bg-accent-hover text-white text-[9px] font-bold uppercase tracking-[0.15em] px-4 py-2.5 transition-colors cursor-pointer shadow-md outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_12px_rgba(212,163,89,0.25)]"
            >
              ACCEPT GATEWAY
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 sm:flex-none whitespace-nowrap bg-bg-primary hover:bg-bg-surface text-chrome hover:text-text-primary border border-border-subtle hover:border-accent text-[9px] font-bold uppercase tracking-[0.15em] px-4 py-2.5 transition-colors cursor-pointer outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
            >
              ESSENTIAL ONLY
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
