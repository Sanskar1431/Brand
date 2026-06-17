"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/products/schema";
import { useFilterStore } from "@/lib/store/filterStore";
import ProductCard from "./ProductCard";
import FilterPanel from "./FilterPanel";
import { motion, AnimatePresence } from "framer-motion";

interface ShopCatalogProps {
  initialProducts: Product[];
  categoryFilter?: "tshirt" | "jogger";
}

export default function ShopCatalog({ initialProducts, categoryFilter }: ShopCatalogProps) {
  const {
    category,
    color,
    size,
    priceRange,
    search,
    sortBy,
    setCategory,
  } = useFilterStore();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [visibleCount, setVisibleCount] = useState(24); // pagination count (Section 7.1)

  // Sync category filter from URL route if present
  useEffect(() => {
    if (categoryFilter) {
      setCategory(categoryFilter);
    }
  }, [categoryFilter, setCategory]);

  // Execute client-side filtering and sorting (Section 7.1.2)
  useEffect(() => {
    let result = [...initialProducts];

    // Filter by active category (Zustand)
    const activeCategory = categoryFilter || category;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by color
    if (color) {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === color.toLowerCase())
      );
    }

    // Filter by size
    if (size) {
      result = result.filter((p) => p.sizes.includes(size as any));
    }

    // Filter by price range
    result = result.filter((p) => {
      const priceUSD = p.price / 100;
      return priceUSD >= priceRange[0] && priceUSD <= priceRange[1];
    });

    // Fuzzy text search
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.fabric.toLowerCase().includes(query)
      );
    }

    // Sort catalog
    if (sortBy) {
      switch (sortBy) {
        case "price-asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "name":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "newest":
        default:
          // Default sorting logic
          break;
      }
    }

    setFilteredProducts(result);
    setVisibleCount(24); // Reset pagination on filter
  }, [initialProducts, category, categoryFilter, color, size, priceRange, search, sortBy]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 24, filteredProducts.length));
  };

  const paginatedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12">
      {/* Search & Filter UI triggers */}
      <FilterPanel />

      <div className="max-w-[1600px] mx-auto">
        <div className="text-left mb-12">
          <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
            PRINCE ARCHIVE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest text-text-primary uppercase font-semibold">
            {categoryFilter === "tshirt"
              ? "SIGNATURE TEES"
              : categoryFilter === "jogger"
              ? "PREMIUM JOGGERS"
              : "ALL PRODUCTS"}
          </h1>
          <p className="text-chrome/50 text-xs sm:text-sm tracking-wider uppercase mt-2">
            SHOWING {filteredProducts.length} PRODUCTS
          </p>
        </div>

        {/* Product Grid (Section 7.1.1 asymmetric crop, grid rhythm) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product, index) => {
                // Occasional 'feature' cells span 2 columns (every 8th item starting from index 6)
                const isFeatureItem = index > 0 && index % 8 === 6;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={isFeatureItem ? "md:col-span-2 md:row-span-2" : ""}
                  >
                    <ProductCard
                      product={product}
                      variant={isFeatureItem ? "feature" : "standard"}
                      // Alternating aspect ratios slightly to break visual monotony (Section 7.1.1)
                      aspectRatio={index % 2 === 0 ? "aspect-[3/4]" : "aspect-[2/3]"}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty Search Result */
          <div className="text-center py-32 border border-dashed border-border-subtle/50 rounded-2xl">
            <p className="text-chrome uppercase tracking-widest text-sm">
              NO MATCHING ITEMS IN ARCHIVES.
            </p>
          </div>
        )}

        {/* Load More/Infinite Scroll triggers (Section 7.1) */}
        {hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={loadMore}
              className="bg-bg-surface hover:bg-accent hover:text-white border border-border-subtle hover:border-accent text-text-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg"
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
