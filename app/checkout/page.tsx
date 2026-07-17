"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToastStore } from "@/lib/store/toastStore";
import { useCurrencyStore } from "@/lib/store/currencyStore";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, giftWrap } = useCartStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { addToast } = useToastStore();
  const { formatPrice } = useCurrencyStore();

  const [promoInput, setPromoInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showCouponsDropdown, setShowCouponsDropdown] = useState(false);

  const [panNumber, setPanNumber] = useState("");
  const [panVerified, setPanVerified] = useState(false);
  const [panError, setPanError] = useState("");
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);

  const handleVerifyPan = () => {
    if (!panNumber.trim()) {
      setPanError("PLEASE ENTER A VALID PAN NUMBER");
      return;
    }
    setIsVerifyingPan(true);
    setPanError("");
    setTimeout(() => {
      setIsVerifyingPan(false);
      const cleanPan = panNumber.trim().toUpperCase();
      const validPans = ["SANSR1431P", "PRNCE1990A", "KINGDOM20P", "GUEST9999F"];
      if (validPans.includes(cleanPan)) {
        setPanVerified(true);
        addToast("PAN VERIFIED SUCCESSFULLY", "success");
      } else {
        setPanError("Error : PAN does not exist, Please register this PAN or try with some other PAN.");
        addToast("PAN VERIFICATION FAILED", "error");
      }
    }, 1200);
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "PRINCE10") {
      setDiscountPercent(10);
      addToast("PROMO CODE PRINCE10 APPLIED: 10% OFF", "success");
    } else if (code === "KINGDOM20") {
      setDiscountPercent(20);
      addToast("PROMO CODE KINGDOM20 APPLIED: 20% OFF", "success");
    } else {
      addToast("INVALID ARCHIVE PROMO CODE", "error");
    }
    setPromoInput("");
  };

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!panVerified) {
      addToast("Error: PAN verification protocol required", "error");
      setPanError("Error : PAN does not exist, Please register this PAN or try with some other PAN.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const randomOrderId = "PRNC-" + Math.floor(100000 + Math.random() * 900000);
      clearCart();
      router.push(`/checkout/success?orderId=${randomOrderId}`);
    }, 1800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = getTotalPrice();
  const giftPackagingFee = giftWrap ? 25000 : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = (discountedSubtotal + giftPackagingFee) > 1500000 ? 0 : 50000;
  const tax = Math.round((discountedSubtotal + giftPackagingFee) * 0.18);
  const total = discountedSubtotal + giftPackagingFee + shipping + tax;

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase mb-2">CHECKOUT</span>
        <h1 className="font-display text-2xl sm:text-3xl tracking-widest font-semibold uppercase mb-6">
          YOUR CART IS EMPTY
        </h1>
        <Link
          href="/shop"
          className="bg-accent text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 cursor-pointer"
        >
          GO TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary pt-32 pb-24 px-6 md:px-12 select-none relative">
      <div className="max-w-6xl mx-auto z-10 relative">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              {/* Checkout Form (7 cols) */}
              <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 text-left">
                <div>
                  <span className="text-xs text-accent tracking-[0.2em] font-bold uppercase block mb-1">
                    SECURE TRANSACTIONS
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl tracking-widest uppercase font-semibold">
                    CHECKOUT
                  </h1>
                </div>

                {/* Email Section */}
                <div className="space-y-4">
                  <h3 className="text-xs tracking-[0.15em] font-bold uppercase text-chrome border-b border-border-subtle/30 pb-2">
                    01. CONTACT INFO
                  </h3>
                  <div>
                    <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors uppercase font-mono"
                    />
                  </div>
                </div>

                {/* Shipping Section */}
                <div className="space-y-4">
                  <h3 className="text-xs tracking-[0.15em] font-bold uppercase text-chrome border-b border-border-subtle/30 pb-2">
                    02. SHIPPING ADDRESS
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors uppercase"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Compliance Section */}
                <div className="space-y-4">
                  <h3 className="text-xs tracking-[0.15em] font-bold uppercase text-chrome border-b border-border-subtle/30 pb-2">
                    03. TAX COMPLIANCE (PAN VERIFICATION)
                  </h3>
                  <div className="space-y-3">
                    <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                      Permanent Account Number (PAN)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="E.G. SANSR1431P"
                        value={panNumber}
                        onChange={(e) => {
                          setPanNumber(e.target.value.toUpperCase());
                          setPanVerified(false);
                          setPanError("");
                        }}
                        disabled={panVerified || isVerifyingPan}
                        className={`flex-1 bg-bg-surface border p-3 outline-none text-sm text-text-primary transition-colors font-mono uppercase ${
                          panVerified
                            ? "border-success/40 focus:border-success/40"
                            : panError
                            ? "border-error/40 focus:border-error/40"
                            : "border-border-subtle focus:border-accent"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyPan}
                        disabled={panVerified || isVerifyingPan}
                        className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                          panVerified
                            ? "bg-success/15 border-success/30 text-success cursor-default"
                            : "bg-bg-surface border-border-subtle hover:border-accent text-text-primary"
                        }`}
                      >
                        {isVerifyingPan ? "VERIFYING..." : panVerified ? "VERIFIED" : "VERIFY PAN"}
                      </button>
                    </div>
                    {panError && (
                      <p className="text-[10px] text-error font-mono font-bold uppercase tracking-wider leading-relaxed">
                        {panError}
                      </p>
                    )}
                    {panVerified && (
                      <p className="text-[10px] text-success font-mono font-bold uppercase tracking-wider">
                        ✓ PAN VERIFIED PROTOCOL ACTIVE
                      </p>
                    )}
                    <p className="text-[9px] text-chrome/50 uppercase tracking-widest leading-relaxed">
                      * Tax Compliance simulated validation is required for high value archive transactions. Valid mock PAN examples: <span className="font-mono text-chrome font-bold select-all">SANSR1431P</span>, <span className="font-mono text-chrome font-bold select-all">PRNCE1990A</span>.
                    </p>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4">
                  <h3 className="text-xs tracking-[0.15em] font-bold uppercase text-chrome border-b border-border-subtle/30 pb-2">
                    04. PAYMENT DETAIL
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        required
                        placeholder="•••• •••• •••• ••••"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        required
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-chrome uppercase tracking-widest block mb-1">
                        CVC
                      </label>
                      <input
                        type="password"
                        name="cardCvc"
                        required
                        placeholder="•••"
                        maxLength={4}
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="w-full bg-bg-surface border border-border-subtle focus:border-accent p-3 outline-none text-sm text-text-primary transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white hover:bg-accent-hover py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors shadow-lg cursor-pointer flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `AUTHORIZE PAYMENT — ₹${(total / 100).toLocaleString("en-IN")}`
                  )}
                </button>
              </form>

              {/* Order Summary (5 cols) */}
              <div className="lg:col-span-5 bg-bg-surface border border-border-subtle p-6 space-y-6 text-left">
                <h3 className="text-xs tracking-[0.2em] font-bold uppercase text-accent">
                  ORDER SUMMARY
                </h3>

                {/* Items List */}
                <div className="divide-y divide-border-subtle/30 overflow-y-auto max-h-[300px] pr-2">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                      className="py-4 flex gap-4"
                    >
                      <div className="flex-1">
                        <h4 className="text-xs uppercase tracking-wider font-semibold">
                          {item.product.name}
                        </h4>
                        <p className="text-[10px] text-chrome uppercase tracking-wider mt-1">
                          COLOR: {item.selectedColor} | SIZE: {item.selectedSize} | QTY: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-sans font-semibold tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="border-t border-border-subtle/30 pt-4 space-y-2 relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-bg-primary border border-border-subtle p-2 text-[10px] tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      APPLY
                    </button>
                  </div>
                  <div className="flex justify-between items-center select-none">
                    {discountPercent > 0 ? (
                      <p className="text-[9px] text-accent tracking-[0.15em] font-bold uppercase block">
                        ✓ CODE APPLIED: {discountPercent}% DISCOUNT ACTUATED
                      </p>
                    ) : (
                      <span className="text-[9px] text-chrome/40 uppercase tracking-widest font-mono">
                        HAVE A COUPON CODE?
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowCouponsDropdown(!showCouponsDropdown)}
                      className="text-[9px] text-accent hover:underline uppercase tracking-wider font-bold cursor-pointer"
                    >
                      {showCouponsDropdown ? "HIDE COUPONS" : "VIEW COUPONS"}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showCouponsDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-bg-primary border border-border-subtle p-3 space-y-2 mt-1 z-25 text-left shadow-xl"
                      >
                        <span className="text-[8px] text-chrome tracking-widest font-mono font-bold block uppercase border-b border-border-subtle/30 pb-1">
                          ACTIVE ARCHIVE PROTOCOLS
                        </span>
                        {[
                          { code: "PRINCE10", desc: "10% OFF ALL GARMENT ARCHIVES" },
                          { code: "KINGDOM20", desc: "20% OFF HIGH DENSITY PRODUCTS" },
                        ].map((cp) => (
                          <button
                            key={cp.code}
                            type="button"
                            onClick={() => {
                              setPromoInput(cp.code);
                              setShowCouponsDropdown(false);
                              const code = cp.code;
                              if (code === "PRINCE10") {
                                setDiscountPercent(10);
                                addToast("PROMO CODE PRINCE10 APPLIED: 10% OFF", "success");
                              } else if (code === "KINGDOM20") {
                                setDiscountPercent(20);
                                addToast("PROMO CODE KINGDOM20 APPLIED: 20% OFF", "success");
                              }
                            }}
                            className="w-full text-left p-2 hover:bg-bg-surface flex flex-col gap-0.5 border border-border-subtle/20 hover:border-accent transition-colors cursor-pointer"
                          >
                            <span className="text-[10px] font-bold font-mono text-text-primary">{cp.code}</span>
                            <span className="text-[8px] text-chrome font-mono uppercase tracking-wider">{cp.desc}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Totals table */}
                <div className="border-t border-border-subtle/50 pt-4 space-y-3 text-xs uppercase tracking-wider">
                  <div className="flex justify-between">
                    <span className="text-chrome">Subtotal</span>
                    <span className="font-sans font-semibold tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Discount ({discountPercent}%)</span>
                      <span className="font-sans font-semibold tabular-nums">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  {giftWrap && (
                    <div className="flex justify-between">
                      <span className="text-chrome">Signature Packaging</span>
                      <span className="font-sans font-semibold tabular-nums text-accent">
                        {formatPrice(giftPackagingFee)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-chrome">Estimated Shipping</span>
                    <span className="font-sans font-semibold tabular-nums">
                      {shipping === 0 ? "FREE" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-chrome">GST (18%)</span>
                    <span className="font-sans font-semibold tabular-nums">
                      {formatPrice(tax)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border-subtle/50 pt-3 text-sm font-bold">
                    <span className="text-text-primary">Total</span>
                    <span className="font-sans tabular-nums text-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Success screen state */
            <motion.div
              key="checkout-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto text-center space-y-8 py-16"
            >
              <div className="w-16 h-16 bg-accent/10 border border-accent rounded-full flex items-center justify-center mx-auto text-accent shadow-lg shadow-accent/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>

              <div className="space-y-3">
                <span className="text-xs text-accent tracking-[0.3em] font-bold uppercase block">
                  ORDER COMPLETED
                </span>
                <h1 className="font-display text-4xl tracking-widest font-semibold uppercase">
                  THANK YOU
                </h1>
                <p className="text-chrome/75 text-sm leading-relaxed tracking-wide max-w-sm mx-auto font-sans">
                  Your transaction has been authorized successfully. A confirmation email with details of your order has been dispatched.
                </p>
              </div>

              <div className="w-12 h-[1px] bg-border-subtle mx-auto" />

              <div>
                <Link
                  href="/shop"
                  className="inline-block px-8 py-4 bg-accent text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
