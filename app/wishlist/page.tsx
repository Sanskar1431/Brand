"use client";

import { useState } from "react";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useToastStore } from "@/lib/store/toastStore";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { setOpenCart } = useUIStore();
  const { addToast } = useToastStore();
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );



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

        {items.length > 0 && (
          <div className="mb-8 max-w-md text-left relative">
            <input
              type="text"
              placeholder="SEARCH WISHLIST ARCHIVES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-surface border border-border-subtle p-3 pr-10 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome hover:text-text-primary text-[10px] font-bold uppercase transition-colors cursor-pointer p-1"
                title="CLEAR SEARCH"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {items.length > 0 ? (
          filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((product, index) => (
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
                  {/* Quick Configuration Panel on hover */}
                  <div className="absolute inset-x-4 bottom-[84px] z-20 bg-bg-surface/95 backdrop-blur-sm border border-border-subtle p-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-lg select-none">
                    {/* Color swatches choice */}
                    <div className="flex gap-2 items-center justify-center border-b border-border-subtle/30 pb-1.5">
                      <span className="text-[7px] text-chrome tracking-widest uppercase font-bold">COLOR:</span>
                      <div className="flex gap-1.5">
                        {product.colors.map((col) => {
                          const activeColor = selectedColors[product.id] || product.colors[0].name;
                          const isSelected = col.name === activeColor;
                          return (
                            <button
                              key={col.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColors((prev) => ({ ...prev, [product.id]: col.name }));
                              }}
                              className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                                isSelected ? "border-accent ring-1 ring-accent scale-110" : "border-border-subtle hover:scale-105"
                              }`}
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex justify-around items-center">
                      <span className="text-[8px] text-chrome tracking-widest uppercase font-bold">QUICK ADD:</span>
                      {["S", "M", "L", "XL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={(e) => {
                            e.stopPropagation();
                            const activeColor = selectedColors[product.id] || product.colors[0].name;
                            addItem(product, activeColor, sz as any, 1);
                            addToast(`${product.name} (${activeColor} / ${sz}) QUICK ADDED`, "success");
                            setOpenCart(true);
                          }}
                          className="text-[10px] font-bold font-mono text-chrome hover:text-accent p-1 cursor-pointer transition-colors"
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-4 right-4 z-10 bg-bg-surface/80 hover:bg-error hover:text-white text-text-primary p-2 border border-border-subtle hover:border-error transition-all duration-300 rounded-full cursor-pointer shadow-md opacity-0 group-hover:opacity-100"
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

              {/* Direct Checkout Banner */}
              <div className="col-span-full mt-12 pt-8 border-t border-border-subtle/30 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
                <div className="text-left">
                  <span className="text-[9px] text-accent tracking-[0.2em] font-mono font-bold block uppercase">
                    DIRECT CHECKOUT SHORTCUT ACTIVE
                  </span>
                  <p className="text-[10px] text-chrome font-mono uppercase tracking-widest mt-1">
                    PROCEED STRAIGHT TO TRANSACTIONS STAGE WITH FAVORITED ITEMS
                  </p>
                </div>
                <button
                  onClick={() => {
                    items.forEach((it) => {
                      const activeColor = selectedColors[it.id] || it.colors[0].name;
                      addItem(it, activeColor, "M", 1);
                    });
                    addToast("ARCHIVES PACKAGED: ROUTING TO SECURE TRANSACTION", "success");
                    setTimeout(() => {
                      window.location.href = "/checkout";
                    }, 800);
                  }}
                  className="bg-accent text-white hover:bg-accent-hover px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg w-full sm:w-auto text-center"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border-subtle/50 w-full flex flex-col items-center justify-center space-y-4">
              <p className="text-chrome uppercase tracking-widest text-xs">
                No matching archives found inside your wishlist.
              </p>
            </div>
          )
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
