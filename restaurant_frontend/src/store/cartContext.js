import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from '../utils/storage';

const CartCtx = createContext(null);

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Provides cart state with localStorage persistence. */
  const [items, setItems] = useState(() => storage.get('cart:v1', []));

  useEffect(() => {
    storage.set('cart:v1', items);
  }, [items]);

  const addItem = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((p) => p.id !== id);
      }
      return prev.map((p) => p.id === id ? { ...p, quantity } : p);
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setItems([]);

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clear }), [items]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Access cart context. */
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
