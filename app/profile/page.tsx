"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToastStore } from "@/lib/store/toastStore";

interface OrderCountdownProps {
  status: string;
}

function OrderCountdown({ status }: OrderCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 45, seconds: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, "0");

  const label = status === "IN TRANSIT" ? "ESTIMATED DELIVERY" : "DISPATCH PROTOCOL COUNTDOWN";

  return (
    <div className="bg-bg-primary/40 border border-border-subtle/30 p-4 flex flex-col items-center justify-center space-y-1.5 text-center mt-4">
      <span className="text-[8px] text-accent tracking-[0.25em] font-mono font-bold block animate-pulse">
        • {label}
      </span>
      <span className="text-sm font-mono tracking-widest text-text-primary font-bold">
        {timeLeft.hours > 0 ? `${formatNum(timeLeft.hours)}h : ` : ""}
        {formatNum(timeLeft.minutes)}m : {formatNum(timeLeft.seconds)}s
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DELIVERED" | "IN TRANSIT">("ALL");
  const { addToast } = useToastStore();
  const [refreshingOrderId, setRefreshingOrderId] = useState<string | null>(null);
  const [refreshLatency, setRefreshLatency] = useState(1.2);

  useEffect(() => {
    let interval: any;
    if (refreshingOrderId) {
      setRefreshLatency(1.2);
      interval = setInterval(() => {
        setRefreshLatency((prev) => Math.max(0, prev - 0.1));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [refreshingOrderId]);

  const handleRefreshLogistics = (orderId: string) => {
    setRefreshingOrderId(orderId);
    addToast("CONNECTING TO LOGISTICS GATEWAY APIS...", "info");
    setTimeout(() => {
      setRefreshingOrderId(null);
      addToast("LOGISTICS CHRONICLER STABLE: STATUS UP TO DATE", "success");
    }, 1200);
  };

  const [orders, setOrders] = useState([
    {
      id: "PRNC-940182",
      date: "2026-06-15",
      item: "SIGNATURE RAW OVERSIZED TEE",
      color: "CARBON BLACK",
      size: "M",
      price: 450000,
      status: "DELIVERED",
    },
    {
      id: "PRNC-930571",
      date: "2026-06-20",
      item: "HEAVYWEIGHT FRENCH TERRY JOGGER",
      color: "PUMICE GREY",
      size: "L",
      price: 780000,
      status: "IN TRANSIT",
    },
  ]);

  const toggleOrderExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleActionSubmit = (orderId: string, action: "RETURN" | "CANCEL") => {
    const inputEl = document.getElementById(`reason-${orderId}`) as HTMLInputElement;
    const reason = inputEl?.value.trim() || "";
    if (!reason) {
      addToast("REASON REQUIRED FOR THIS ARCHIVE PROTOCOL", "error");
      return;
    }
    
    if (action === "RETURN") {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "RETURN INITIATED" } : o))
      );
      addToast(`RETURN INITIATED FOR ORDER ${orderId}: REASON CACHED`, "success");
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
      addToast(`ORDER ${orderId} CANCELLED IN ARCHIVE`, "info");
    }
    
    if (inputEl) {
      inputEl.value = "";
    }
    setExpandedOrderId(null);
  };

  const handleDownloadInvoice = (orderId: string) => {
    addToast(`GENERATING INVOICE PROTOCOL FOR ${orderId}...`, "info");
    setTimeout(() => {
      addToast(`INVOICE PDF FOR ${orderId} SAVED TO DOWNLOADS`, "success");
    }, 1500);
  };

  const getTimelineSteps = (status: string) => {
    return [
      { label: "ORDER PLACED", active: true },
      { label: "PREPARED", active: true },
      { label: "DISPATCHED", active: status === "DELIVERED" || status === "IN TRANSIT" },
      { label: "DELIVERED", active: status === "DELIVERED" },
    ];
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.item.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary text-text-primary pt-32 pb-24 px-6 md:px-12 select-none relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1200px] mx-auto space-y-12 z-10 relative text-left"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="border-b border-border-subtle/30 pb-6">
          <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
            CLIENT CONCIERGE
          </span>
          <h1 className="font-display text-3xl sm:text-5xl tracking-widest uppercase font-semibold">
            MY ACCOUNT
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Client Details Card (4 cols) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 bg-bg-surface border border-border-subtle p-6 space-y-6"
          >
            <h3 className="text-xs tracking-[0.2em] font-bold uppercase text-accent border-b border-border-subtle/30 pb-2">
              CLIENT PROFILE
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Client Name</span>
                <p className="text-sm font-semibold uppercase">Sanskar verma</p>
              </div>

              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Linked Email</span>
                <p className="text-sm font-mono text-chrome select-all">
                  Sanskar1431@users.noreply.github.com
                </p>
              </div>

              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Client Tier</span>
                <p className="text-xs font-mono uppercase text-accent font-bold tracking-wider">
                  PRINCE ARCHIVE MEMBER // TIER 01
                </p>
              </div>

              <div>
                <span className="text-[10px] text-chrome uppercase tracking-widest block">Shipping Region</span>
                <p className="text-sm uppercase">IN / ASIA PACIFIC</p>
              </div>
            </div>
          </motion.div>

          {/* Order History Table (8 cols) */}
          <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">
            <h3 className="text-xs tracking-[0.2em] font-bold uppercase text-accent border-b border-border-subtle/30 pb-2">
              ORDER ARCHIVE
            </h3>

            <div className="space-y-4">
              {/* Search & Filter Tray */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="SEARCH ARCHIVE BY ITEM OR ID..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="flex-1 bg-bg-surface border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono"
                />
                <div className="flex gap-2">
                  {(["ALL", "DELIVERED", "IN TRANSIT"] as const).map((status) => {
                    const getCount = (st: "ALL" | "DELIVERED" | "IN TRANSIT") => {
                      if (st === "ALL") return orders.length;
                      return orders.filter(o => o.status === st).length;
                    };
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          statusFilter === status
                            ? "bg-accent border-accent text-white"
                            : "border-border-subtle text-chrome hover:text-text-primary hover:border-chrome"
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-mono font-bold leading-none ${
                          statusFilter === status
                            ? "bg-white text-accent animate-pulse"
                            : "bg-bg-surface border border-border-subtle/50 text-chrome"
                        }`}>
                          {getCount(status)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {orderSearchQuery.trim() && (
                <div className="text-[9px] text-accent font-mono font-bold tracking-widest uppercase text-left py-1">
                  FOUND {filteredOrders.length} ARCHIVE {filteredOrders.length === 1 ? "TRANSACTION" : "TRANSACTIONS"} MATCHING "{orderSearchQuery}"
                </div>
              )}

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                  key={order.id}
                  onClick={() => toggleOrderExpand(order.id)}
                  className="bg-bg-surface border border-border-subtle/50 p-6 flex flex-col justify-between gap-4 hover:border-chrome/40 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 w-full">
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-accent select-all">{order.id}</span>
                        <span className="text-[10px] text-chrome uppercase tracking-wider">{order.date}</span>
                      </div>
                      <h4 className="text-sm uppercase tracking-wider font-semibold text-text-primary">
                        {order.item}
                      </h4>
                      <p className="text-xs text-chrome uppercase tracking-widest">
                        COLOR: {order.color} | SIZE: {order.size}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-4">
                      <span className="text-sm font-sans font-bold tabular-nums">
                        ₹{(order.price / 100).toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`text-[9px] font-bold tracking-widest px-3 py-1 border uppercase font-mono ${
                          order.status === "DELIVERED"
                            ? "bg-bg-primary text-text-primary border-border-subtle"
                            : order.status === "CANCELLED"
                            ? "bg-bg-primary text-chrome/50 border-border-subtle/40 line-through"
                            : order.status.includes("RETURN")
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-accent/15 text-accent border-accent/20 animate-pulse"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full border-t border-border-subtle/30 pt-6 mt-2 space-y-6 overflow-hidden"
                        onClick={(e) => e.stopPropagation()} // Stop click bubbling
                      >
                        <div className="flex justify-between items-center relative py-2">
                          {/* Connecting Line */}
                          <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-border-subtle/30 z-0" />
                          
                          {getTimelineSteps(order.status).map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center z-10 space-y-2 flex-1 relative">
                              {/* Circle Node */}
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                  step.active
                                    ? "bg-accent border-accent text-white scale-110 shadow-lg shadow-accent/20"
                                    : "bg-bg-surface border-border-subtle text-chrome"
                                }`}
                              >
                                {step.active && <span className="w-1 h-1 rounded-full bg-white" />}
                              </div>
                              {/* Label */}
                              <span
                                className={`text-[8px] tracking-wider font-mono font-bold text-center uppercase ${
                                  step.active ? "text-text-primary" : "text-chrome/30"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                          <div className="flex flex-col sm:flex-row items-center justify-between border border-border-subtle/30 p-4 bg-bg-surface/20 gap-3">
                            <OrderCountdown status={order.status} />
                            <div className="flex items-center gap-3">
                              {refreshingOrderId === order.id && (
                                <span className="text-[9px] text-accent tracking-widest font-mono font-bold animate-pulse">
                                  CONNECTING APIS ({refreshLatency.toFixed(1)}S)
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRefreshLogistics(order.id)}
                                className="bg-bg-primary hover:bg-bg-surface border border-border-subtle hover:border-accent text-chrome hover:text-accent p-2 rounded-full transition-all cursor-pointer flex items-center justify-center shadow-sm"
                                title="REFRESH LOGISTICS STATUS"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  className={`w-4 h-4 ${refreshingOrderId === order.id ? "animate-spin text-accent" : ""}`}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Transaction Price Breakdown */}
                        <div className="border-t border-border-subtle/20 pt-4 space-y-2 select-none text-left">
                          <span className="text-[9px] text-accent tracking-[0.15em] font-mono font-bold block uppercase">
                            TRANSACTION COST BREAKDOWN
                          </span>
                          <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-mono uppercase tracking-wider text-chrome">
                            <span>Item Subtotal:</span>
                            <span className="text-right text-text-primary">
                              ₹{((order.price - Math.round(order.price * 0.18)) / 100).toLocaleString("en-IN")}
                            </span>

                            <span>GST Tax (18%):</span>
                            <span className="text-right text-text-primary">
                              ₹{(Math.round(order.price * 0.18) / 100).toLocaleString("en-IN")}
                            </span>

                            <span>Shipping Protocol:</span>
                            <span className="text-right text-accent font-bold">FREE</span>

                            <span className="border-t border-border-subtle/30 pt-1.5 font-bold text-text-primary">Total Paid:</span>
                            <span className="border-t border-border-subtle/30 pt-1.5 font-bold text-right text-text-primary text-xs">
                              ₹{(order.price / 100).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Invoice download simulation */}
                        <div className="border-t border-border-subtle/20 pt-4">
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order.id)}
                            className="w-full bg-bg-surface hover:bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent py-3 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
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
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                              />
                            </svg>
                            DOWNLOAD INVOICE PROTOCOL
                          </button>
                        </div>

                        {/* Return/Cancel actions */}
                        {order.status !== "CANCELLED" && !order.status.includes("RETURN") && (
                          <div className="border-t border-border-subtle/20 pt-4 flex flex-col gap-4">
                          {order.status === "DELIVERED" ? (
                            <div className="space-y-4">
                              <span className="text-[9px] text-chrome tracking-wider uppercase font-bold block text-left">
                                INITIATE ARCHIVE RETURN
                              </span>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="REASON FOR RETURN (E.G. SIZE TOO BIG)..."
                                  className="flex-1 bg-bg-primary border border-border-subtle p-2.5 text-[10px] tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono"
                                  id={`reason-${order.id}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleActionSubmit(order.id, "RETURN")}
                                  className="bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  SUBMIT REQUEST
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <span className="text-[9px] text-chrome tracking-wider uppercase font-bold block text-left">
                                CANCEL DISPATCH PROTOCOL
                              </span>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="REASON FOR CANCELLATION..."
                                  className="flex-1 bg-bg-primary border border-border-subtle p-2.5 text-[10px] tracking-wider outline-none focus:border-accent text-text-primary uppercase font-mono"
                                  id={`reason-${order.id}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleActionSubmit(order.id, "CANCEL")}
                                  className="bg-bg-primary border border-border-subtle hover:border-accent text-chrome hover:text-accent px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                >
                                  CANCEL ORDER
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
              ) : (
                <div className="text-center py-16 border border-dashed border-border-subtle/50 rounded-lg">
                  <p className="text-chrome uppercase tracking-widest text-xs">
                    No matching archives found inside your orders.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
