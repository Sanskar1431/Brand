"use client";

import Link from "next/link";
import { useToastStore } from "@/lib/store/toastStore";
import { useState, useEffect } from "react";

export default function Footer() {
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");
  const [selectedNewsletterTier, setSelectedNewsletterTier] = useState("VAULT DROPS ONLY");
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({
    london: "--:--",
    newyork: "--:--",
    tokyo: "--:--",
    mumbai: "--:--",
  });

  useEffect(() => {
    const updateTimes = () => {
      const getTzTime = (tz: string) => {
        try {
          return new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date());
        } catch {
          return "--:--";
        }
      };

      setCurrentTimes({
        london: getTzTime("Europe/London"),
        newyork: getTzTime("America/New_York"),
        tokyo: getTzTime("Asia/Tokyo"),
        mumbai: getTzTime("Asia/Kolkata"),
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addToast(`SUBSCRIBED TO ${selectedNewsletterTier} PROTOCOL`, "success");
      setEmail("");
    }
  };

  const handleCopyCertificate = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const certHash = "SHA256:7F4A98E2-PRNC-AUTHENTIC-ARCHIVE-VAULT";
      navigator.clipboard.writeText(certHash);
      addToast(`ATELIER AUTHENTICITY CERTIFICATE COPIED: ${certHash}`, "success");
    }
  };
  return (
    <footer className="bg-bg-primary border-t border-border-subtle py-20 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-display text-xl tracking-[0.2em] font-semibold text-text-primary uppercase">
            PRINCE
          </span>
          <p className="text-text-muted text-sm max-w-xs leading-relaxed">
            Rule Without Speaking. Fine cinematic streetwear built with heavyweight structure and architectural discipline.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-text-primary font-bold">
            Catalog
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>
              <Link href="/shop" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/shop/tshirt" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                Signature Tees
              </Link>
            </li>
            <li>
              <Link href="/shop/jogger" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                Premium Joggers
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                Saved Wishlist
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-text-primary font-bold">
            Company
          </h4>
          <ul className="flex flex-col gap-2 text-sm text-text-muted">
            <li>
              <Link href="/about" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                About / Brand Story
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                My Profile / Orders
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                Contact Concierge
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-accent transition-colors outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -ml-1">
                Support & FAQ
              </Link>
            </li>
            <li>
              <span className="text-xs text-text-muted">
                Terms / Privacy
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs uppercase tracking-[0.2em] text-text-primary font-bold">
            Newsletter
          </h4>
          <p className="text-text-muted text-sm leading-relaxed">
            Subscribe to unlock private collection updates.
          </p>

          {/* Newsletter Dispatch Preference Tiers */}
          <div className="space-y-1.5">
            <span className="text-[8px] font-mono text-chrome/60 uppercase tracking-widest block">
              SELECT DISPATCH FREQUENCY:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["VAULT DROPS ONLY", "LOOKBOOKS", "ALL RELEASES"].map((tier) => {
                const isSelected = selectedNewsletterTier === tier;
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedNewsletterTier(tier)}
                    className={`px-2 py-0.5 text-[8px] font-mono tracking-wider uppercase border transition-all cursor-pointer outline-none ${
                      isSelected
                        ? "border-accent bg-accent/15 text-accent font-bold"
                        : "border-border-subtle/50 text-chrome/60 hover:border-chrome hover:text-text-primary bg-bg-surface/50"
                    } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubscribe}
            className="flex items-center gap-2 border-b border-chrome/30 py-2 focus-within:border-accent focus-within:shadow-[0_4px_12px_rgba(212,163,89,0.15)] transition-all duration-300"
          >
            <input
              type="email"
              placeholder="ENTER EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-text-primary placeholder:text-chrome/50 tracking-wider uppercase font-mono"
              required
            />
            <button
              type="submit"
              className="text-chrome hover:text-accent transition-colors text-xs uppercase font-bold tracking-widest cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] px-2 py-0.5 rounded"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      {/* Global Atelier Clocks & Authentication Seal Bar */}
      <div className="max-w-[1600px] mx-auto mt-14 pt-6 border-t border-border-subtle/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-left">
        {/* Atelier Live Time Clocks */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-[9px] font-mono tracking-wider uppercase">
          <span className="text-accent font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            GLOBAL ATELIER CLOCKS:
          </span>
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 text-chrome">
            <div>
              <span className="text-chrome/50 block text-[7.5px]">LONDON GMT</span>
              <span className="text-text-primary font-bold">{currentTimes.london}</span>
            </div>
            <div>
              <span className="text-chrome/50 block text-[7.5px]">NEW YORK EST</span>
              <span className="text-text-primary font-bold">{currentTimes.newyork}</span>
            </div>
            <div>
              <span className="text-chrome/50 block text-[7.5px]">TOKYO JST</span>
              <span className="text-text-primary font-bold">{currentTimes.tokyo}</span>
            </div>
            <div>
              <span className="text-chrome/50 block text-[7.5px]">MUMBAI IST</span>
              <span className="text-text-primary font-bold">{currentTimes.mumbai}</span>
            </div>
          </div>
        </div>

        {/* Cryptographic Atelier Authentication Seal */}
        <button
          type="button"
          onClick={handleCopyCertificate}
          className="p-2 border border-border-subtle/40 bg-bg-surface/40 hover:border-accent text-left transition-all cursor-pointer flex items-center gap-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] group"
        >
          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono text-accent uppercase font-bold tracking-widest">
              CRYPTOGRAPHIC ARCHIVE SEAL
            </span>
            <span className="text-[9px] font-mono text-chrome group-hover:text-text-primary transition-colors">
              SHA256 // 7F4A-98E2-PRNC-VAULT
            </span>
          </div>
          <span className="text-[9px] font-mono text-accent uppercase font-bold opacity-75 group-hover:opacity-100">
            COPY ⎘
          </span>
        </button>
      </div>

      {/* Bottom info */}
      <div className="max-w-[1600px] mx-auto mt-8 pt-6 border-t border-border-subtle/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted tracking-wider uppercase">
        <p>© {new Date().getFullYear()} PRINCE E-COMMERCE. ALL RIGHTS RESERVED.</p>
        <p>Rule Without Speaking. Crafted by Antigravity.</p>
      </div>
    </footer>
  );
}
