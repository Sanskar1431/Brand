"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementBar() {
  const announcements = [
    "FREE EXPRESS SHIPPING OVER ₹15,000 // WORLDWIDE CONCIERGE DISPATCH ACTIVE",
    "PRINCE TIER 01 ARCHIVES NOW PUBLIC // ARCHITECTURAL SILHOUETTES ONLY",
    "CONCIERGE SUPPORT STANDBY // CONNECT WITH THE KINGDOM",
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length, isPaused]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-0 left-0 w-full bg-accent text-white h-9 flex items-center justify-between px-4 sm:px-8 select-none z-50 overflow-hidden"
    >
      <button
        onClick={handlePrev}
        aria-label="Previous announcement"
        className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer outline-none focus:text-white focus:ring-1 focus:ring-white/40 focus:shadow-[0_0_8px_rgba(255,255,255,0.3)] rounded text-xs hidden sm:block"
      >
        ‹
      </button>

      <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[8.5px] sm:text-[10px] font-bold tracking-[0.2em] sm:tracking-[0.25em] font-mono text-center uppercase truncate"
          >
            {announcements[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={handleNext}
        aria-label="Next announcement"
        className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer outline-none focus:text-white focus:ring-1 focus:ring-white/40 focus:shadow-[0_0_8px_rgba(255,255,255,0.3)] rounded text-xs hidden sm:block"
      >
        ›
      </button>
    </div>
  );
}
