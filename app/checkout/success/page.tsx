"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("PRNC-940182");
  const [conciergeNotes, setConciergeNotes] = useState("");

  useEffect(() => {
    const id = searchParams.get("orderId");
    if (id) {
      setOrderId(id);
    } else {
      const randomId = "PRNC-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(randomId);
    }
    const nt = searchParams.get("notes");
    if (nt) {
      setConciergeNotes(decodeURIComponent(nt));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen w-full bg-bg-primary flex flex-col items-center justify-center p-6 text-center select-none relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
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
          {conciergeNotes && (
            <p className="text-[9px] text-accent tracking-[0.2em] font-mono font-bold uppercase flex items-center justify-center gap-1.5 mt-2 animate-pulse">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="w-3 h-3 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0V10.5m-2.25 10.5h13.5c.621 0 1.125-.504 1.125-1.125v-8.25c0-.621-.504-1.125-1.125-1.125H5.25c-.621 0-1.125.504-1.125 1.125v8.25c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
              <span>✓ CONCIERGE PROTOCOL SECURELY ATTACHED</span>
            </p>
          )}
        </div>

        {conciergeNotes && (
          <div className="border border-border-subtle/50 p-4 bg-bg-surface/20 space-y-2 text-left max-w-sm mx-auto select-none relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/30 animate-pulse" />
            <div className="flex items-center gap-2 border-b border-border-subtle/30 pb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-3.5 h-3.5 text-accent"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
              <span className="text-[8px] text-accent tracking-widest font-mono font-bold block uppercase">
                CONCIERGE SPECIAL INSTRUCTIONS CACHED
              </span>
            </div>
            <p className="text-[10px] text-chrome font-mono uppercase tracking-wider leading-relaxed pt-1">
              "{conciergeNotes}"
            </p>
          </div>
        )}

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
