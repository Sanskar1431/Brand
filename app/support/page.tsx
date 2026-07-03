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
        className="w-full flex justify-between items-center text-sm uppercase tracking-[0.2em] font-semibold text-text-primary py-2 text-left cursor-pointer"
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

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary pt-32 pb-24 px-6 md:px-12 select-none relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="max-w-[800px] mx-auto space-y-12 z-10 relative text-left">
        {/* Header */}
        <div className="border-b border-border-subtle/30 pb-6">
          <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
            CLIENT SERVICES
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest uppercase font-semibold">
            SUPPORT & FAQ
          </h1>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.title}
              content={faq.content}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
