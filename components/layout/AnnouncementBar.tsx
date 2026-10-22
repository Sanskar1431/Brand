"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrencyStore } from "@/lib/store/currencyStore";
import { useToastStore } from "@/lib/store/toastStore";
import Link from "next/link";

export default function AnnouncementBar() {
  const { currency, setCurrency, formatPrice } = useCurrencyStore();
  const { addToast } = useToastStore();

  const announcements = [
    {
      text: `COMPLIMENTARY AIR DISPATCH OVER ${formatPrice(1500000)} // WORLDWIDE COURIER ACTIVE`,
      link: "/shop",
    },
    {
      text: "PRINCE TIER 01 ARCHIVES PUBLIC // OVERSIZED ARCHITECTURAL SILHOUETTES",
      link: "/shop",
    },
    {
      text: "CONCIERGE HOTLINE STANDBY // VIP DESK 24/7 ACTIVE PROTOCOL",
      link: "/support",
    },
  ];

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Live Dispatch Cutoff Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigits = (n: number) => n.toString().padStart(2, "0");

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

  if (isDismissed) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsDismissed(false);
          addToast("ANNOUNCEMENT PROTOCOL RESTORED", "info");
        }}
        className="fixed top-1 left-4 z-50 bg-accent text-white text-[8px] font-mono font-bold px-2 py-0.5 shadow-md hover:bg-accent-hover transition-colors rounded-sm uppercase tracking-wider outline-none focus:ring-1 focus:ring-white"
        title="Show Announcements"
      >
        ✦ ALERTS ▼
      </button>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-0 left-0 w-full bg-accent text-white h-9 flex items-center justify-between px-3 sm:px-6 select-none z-50 overflow-hidden shadow-sm"
    >
      {/* Left: Dispatch Cutoff & Currency Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-[8px] font-mono text-white/90 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>SAME-DAY DISPATCH:</span>
          <span className="font-bold tabular-nums">
            {formatDigits(timeLeft.hours)}:{formatDigits(timeLeft.minutes)}:{formatDigits(timeLeft.seconds)}
          </span>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-0.5 bg-black/20 border border-white/20 px-1.5 py-0.5 rounded-sm">
          <button
            type="button"
            onClick={() => {
              if (currency !== "INR") {
                setCurrency("INR");
                addToast("GLOBAL CURRENCY SWITCHED: INR (₹)", "success");
              }
            }}
            className={`text-[8px] font-mono font-bold px-1 rounded transition-colors cursor-pointer outline-none ${
              currency === "INR" ? "bg-white text-accent shadow-xs" : "text-white/70 hover:text-white"
            }`}
          >
            ₹ INR
          </button>
          <span className="text-[7px] text-white/30">|</span>
          <button
            type="button"
            onClick={() => {
              if (currency !== "USD") {
                setCurrency("USD");
                addToast("GLOBAL CURRENCY SWITCHED: USD ($)", "success");
              }
            }}
            className={`text-[8px] font-mono font-bold px-1 rounded transition-colors cursor-pointer outline-none ${
              currency === "USD" ? "bg-white text-accent shadow-xs" : "text-white/70 hover:text-white"
            }`}
          >
            $ USD
          </button>
        </div>
      </div>

      {/* Middle: Carousel Announcer */}
      <div className="flex-1 flex items-center justify-center overflow-hidden px-2 max-w-[70%] sm:max-w-[60%]">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer outline-none focus:text-white focus:ring-1 focus:ring-white/40 rounded text-xs hidden md:block"
        >
          ‹
        </button>

        <div className="flex-1 overflow-hidden px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-[8px] sm:text-[9.5px] font-bold tracking-[0.18em] sm:tracking-[0.25em] font-mono text-center uppercase truncate"
            >
              <Link
                href={announcements[index].link}
                className="hover:underline hover:text-white/90 transition-colors inline-block"
              >
                {announcements[index].text}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer outline-none focus:text-white focus:ring-1 focus:ring-white/40 rounded text-xs hidden md:block"
        >
          ›
        </button>
      </div>

      {/* Right: Dismiss & Link */}
      <div className="flex items-center gap-2">
        <Link
          href="/support"
          className="text-[8px] font-mono text-white/80 hover:text-white tracking-widest uppercase hidden sm:block hover:underline"
        >
          VIP CONCIERGE
        </Link>
        <button
          type="button"
          onClick={() => {
            setIsDismissed(true);
            addToast("ANNOUNCEMENT BAR MINIMIZED", "info");
          }}
          className="text-white/60 hover:text-white text-[10px] p-1 cursor-pointer outline-none transition-colors"
          title="Minimize bar"
          aria-label="Minimize bar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
