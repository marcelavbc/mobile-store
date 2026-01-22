'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem } from '@/types';

// ============================================
// Types
// ============================================

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

// ============================================
// Context
// ============================================

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mobile-store-cart';

// ============================================
// Provider
// ============================================

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  // Calculate item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + item.storage.price * item.quantity, 0);

  // Add item to cart
  const addItem = (newItem: Omit<CartItem, 'id' | 'quantity'>) => {
    setItems((prev) => {
      // Check if item with same phone, color, and storage already exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.phoneId === newItem.phoneId &&
          item.color.name === newItem.color.name &&
          item.storage.capacity === newItem.storage.capacity
      );

      if (existingIndex >= 0) {
        // Increment quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      // Add new item
      const id = `${newItem.phoneId}-${newItem.color.name}-${newItem.storage.capacity}-${Date.now()}`;
      return [...prev, { ...newItem, id, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all items from cart
  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
