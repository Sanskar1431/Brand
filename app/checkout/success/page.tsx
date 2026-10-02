"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useToastStore } from "@/lib/store/toastStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("PRNC-940182");
  const [conciergeNotes, setConciergeNotes] = useState("");
  const [isDispatchingReceipt, setIsDispatchingReceipt] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  const { addToast } = useToastStore();

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

  const handleCopyOrderId = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(orderId);
      addToast(`ORDER REFERENCE COPIED: ${orderId}`, "success");
    }
  };

  const handleDispatchReceipt = () => {
    setIsDispatchingReceipt(true);
    addToast("GENERATING ENCRYPTED PDF RECEIPT PROTOCOL...", "info");
    setTimeout(() => {
      setIsDispatchingReceipt(false);
      setReceiptSent(true);
      addToast("DIGITAL RECEIPT & INVOICE DISPATCHED TO CLIENT INBOX", "success");
    }, 1200);
  };

  const fulfillmentSteps = [
    { step: "01", label: "PAYMENT AUTHORIZED", status: "completed" },
    { step: "02", label: "VAULT PACKAGING", status: "current" },
    { step: "03", label: "AIR EXPRESS TRANSIT", status: "upcoming" },
    { step: "04", label: "SIGNATURE DELIVERY", status: "upcoming" },
  ];

  return (
    <div className="min-h-screen w-full bg-bg-primary flex flex-col items-center justify-center p-6 text-center select-none relative pt-24 pb-20">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="max-w-xl mx-auto text-center space-y-8 py-8 z-10 w-full"
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
            ORDER AUTHORIZED &amp; LOCKED
          </span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-widest font-semibold uppercase">
            TRANSACTION CONFIRMED
          </h1>
          <p className="text-chrome/75 text-xs sm:text-sm leading-relaxed tracking-wide max-w-md mx-auto font-sans uppercase">
            Your high-fashion acquisition has been finalized. Reference:{" "}
            <span className="font-mono font-bold text-accent select-all">{orderId}</span>
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

        {/* Concierge Cached Notes Banner */}
        {conciergeNotes && (
          <div className="border border-border-subtle/50 p-4 bg-bg-surface/20 space-y-2 text-left max-w-md mx-auto select-none relative overflow-hidden group">
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

        {/* Real-Time Fulfillment Pipeline */}
        <div className="border border-border-subtle bg-bg-surface/50 p-5 max-w-lg mx-auto text-left space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
            <span className="text-[9px] text-accent font-mono font-bold tracking-[0.2em] uppercase">
              FULFILLMENT PROTOCOL PIPELINE
            </span>
            <span className="text-[9px] text-chrome font-mono tracking-wider uppercase">
              EST. DISPATCH: 24-48 HRS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            {fulfillmentSteps.map((s, idx) => (
              <div
                key={idx}
                className={`p-2.5 border transition-all ${
                  s.status === "completed"
                    ? "border-accent/40 bg-accent/5 text-accent"
                    : s.status === "current"
                    ? "border-accent bg-bg-surface text-text-primary shadow-[0_0_10px_rgba(212,163,89,0.15)]"
                    : "border-border-subtle/30 bg-bg-primary/30 text-chrome/40"
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-[8px] font-mono font-bold opacity-60">{s.step}</span>
                  {s.status === "completed" && <span className="text-[8px]">✓</span>}
                  {s.status === "current" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  )}
                </div>
                <p className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase leading-tight font-mono">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Utility Controls */}
        <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="py-3 px-4 bg-bg-surface hover:bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9 9 9 0 0 0-9 9v2.25m16.5 0h.008v.008h-.008v-.008Zm0 0H18"
              />
            </svg>
            <span>COPY ORDER REF</span>
          </button>

          <button
            type="button"
            disabled={isDispatchingReceipt}
            onClick={handleDispatchReceipt}
            className="py-3 px-4 bg-bg-surface hover:bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] disabled:opacity-50"
          >
            {isDispatchingReceipt ? (
              <span className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            )}
            <span>{receiptSent ? "✓ RECEIPT DISPATCHED" : "DISPATCH DIGITAL RECEIPT"}</span>
          </button>
        </div>

        <div className="w-12 h-[1px] bg-border-subtle mx-auto" />

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <Link
            href="/profile"
            className="flex-1 px-8 py-4 bg-accent text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15 outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)] text-center"
          >
            TRACK IN CLIENT ARCHIVE
          </Link>
          <Link
            href="/shop"
            className="flex-1 px-8 py-4 bg-transparent text-text-primary border border-border-subtle hover:border-text-primary text-xs font-bold uppercase tracking-[0.2em] transition-colors outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] text-center"
          >
            CONTINUE SHOPPING
          </Link>
        </div>

        {/* Category Discovery Gateways */}
        <div className="pt-4 border-t border-border-subtle/30 max-w-lg mx-auto">
          <span className="text-[8px] text-chrome/60 font-mono tracking-widest uppercase block mb-3">
            EXPLORE COMPLEMENTARY ARCHIVES
          </span>
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/shop/tshirt"
              className="p-2.5 bg-bg-surface hover:bg-bg-primary border border-border-subtle/50 hover:border-accent text-center text-chrome hover:text-accent text-[9px] font-bold uppercase tracking-wider transition-all outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
            >
              T-SHIRTS →
            </Link>
            <Link
              href="/shop/jogger"
              className="p-2.5 bg-bg-surface hover:bg-bg-primary border border-border-subtle/50 hover:border-accent text-center text-chrome hover:text-accent text-[9px] font-bold uppercase tracking-wider transition-all outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
            >
              JOGGERS →
            </Link>
            <Link
              href="/wishlist"
              className="p-2.5 bg-bg-surface hover:bg-bg-primary border border-border-subtle/50 hover:border-accent text-center text-chrome hover:text-accent text-[9px] font-bold uppercase tracking-wider transition-all outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
            >
              WISHLIST →
            </Link>
          </div>
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

