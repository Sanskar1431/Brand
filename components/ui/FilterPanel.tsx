"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilterStore } from "@/lib/store/filterStore";

const availableColors = ["Obsidian Black", "Royal Purple", "Gunmetal Grey", "Pure Black", "Soft White"];
const availableSizes = ["S", "M", "L", "XL"];

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    category,
    color,
    size,
    priceRange,
    search,
    sortBy,
    setCategory,
    setColor,
    setSize,
    setPriceRange,
    setSearch,
    setSortBy,
    reset,
  } = useFilterStore();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = parseInt(e.target.value);
    const newRange = [...priceRange] as [number, number];
    newRange[index] = val;
    setPriceRange(newRange);
  };

  return (
    <>
      {/* Floating Trigger Button (Section 7.1.2) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:absolute md:top-24 md:right-12 md:left-auto md:translate-x-0 z-35">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent text-white px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-accent/30 hover:bg-accent-hover transition-colors flex items-center gap-2 border border-accent-hover cursor-pointer"
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
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          FILTER & SORT
        </button>
      </div>

      {/* Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-45 backdrop-blur-sm"
            />

            {/* Panel (Scales/fades in, Section 7.1.2) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 bottom-4 top-20 md:top-auto md:bottom-24 md:right-12 md:left-auto md:w-96 bg-bg-surface border border-border-subtle p-6 rounded-2xl z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border-subtle/50 pb-4 mb-6">
                <h3 className="font-display text-sm tracking-[0.15em] font-semibold uppercase">
                  FILTERING ENGINE
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-chrome hover:text-text-primary transition-colors text-xs uppercase tracking-widest font-bold cursor-pointer"
                >
                  CLOSE
                </button>
              </div>

              {/* Body */}
              <div className="space-y-6 flex-1 text-left">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase block">
                    Search Catalog
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ENTER QUERY..."
                    className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider uppercase outline-none focus:border-accent text-text-primary placeholder:text-chrome/30"
                  />
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider uppercase outline-none focus:border-accent text-text-primary"
                  >
                    <option value="newest">NEWEST ARRIVALS</option>
                    <option value="name">ALPHABETICAL (A-Z)</option>
                    <option value="price-asc">PRICE: LOW TO HIGH</option>
                    <option value="price-desc">PRICE: HIGH TO LOW</option>
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase block">
                    Category
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCategory(category === "tshirt" ? undefined : "tshirt")}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                        category === "tshirt"
                          ? "bg-accent border-accent text-white"
                          : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                      }`}
                    >
                      TEES
                    </button>
                    <button
                      onClick={() => setCategory(category === "jogger" ? undefined : "jogger")}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                        category === "jogger"
                          ? "bg-accent border-accent text-white"
                          : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                      }`}
                    >
                      JOGGERS
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <label className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase block">
                    Select Size
                  </label>
                  <div className="flex gap-2">
                    {availableSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(size === s ? undefined : s)}
                        className={`w-10 h-10 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                          size === s
                            ? "bg-accent border-accent text-white"
                            : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors (Swatches) */}
                <div className="space-y-2">
                  <label className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase block">
                    Select Color
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {availableColors.map((c) => {
                      const isActive = color === c;
                      // Find matching color hex
                      const hex =
                        c === "Obsidian Black"
                          ? "#121214"
                          : c === "Royal Purple"
                          ? "#6B46C1"
                          : c === "Gunmetal Grey"
                          ? "#2C2E33"
                          : c === "Pure Black"
                          ? "#0A0A0A"
                          : "#F5F4F2";
                      return (
                        <button
                          key={c}
                          onClick={() => setColor(isActive ? undefined : c)}
                          className={`w-7 h-7 rounded-full border relative transition-transform cursor-pointer ${
                            isActive ? "scale-110 border-accent border-2" : "border-white/20 hover:scale-105"
                          }`}
                          style={{ backgroundColor: hex }}
                          title={c}
                        >
                          {isActive && (
                            <span className="absolute inset-0.5 rounded-full border border-white/50" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-accent tracking-[0.2em] font-bold uppercase">
                    <span>Price Range</span>
                    <span className="font-sans font-semibold text-text-primary">
                      ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                  </div>
                  <div className="space-y-4 pt-2">
                    <input
                      type="range"
                      min="0"
                      max="15000"
                      step="250"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="w-full accent-accent bg-bg-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Footer */}
              <div className="border-t border-border-subtle/50 pt-4 mt-6 flex gap-4">
                <button
                  onClick={reset}
                  className="flex-1 py-3 border border-border-subtle hover:border-error hover:text-error text-chrome transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                >
                  RESET ALL
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 bg-white text-black hover:bg-accent hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest cursor-pointer"
                >
                  APPLY FILTERS
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
