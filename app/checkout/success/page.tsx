"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("PRNC-940182");

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    } else {
      // Generate a random one if not supplied
      const randomId = "PRNC-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(randomId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full bg-bg-primary flex flex-col items-center justify-center p-6 text-center select-none relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md mx-auto text-center space-y-8 py-16 z-10"
      >
        <div className="w-16 h-16 bg-accent/10 border border-accent rounded-full flex items-center justify-center mx-auto text-accent shadow-lg shadow-accent/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        <div className="space-y-3">
          <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase block">
            ORDER AUTHORIZED
          </span>
          <h1 className="font-display text-4xl tracking-widest font-semibold uppercase">
            THANK YOU
          </h1>
          <p className="text-chrome/75 text-sm leading-relaxed tracking-wide max-w-sm mx-auto font-sans uppercase">
            Your transaction has been finalized. Order Reference: <span className="font-mono font-bold text-accent select-all">{orderId}</span>
          </p>
        </div>

        <div className="w-12 h-[1px] bg-border-subtle mx-auto" />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/profile"
            className="px-8 py-4 bg-accent text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15"
          >
            TRACK ORDER
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 bg-transparent text-text-primary border border-border-subtle hover:border-text-primary text-xs font-bold uppercase tracking-[0.2em] transition-colors"
          >
            CONTINUE SHOP
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
