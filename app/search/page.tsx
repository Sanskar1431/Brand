"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/products/schema";
import { fetchProducts } from "@/lib/products/fetchProducts";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [inputVal, setInputVal] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "tshirt" | "jogger">("ALL");
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc" | "name">("relevance");

  useEffect(() => {
    setInputVal(query);
    setLoading(true);
    fetchProducts({ search: query, limit: 100 }).then((res) => {
      setProducts(res.products);
      setLoading(false);
    });
  }, [query]);

  const popularSearches = ["TEE", "JOGGER", "HEAVYWEIGHT", "RAW", "FRENCH TERRY"];

  const teeCount = products.filter((p) => p.category === "tshirt").length;
  const joggerCount = products.filter((p) => p.category === "jogger").length;

  const displayProducts = [...products]
    .filter((p) => {
      if (selectedCategory === "ALL") return true;
      return p.category === selectedCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-left mb-8">
          <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
            SEARCH RESULTS FOR
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest text-text-primary uppercase font-semibold">
            &ldquo;{query}&rdquo;
          </h1>
          <p className="text-chrome/50 text-xs sm:text-sm tracking-wider uppercase mt-2">
            {loading ? "SEARCHING ARCHIVES..." : `FOUND ${displayProducts.length} PRODUCTS (TOTAL: ${products.length})`}
          </p>
        </div>

        {/* Inline Search Refinement */}
        <div className="mb-4 max-w-md text-left relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputVal.trim()) {
                router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
              }
            }}
            className="relative"
          >
            <input
              type="text"
              placeholder="REFINE SEARCH ARCHIVES..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full bg-bg-surface border border-border-subtle p-3 pr-10 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
            />
            {inputVal && (
              <button
                type="button"
                onClick={() => setInputVal("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome hover:text-text-primary text-[10px] font-bold uppercase transition-colors cursor-pointer p-1 outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-full"
                title="CLEAR SEARCH"
              >
                ✕
              </button>
            )}
          </form>
        </div>

        {/* Popular Search Suggestion Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-8 select-none">
          <span className="text-[10px] text-chrome/60 uppercase tracking-widest font-mono mr-1">
            POPULAR:
          </span>
          {popularSearches.map((tag) => {
            const isCurrent = query.toLowerCase() === tag.toLowerCase();
            return (
              <button
                key={tag}
                type="button"
                onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                className={`px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                  isCurrent
                    ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                    : "bg-bg-surface/60 hover:bg-bg-surface border-border-subtle hover:border-accent text-chrome hover:text-text-primary"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Category & Sorting Controls Bar */}
        {!loading && products.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border-subtle/30 select-none">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: "ALL", value: "ALL" as const, count: products.length },
                { label: "SIGNATURE TEES", value: "tshirt" as const, count: teeCount },
                { label: "PREMIUM JOGGERS", value: "jogger" as const, count: joggerCount },
              ].map((tab) => {
                const isActive = selectedCategory === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setSelectedCategory(tab.value)}
                    className={`px-3.5 py-1.5 text-[9px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-1.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                      isActive
                        ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                        : "bg-bg-surface/50 border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-mono ${
                      isActive ? "bg-white text-accent font-bold" : "bg-bg-primary text-chrome/70"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sorting Select */}
            <div className="flex items-center gap-2 text-left">
              <span className="text-[9px] text-chrome/60 font-mono tracking-widest uppercase">
                SORT:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort search results"
                className="bg-bg-surface border border-border-subtle text-text-primary text-[9px] font-mono uppercase tracking-wider py-1.5 px-2.5 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] cursor-pointer"
              >
                <option value="relevance">RELEVANCE</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="name">NAME (A-Z)</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            {/* Elegant minimalist loader */}
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-[0.25em] text-chrome">QUERING ARCHIVES...</p>
          </div>
        ) : displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductCard
                    product={product}
                    variant="standard"
                    aspectRatio="aspect-[3/4]"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-border-subtle/50 rounded-2xl flex flex-col items-center justify-center space-y-6">
            <p className="text-chrome uppercase tracking-widest text-sm">
              NO MATCHING ITEMS FOR &ldquo;{query}&rdquo; IN THE ARCHIVES.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              <span className="w-full text-[10px] text-chrome/60 uppercase tracking-widest font-mono mb-1">
                POPULAR SEARCHES:
              </span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
                  className="px-3 py-1.5 bg-bg-surface hover:bg-accent hover:text-white border border-border-subtle hover:border-accent text-chrome hover:text-text-primary text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                >
                  {tag}
                </button>
              ))}
            </div>
            <Link
              href="/shop"
              className="bg-accent text-white hover:bg-accent-hover px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
            >
              EXPLORE FULL ARCHIVE
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
