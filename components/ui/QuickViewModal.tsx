"use client";

import { useState, useEffect } from "react";
import { Product, ProductColor } from "@/lib/products/schema";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useToastStore } from "@/lib/store/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrencyStore } from "@/lib/store/currencyStore";

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
            {/* Close Trigger */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer"
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
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative ${
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
                        className={`w-10 h-10 text-xs font-bold border transition-all cursor-pointer relative ${
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
            <div className="pt-6 border-t border-border-subtle/30 mt-6">
              {isOutOfStock(activeColor.name, selectedSize) ? (
                <div className="space-y-3">
                  <button
                    disabled
                    className="w-full bg-border-subtle/50 text-chrome/40 py-4 text-xs font-bold uppercase tracking-[0.2em] cursor-not-allowed border border-border-subtle/20"
                  >
                    OUT OF STOCK
                  </button>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="EMAIL FOR RESTOCK ALERT..."
                      value={restockEmail}
                      onChange={(e) => setRestockEmail(e.target.value)}
                      className="flex-1 bg-bg-surface border border-border-subtle p-2 text-xs outline-none focus:border-accent text-text-primary uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleRestockSubmit}
                      className="bg-bg-primary hover:bg-bg-surface border border-border-subtle hover:border-accent text-chrome hover:text-text-primary px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      SUBMIT
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-accent text-white hover:bg-accent-hover py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg cursor-pointer"
                >
                  ADD TO ARCHIVES
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
