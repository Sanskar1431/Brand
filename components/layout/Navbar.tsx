"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/lib/store/uiStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useAmbientAudio } from "@/hooks/useAmbientAudio";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useRouter } from "next/navigation";
import { useCurrencyStore } from "@/lib/store/currencyStore";
import { useToastStore } from "@/lib/store/toastStore";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  // Call master ambient sound generation hook (Section 5.1.2)
  useAmbientAudio();
  
  const { setOpenCart, isAudioPlaying, toggleAudio, isMenuOpen, setOpenMenu } = useUIStore();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;
  const { currency, setCurrency } = useCurrencyStore();
  const { addToast } = useToastStore();
  const router = useRouter();
  
  const [hasBg, setHasBg] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const popularSearches = ["TEE", "JOGGER", "HEAVYWEIGHT", "RAW", "FRENCH TERRY"];

  const handlePopularSearchClick = (term: string) => {
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchQuery("");
  };

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
        className={`fixed left-0 w-full z-40 transition-all duration-300 ${
          hasBg
            ? "top-0 bg-bg-surface/85 backdrop-blur-md border-b border-border-subtle py-2"
            : "top-9 bg-transparent border-b border-transparent py-3"
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

            {/* Currency Switcher */}
            <button
              onClick={() => {
                const nextCurrency = currency === "INR" ? "USD" : "INR";
                setCurrency(nextCurrency);
                addToast(`CONVERTING COLLECTION VALUE METRICS TO ${nextCurrency}`, "success");
              }}
              className="px-2 py-1 text-[9px] font-bold font-mono tracking-widest border border-border-subtle/30 hover:border-accent text-chrome hover:text-accent transition-colors cursor-pointer mr-1"
              aria-label={`Toggle currency, currently ${currency}`}
            >
              {currency}
            </button>

            {/* Search Toggle Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-chrome hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Search Catalog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z"
                />
              </svg>
            </button>

            {/* Wishlist Link Button */}
            <Link
              href="/wishlist"
              className="relative p-2 text-chrome hover:text-text-primary transition-colors"
              aria-label={`View Wishlist, ${wishlistCount} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-sans">
                  {wishlistCount}
                </span>
              )}
            </Link>

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

      {/* Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex flex-col justify-start pt-32 px-6 md:px-12"
          >
            <div className="max-w-2xl mx-auto w-full relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute -top-16 right-0 text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer"
                aria-label="Close search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    setIsSearchOpen(false);
                    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery("");
                  }
                }}
                className="w-full flex items-center border-b border-border-subtle py-4"
              >
                <input
                  type="text"
                  placeholder="SEARCH ARCHIVES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xl sm:text-2xl tracking-[0.1em] text-text-primary placeholder:text-chrome/30 outline-none uppercase font-semibold font-display"
                />
                <button
                  type="submit"
                  className="text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer"
                  aria-label="Submit search"
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
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </form>
              <div className="mt-4 text-left">
                <span className="text-[10px] text-accent tracking-[0.25em] font-bold uppercase">
                  Press Enter to search the collection
                </span>
              </div>
              <div className="mt-8 text-left space-y-3">
                <span className="text-[10px] text-chrome/55 tracking-[0.2em] font-bold uppercase block">
                  Popular Searches:
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearchClick(term)}
                      className="text-[10px] tracking-wider uppercase font-mono border border-border-subtle/50 px-3 py-1.5 hover:border-accent hover:text-accent transition-all cursor-pointer bg-bg-surface/30"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
