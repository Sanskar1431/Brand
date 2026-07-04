"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
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
      <Link href={`/product/${product.slug}`} className="w-full h-full flex flex-col justify-between">
        {/* Product Image Frame */}
        <div className={`relative w-full ${isFeature ? "aspect-[4/3] md:h-full" : aspectRatio} bg-bg-elevated overflow-hidden`}>
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
                ₹{(product.price / 100).toLocaleString("en-IN")}
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
        className="absolute top-4 left-4 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-bg-surface/85 hover:bg-accent hover:text-white border border-border-subtle hover:border-accent text-[9px] font-bold uppercase tracking-[0.2em] px-3.5 py-2 cursor-pointer shadow-md"
      >
        QUICK VIEW
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
