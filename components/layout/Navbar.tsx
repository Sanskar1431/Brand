"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/uiStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  // Call master ambient sound generation hook (Section 5.1.2)
  useAmbientAudio();
  
  const { setOpenCart, isAudioPlaying, toggleAudio, isMenuOpen, setOpenMenu } = useUIStore();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  
  const [hasBg, setHasBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasBg(true);
      } else {
        setHasBg(false);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          hasBg
            ? "bg-bg-surface/85 backdrop-blur-md border-b border-border-subtle py-2"
            : "bg-transparent border-b border-transparent py-3"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2" onClick={() => setOpenMenu(false)}>
            <span className="font-display text-2xl tracking-[0.2em] font-semibold text-text-primary uppercase transition-colors group-hover:text-accent duration-300">
              Prince
            </span>
          </Link>

          {/* Desktop Nav Links (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className="relative text-sm uppercase tracking-wider text-chrome hover:text-text-primary transition-colors py-2 group"
            >
              Shop
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
            <Link
              href="/shop/tshirt"
              className="relative text-sm uppercase tracking-wider text-chrome hover:text-text-primary transition-colors py-2 group"
            >
              T-Shirts
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
            <Link
              href="/shop/jogger"
              className="relative text-sm uppercase tracking-wider text-chrome hover:text-text-primary transition-colors py-2 group"
            >
              Joggers
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="relative text-sm uppercase tracking-wider text-chrome hover:text-text-primary transition-colors py-2 group"
            >
              About
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
            <Link
              href="/contact"
              className="relative text-sm uppercase tracking-wider text-chrome hover:text-text-primary transition-colors py-2 group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Soundtrack waveform toggler (Section 5.1.2) */}
            <button
              onClick={toggleAudio}
              className="flex items-end gap-[3px] h-6 cursor-pointer"
              aria-label={isAudioPlaying ? "Mute soundtrack" : "Play soundtrack"}
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={
                    isAudioPlaying
                      ? {
                          height: [
                            "8px",
                            i % 2 === 0 ? "20px" : "14px",
                            i % 3 === 0 ? "10px" : "18px",
                            "8px",
                          ],
                        }
                      : { height: ["8px", "10px", "8px"] }
                  }
                  transition={{
                    duration: isAudioPlaying ? 0.8 + i * 0.15 : 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`w-[3px] rounded-full bg-accent`}
                />
              ))}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setOpenCart(true)}
              className="relative p-2 text-chrome hover:text-text-primary transition-colors cursor-pointer"
              aria-label={`Open Cart, ${cartItemsCount} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold font-sans"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Burger Toggle */}
            <button
              onClick={() => setOpenMenu(!isMenuOpen)}
              className="md:hidden p-2 text-chrome hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Toggle Navigation Options"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Panel Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-bg-surface z-30 pt-28 px-6 flex flex-col justify-start gap-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-left">
              <Link
                href="/shop"
                onClick={() => setOpenMenu(false)}
                className="font-display text-2xl tracking-[0.15em] uppercase text-text-primary hover:text-accent transition-colors"
              >
                Shop All
              </Link>
              <Link
                href="/shop/tshirt"
                onClick={() => setOpenMenu(false)}
                className="font-display text-2xl tracking-[0.15em] uppercase text-text-primary hover:text-accent transition-colors"
              >
                Signature Tees
              </Link>
              <Link
                href="/shop/jogger"
                onClick={() => setOpenMenu(false)}
                className="font-display text-2xl tracking-[0.15em] uppercase text-text-primary hover:text-accent transition-colors"
              >
                Premium Joggers
              </Link>
              <Link
                href="/about"
                onClick={() => setOpenMenu(false)}
                className="font-display text-2xl tracking-[0.15em] uppercase text-text-primary hover:text-accent transition-colors"
              >
                About Story
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpenMenu(false)}
                className="font-display text-2xl tracking-[0.15em] uppercase text-text-primary hover:text-accent transition-colors"
              >
                Contact Concierge
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
