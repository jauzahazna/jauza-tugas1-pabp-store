import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
}

interface CartState {
  cart: Product[];
  notification: string | null; // State untuk animasi tab/toast
  showNotification: (msg: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  cartTotal: () => number;
  cartTotalPrice: () => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        notification: null,

        showNotification: (msg) => {
          set({ notification: msg }, false, "cart/showNotification");
          // Tab akan hilang otomatis setelah 3 detik
          setTimeout(() => {
            set({ notification: null }, false, "cart/hideNotification");
          }, 3000);
        },

        addToCart: (product) => {
          set(
            (state) => ({ cart: [...state.cart, product] }),
            false,
            "cart/addToCart",
          );

          // Ini yang memicu Toast-nya muncul!
          get().showNotification(
            `Berhasil menambah ${product.title.substring(0, 15)}...`,
          );
        },
        removeFromCart: (indexToRemove) => {
          set(
            (state) => {
              const newCart = [...state.cart];
              newCart.splice(indexToRemove, 1);
              return { cart: newCart };
            },
            false,
            "cart/removeFromCart",
          );
        },

        cartTotal: () => get().cart.length,
        cartTotalPrice: () => {
          const totalUSD = get().cart.reduce(
            (total, item) => total + item.price,
            0,
          );
          return Math.round(totalUSD * 15000);
        },
        clearCart: () => set({ cart: [] }, false, "cart/clearCart"),
      }),
      { name: "zaastore-storage" },
    ),
    { name: "ZaaStore-State" },
  ),
);
