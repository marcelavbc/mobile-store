'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  totalPrice: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'mobile_store_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  // To avoid hydration errors, we start with an empty cart and then hydrate from localStorage on mount.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate from localStorage (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? (JSON.parse(raw) as CartItem[]) : []);
    } catch {
      setItems([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Persist
  useEffect(() => {
    // Prevent overwriting localStorage with an empty cart before hydration completes
    if (!hasHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hasHydrated]);

  const addItem = (item: CartItem) => {
    // Spec says: show phones added; no quantity UI in Figma.
    // We’ll avoid duplicates by lineId (same phone+storage+color).
    setItems((prev) => (prev.some((p) => p.lineId === item.lineId) ? prev : [...prev, item]));
  };

  const removeItem = (lineId: string) => {
    setItems((prev) => prev.filter((p) => p.lineId !== lineId));
  };

  const clear = () => setItems([]);

  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice, 0);
  const count = items.length;

  const value: CartContextValue = { items, addItem, removeItem, clear, totalPrice, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
