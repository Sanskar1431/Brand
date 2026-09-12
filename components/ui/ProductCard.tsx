"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCurrencyStore } from "@/lib/store/currencyStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useToastStore } from "@/lib/store/toastStore";
import QuickViewModal from "./QuickViewModal";
import { Product } from "@/lib/products/schema";
import { cardLift } from "../motion/variants";

interface ProductCardProps {
  product: Product;
  variant?: "standard" | "feature";
  aspectRatio?: string; // e.g. "aspect-[3/4]" or "aspect-[2/3]"
}

export default function ProductCard({
  product,
  variant = "standard",
  aspectRatio = "aspect-[3/4]",
}: ProductCardProps) {
  const isFeature = variant === "feature";
  const [openQuickView, setOpenQuickView] = useState(false);
  const { formatPrice } = useCurrencyStore();
  const { addToast } = useToastStore();
  const isWishlisted = useWishlistStore((state) => state.items.some((item) => item.id === product.id));
  const { addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast(`${product.name} REMOVED FROM WISHLIST`, "info");
    } else {
      addToWishlist(product);
      addToast(`${product.name} ADDED TO WISHLIST`, "success");
    }
  };

  const getBadgeText = () => {
    if (product.price > 700000) return "LIMITED RELEASE";
    if (product.name.toLowerCase().includes("tee")) return "LOW STOCK";
    if (product.id.charCodeAt(0) % 2 === 0) return "SIGNATURE ARCHIVE";
    return "";
  };

  // Enforce 'No Generic Cards' (Section 7.1.1)
  return (
    <>
      <motion.div
        variants={cardLift}
        initial="rest"
        whileHover="hover"
        className={`group relative overflow-hidden bg-bg-surface flex flex-col justify-between select-none ${
          isFeature ? "md:col-span-2 md:row-span-2" : "col-span-1"
        }`}
      >
      <Link href={`/product/${product.slug}`} className="w-full h-full flex flex-col justify-between outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]">
        {/* Product Image Frame */}
        <div className={`relative w-full ${isFeature ? "aspect-[4/3] md:h-full" : aspectRatio} bg-bg-elevated overflow-hidden`}>
          {/* Badge Overlay */}
          {getBadgeText() && (
            <span className={`absolute top-4 left-4 z-15 text-[8px] font-bold font-mono tracking-widest px-2.5 py-1 uppercase shadow-md select-none border ${
              getBadgeText() === "LOW STOCK"
                ? "bg-error/15 border-error/25 text-error"
                : getBadgeText() === "LIMITED RELEASE"
                ? "bg-accent/15 border-accent/25 text-accent animate-pulse"
                : "bg-bg-surface/90 border-border-subtle text-chrome"
            }`}>
              {getBadgeText()}
            </span>
          )}

          {/* Subtle gradient spotlight overlay (Section 5.5 / 7.1.1) */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 z-10" />

          {/* Fallback visual until real image assets are available */}
          <div className="absolute inset-0 bg-gradient-to-tr from-bg-elevated via-bg-primary to-bg-elevated flex flex-col items-center justify-center p-6 text-center">
            {isFeature ? (
              <div className="space-y-2">
                <span className="text-[10px] text-accent tracking-[0.3em] font-bold uppercase">
                  EDITORIAL SERIES
                </span>
                <h4 className="font-display text-2xl tracking-[0.2em] font-medium text-text-primary uppercase">
                  {product.name}
                </h4>
              </div>
            ) : (
              <span className="text-xs tracking-[0.3em] font-bold text-chrome/30 uppercase">
                {product.name.split(" ")[0]}
              </span>
            )}
          </div>

          {/* Ken Burns subtle zoom on hover */}
          <motion.div
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.05 },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Overlay details on gradient at bottom (Section 7.1.1) */}
          <div className="absolute bottom-0 left-0 w-full p-5 z-20 flex flex-col justify-end">
            <span className="text-[9px] text-accent tracking-[0.2em] font-bold uppercase block mb-1">
              {product.category}
            </span>
            <div className="flex justify-between items-end gap-2">
              <h4 className="font-display text-sm sm:text-base tracking-wider text-text-primary uppercase font-medium line-clamp-1">
                {product.name}
              </h4>
              <span className="font-sans text-xs sm:text-sm font-semibold text-text-primary tabular-nums whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>
            
            {/* Swatch dots visible on hover */}
            <div className="flex gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.colors.map((c) => (
                <span
                  key={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-white/20"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Quick View absolute trigger */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenQuickView(true);
        }}
        className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 bg-bg-surface/85 hover:bg-accent hover:text-white border border-border-subtle hover:border-accent text-[9px] font-bold uppercase tracking-[0.2em] px-3.5 py-2 cursor-pointer shadow-md outline-none focus:bg-accent focus:text-white focus:border-accent focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
      >
        QUICK VIEW
      </button>

      {/* Quick Wishlist absolute trigger */}
      <button
        type="button"
        onClick={toggleWishlist}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-4 right-4 z-30 transition-all duration-300 p-2 cursor-pointer shadow-md outline-none border focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)] ${
          isWishlisted
            ? "opacity-100 bg-accent text-white border-accent"
            : "opacity-0 group-hover:opacity-100 focus:opacity-100 bg-bg-surface/85 hover:bg-accent hover:text-white border-border-subtle hover:border-accent text-chrome hover:text-white"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-3.5 h-3.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
    </motion.div>

    <QuickViewModal
      product={product}
      isOpen={openQuickView}
      onClose={() => setOpenQuickView(false)}
    />
  </>
  );
}
