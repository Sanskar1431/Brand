"use client";

import { useUIStore } from "@/lib/store/uiStore";
import { useCartStore } from "@/lib/store/cartStore";
import { useWishlistStore } from "@/lib/store/wishlistStore";
import { fetchSignatureProducts } from "@/lib/products/fetchProducts";
import { Product } from "@/lib/products/schema";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/lib/store/toastStore";
import { useCurrencyStore } from "@/lib/store/currencyStore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { drawerSlide } from "./variants";

export default function CartDrawer() {
  const { isCartOpen, setOpenCart } = useUIStore();
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart, giftWrap, toggleGiftWrap } = useCartStore();
  const { addToast } = useToastStore();
  const { formatPrice } = useCurrencyStore();
  const { addItem: addToWishlist } = useWishlistStore();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [isGiftNoteOpen, setIsGiftNoteOpen] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [monogramInitials, setMonogramInitials] = useState("");

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const est = new Date(today);
    est.setDate(today.getDate() + 3);
    return est.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      addToast("PLEASE ENTER A PROMO CODE", "error");
      return;
    }
    if (code === "PRINCE10") {
      setAppliedPromo({ code: "PRINCE10", percent: 10 });
      addToast("PROMO CODE 'PRINCE10' APPLIED (10% OFF)", "success");
      setPromoCodeInput("");
    } else if (code === "VIPARCHIVE" || code === "KINGDOM15") {
      setAppliedPromo({ code, percent: 15 });
      addToast(`VIP PROMO CODE '${code}' APPLIED (15% OFF)`, "success");
      setPromoCodeInput("");
    } else if (code === "ROYALTY20") {
      setAppliedPromo({ code: "ROYALTY20", percent: 20 });
      addToast("EXCLUSIVE PROMO 'ROYALTY20' APPLIED (20% OFF)", "success");
      setPromoCodeInput("");
    } else {
      addToast("INVALID OR EXPIRED CONCIERGE PROMO CODE", "error");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast("PROMO VOUCHER REMOVED", "info");
  };

  const handleTransferToWishlist = (item: any) => {
    addToWishlist(item.product);
    removeItem(item.product.id, item.selectedColor, item.selectedSize);
    addToast(`${item.product.name} SAVED TO WISHLIST`, "success");
  };
  const [isCheckoutWiping, setIsCheckoutWiping] = useState(false);
  const router = useRouter();

  const handleClearCart = () => {
    clearCart();
    setAppliedPromo(null);
    addToast("ALL ITEMS WIPED FROM CART ARCHIVE", "info");
  };

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
      router.push("/checkout");
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
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-[9px] tracking-wider uppercase font-mono border border-border-subtle/50 px-2.5 py-1 hover:border-error hover:text-error transition-all cursor-pointer bg-bg-primary/20 mr-2 outline-none focus:border-error focus:ring-1 focus:ring-error/30 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                  >
                    CLEAR ALL
                  </button>
                )}
                <button
                  onClick={() => setOpenCart(false)}
                  className="text-chrome hover:text-text-primary transition-colors p-2 cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded-full"
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
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length > 0 && (
                <div className="border border-border-subtle/40 p-4 bg-bg-surface/20 space-y-3 select-none">
                  {(() => {
                    const threshold = 1500000; // ₹15,000 in cents
                    const subtotal = getTotalPrice();
                    const isUnlocked = subtotal >= threshold;
                    const percent = Math.min(100, (subtotal / threshold) * 100);
                    const remaining = threshold - subtotal;
                    return (
                      <>
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono tracking-widest uppercase">
                          <span className={isUnlocked ? "text-accent animate-pulse" : "text-chrome"}>
                            {isUnlocked
                              ? "✓ FREE SECURE AIR SHIPPING UNLOCKED"
                              : "SHIPPING UPGRADE PATHWAY"}
                          </span>
                          {!isUnlocked && (
                            <span className="text-accent">
                              {formatPrice(remaining)} TO UNLOCK
                            </span>
                          )}
                        </div>
                        {/* Progress Bar Track */}
                        <div className="w-full h-[3px] bg-border-subtle/20 overflow-hidden relative">
                          <div
                            className="h-full bg-accent transition-all duration-500 ease-out"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

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
                            {formatPrice(item.product.price * item.quantity)}
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
                            className="px-3 py-1 text-chrome hover:text-text-primary transition-colors cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
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
                            className="px-3 py-1 text-chrome hover:text-text-primary transition-colors cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() =>
                              removeItem(item.product.id, item.selectedColor, item.selectedSize)
                            }
                            className="text-xs text-error/80 hover:text-error transition-colors uppercase tracking-widest cursor-pointer outline-none focus:text-error focus:ring-1 focus:ring-error/30 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => handleTransferToWishlist(item)}
                            className="text-xs text-chrome hover:text-accent transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-1 font-bold outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              className="w-3 h-3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                              />
                            </svg>
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Empty state recommendations (Section 7.1.3) */
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <p className="text-sm text-chrome uppercase tracking-widest">
                    YOUR CART IS EMPTY.
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setOpenCart(false)}
                    className="bg-accent text-white hover:bg-accent-hover px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-md outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
                  >
                    EXPLORE COLLECTION
                  </Link>
                  
                  {recommendations.length > 0 && (
                    <div className="w-full mt-4 text-left border-t border-border-subtle pt-6">
                      <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-accent mb-4">
                        SIGNATURE RECOMMENDATIONS
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {recommendations.map((prod) => (
                          <div
                            key={prod.id}
                            className="group cursor-pointer border border-border-subtle/50 p-3 bg-bg-primary hover:border-accent transition-colors"
                          >
                            <Link
                              href={`/product/${prod.slug}`}
                              onClick={() => setOpenCart(false)}
                              className="block outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded"
                            >
                              <div className="aspect-[3/4] bg-bg-elevated mb-2 flex items-center justify-center">
                                <span className="text-[10px] text-chrome font-bold uppercase">HERO</span>
                              </div>
                              <h5 className="text-[11px] uppercase tracking-wider font-semibold truncate group-hover:text-accent transition-colors">
                                {prod.name}
                              </h5>
                              <div className="flex justify-between items-center mt-1">
                                <p className="text-[10px] text-chrome font-sans font-semibold">
                                  {formatPrice(prod.price)}
                                </p>
                                <span className="text-[8.5px] text-accent font-mono uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                  VIEW →
                                </span>
                              </div>
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
            {items.length > 0 && (() => {
              const subtotalBeforeDiscount = getTotalPrice() + (giftWrap ? 25000 : 0);
              const discountAmount = appliedPromo
                ? Math.round((getTotalPrice() * appliedPromo.percent) / 100)
                : 0;
              const finalSubtotal = Math.max(0, subtotalBeforeDiscount - discountAmount);

              return (
                <div className="p-6 border-t border-border-subtle bg-bg-primary/50 space-y-4">
                  {/* Gift wrapping toggle & Concierge Monogramming */}
                  <div className="border border-border-subtle/40 p-3.5 bg-bg-surface/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] text-text-primary tracking-wider uppercase font-bold">
                          SIGNATURE GIFT BOX PACKAGING
                        </span>
                        <span className="text-[9px] text-chrome uppercase font-mono">
                          + {formatPrice(25000)} // PREMIUM BOX & EMBOSSED ARCHIVE TICKET
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => {
                          toggleGiftWrap();
                          addToast(
                            e.target.checked
                              ? "GIFT PACKAGING ADDED TO DISPATCH PROTOCOL"
                              : "GIFT PACKAGING REMOVED",
                            "info"
                          );
                        }}
                        className="accent-accent w-4 h-4 cursor-pointer outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                      />
                    </div>

                    {/* Expandable Monogram & Concierge Note Protocol */}
                    <div className="border-t border-border-subtle/30 pt-2.5">
                      <button
                        type="button"
                        onClick={() => setIsGiftNoteOpen(!isGiftNoteOpen)}
                        className="w-full flex items-center justify-between text-[9px] font-mono tracking-widest text-accent uppercase font-bold hover:text-accent/80 transition-colors outline-none focus:text-accent"
                      >
                        <span className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          CONCIERGE MONOGRAM & EMBOSSED NOTE
                        </span>
                        <span className="text-xs">{isGiftNoteOpen ? "−" : "+"}</span>
                      </button>

                      <AnimatePresence>
                        {isGiftNoteOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-2.5 pt-3 overflow-hidden text-left"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8px] font-mono text-chrome/60 uppercase tracking-widest block mb-1">
                                  RECIPIENT NAME
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. ALEXANDER"
                                  value={giftRecipient}
                                  onChange={(e) => setGiftRecipient(e.target.value.toUpperCase())}
                                  maxLength={30}
                                  className="w-full bg-bg-surface border border-border-subtle p-1.5 text-[10px] uppercase font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] text-text-primary"
                                />
                              </div>
                              <div>
                                <label className="text-[8px] font-mono text-chrome/60 uppercase tracking-widest block mb-1">
                                  MONOGRAM (MAX 3)
                                </label>
                                <input
                                  type="text"
                                  placeholder="PRN"
                                  value={monogramInitials}
                                  onChange={(e) => setMonogramInitials(e.target.value.toUpperCase().slice(0, 3))}
                                  maxLength={3}
                                  className="w-full bg-bg-surface border border-border-subtle p-1.5 text-[10px] uppercase font-mono tracking-widest outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] text-accent font-bold"
                                />
                              </div>
                            </div>

                            {monogramInitials && (
                              <div className="flex items-center gap-2 p-1.5 bg-accent/10 border border-accent/30">
                                <span className="text-[8px] font-mono uppercase text-accent tracking-widest">
                                  EMBOSSED CREST:
                                </span>
                                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-accent">
                                  [ {monogramInitials.split("").join(" · ")} ]
                                </span>
                              </div>
                            )}

                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[8px] font-mono text-chrome/60 uppercase tracking-widest block">
                                  PERSONALIZED CONCIERGE MESSAGE
                                </label>
                                <span className="text-[8px] font-mono text-chrome/40">
                                  {giftNote.length}/140
                                </span>
                              </div>
                              <textarea
                                placeholder="Complimentary gold-foiled note included in dispatch parcel..."
                                value={giftNote}
                                onChange={(e) => setGiftNote(e.target.value.slice(0, 140))}
                                rows={2}
                                className="w-full bg-bg-surface border border-border-subtle p-2 text-[10px] outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] text-text-primary resize-none"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Promo / Concierge Voucher Section */}
                  <div className="border border-border-subtle/40 p-3 bg-bg-surface/20 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-accent tracking-wider uppercase font-bold font-mono">
                        CONCIERGE VOUCHER PROTOCOL
                      </span>
                      {appliedPromo && (
                        <button
                          type="button"
                          onClick={handleRemovePromo}
                          className="text-[9px] text-error hover:underline font-mono uppercase font-bold cursor-pointer"
                        >
                          REMOVE ({appliedPromo.code})
                        </button>
                      )}
                    </div>

                    {appliedPromo ? (
                      <div className="flex items-center justify-between p-2 bg-accent/10 border border-accent/30 text-[9px] font-mono">
                        <span className="text-accent font-bold">
                          ✓ {appliedPromo.code} ({appliedPromo.percent}% SAVINGS APPLIED)
                        </span>
                        <span className="text-accent font-bold">
                          -{formatPrice(discountAmount)}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ENTER PROMO CODE (e.g. PRINCE10)..."
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                            className="flex-1 bg-bg-surface border border-border-subtle p-2 text-xs outline-none focus:border-accent text-text-primary uppercase font-mono focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                            maxLength={15}
                          />
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="bg-bg-primary hover:bg-bg-surface border border-border-subtle hover:border-accent text-chrome hover:text-text-primary px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                          >
                            APPLY
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="text-[8px] text-chrome/50 font-mono uppercase tracking-widest">
                            TRY:
                          </span>
                          {["PRINCE10", "VIPARCHIVE"].map((sample) => (
                            <button
                              key={sample}
                              type="button"
                              onClick={() => {
                                setPromoCodeInput(sample);
                              }}
                              className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 border border-border-subtle/50 text-chrome/70 hover:text-accent hover:border-accent cursor-pointer transition-colors"
                            >
                              {sample}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtotal breakdown */}
                  <div className="space-y-1 pt-1">
                    {appliedPromo && (
                      <div className="flex justify-between items-center text-xs text-chrome uppercase tracking-wider">
                        <span>Standard Archive Subtotal</span>
                        <span className="font-sans tabular-nums line-through opacity-70">
                          {formatPrice(subtotalBeforeDiscount)}
                        </span>
                      </div>
                    )}
                    {appliedPromo && (
                      <div className="flex justify-between items-center text-xs text-accent uppercase tracking-wider font-semibold">
                        <span>Concierge Discount ({appliedPromo.percent}%)</span>
                        <span className="font-sans tabular-nums">
                          -{formatPrice(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-sm uppercase tracking-wider font-semibold pt-1">
                      <span>Final Total</span>
                      <span className="font-sans tabular-nums font-bold text-text-primary">
                        {formatPrice(finalSubtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Delivery Dispatch Badge */}
                  <div className="flex items-center gap-2 p-2.5 bg-bg-surface/40 border border-border-subtle/50 text-[9px] font-mono text-chrome">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-accent flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <div className="flex flex-col text-left">
                      <span className="text-text-primary font-bold uppercase tracking-wider">
                        ESTIMATED ARRIVAL: <span className="text-accent">{getEstimatedDeliveryDate()}</span>
                      </span>
                      <span className="text-[8px] text-chrome/60 uppercase">
                        WHITE-GLOVE AIR COURIER // 24H DISPATCH PROTOCOL
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-chrome uppercase tracking-wider leading-relaxed">
                    Shipping, taxes, and duties calculated at checkout.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-accent text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
                  >
                    SECURE CHECKOUT
                  </button>
                </div>
              );
            })()}
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
