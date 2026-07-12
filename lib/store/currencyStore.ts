import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyState {
  currency: "INR" | "USD";
  rate: number; // exchange rate from INR to USD
  setCurrency: (currency: "INR" | "USD") => void;
  formatPrice: (priceInINRCent: number) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "INR",
      rate: 0.012,
      setCurrency: (currency) => set({ currency }),
      formatPrice: (priceInINRCent) => {
        const { currency, rate } = get();
        if (currency === "USD") {
          const priceUSD = (priceInINRCent * rate) / 100;
          return `$${priceUSD.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
        const priceINR = priceInINRCent / 100;
        return `₹${priceINR.toLocaleString("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`;
      },
    }),
    {
      name: "prince-currency",
    }
  )
);
