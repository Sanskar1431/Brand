"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product, ProductColor } from "@/lib/products/schema";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useToastStore } from "@/lib/store/toastStore";
import ProductCard from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCartStore();
  const { setOpenCart } = useUIStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, hasItem: isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);
  const { addToast } = useToastStore();

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      addToast(`${product.name} REMOVED FROM WISHLIST`, "info");
    } else {
      addToWishlist(product);
      addToast(`${product.name} ADDED TO WISHLIST`, "success");
    }
  };

  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L" | "XL">("M");
  const [activeAngle, setActiveAngle] = useState<string>(product.images.hero);
  
  // Size Guide States
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [heightInput, setHeightInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);

  // Care Accordion State
  const [isCareOpen, setIsCareOpen] = useState(false);

  // Reset angle when color changes
  useEffect(() => {
    setActiveAngle(product.images.hero);
  }, [selectedColor, product]);

  const handleAddToCart = () => {
    addItem(product, selectedColor.name, selectedSize, 1);
    addToast(`${product.name} ADDED TO CART`, "success");
    setOpenCart(true); // Open cart slide drawer immediately (Section 7.1.3 feedback)
  };

  // Recommended size calculation (Section 7.2.3)
  const calculateRecommendedSize = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(heightInput);
    const w = parseFloat(weightInput);

    if (isNaN(h) || isNaN(w)) return;

    let sizeRec = "M";
    if (h > 182 || w > 85) {
      sizeRec = "XL";
    } else if (h > 172 || w > 72) {
      sizeRec = "L";
    } else if (h > 162 || w > 58) {
      sizeRec = "M";
    } else {
      sizeRec = "S";
    }
    setRecommendedSize(sizeRec);
  };

  const allAngles = [product.images.hero, ...product.images.gallery];
  if (product.images.flatLay) {
    allAngles.push(product.images.flatLay);
  }

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12 text-left">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-chrome hover:text-text-primary transition-colors flex items-center gap-2"
          >
            ← BACK TO ARCHIVES
          </Link>
        </div>

        {/* 1. HERO SECTION (Spotlight backdrop + swatches) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* Hero Images Showcase (7 cols) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            
            {/* Gallery Thumbnail Strip (Left side on desktop) */}
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto no-scrollbar justify-start">
              {allAngles.map((angleUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveAngle(angleUrl)}
                  className={`w-16 h-20 bg-bg-surface border flex-shrink-0 flex items-center justify-center cursor-pointer transition-all ${
                    activeAngle === angleUrl ? "border-accent" : "border-border-subtle hover:border-chrome"
                  }`}
                >
                  <span className="text-[9px] text-chrome font-bold uppercase">ANGLE {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Main Stage (Right side, dark gradient spotlight) */}
            <div className="flex-1 aspect-[3/4] bg-gradient-to-b from-bg-elevated via-bg-primary to-bg-primary border border-border-subtle relative overflow-hidden flex items-center justify-center order-1 md:order-2">
              {/* Spotlight base */}
              <div className="absolute w-[80%] h-[80%] bg-accent/10 rounded-full blur-[100px] z-0" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAngle + selectedColor.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full flex flex-col items-center justify-center p-12 text-center z-10"
                >
                  {/* Mock image replacement */}
                  <span className="text-[10px] text-accent tracking-[0.3em] font-bold uppercase mb-2">
                    {"PRINCE"}
                  </span>
                  <h2 className="font-display text-4xl tracking-[0.2em] font-bold text-chrome/20 uppercase">
                    {product.name}
                  </h2>
                  <p className="text-[10px] text-chrome/50 uppercase tracking-widest mt-4">
                    Stage // {selectedColor.name} Angle View
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Details Configurator (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
                {product.category} // {product.fit} FIT
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-wider text-text-primary uppercase leading-tight">
                {product.name}
              </h1>
              <p className="font-sans text-2xl font-bold text-text-primary mt-4 tabular-nums">
                ₹{(product.price / 100).toLocaleString("en-IN")}
              </p>
            </div>

            <p className="text-chrome text-sm leading-relaxed font-sans border-t border-border-subtle/40 pt-6">
              {product.description}
            </p>

            {/* Swatch Selector */}
            <div className="space-y-3">
              <label className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase block">
                Colorway: {selectedColor.name}
              </label>
              <div className="flex gap-3">
                {product.colors.map((colorway) => (
                  <button
                    key={colorway.name}
                    onClick={() => setSelectedColor(colorway)}
                    className={`w-8 h-8 rounded-full border transition-all cursor-pointer relative ${
                      selectedColor.name === colorway.name
                        ? "scale-110 border-accent border-2"
                        : "border-white/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: colorway.hex }}
                    title={colorway.name}
                  >
                    {selectedColor.name === colorway.name && (
                      <span className="absolute inset-0.5 rounded-full border border-white/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] text-accent tracking-[0.2em] font-bold uppercase">
                <span>Select Size</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="underline hover:text-text-primary transition-colors cursor-pointer"
                >
                  Size Guide Calculator
                </button>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s as any)}
                    className={`w-12 h-12 text-xs font-bold border transition-all cursor-pointer ${
                      selectedSize === s
                        ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                        : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart & Wishlist Buttons */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-accent text-white hover:bg-accent-hover py-4.5 text-xs font-bold uppercase tracking-[0.25em] transition-colors shadow-xl cursor-pointer"
              >
                ADD TO ARCHIVES
              </button>
              <button
                onClick={toggleWishlist}
                className={`w-14 border flex items-center justify-center transition-all cursor-pointer ${
                  isWishlisted
                    ? "bg-text-primary text-bg-primary border-text-primary"
                    : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                }`}
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

            {/* Care accordion */}
            <div className="border-t border-border-subtle/40 pt-4">
              <button
                onClick={() => setIsCareOpen(!isCareOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-[0.2em] text-text-primary font-bold py-2 cursor-pointer"
              >
                <span>CARE & HANDLING</span>
                <span>{isCareOpen ? "−" : "+"}</span>
              </button>
              
              <AnimatePresence>
                {isCareOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="py-4 text-xs text-chrome leading-relaxed space-y-2 font-sans uppercase tracking-wider">
                      <p>• Machine wash cold, inside out with similar colors.</p>
                      <p>• Do not bleach. Tumble dry low or line dry in shade.</p>
                      <p>• Warm iron inside out if needed. Do not iron prints.</p>
                      <p>• Designed to build character and age gracefully over time.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* 2. PROGRESSIVE DETAIL REVEAL (Section 7.2.2) */}
        <div className="space-y-16 border-t border-border-subtle/30 pt-24 mb-24">
          <div className="max-w-xl text-left">
            <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
              SPEC DETAILS
            </span>
            <h2 className="font-display text-3xl tracking-wider text-text-primary uppercase font-semibold">
              ARCHITECTURAL COMPOSITION
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left side details */}
            <div className="space-y-8">
              <div className="border-b border-border-subtle/30 pb-6">
                <h4 className="text-xs text-accent tracking-[0.2em] font-bold uppercase mb-2">
                  01 // FABRIC SELECTION
                </h4>
                <p className="text-text-primary font-display text-lg sm:text-xl leading-relaxed uppercase tracking-wider">
                  {product.fabric}
                </p>
              </div>

              <div className="border-b border-border-subtle/30 pb-6">
                <h4 className="text-xs text-accent tracking-[0.2em] font-bold uppercase mb-2">
                  02 // SILHOUETTE FIT
                </h4>
                <p className="text-text-primary font-display text-lg sm:text-xl leading-relaxed uppercase tracking-wider">
                  {product.fit} fit coordinates
                </p>
              </div>

              <div className="border-b border-border-subtle/30 pb-6">
                <h4 className="text-xs text-accent tracking-[0.2em] font-bold uppercase mb-2">
                  03 // CRAFTSMANSHIP
                </h4>
                <ul className="text-chrome text-xs uppercase tracking-widest leading-relaxed space-y-2 mt-2">
                  {product.craftsmanship.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-accent">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right side close-up micro showcase */}
            <div className="aspect-[4/3] bg-bg-surface border border-border-subtle p-6 flex flex-col justify-between">
              <div className="flex-1 bg-bg-elevated flex items-center justify-center relative overflow-hidden">
                <span className="text-[10px] text-chrome/30 uppercase tracking-widest font-mono">
                  CLOSE UP MACRO VIEW // WEAVE DETAILS
                </span>
              </div>
              <p className="text-[10px] text-chrome uppercase tracking-widest mt-4">
                Section details showing high density stitch profiles.
              </p>
            </div>
          </div>
        </div>

        {/* 3. RELATED PRODUCTS CAROUSEL (Section 7.2.4) */}
        <div className="border-t border-border-subtle/30 pt-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase">
                COMPOSITION
              </span>
              <h2 className="font-display text-2xl md:text-3xl tracking-wider text-text-primary uppercase font-semibold mt-2">
                COMPLETE THE LOOK
              </h2>
            </div>
          </div>

          {/* Grid Layout of recommended products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>

      {/* SIZE GUIDE MODAL (Section 7.2.3) */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-[20%] max-w-md mx-auto bg-bg-surface border border-border-subtle p-6 rounded-2xl z-[60] text-left shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-border-subtle/50 pb-4 mb-6">
                <h3 className="font-display text-sm tracking-[0.15em] font-semibold uppercase">
                  SIZE CALCULATOR
                </h3>
                <button
                  onClick={() => {
                    setIsSizeGuideOpen(false);
                    setRecommendedSize(null);
                  }}
                  className="text-chrome hover:text-text-primary transition-colors text-xs uppercase tracking-widest font-bold cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

              {/* Calculator Form */}
              <form onSubmit={calculateRecommendedSize} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-chrome tracking-wider uppercase block">
                    HEIGHT (CM)
                  </label>
                  <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => setHeightInput(e.target.value)}
                    placeholder="E.G. 180"
                    required
                    className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-chrome tracking-wider uppercase block">
                    WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    placeholder="E.G. 75"
                    required
                    className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  CALCULATE SIZE
                </button>
              </form>

              {/* Result output */}
              <AnimatePresence>
                {recommendedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-bg-primary border border-accent/30 text-center"
                  >
                    <p className="text-[10px] text-chrome tracking-wider uppercase">
                      RECOMMENDED FIT SIZE
                    </p>
                    <p className="text-3xl font-bold text-accent mt-2 font-display">{recommendedSize}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
