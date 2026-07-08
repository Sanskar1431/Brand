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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 inset-x-6 md:left-auto md:right-6 md:max-w-md bg-bg-surface border border-border-subtle p-5 z-[9999] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 select-none"
        >
          <div className="space-y-1.5 text-left">
            <span className="text-[9px] text-accent tracking-[0.2em] font-bold uppercase block">
              ARCHIVE GATEWAY COOKIES
            </span>
            <p className="text-[10px] text-chrome leading-relaxed uppercase tracking-wider font-mono">
              We utilize cookies to actuate fit recommendations, cache checkout forms, and compile cart details.
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto whitespace-nowrap bg-accent hover:bg-accent-hover text-white text-[9px] font-bold uppercase tracking-[0.15em] px-4 py-2.5 transition-colors cursor-pointer shadow-md"
          >
            ACCEPT GATEWAY
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
