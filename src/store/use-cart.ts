import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuth } from './use-auth';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  carts: Record<string, CartItem[]>; // Keyed by user email
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCart: () => CartItem[];
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      carts: {},

      addToCart: (product) => {
        const email = useAuth.getState().session?.user.email;
        if (!email) return;

        set((state) => {
          const userCart = state.carts[email] || [];
          const existingItem = userCart.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              carts: {
                ...state.carts,
                [email]: userCart.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
              },
            };
          }

          return {
            carts: {
              ...state.carts,
              [email]: [...userCart, { ...product, quantity: 1 }],
            },
          };
        });
      },

      removeFromCart: (id) => {
        const email = useAuth.getState().session?.user.email;
        if (!email) return;

        set((state) => ({
          carts: {
            ...state.carts,
            [email]: (state.carts[email] || []).filter((item) => item.id !== id),
          },
        }));
      },

      updateQuantity: (id, quantity) => {
        const email = useAuth.getState().session?.user.email;
        if (!email) return;
        
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }

        set((state) => ({
          carts: {
            ...state.carts,
            [email]: (state.carts[email] || []).map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          },
        }));
      },

      clearCart: () => {
        const email = useAuth.getState().session?.user.email;
        if (!email) return;

        set((state) => ({
          carts: {
            ...state.carts,
            [email]: [],
          },
        }));
      },

      getCart: () => {
        const email = useAuth.getState().session?.user.email;
        if (!email) return [];
        return get().carts[email] || [];
      },

      getCartTotal: () => {
        const cart = get().getCart();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        const cart = get().getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'ecommerce-cart-storage',
    }
  )
);
