"use client";

import { useWishlistStore } from "@/lib/store/wishlistStore";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="text-left mb-12">
          <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
            MY ARCHIVE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest text-text-primary uppercase font-semibold">
            YOUR WISHLIST
          </h1>
          <p className="text-chrome/50 text-xs sm:text-sm tracking-wider uppercase mt-2">
            {items.length} ITEMS SAVED
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {items.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative group"
                >
                  <ProductCard
                    product={product}
                    variant="standard"
                    aspectRatio="aspect-[3/4]"
                  />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-4 right-4 z-10 bg-bg-surface/80 hover:bg-error hover:text-white text-text-primary p-2 border border-border-subtle hover:border-error transition-all duration-300 rounded-full cursor-pointer shadow-md"
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-border-subtle/50 rounded-2xl flex flex-col items-center justify-center space-y-6">
            <p className="text-chrome uppercase tracking-widest text-sm">
              YOUR WISHLIST IS CURRENTLY EMPTY.
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
