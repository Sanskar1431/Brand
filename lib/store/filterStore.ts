import { create } from "zustand";

interface FilterState {
  category: "tshirt" | "jogger" | undefined;
  color: string | undefined;
  size: string | undefined;
  priceRange: [number, number]; // [min, max] in INR
  search: string;
  sortBy: "price-asc" | "price-desc" | "name" | "newest";
  page: number;
  
  setCategory: (category: "tshirt" | "jogger" | undefined) => void;
  setColor: (color: string | undefined) => void;
  setSize: (size: string | undefined) => void;
  setPriceRange: (range: [number, number]) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: "price-asc" | "price-desc" | "name" | "newest") => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initialPriceRange: [number, number] = [0, 15000];

export const useFilterStore = create<FilterState>((set) => ({
  category: undefined,
  color: undefined,
  size: undefined,
  priceRange: initialPriceRange,
  search: "",
  sortBy: "newest",
  page: 1,

  setCategory: (category) => set({ category, page: 1 }),
  setColor: (color) => set({ color, page: 1 }),
  setSize: (size) => set({ size, page: 1 }),
  setPriceRange: (priceRange) => set({ priceRange, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy }),
  setPage: (page) => set({ page }),
  
  reset: () =>
    set({
      category: undefined,
      color: undefined,
      size: undefined,
      priceRange: initialPriceRange,
      search: "",
      sortBy: "newest",
      page: 1,
    }),
}));
