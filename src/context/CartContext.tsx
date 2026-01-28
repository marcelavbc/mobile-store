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
  // Initialize state from localStorage using lazy initialization
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

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
