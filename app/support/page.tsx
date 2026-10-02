"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useToastStore } from "@/lib/store/toastStore";

interface AccordionItemProps {
  id: string;
  title: string;
  category: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ id, title, category, content, isOpen, onToggle }: AccordionItemProps) {
  return (
    <div className="border border-border-subtle/40 bg-bg-surface/30 p-4 transition-colors hover:border-border-subtle">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold text-text-primary text-left cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="text-[9px] font-mono text-accent font-bold tracking-widest">{category}</span>
          <span>{title}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-chrome text-xs ml-2"
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
            <div className="pt-4 border-t border-border-subtle/20 mt-3">
              <p className="text-xs sm:text-sm text-chrome/85 leading-relaxed font-sans whitespace-pre-line tracking-wide uppercase">
                {content}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SupportPage() {
  const [openIds, setOpenIds] = useState<string[]>(["sizing"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const { addToast } = useToastStore();

  const faqs = [
    {
      id: "sizing",
      category: "SIZING & SPECS",
      title: "01. Sizing & Cut Metrics",
      content: `Our garments feature custom heavyweight specs: 280GSM for combed cotton tees and 450GSM for French terry hoodies.
      
      SILHOUETTE: Boxy, architectural drape with dropped shoulders.
      PRE-SHRUNK: All items undergo double-wash treatment to prevent shrinking.
      RECOMMENDATION: Choose your normal size for the intended oversized look, or size down for a more standard fit.`,
    },
    {
      id: "shipping",
      category: "SHIPPING",
      title: "02. Shipping & Dispatch Metrics",
      content: `TRANSIT TIMES: Express delivery within 3–5 business days globally.
      CARRIER: Premium carbon-neutral couriers (DHL Express / FedEx).
      DUTIES: All custom import duties are prepaid on delivery.
      DISPATCH: Orders leave our central warehouse within 24 hours of payment authorization.`,
    },
    {
      id: "returns",
      category: "RETURNS",
      title: "03. Return & Exchange Policy",
      content: `EXCHANGES: Valid within 14 days of delivery.
      RETURNS: To initiate a private return, contact our support concierge. Items must be unworn and in original structural packaging with tags attached.
      REFUNDS: Credited back to your payment origin within 5–7 business days of archive inspection.`,
    },
    {
      id: "care",
      category: "CARE PROTOCOL",
      title: "04. Care & Maintenance Protocol",
      content: `WASHING: Machine wash cold, inside out with similar dark colors.
      DRYING: Line dry in shade to protect fibers. Do not tumble dry.
      IRONING: Warm iron inside out only. Never iron prints directly.`,
    },
  ];

  const categories = ["ALL", "SIZING & SPECS", "SHIPPING", "RETURNS", "CARE PROTOCOL"];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "ALL" || faq.category === activeCategory;
    const matchesSearch =
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (openIds.length === filteredFaqs.length) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqs.map((f) => f.id));
    }
  };

  const handleCopyHotline = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("+1-800-840-7762");
      addToast("CONCIERGE HOTLINE COPIED: +1 (800) 840-PRNC", "success");
    }
  };

  const handleCopyEmail = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("concierge@prince-archive.com");
      addToast("CONCIERGE EMAIL PROTOCOL COPIED", "success");
    }
  };

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
            SUPPORT &amp; FAQ
          </h1>
        </div>

        {/* Search Input Box */}
        <div className="space-y-2">
          <div className="flex justify-between items-center select-none">
            <span className="text-[9px] text-accent tracking-[0.25em] font-mono font-bold uppercase">
              FAQ ARCHIVE SEARCH
            </span>
            <span
              className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                searchQuery.length >= 22 ? "text-error font-bold" : "text-chrome/50"
              }`}
            >
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
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome hover:text-text-primary text-[10px] font-bold uppercase transition-colors cursor-pointer p-1 outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-full"
                title="CLEAR SEARCH"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips & Expand All Controls */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    activeCategory === cat
                      ? "bg-accent text-white border-accent shadow-sm"
                      : "bg-bg-surface hover:bg-bg-primary text-chrome hover:text-accent border-border-subtle hover:border-accent outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredFaqs.length > 0 && (
              <button
                type="button"
                onClick={handleToggleAll}
                className="px-3 py-1.5 bg-bg-surface hover:bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent text-[9px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
              >
                {openIds.length === filteredFaqs.length ? "COLLAPSE ALL" : "EXPAND ALL"}
              </button>
            )}
          </div>

          {(searchQuery.trim() || activeCategory !== "ALL") && (
            <div className="flex items-center justify-between py-1 select-none">
              <span className="text-[9px] text-accent font-mono font-bold tracking-widest uppercase">
                FOUND {filteredFaqs.length} {filteredFaqs.length === 1 ? "ARTICLE" : "ARTICLES"} IN FILTERED QUEUE
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="text-[9px] text-chrome hover:text-accent font-mono uppercase underline cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
            </div>
          )}
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                id={faq.id}
                title={faq.title}
                category={faq.category}
                content={faq.content}
                isOpen={openIds.includes(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            ))
          ) : (
            <div className="py-12 text-center border border-dashed border-border-subtle/30 flex flex-col items-center justify-center space-y-4">
              <p className="text-xs text-chrome/50 font-mono tracking-widest uppercase">
                NO MATCHING FAQ ARTICLES FOUND IN PROTOCOL QUEUES
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("ALL");
                }}
                className="bg-accent text-white hover:bg-accent-hover px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
              >
                RESET FILTERS &amp; SEARCH
              </button>
            </div>
          )}
        </div>

        {/* Direct Concierge Gateway Card & Instant Action Trays */}
        <div className="mt-12 p-6 bg-bg-surface border border-border-subtle space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <span className="text-[9px] text-accent tracking-[0.2em] font-mono font-bold block uppercase">
                NEED BESPOKE ASSISTANCE?
              </span>
              <p className="text-xs text-chrome font-sans uppercase tracking-wider">
                Our concierge team is available 24/7 for tailored inquiries, custom orders, and archive guidance.
              </p>
            </div>
            <Link
              href="/contact"
              className="whitespace-nowrap bg-accent text-white hover:bg-accent-hover px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
            >
              CONTACT CONCIERGE →
            </Link>
          </div>

          <div className="border-t border-border-subtle/30 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopyHotline}
              className="p-3 bg-bg-primary/40 hover:bg-bg-primary border border-border-subtle/60 hover:border-accent text-left transition-all cursor-pointer flex items-center justify-between outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] group"
            >
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">VIP CLIENT HOTLINE</span>
                <span className="text-[10px] font-mono font-bold text-text-primary group-hover:text-accent transition-colors">
                  +1 (800) 840-PRNC
                </span>
              </div>
              <span className="text-[9px] font-mono text-accent uppercase font-bold opacity-80 group-hover:opacity-100">
                COPY ⎘
              </span>
            </button>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-3 bg-bg-primary/40 hover:bg-bg-primary border border-border-subtle/60 hover:border-accent text-left transition-all cursor-pointer flex items-center justify-between outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] group"
            >
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">SECURE INQUIRY EMAIL</span>
                <span className="text-[10px] font-mono font-bold text-text-primary group-hover:text-accent transition-colors">
                  concierge@prince-archive.com
                </span>
              </div>
              <span className="text-[9px] font-mono text-accent uppercase font-bold opacity-80 group-hover:opacity-100">
                COPY ⎘
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
