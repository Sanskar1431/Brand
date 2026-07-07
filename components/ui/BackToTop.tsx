"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // SVG radius details
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 w-11 h-11 bg-bg-surface border border-border-subtle rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:border-accent text-chrome hover:text-accent transition-colors"
          aria-label="Scroll back to top"
        >
          {/* Circular Progress Path */}
          <svg className="w-10 h-10 rotate-[-90deg] absolute inset-0.5">
            <circle
              cx="20"
              cy="20"
              r={radius}
              className="stroke-border-subtle/20 fill-none"
              strokeWidth="1.5"
            />
            <motion.circle
              cx="20"
              cy="20"
              r={radius}
              className="stroke-accent fill-none"
              strokeWidth="1.5"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </svg>
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-4 h-4 z-10"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
