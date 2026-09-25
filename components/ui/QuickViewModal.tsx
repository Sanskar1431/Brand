"use client";

import { useState, useEffect } from "react";
import { Product, ProductColor } from "@/lib/products/schema";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useToastStore } from "@/lib/store/toastStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrencyStore } from "@/lib/store/currencyStore";
import Link from "next/link";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCartStore();
  const { setOpenCart } = useUIStore();
  const { addToast } = useToastStore();
  const { formatPrice } = useCurrencyStore();
  const isWishlisted = useWishlistStore((state) =>
    product ? state.items.some((item) => item.id === product.id) : false
  );
  const { addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      const savedRec = localStorage.getItem("prince-fit-size");
      if (savedRec) {
        setSelectedSize(savedRec as any);
        setRecommendedSize(savedRec);
      }
    }
  }, [isOpen]);

  // Initialize selected color when modal opens
  const activeColor = selectedColor || (product ? product.colors[0] : null);

  const [restockEmail, setRestockEmail] = useState("");

  const isOutOfStock = (colorName: string, sz: string) => {
    if (!product) return false;
    const key = `${colorName}-${sz}`;
    return product.stock && product.stock[key] === 0;
  };

  const handleRestockSubmit = () => {
    if (!activeColor) return;
    if (!restockEmail.trim() || !restockEmail.includes("@")) {
      addToast("PLEASE ENTER A VALID EMAIL ADDRESS", "error");
      return;
    }
    if (restockEmail.length > 50) {
      addToast("EMAIL EXCEEDS MAXIMUM DURATION LENGTH (50)", "error");
      return;
    }
    addToast(`RESTOCK PROMPT CACHED FOR ${activeColor.name} / ${selectedSize}`, "success");
    setRestockEmail("");
  };

  const handleAddToCart = () => {
    if (!product || !activeColor) return;
    addItem(product, activeColor.name, selectedSize, 1);
    addToast(`${product.name} ADDED TO CART`, "success");
    onClose();
    setOpenCart(true);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast(`${product.name} REMOVED FROM WISHLIST`, "info");
    } else {
      addToWishlist(product);
      addToast(`${product.name} ADDED TO WISHLIST ARCHIVES`, "success");
    }
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      const url = `${window.location.origin}/product/${product.slug}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        addToast("PRODUCT SPECIFICATION LINK COPIED", "success");
      } else {
        addToast(`DIRECT LINK: ${url}`, "info");
      }
    } catch {
      addToast("FAILED TO COPY LINK", "error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product && activeColor && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 bottom-4 top-20 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-bg-surface border border-border-subtle z-50 p-6 md:p-8 flex flex-col justify-between overflow-y-auto select-none"
          >
            {/* Header Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <button
                onClick={handleShare}
                className="text-chrome hover:text-accent transition-colors p-2 cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-full"
                aria-label="Share product link"
                title="Share link"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 cursor-pointer outline-none transition-colors rounded-full focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                  isWishlisted ? "text-accent" : "text-chrome hover:text-accent"
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={isWishlisted ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-full"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Info Layout */}
            <div className="space-y-6 text-left">
              <div>
                <span className="text-[10px] text-accent tracking-[0.25em] font-bold uppercase block">
                  QUICK ARCHIVE VIEW
                </span>
                <h3 className="font-display text-2xl tracking-wider font-semibold uppercase text-text-primary mt-1">
                  {product.name}
                </h3>
                <p className="font-sans text-lg font-bold text-text-primary mt-2 tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </div>

              <p className="text-xs text-chrome leading-relaxed font-sans border-t border-border-subtle/30 pt-4">
                {product.description}
              </p>

              {/* Colorways */}
              <div className="space-y-2">
                <label className="text-[9px] text-chrome tracking-[0.15em] font-bold uppercase block">
                  Colorway: {activeColor.name}
                </label>
                <div className="flex gap-2.5">
                  {product.colors.map((colorway) => (
                    <button
                      key={colorway.name}
                      onClick={() => setSelectedColor(colorway)}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                        activeColor.name === colorway.name
                          ? "scale-105 border-accent border-2"
                          : "border-white/10 hover:scale-105"
                      }`}
                      style={{ backgroundColor: colorway.hex }}
                      title={colorway.name}
                    >
                      {activeColor.name === colorway.name && (
                        <span className="absolute inset-0.5 rounded-full border border-white/50" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <label className="text-[9px] text-accent tracking-[0.15em] font-bold uppercase block">
                  Select Size {recommendedSize && `(Fit profile: ${recommendedSize})`}
                </label>
                <div className="flex gap-2.5">
                  {product.sizes.map((s) => {
                    const oos = isOutOfStock(activeColor.name, s);
                    return (
                      <button
                        key={s}
                        disabled={oos}
                        onClick={() => !oos && setSelectedSize(s as any)}
                        className={`w-10 h-10 text-xs font-bold border transition-all cursor-pointer relative outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                          oos
                            ? "border-border-subtle/30 text-chrome/30 line-through cursor-not-allowed bg-bg-surface/20"
                            : selectedSize === s
                            ? "bg-accent border-accent text-white shadow-md shadow-accent/10"
                            : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA action */}
            <div className="pt-6 border-t border-border-subtle/30 mt-6 space-y-3">
              {isOutOfStock(activeColor.name, selectedSize) ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      disabled
                      className="flex-1 bg-border-subtle/50 text-chrome/40 py-4 text-xs font-bold uppercase tracking-[0.2em] cursor-not-allowed border border-border-subtle/20"
                    >
                      OUT OF STOCK
                    </button>
                    <button
                      onClick={handleToggleWishlist}
                      className={`px-4 border transition-all cursor-pointer outline-none flex items-center justify-center focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                        isWishlisted
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-subtle bg-bg-primary hover:border-accent text-chrome hover:text-text-primary"
                      }`}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isWishlisted ? "currentColor" : "none"}
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
                    </button>
                  </div>
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[9px] text-accent tracking-[0.25em] font-mono font-bold uppercase">
                      RESTOCK REQUEST
                    </span>
                    <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                      restockEmail.length >= 40 ? "text-error font-bold" : "text-chrome/50"
                    }`}>
                      {restockEmail.length} / 50 CHARS
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="EMAIL FOR RESTOCK ALERT..."
                      value={restockEmail}
                      onChange={(e) => setRestockEmail(e.target.value.slice(0, 50))}
                      maxLength={50}
                      className="flex-1 bg-bg-surface border border-border-subtle p-2 text-xs outline-none focus:border-accent text-text-primary uppercase font-mono focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                    />
                    <button
                      type="button"
                      onClick={handleRestockSubmit}
                      className="bg-bg-primary hover:bg-bg-surface border border-border-subtle hover:border-accent text-chrome hover:text-text-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-accent text-white hover:bg-accent-hover py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
                  >
                    ADD TO ARCHIVES
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`px-4 border transition-all cursor-pointer outline-none flex items-center justify-center focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                      isWishlisted
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-subtle bg-bg-primary hover:border-accent text-chrome hover:text-text-primary"
                    }`}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isWishlisted ? "currentColor" : "none"}
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
                  </button>
                </div>
              )}
              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="w-full block text-center bg-bg-primary hover:bg-bg-surface border border-border-subtle hover:border-accent text-chrome hover:text-text-primary py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
              >
                VIEW FULL SPECIFICATIONS →
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
