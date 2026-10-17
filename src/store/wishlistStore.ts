import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../lib/storage';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  hoursNeeded: number;
  createdAt: string;
  isPurchased?: boolean;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (title: string, price: number, hourlyRate: number) => void;
  removeItem: (id: string) => void;
  togglePurchased: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (title: string, price: number, hourlyRate: number) => {
        const hoursNeeded = hourlyRate > 0 ? Math.round((price / hourlyRate) * 10) / 10 : 0;
        const newItem: WishlistItem = {
          id: Date.now().toString(),
          title,
          price,
          hoursNeeded,
          createdAt: new Date().toISOString(),
          isPurchased: false,
        };

        set((state) => ({
          items: [newItem, ...state.items],
        }));
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      togglePurchased: (id: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
          ),
        }));
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);