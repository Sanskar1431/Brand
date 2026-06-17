"use client";

import { useUIStore } from "@/lib/store/uiStore";
import { useCartStore } from "@/lib/store/cartStore";
import { fetchSignatureProducts } from "@/lib/products/fetchProducts";
import { Product } from "@/lib/products/schema";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { drawerSlide } from "./variants";

export default function CartDrawer() {
  const { isCartOpen, setOpenCart } = useUIStore();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isCheckoutWiping, setIsCheckoutWiping] = useState(false);

  // Fetch 1-2 Signature Products if cart is empty
  useEffect(() => {
    fetchSignatureProducts().then((prods) => {
      setRecommendations(prods.slice(0, 2));
    });
  }, []);

  const handleCheckout = () => {
    setIsCheckoutWiping(true);
    setTimeout(() => {
      setIsCheckoutWiping(false);
      setOpenCart(false);
      alert("Checkout triggered! Transitioning to secure checkout gateway.");
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCart(false)}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={drawerSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-surface border-l border-border-subtle z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-subtle flex items-center justify-between">
              <h3 className="font-display text-lg tracking-[0.15em] font-semibold uppercase">
                YOUR CART ({getTotalItems()})
              </h3>
              <button
                onClick={() => setOpenCart(false)}
                className="text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer"
                aria-label="Close Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex gap-4 border-b border-border-subtle/40 pb-6"
                  >
                    <div className="relative w-20 h-24 bg-bg-primary border border-border-subtle/50 flex-shrink-0">
                      {/* For now we use a gradient placeholder or a fallback since actual images are not generated yet */}
                      <div className="w-full h-full bg-gradient-to-b from-bg-elevated to-bg-primary flex items-center justify-center">
                        <span className="text-[10px] text-chrome font-bold uppercase">PRINCE</span>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm uppercase tracking-wider font-semibold">
                            {item.product.name}
                          </h4>
                          <span className="text-sm font-sans tabular-nums font-semibold">
                            ₹{((item.product.price * item.quantity) / 100).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <p className="text-xs text-chrome mt-1 uppercase tracking-wider">
                          COLOR: {item.selectedColor} | SIZE: {item.selectedSize}
                        </p>
                      </div>

                      {/* Quantity Toggles */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border-subtle">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                item.quantity - 1
                              )
                            }
                            className="px-3 py-1 text-chrome hover:text-text-primary transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-sans tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedColor,
                                item.selectedSize,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 text-chrome hover:text-text-primary transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.selectedColor, item.selectedSize)
                          }
                          className="text-xs text-error/80 hover:text-error transition-colors uppercase tracking-widest cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty state recommendations (Section 7.1.3) */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm text-chrome uppercase tracking-widest mb-6">
                    YOUR CART IS EMPTY.
                  </p>
                  
                  {recommendations.length > 0 && (
                    <div className="w-full mt-6 text-left border-t border-border-subtle pt-6">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-4">
                        SIGNATURE RECOMMENDATIONS
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {recommendations.map((prod) => (
                          <div
                            key={prod.id}
                            className="group cursor-pointer border border-border-subtle/50 p-3 bg-bg-primary hover:border-accent transition-colors"
                          >
                            <Link href={`/product/${prod.slug}`} onClick={() => setOpenCart(false)}>
                              <div className="aspect-[3/4] bg-bg-elevated mb-2 flex items-center justify-center">
                                <span className="text-[10px] text-chrome font-bold uppercase">HERO</span>
                              </div>
                              <h5 className="text-[11px] uppercase tracking-wider font-semibold truncate">
                                {prod.name}
                              </h5>
                              <p className="text-[10px] text-chrome font-sans font-semibold mt-1">
                               ₹{(prod.price / 100).toLocaleString("en-IN")}
                              </p>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border-subtle bg-bg-primary/50 space-y-4">
                <div className="flex justify-between items-center text-sm uppercase tracking-wider font-semibold">
                  <span>Subtotal</span>
                  <span className="font-sans tabular-nums">₹{(getTotalPrice() / 100).toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[10px] text-chrome uppercase tracking-wider leading-relaxed">
                  Shipping, taxes, and duties calculated at checkout.
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-accent text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 cursor-pointer"
                >
                  SECURE CHECKOUT
                </button>
              </div>
            )}
          </motion.div>

          {/* Full-bleed Checkout Transition Wipe */}
          <AnimatePresence>
            {isCheckoutWiping && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 bg-accent z-[9999] origin-bottom flex items-center justify-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-white"
                >
                  <h2 className="font-display text-3xl tracking-[0.3em] font-semibold uppercase">
                    PRINCE
                  </h2>
                  <p className="text-xs uppercase tracking-[0.25em] mt-4 text-white/70 animate-pulse">
                    TRANSITIONING TO GATEWAY...
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
