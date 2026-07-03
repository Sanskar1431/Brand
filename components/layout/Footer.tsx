"use client";

import Link from "next/link";
import { useToastStore } from "@/lib/store/toastStore";
import { useState } from "react";

export default function Footer() {
  const { addToast } = useToastStore();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addToast(`SUBSCRIBED TO COLLECTION UPDATES`, "success");
      setEmail("");
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
              <Link href="/shop" className="hover:text-accent transition-colors">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/shop/tshirt" className="hover:text-accent transition-colors">
                Signature Tees
              </Link>
            </li>
            <li>
              <Link href="/shop/jogger" className="hover:text-accent transition-colors">
                Premium Joggers
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
              <Link href="/about" className="hover:text-accent transition-colors">
                About / Brand Story
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-accent transition-colors">
                My Profile / Orders
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-accent transition-colors">
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
          <form
            onSubmit={handleSubscribe}
            className="flex items-center gap-2 border-b border-chrome/30 py-2 focus-within:border-accent transition-colors"
          >
            <input
              type="email"
              placeholder="ENTER EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-text-primary placeholder:text-chrome/50 tracking-wider uppercase"
              required
            />
            <button
              type="submit"
              className="text-chrome hover:text-accent transition-colors text-xs uppercase font-bold tracking-widest cursor-pointer"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>

      {/* Bottom info */}
      <div className="max-w-[1600px] mx-auto mt-20 pt-8 border-t border-border-subtle/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-muted tracking-wider uppercase">
        <p>© {new Date().getFullYear()} PRINCE E-COMMERCE. ALL RIGHTS RESERVED.</p>
        <p>Rule Without Speaking. Crafted by Antigravity.</p>
      </div>
    </footer>
  );
}
