"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/products/schema";
import { fetchProducts } from "@/lib/products/fetchProducts";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ search: query, limit: 100 }).then((res) => {
      setProducts(res.products);
      setLoading(false);
    });
  }, [query]);

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-left mb-12">
          <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
            SEARCH RESULTS FOR
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest text-text-primary uppercase font-semibold">
            &ldquo;{query}&rdquo;
          </h1>
          <p className="text-chrome/50 text-xs sm:text-sm tracking-wider uppercase mt-2">
            {loading ? "SEARCHING ARCHIVES..." : `FOUND ${products.length} PRODUCTS`}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            {/* Elegant minimalist loader */}
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xs uppercase tracking-[0.25em] text-chrome">QUERING ARCHIVES...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
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
              NO MATCHING ITEMS IN THE ARCHIVES.
            </p>
            <Link
              href="/shop"
              className="bg-bg-surface hover:bg-accent hover:text-white border border-border-subtle hover:border-accent text-text-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg"
            >
              EXPLORE COLLECTION
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
