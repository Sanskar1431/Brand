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

  // Urgent Ticket Protocol State
  const [ticketPriority, setTicketPriority] = useState<"STANDARD" | "URGENT" | "VIP SOVEREIGN">("URGENT");
  const [ticketTopic, setTicketTopic] = useState("ORDER DISPATCH TRACKING");
  const [ticketClientRef, setTicketClientRef] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<{ code: string; estTime: string } | null>(null);
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);

  // Order Logistics Radar State
  const [trackingInput, setTrackingInput] = useState("PRNC-940182");
  const [isQueryingTracking, setIsQueryingTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<{
    orderId: string;
    status: string;
    route: string;
    courier: string;
    seal: string;
    estDelivery: string;
    weight: string;
    step: number;
  } | null>({
    orderId: "PRNC-940182",
    status: "DELIVERED",
    route: "BOM (MUMBAI) → LHR (LONDON HEATHROW)",
    courier: "INSURED WHITE-GLOVE AIR EXPRESS",
    seal: "TAMPER-EVIDENT ARCHIVE SEAL #8812",
    estDelivery: "DELIVERED TO CLIENT MANOR",
    weight: "1.42 KG BESPOKE HARD-SHELL VAULT",
    step: 4,
  });

  // Authenticity Verifier State
  const [authSerialInput, setAuthSerialInput] = useState("PRNC-AUTH-7721-VIP");
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(false);
  const [authCertificate, setAuthCertificate] = useState<{
    serial: string;
    weaveBatch: string;
    tailorDesk: string;
    hash: string;
    verifiedDate: string;
  } | null>({
    serial: "PRNC-AUTH-7721-VIP",
    weaveBatch: "SERIES 01 // 240 GSM COMBED HEAVYWEIGHT JERSEY",
    tailorDesk: "ATELIER DESK NO. 4 // LONDON MAYFAIR",
    hash: "SHA256: 7F4A-98E2-PRNC-VAULT-AUTHENTIC",
    verifiedDate: "OCT 2026",
  });

  const handleLookupTracking = (orderCode?: string) => {
    const code = (orderCode || trackingInput).trim().toUpperCase();
    if (!code) {
      addToast("PLEASE ENTER AN ORDER IDENTIFIER", "error");
      return;
    }
    setTrackingInput(code);
    setIsQueryingTracking(true);
    setTimeout(() => {
      setIsQueryingTracking(false);
      const isDelivered = code.includes("940") || code.includes("DELIVERED");
      const isInTransit = code.includes("930") || code.includes("TRANSIT");
      setTrackingResult({
        orderId: code,
        status: isDelivered ? "DELIVERED" : isInTransit ? "IN TRANSIT (AIR)" : "VAULT PACKAGING",
        route: isDelivered ? "BOM (MUMBAI) → LHR (LONDON HEATHROW)" : isInTransit ? "BLR (BENGALURU) → JFK (NEW YORK)" : "APAC ATELIER HUB (MUMBAI)",
        courier: "INSURED WHITE-GLOVE AIR EXPRESS",
        seal: `TAMPER-EVIDENT ARCHIVE SEAL #${Math.floor(1000 + Math.random() * 9000)}`,
        estDelivery: isDelivered ? "DELIVERED TO CLIENT MANOR" : isInTransit ? "IN TRANSIT // ARRIVING IN 2 DAYS" : "SCHEDULED FOR AIR FREIGHT TOMORROW",
        weight: "1.42 KG BESPOKE HARD-SHELL VAULT",
        step: isDelivered ? 4 : isInTransit ? 3 : 2,
      });
      addToast(`CARRIER LOGISTICS RECORD RETRIEVED: ${code}`, "success");
    }, 1000);
  };

  const handleVerifyAuthenticity = (serialCode?: string) => {
    const code = (serialCode || authSerialInput).trim().toUpperCase();
    if (!code) {
      addToast("PLEASE ENTER GARMENT SERIAL TAG", "error");
      return;
    }
    setAuthSerialInput(code);
    setIsVerifyingAuth(true);
    setTimeout(() => {
      setIsVerifyingAuth(false);
      setAuthCertificate({
        serial: code,
        weaveBatch: "SERIES 01 // 240 GSM COMBED HEAVYWEIGHT JERSEY",
        tailorDesk: "ATELIER DESK NO. 4 // LONDON MAYFAIR",
        hash: `SHA256: ${code.replace(/[^A-Z0-9]/g, "").slice(0, 8)}-VERIFIED-GENUINE`,
        verifiedDate: "OCT 2026",
      });
      addToast(`CRYPTOGRAPHIC AUTHENTICITY CONFIRMED: ${code}`, "success");
    }, 1100);
  };

  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingTicket(true);
    setTimeout(() => {
      setIsGeneratingTicket(false);
      const pfx = ticketPriority === "VIP SOVEREIGN" ? "SOV" : ticketPriority.slice(0, 3);
      const randomCode = `TCK-${pfx}-${Math.floor(1000 + Math.random() * 9000)}`;
      const estTime = ticketPriority === "VIP SOVEREIGN" ? "8 MINS" : ticketPriority === "URGENT" ? "24 MINS" : "90 MINS";
      setGeneratedTicket({ code: randomCode, estTime });
      addToast(`PRIORITY TICKET DISPATCHED: ${randomCode}`, "success");
    }, 1200);
  };

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

        {/* Live Logistics Radar & Courier Chronicler */}
        <div className="mt-8 p-6 bg-bg-surface/40 border border-border-subtle/50 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle/30 pb-4 gap-2">
            <div>
              <span className="text-[9px] text-accent tracking-[0.25em] font-mono font-bold block uppercase">
                DISPATCH &amp; TRANSIT TELEMETRY
              </span>
              <h3 className="font-display text-lg tracking-[0.15em] font-semibold uppercase text-text-primary mt-0.5">
                LIVE LOGISTICS RADAR
              </h3>
            </div>
            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest border border-emerald-500/30 px-2.5 py-1 self-start sm:self-auto bg-emerald-500/10 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GLOBAL CARRIER API ACTIVE
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookupTracking();
            }}
            className="space-y-4"
          >
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[9px] font-mono text-chrome tracking-widest uppercase">
                  ENTER ARCHIVE ORDER ID / AIR WAYBILL
                </label>
                <span className="text-[8px] font-mono text-chrome/50 uppercase tracking-wider">
                  SECURE VAULT COURIER
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                  placeholder="E.G. PRNC-940182"
                  className="flex-1 bg-bg-surface border border-border-subtle focus:border-accent px-4 py-2.5 outline-none text-xs text-text-primary font-mono tracking-widest uppercase rounded-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                />
                <button
                  type="submit"
                  disabled={isQueryingTracking}
                  className="bg-accent hover:bg-accent-hover text-bg-primary font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 transition-all cursor-pointer whitespace-nowrap outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                >
                  {isQueryingTracking ? "SCANNING SATELLITE RADAR..." : "LOCATE AIR CARGO ↗"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[8px] font-mono text-chrome uppercase tracking-wider">
                SAMPLE WAYBILLS:
              </span>
              {[
                { code: "PRNC-940182", tag: "DELIVERED" },
                { code: "PRNC-930571", tag: "AIR TRANSIT" },
                { code: "PRNC-992144", tag: "VAULT PACKAGING" },
              ].map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => handleLookupTracking(sample.code)}
                  className="text-[8px] font-mono border border-border-subtle hover:border-accent px-2 py-1 bg-bg-primary/50 text-text-muted hover:text-accent transition-colors uppercase cursor-pointer"
                >
                  {sample.code} [{sample.tag}]
                </button>
              ))}
            </div>
          </form>

          {trackingResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-bg-primary/80 border border-border-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle/40 pb-3">
                <div>
                  <span className="text-[8px] font-mono text-chrome uppercase tracking-widest block">
                    WAYBILL IDENTIFIER
                  </span>
                  <span className="text-base font-mono font-bold text-accent tracking-[0.2em] block">
                    {trackingResult.orderId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1 border ${
                      trackingResult.status.includes("DELIVERED")
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : trackingResult.status.includes("TRANSIT")
                        ? "bg-accent/10 text-accent border-accent/40"
                        : "bg-chrome/10 text-chrome border-chrome/30"
                    }`}
                  >
                    STATUS: {trackingResult.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(trackingResult.orderId);
                        addToast(`WAYBILL COPIED: ${trackingResult.orderId}`, "success");
                      }
                    }}
                    className="px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest border border-border-subtle hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer"
                  >
                    COPY ⎘
                  </button>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-[8px] font-mono text-chrome uppercase tracking-widest">
                  <span>DISPATCH STAGES</span>
                  <span>STAGE 0{trackingResult.step} OF 04</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    "VAULT PACKAGING",
                    "CUSTOMS CLEARANCE",
                    "AIR TRANSIT",
                    "CLIENT DELIVERY",
                  ].map((stepName, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = trackingResult.step >= stepNum;
                    const isCurrent = trackingResult.step === stepNum;
                    return (
                      <div key={stepName} className="space-y-1">
                        <div
                          className={`h-1.5 w-full transition-all duration-300 ${
                            isCompleted
                              ? "bg-accent"
                              : "bg-border-subtle/40"
                          }`}
                        />
                        <span
                          className={`text-[7px] font-mono uppercase tracking-tight block truncate ${
                            isCurrent
                              ? "text-accent font-bold"
                              : isCompleted
                              ? "text-text-primary"
                              : "text-chrome/50"
                          }`}
                        >
                          {stepNum}. {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 border-t border-border-subtle/30">
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">FLIGHT ROUTING</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary uppercase mt-0.5 block">{trackingResult.route}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">COURIER PROTOCOL</span>
                  <span className="text-[10px] font-mono font-bold text-accent uppercase mt-0.5 block">{trackingResult.courier}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">SECURITY SEAL</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary uppercase mt-0.5 block">{trackingResult.seal}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">ESTIMATED ARRIVAL / STATUS</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase mt-0.5 block">{trackingResult.estDelivery}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Cryptographic Authenticity Certificate Validator */}
        <div className="mt-8 p-6 bg-bg-surface/40 border border-border-subtle/50 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle/30 pb-4 gap-2">
            <div>
              <span className="text-[9px] text-accent tracking-[0.25em] font-mono font-bold block uppercase">
                AUTHENTICITY CERTIFICATE REGISTRY
              </span>
              <h3 className="font-display text-lg tracking-[0.15em] font-semibold uppercase text-text-primary mt-0.5">
                GARMENT PROVENANCE VALIDATOR
              </h3>
            </div>
            <span className="text-[8px] font-mono text-accent uppercase tracking-widest border border-accent/40 px-2.5 py-1 self-start sm:self-auto bg-accent/10">
              SHA-256 DIGITAL ATELIER SEAL
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyAuthenticity();
            }}
            className="space-y-4"
          >
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[9px] font-mono text-chrome tracking-widest uppercase">
                  ENTER NFC TAG / EMBEDDED SERIAL HASH
                </label>
                <span className="text-[8px] font-mono text-chrome/50 uppercase tracking-wider">
                  FOUND ON INTERIOR CARE LABEL
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={authSerialInput}
                  onChange={(e) => setAuthSerialInput(e.target.value.toUpperCase())}
                  placeholder="E.G. PRNC-AUTH-7721-VIP"
                  className="flex-1 bg-bg-surface border border-border-subtle focus:border-accent px-4 py-2.5 outline-none text-xs text-text-primary font-mono tracking-widest uppercase rounded-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                />
                <button
                  type="submit"
                  disabled={isVerifyingAuth}
                  className="bg-accent hover:bg-accent-hover text-bg-primary font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 transition-all cursor-pointer whitespace-nowrap outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                >
                  {isVerifyingAuth ? "VERIFYING ATELIER CIPHER..." : "VERIFY PIECE ↗"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[8px] font-mono text-chrome uppercase tracking-wider">
                SAMPLE TAGS:
              </span>
              {[
                { serial: "PRNC-AUTH-7721-VIP", label: "SOVEREIGN TEE" },
                { serial: "PRNC-AUTH-5540-HOOD", label: "FRENCH TERRY" },
                { serial: "PRNC-AUTH-9081-CAP", label: "METRIC CAP" },
              ].map((sample) => (
                <button
                  key={sample.serial}
                  type="button"
                  onClick={() => handleVerifyAuthenticity(sample.serial)}
                  className="text-[8px] font-mono border border-border-subtle hover:border-accent px-2 py-1 bg-bg-primary/50 text-text-muted hover:text-accent transition-colors uppercase cursor-pointer"
                >
                  {sample.serial} [{sample.label}]
                </button>
              ))}
            </div>
          </form>

          {authCertificate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-accent/5 border-2 border-accent/40 space-y-4 relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 opacity-5 font-display text-8xl font-black text-accent pointer-events-none select-none">
                PRINCE
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-accent/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-accent flex items-center justify-center text-accent text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-accent uppercase tracking-widest block font-bold">
                      OFFICIAL ATELIER AUTHENTICATION RECORD
                    </span>
                    <span className="text-sm font-mono font-bold text-text-primary tracking-widest block">
                      {authCertificate.serial}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(authCertificate.hash);
                      addToast(`CERTIFICATE HASH COPIED: ${authCertificate.hash}`, "success");
                    }
                  }}
                  className="px-3 py-1 bg-accent/20 text-accent hover:bg-accent hover:text-bg-primary text-[8px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer border border-accent/40"
                >
                  COPY CRYPTO SEAL ⎘
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">TEXTILE ARCHITECTURE &amp; WEAVE</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary uppercase mt-0.5 block">{authCertificate.weaveBatch}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">MASTER ATELIER DESK</span>
                  <span className="text-[10px] font-mono font-bold text-accent uppercase mt-0.5 block">{authCertificate.tailorDesk}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[8px] font-mono text-chrome block uppercase">CRYPTOGRAPHIC SHA-256 SEAL</span>
                  <span className="text-[9px] font-mono text-text-muted break-all uppercase mt-0.5 block bg-bg-surface/60 p-1.5 border border-border-subtle/50">
                    {authCertificate.hash}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Priority Concierge Urgent Ticket Protocol */}
        <div className="mt-8 p-6 bg-bg-surface/40 border border-border-subtle/50 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-subtle/30 pb-4 gap-2">
            <div>
              <span className="text-[9px] text-accent tracking-[0.25em] font-mono font-bold block uppercase">
                RAPID PROTOCOL QUEUE
              </span>
              <h3 className="font-display text-lg tracking-[0.15em] font-semibold uppercase text-text-primary mt-0.5">
                EXPRESS CONCIERGE TICKET DISPATCH
              </h3>
            </div>
            <span className="text-[8px] font-mono text-chrome/60 uppercase tracking-widest border border-border-subtle/40 px-2.5 py-1 self-start sm:self-auto bg-bg-primary/40">
              AVERAGE TRIAGE: &lt; 15 MINS
            </span>
          </div>

          {generatedTicket ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-accent/10 border border-accent/40 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-accent/30 pb-3">
                <div>
                  <span className="text-[8px] font-mono text-accent uppercase tracking-widest block font-bold">
                    ACTIVE TICKET IDENTIFIER
                  </span>
                  <span className="text-lg font-mono font-bold text-accent tracking-[0.2em] mt-0.5 block">
                    {generatedTicket.code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(generatedTicket.code);
                        addToast(`TICKET HASH COPIED: ${generatedTicket.code}`, "success");
                      }
                    }}
                    className="px-3.5 py-1.5 bg-accent text-bg-primary hover:bg-accent-hover text-[9px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
                  >
                    COPY TICKET HASH ⎘
                  </button>
                  <button
                    type="button"
                    onClick={() => setGeneratedTicket(null)}
                    className="px-3 py-1.5 border border-accent/40 text-accent hover:border-accent text-[9px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                  >
                    NEW TICKET
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">PRIORITY LEVEL</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary uppercase mt-0.5 block">{ticketPriority}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">TOPIC CATEGORY</span>
                  <span className="text-[10px] font-mono font-bold text-text-primary uppercase mt-0.5 block">{ticketTopic}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono text-chrome block uppercase">EST. FIRST RESPONSE</span>
                  <span className="text-[10px] font-mono font-bold text-accent uppercase mt-0.5 block">&lt; {generatedTicket.estTime}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleGenerateTicket} className="space-y-4">
              {/* Priority Chips */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                  01. SELECT TRIAGE PRIORITY
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "STANDARD" as const, est: "< 90 MINS" },
                    { id: "URGENT" as const, est: "< 24 MINS" },
                    { id: "VIP SOVEREIGN" as const, est: "< 8 MINS" },
                  ].map((lvl) => {
                    const isSelected = ticketPriority === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setTicketPriority(lvl.id)}
                        className={`p-2 text-left border transition-all cursor-pointer outline-none flex flex-col justify-between ${
                          isSelected
                            ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(212,163,89,0.15)] ring-1 ring-accent/30"
                            : "border-border-subtle/50 bg-bg-primary/40 text-chrome hover:border-accent/60 hover:text-text-primary"
                        } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                      >
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider ${isSelected ? "text-accent" : "text-text-primary"}`}>
                          {lvl.id}
                        </span>
                        <span className="text-[7.5px] font-mono text-chrome/50 uppercase mt-0.5">
                          {lvl.est}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Inquiry Topic Chips */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                  02. INQUIRY TOPIC
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "ORDER DISPATCH TRACKING",
                    "GARMENT SPECIFICATIONS",
                    "BESPOKE SIZING ADVISORY",
                    "CUSTOM MONOGRAM INQUIRY",
                  ].map((topic) => {
                    const isSelected = ticketTopic === topic;
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setTicketTopic(topic)}
                        className={`p-2 text-left border text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer outline-none ${
                          isSelected
                            ? "border-accent bg-accent/15 text-accent ring-1 ring-accent/30"
                            : "border-border-subtle/50 bg-bg-primary/40 text-chrome hover:border-accent/60 hover:text-text-primary"
                        } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                      >
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Client Ref & Submit Trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                <div className="sm:col-span-8">
                  <input
                    type="text"
                    required
                    placeholder="ENTER ORDER ID (E.G. PRNC-940182) OR VIP EMAIL..."
                    value={ticketClientRef}
                    onChange={(e) => setTicketClientRef(e.target.value.toUpperCase())}
                    className="w-full bg-bg-primary border border-border-subtle p-2.5 text-[10px] font-mono uppercase outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] text-text-primary"
                  />
                </div>
                <div className="sm:col-span-4">
                  <button
                    type="submit"
                    disabled={isGeneratingTicket}
                    className="w-full h-full min-h-[38px] bg-accent hover:bg-accent-hover text-bg-primary text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)] flex items-center justify-center"
                  >
                    {isGeneratingTicket ? (
                      <span className="animate-pulse">DISPATCHING...</span>
                    ) : (
                      <span>DISPATCH TICKET →</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Direct Concierge Gateway Card & Instant Action Trays */}
        <div className="mt-8 p-6 bg-bg-surface border border-border-subtle space-y-6">
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
