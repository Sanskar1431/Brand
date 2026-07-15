import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../products/schema";

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  giftWrap: boolean;
  addItem: (product: Product, color: string, size: string, quantity?: number) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  toggleGiftWrap: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      giftWrap: false,
      
      addItem: (product, color, size, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems };
          }

          return {
            items: [...state.items, { product, selectedColor: color, selectedSize: size, quantity }],
          };
        });
      },

      removeItem: (productId, color, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedColor === color &&
                item.selectedSize === size
              )
          ),
        }));
      },

      updateQuantity: (productId, color, size, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId &&
              item.selectedColor === color &&
              item.selectedSize === size
                ? { ...item, quantity: Math.max(1, quantity) }
                : item
            ),
        }));
      },

      clearCart: () => set({ items: [], giftWrap: false }),

      toggleGiftWrap: () => set((state) => ({ giftWrap: !state.giftWrap })),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },
    }),
    {
      name: "prince-cart", // LocalStorage key
    }
  )
);
