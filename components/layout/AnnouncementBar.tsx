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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="fixed top-0 left-0 w-full bg-accent text-white h-9 flex items-center justify-center overflow-hidden px-4 select-none z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] font-mono text-center uppercase"
        >
          {announcements[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
