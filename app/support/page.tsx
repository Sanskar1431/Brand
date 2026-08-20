"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ title, content, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border-b border-border-subtle/30 py-4">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-sm uppercase tracking-[0.2em] font-semibold text-text-primary py-2 text-left cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
      >
        <span>{title}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-chrome text-xs"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="py-4 text-xs sm:text-sm text-chrome/85 leading-relaxed font-sans whitespace-pre-line tracking-wide uppercase">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      title: "01. Sizing & Cut Metrics",
      content: `Our garments feature custom heavyweight specs: 280GSM for combed cotton tees and 450GSM for French terry hoodies.
      
      SILHOUETTE: Boxy, architectural drape with dropped shoulders.
      PRE-SHRUNK: All items undergo double-wash treatment to prevent shrinking.
      RECOMMENDATION: Choose your normal size for the intended oversized look, or size down for a more standard fit.`,
    },
    {
      title: "02. Shipping & Dispatch Metrics",
      content: `TRANSIT TIMES: Express delivery within 3–5 business days globally.
      CARRIER: Premium carbon-neutral couriers (DHL Express / FedEx).
      DUTIES: All custom import duties are prepaid on delivery.
      DISPATCH: Orders leave our central warehouse within 24 hours of payment authorization.`,
    },
    {
      title: "03. Return & Exchange Policy",
      content: `EXCHANGES: Valid within 14 days of delivery.
      RETURNS: To initiate a private return, contact our support concierge. Items must be unworn and in original structural packaging with tags attached.
      REFUNDS: Credited back to your payment origin within 5–7 business days of archive inspection.`,
    },
    {
      title: "04. Care & Maintenance Protocol",
      content: `WASHING: Machine wash cold, inside out with similar dark colors.
      DRYING: Line dry in shade to protect fibers. Do not tumble dry.
      IRONING: Warm iron inside out only. Never iron prints directly.`,
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary pt-32 pb-24 px-6 md:px-12 select-none relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="max-w-[800px] mx-auto space-y-8 z-10 relative text-left">
        {/* Header */}
        <div className="border-b border-border-subtle/30 pb-6">
          <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
            CLIENT SERVICES
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest uppercase font-semibold">
            SUPPORT & FAQ
          </h1>
        </div>

        {/* Search Input Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center select-none">
            <span className="text-[9px] text-accent tracking-[0.25em] font-mono font-bold uppercase">
              FAQ ARCHIVE SEARCH
            </span>
            <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
              searchQuery.length >= 22 ? "text-error font-bold" : "text-chrome/50"
            }`}>
              {searchQuery.length} / 30 CHARS
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="SEARCH FAQ ARCHIVES (E.G. SIZING, REFUNDS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.slice(0, 30))}
              maxLength={30}
              className="w-full bg-bg-surface border border-border-subtle focus:border-accent px-4 py-3 outline-none text-[10px] sm:text-xs text-text-primary transition-all uppercase font-mono tracking-widest pr-10 rounded-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome hover:text-text-primary text-[10px] font-bold uppercase transition-colors cursor-pointer p-1 outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-full"
                title="CLEAR SEARCH"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {searchQuery.trim() && (
          <div className="flex items-center justify-between py-1 select-none">
            <span className="text-[9px] text-accent font-mono font-bold tracking-widest uppercase">
              FOUND {filteredFaqs.length} MATCHING {filteredFaqs.length === 1 ? "ARTICLE" : "ARTICLES"}
            </span>
          </div>
        )}

        {/* FAQ Accordions */}
        <div className="space-y-2 pt-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <AccordionItem
                key={index}
                title={faq.title}
                content={faq.content}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))
          ) : (
            <p className="text-xs text-chrome/50 font-mono tracking-widest uppercase py-8 text-center border border-dashed border-border-subtle/30">
              NO MATCHING FAQ ARTICLES FOUND IN PROTOCOL QUEUES
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
