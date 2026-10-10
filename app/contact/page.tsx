"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/lib/store/toastStore";

// Zod validation schema (Section 7.3.2)
const contactSchema = z.object({
  name: z.string().min(2, { message: "NAME REQUIRED (MIN 2 CHARS)." }),
  email: z.string().email({ message: "VALID EMAIL REQUIRED." }),
  subject: z.string().min(3, { message: "SUBJECT REQUIRED." }),
  message: z.string().min(10, { message: "MESSAGE REQUIRED (MIN 10 CHARS)." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const faqs = [
  {
    question: "WHAT IS THE DISPATCH TIMELINE FOR EXCLUSIVE ARCHIVES?",
    answer: "Orders are processed within 24-48 business hours. Delivery takes 3-5 business days for domestic shipments and 5-10 business days for international orders, complete with end-to-end tracking."
  },
  {
    question: "WHAT IS YOUR RETURN AND REFUND POLICY?",
    answer: "We support a 14-day return window from the delivery date for all unworn, unwashed items in original packaging. Return shipping is managed securely through our portal."
  },
  {
    question: "CAN I CANCEL OR MODIFY AN ACTIVE ORDER?",
    answer: "Given our rapid fulfillment sequence, order modifications are only available within 60 minutes of checkout. Contact support immediately for urgent queue holds."
  }
];

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success">("idle");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [requestCallback, setRequestCallback] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("MORNING (09:00 - 12:00)");
  const [selectedDeskLocation, setSelectedDeskLocation] = useState("LONDON (GMT)");
  
  // Private Atelier Showroom Session State
  const [showroomLocation, setShowroomLocation] = useState("LONDON MAYFAIR");
  const [sessionType, setSessionType] = useState("PRIVATE ARCHIVE FITTING");
  const [sessionDate, setSessionDate] = useState("THU, OCT 15");
  const [sessionTime, setSessionTime] = useState("11:00 AM");
  const [clientGuestCount, setClientGuestCount] = useState("SOLO VIP (1)");
  const [bookingPassCode, setBookingPassCode] = useState<string | null>(null);
  const [isBookingSession, setIsBookingSession] = useState(false);
  
  const { addToast } = useToastStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const emailValue = watch("email", "");
  const messageValue = watch("message", "");
  const subjectValue = watch("subject", "");
  const nameValue = watch("name", "");

  const onSubmit = async (data: ContactFormValues) => {
    setSubmitStatus("loading");
    // Simulate network submission delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitStatus("success");
    if (requestCallback) {
      addToast(
        `INQUIRY & VIP CALLBACK SCHEDULED (${selectedDeskLocation} / ${selectedTimeSlot})`,
        "success"
      );
    } else {
      addToast("INQUIRY SUBMITTED TO CONCIERGE QUEUE", "success");
    }
    reset();
    setRequestCallback(false);
    setTimeout(() => setSubmitStatus("idle"), 5000);
  };

  const handleBookSession = () => {
    setIsBookingSession(true);
    setTimeout(() => {
      setIsBookingSession(false);
      const locCode = showroomLocation.split(" ")[0].slice(0, 3).toUpperCase();
      const generatedCode = `ATELIER-${locCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingPassCode(generatedCode);
      addToast(`PRIVATE SHOWROOM RESERVED: ${generatedCode} (${showroomLocation})`, "success");
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-bg-primary pt-32 pb-24 px-6 md:px-12 text-left flex flex-col justify-center">
      <div className="max-w-[1600px] mx-auto w-full space-y-16">
        
        {/* Main Grid: Info and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Information and FAQs */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <span className="text-xs text-accent tracking-[0.25em] font-bold uppercase block mb-1">
              SUPPORT SECTOR
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-wider text-text-primary uppercase leading-tight">
              CONNECT WITH THE KINGDOM
            </h1>
            <p className="text-chrome text-sm mt-4 leading-relaxed font-sans">
              Have questions regarding garment metrics, fit sizing, or dispatch delivery? Access our communication queues.
            </p>
          </div>

          {/* Social Links (monoline chrome-style, Section 7.3.2) */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase">
              DIRECT LINES
            </h4>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "INSTAGRAM", handle: "@prince.brand" },
                { name: "X-TWITTER", handle: "@prince_garments" },
                { name: "DISCORD", handle: "PRINCE VAULT" },
              ].map((channel) => (
                <motion.button
                  key={channel.name}
                  type="button"
                  whileHover={{ y: -2, scale: 1.02 }}
                  onClick={() => {
                    addToast(`ROUTING TO ${channel.name} CONCIERGE LINE (${channel.handle})`, "info");
                  }}
                  className="text-xs font-bold tracking-widest text-chrome hover:text-accent border border-border-subtle hover:border-accent px-4 py-2.5 bg-bg-surface transition-all cursor-pointer outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] flex items-center gap-2"
                >
                  <span>{channel.name}</span>
                  <span className="text-[8px] text-chrome/50 font-mono font-normal">
                    {channel.handle}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Global Atelier Concierge Operating Desks */}
          <div className="space-y-3 pt-6 border-t border-border-subtle/30">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase">
                GLOBAL ATELIER OPERATING DESKS
              </h4>
              <span className="text-[8px] font-mono text-chrome tracking-widest uppercase">
                24/7 ROTATIONAL COVERAGE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { city: "LONDON ATELIER", timezone: "GMT+0", hours: "09:00 - 18:00 GMT", status: "DESK ACTIVE" },
                { city: "NEW YORK DESK", timezone: "EST", hours: "10:00 - 19:00 EST", status: "DESK ACTIVE" },
                { city: "TOKYO VAULT", timezone: "JST", hours: "09:00 - 18:00 JST", status: "DESK ACTIVE" },
                { city: "MUMBAI DISPATCH", timezone: "IST", hours: "10:00 - 20:00 IST", status: "DESK ACTIVE" },
              ].map((desk, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-bg-surface/50 border border-border-subtle/50 space-y-1 text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-text-primary uppercase">
                      {desk.city}
                    </span>
                    <span className="text-[8px] font-mono text-accent font-bold tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      {desk.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-chrome/70 uppercase">
                    <span>TZ: {desk.timezone}</span>
                    <span>{desk.hours}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Hotline & Encrypted Chat Trigger Trays */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText("+1-800-840-7762");
                  addToast("PRIORITY CONCIERGE HOTLINE COPIED: +1 (800) 840-PRNC", "success");
                }
              }}
              className="w-full p-3 bg-bg-surface hover:bg-bg-primary border border-border-subtle hover:border-accent text-left transition-all cursor-pointer flex items-center justify-between outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] group"
            >
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">VIP INSTANT CALL LINE</span>
                <span className="text-[10px] font-mono font-bold text-text-primary group-hover:text-accent transition-colors">
                  +1 (800) 840-PRNC (TOLL-FREE)
                </span>
              </div>
              <span className="text-[9px] font-mono text-accent uppercase font-bold opacity-80 group-hover:opacity-100">
                COPY ⎘
              </span>
            </button>
          </div>

          {/* FAQs Accordion Pattern (Section 7.3.2) */}
          <div className="space-y-4 pt-6 border-t border-border-subtle/30">
            <h4 className="text-[10px] text-accent tracking-[0.2em] font-bold uppercase mb-4">
              COMMON INQUIRIES
            </h4>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-border-subtle/20 pb-4">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center text-left text-xs font-bold uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-2 cursor-pointer outline-none focus:text-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] rounded px-1 -mx-1"
                  >
                    <span>{faq.question}</span>
                    <span className="text-base">{isOpen ? "−" : "+"}</span>
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-chrome leading-relaxed font-sans mt-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Glassmorphism Form panel (Section 7.3.2) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl space-y-8 relative overflow-hidden">
            
            <div className="text-left border-b border-border-subtle/50 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg tracking-[0.15em] font-semibold uppercase">
                  SECURE CONCIERGE QUEUE
                </h3>
                <p className="text-[10px] text-chrome/50 uppercase tracking-widest mt-1">
                  Submissions routed immediately to staff.
                </p>
              </div>
              {(nameValue || emailValue || subjectValue || messageValue) && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    addToast("INQUIRY DRAFT CLEARED", "info");
                  }}
                  className="text-[9px] font-mono tracking-widest uppercase text-chrome/60 hover:text-accent border border-border-subtle hover:border-accent px-2.5 py-1 transition-colors outline-none focus:text-accent focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                >
                  RESET FORM
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Name */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-chrome tracking-wider uppercase block">
                    NAME
                  </label>
                  <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                    nameValue.length >= 22 ? "text-error font-bold" : "text-chrome/50"
                  }`}>
                    {nameValue.length} / 30 CHARS
                  </span>
                </div>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="ENTER NAME"
                  maxLength={30}
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                />
                {errors.name && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-chrome tracking-wider uppercase block">
                    EMAIL ADDRESS
                  </label>
                  <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                    emailValue.length >= 40 ? "text-error font-bold" : "text-chrome/50"
                  }`}>
                    {emailValue.length} / 50 CHARS
                  </span>
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="ENTER EMAIL ADDRESS"
                  maxLength={50}
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                />
                {errors.email && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-chrome tracking-wider uppercase block">
                    SUBJECT
                  </label>
                  <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                    subjectValue.length >= 30 ? "text-error font-bold" : "text-chrome/50"
                  }`}>
                    {subjectValue.length} / 40 CHARS
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {["ORDER INQUIRY", "SIZE ADVISORY", "DISPATCH LOGISTICS", "SPECIAL REQUEST"].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        setValue("subject", topic, { shouldValidate: true });
                        addToast(`SUBJECT TOPIC APPLIED: ${topic}`, "info");
                      }}
                      className={`text-[9px] font-mono tracking-wider px-2.5 py-1 border transition-all cursor-pointer outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                        subjectValue === topic
                          ? "border-accent bg-accent/15 text-accent font-bold"
                          : "border-border-subtle/50 text-chrome/60 hover:border-chrome hover:text-text-primary bg-bg-primary/50"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  {...register("subject")}
                  placeholder="ENTER SUBJECT"
                  maxLength={40}
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                />
                {errors.subject && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-chrome tracking-wider uppercase block">
                    MESSAGE BODY
                  </label>
                  <span className={`text-[9px] font-mono tracking-widest uppercase transition-colors duration-200 ${
                    messageValue.length >= 250 ? "text-error font-bold" : "text-chrome/50"
                  }`}>
                    {messageValue.length} / 300 CHARS
                  </span>
                </div>
                <textarea
                  rows={4}
                  {...register("message")}
                  placeholder="ENTER INQUIRY DESCRIPTION..."
                  maxLength={300}
                  className="w-full bg-bg-primary border border-border-subtle p-3 text-xs tracking-wider outline-none focus:border-accent text-text-primary uppercase resize-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                />
                {errors.message && (
                  <p className="text-[10px] text-error uppercase font-semibold tracking-wider mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* VIP Callback Protocol Selector (Optional) */}
              <div className="border border-border-subtle/50 p-4 bg-bg-primary/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={requestCallback}
                      onChange={(e) => {
                        setRequestCallback(e.target.checked);
                        if (e.target.checked) {
                          addToast("VIP CALL BACK PROTOCOL ATTACHED", "info");
                        }
                      }}
                      className="accent-accent w-4 h-4 cursor-pointer outline-none focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                    />
                    <span className="text-[10px] font-mono font-bold text-text-primary uppercase tracking-wider">
                      REQUEST SCHEDULED VIP CALL BACK
                    </span>
                  </label>
                  <span className="text-[8px] font-mono text-accent uppercase font-bold tracking-widest">
                    OPTIONAL
                  </span>
                </div>

                {requestCallback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2 border-t border-border-subtle/30"
                  >
                    <div>
                      <span className="text-[8px] font-mono text-chrome block uppercase mb-1.5">
                        PREFERRED TIME WINDOW
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                        {["MORNING (09:00 - 12:00)", "AFTERNOON (13:00 - 17:00)", "EVENING (18:00 - 21:00)"].map(
                          (slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`p-2 text-[8px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer text-center outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                                selectedTimeSlot === slot
                                  ? "bg-accent text-white border-accent"
                                  : "bg-bg-surface text-chrome border-border-subtle hover:border-accent hover:text-accent"
                              }`}
                            >
                              {slot}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] font-mono text-chrome block uppercase mb-1.5">
                        DESK TIMEZONE
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {["LONDON (GMT)", "NEW YORK (EST)", "MUMBAI (IST)", "TOKYO (JST)"].map((tz) => (
                          <button
                            key={tz}
                            type="button"
                            onClick={() => setSelectedDeskLocation(tz)}
                            className={`p-2 text-[8px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer text-center outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)] ${
                              selectedDeskLocation === tz
                                ? "bg-accent text-white border-accent"
                                : "bg-bg-surface text-chrome border-border-subtle hover:border-accent hover:text-accent"
                            }`}
                          >
                            {tz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Submit Button with loader morph and checkmark animations (Section 7.3.2) */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="w-full bg-accent text-white hover:bg-accent-hover py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative flex items-center justify-center min-h-[52px] cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
                >
                  <AnimatePresence mode="wait">
                    {submitStatus === "idle" && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        SUBMIT INQUIRY
                      </motion.span>
                    )}
                    {submitStatus === "loading" && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-1.5"
                      >
                        {/* Subtle pulsing dots replacing generic spinners */}
                        <span className="w-2.5 h-2.5 rounded-full bg-black/60 animate-pulse-slow" />
                        <span className="w-2.5 h-2.5 rounded-full bg-black/60 animate-pulse-slow delay-75" />
                        <span className="w-2.5 h-2.5 rounded-full bg-black/60 animate-pulse-slow delay-150" />
                      </motion.div>
                    )}
                    {submitStatus === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-accent font-bold"
                      >
                        {/* Framer Motion path-draw SVG checkmark */}
                        <svg
                          className="w-5 h-5 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.4 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        SUBMISSION COMPLETE
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* Private Atelier Showroom VIP Reservation Protocol */}
      <div className="border border-border-subtle/50 bg-bg-surface/30 p-8 md:p-12 space-y-8 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-subtle/40 pb-5 gap-3">
          <div>
            <span className="text-[10px] text-accent font-mono font-bold tracking-[0.25em] uppercase block">
              PRIVATE SALON ACCESS
            </span>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-wider text-text-primary uppercase mt-1">
              ATELIER SHOWROOM VIP RESERVATION
            </h2>
          </div>
          <span className="text-[9px] font-mono text-chrome/60 uppercase tracking-widest border border-border-subtle/40 px-3 py-1.5 self-start md:self-auto bg-bg-primary/40">
            BY INVITATION & APPOINTMENT ONLY
          </span>
        </div>

        {bookingPassCode ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 bg-accent/10 border border-accent/40 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accent/30 pb-4">
              <div>
                <span className="text-[9px] font-mono text-accent uppercase font-bold tracking-widest block">
                  CONFIRMED VIP SALON PASS
                </span>
                <span className="text-xl md:text-2xl font-mono font-bold text-accent tracking-[0.2em] mt-1 block">
                  {bookingPassCode}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(bookingPassCode);
                      addToast(`PASS KEY COPIED: ${bookingPassCode}`, "success");
                    }
                  }}
                  className="px-4 py-2 bg-accent text-bg-primary hover:bg-accent-hover text-[10px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)]"
                >
                  COPY PASS KEY ⎘
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingPassCode(null);
                    addToast("MODIFIED SALON APPOINTMENT PROTOCOL", "info");
                  }}
                  className="px-4 py-2 border border-accent/40 text-accent hover:border-accent text-[10px] font-mono font-bold uppercase tracking-widest transition-colors cursor-pointer outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                >
                  RE-SCHEDULE
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">ATELIER LOCATION</span>
                <span className="text-xs font-mono font-bold text-text-primary uppercase mt-0.5 block">{showroomLocation}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">PROTOCOL TYPE</span>
                <span className="text-xs font-mono font-bold text-text-primary uppercase mt-0.5 block">{sessionType}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">DATE & SLOT</span>
                <span className="text-xs font-mono font-bold text-accent uppercase mt-0.5 block">{sessionDate} @ {sessionTime}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-chrome block uppercase">GUEST PASS</span>
                <span className="text-xs font-mono font-bold text-text-primary uppercase mt-0.5 block">{clientGuestCount}</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Showroom Location */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                01. SELECT ATELIER SHOWROOM LOCATION
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { name: "LONDON MAYFAIR", address: "44 BOND STREET, W1S" },
                  { name: "NEW YORK SOHO", address: "102 MERCER STREET, NY" },
                  { name: "TOKYO GINZA", address: "6-10-1 GINZA, CHUO" },
                  { name: "MUMBAI BANDRA", address: "PRINCE ATELIER, WEST" },
                ].map((loc) => {
                  const isSelected = showroomLocation === loc.name;
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setShowroomLocation(loc.name)}
                      className={`p-3 text-left border transition-all cursor-pointer outline-none flex flex-col justify-between ${
                        isSelected
                          ? "border-accent bg-accent/15 text-accent ring-1 ring-accent/30 shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                          : "border-border-subtle/50 bg-bg-primary/40 text-chrome hover:border-accent/60 hover:text-text-primary"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? "text-accent" : "text-text-primary"}`}>
                        {loc.name}
                      </span>
                      <span className="text-[8px] font-mono text-chrome/50 uppercase mt-1">
                        {loc.address}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                02. SELECT SESSION PROTOCOL
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { type: "PRIVATE ARCHIVE FITTING", desc: "1-on-1 private styling & drape analysis" },
                  { type: "BESPOKE MONOGRAM SALON", desc: "Live laser monogramming workshop" },
                  { type: "COLLECTION PRE-RELEASE", desc: "VIP preview of upcoming vault drop" },
                ].map((item) => {
                  const isSelected = sessionType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSessionType(item.type)}
                      className={`p-3 text-left border transition-all cursor-pointer outline-none ${
                        isSelected
                          ? "border-accent bg-accent/15 text-accent ring-1 ring-accent/30 shadow-[0_0_12px_rgba(212,163,89,0.15)]"
                          : "border-border-subtle/50 bg-bg-primary/40 text-chrome hover:border-accent/60 hover:text-text-primary"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${isSelected ? "text-accent" : "text-text-primary"}`}>
                        {item.type}
                      </span>
                      <span className="text-[8px] font-mono text-chrome/50 uppercase mt-0.5 block">
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                  03. PREFERRED DATE
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["THU, OCT 15", "FRI, OCT 16", "SAT, OCT 17", "SUN, OCT 18"].map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSessionDate(date)}
                      className={`py-2 px-1 text-center border text-[9px] font-mono font-bold uppercase transition-all cursor-pointer outline-none ${
                        sessionDate === date
                          ? "bg-accent text-bg-primary border-accent"
                          : "border-border-subtle/50 bg-bg-primary/40 text-chrome hover:border-accent hover:text-accent"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      {date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono text-chrome/70 uppercase tracking-widest font-bold block">
                  04. PREFERRED TIME SLOT
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["11:00 AM", "02:30 PM", "05:00 PM", "07:30 PM"].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSessionTime(time)}
                      className={`py-2 px-1 text-center border text-[9px] font-mono font-bold uppercase transition-all cursor-pointer outline-none ${
                        sessionTime === time
                          ? "bg-accent text-bg-primary border-accent"
                          : "border-border-subtle/50 bg-bg-primary/40 text-chrome hover:border-accent hover:text-accent"
                      } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Guest Capacity and Booking Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border-subtle/30">
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-chrome uppercase tracking-widest">
                  CLIENT CAPACITY:
                </span>
                {["SOLO VIP (1)", "VIP + 1 GUEST (2)"].map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setClientGuestCount(cap)}
                    className={`px-3 py-1 text-[8px] font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer outline-none ${
                      clientGuestCount === cap
                        ? "border-accent text-accent bg-accent/10"
                        : "border-border-subtle/40 text-chrome/60 hover:text-text-primary"
                    } focus:border-accent focus:ring-1 focus:ring-accent/30 focus:shadow-[0_0_12px_rgba(212,163,89,0.15)]`}
                  >
                    {cap}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleBookSession}
                disabled={isBookingSession}
                className="px-8 py-3.5 bg-accent hover:bg-accent-hover text-bg-primary text-xs font-bold uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg shadow-accent/20 outline-none focus:ring-1 focus:ring-accent focus:shadow-[0_0_15px_rgba(212,163,89,0.35)] flex items-center justify-center gap-2"
              >
                {isBookingSession ? (
                  <span className="animate-pulse">CONFIRMING ATELIER PASS...</span>
                ) : (
                  <span>CONFIRM PRIVATE APPOINTMENT</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  </div>
  );
}
