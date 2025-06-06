'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const CartContext = createContext();
const API_URL = '/cart';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await api.get(API_URL);
        setCart(response.data);
      } catch (err) {
        console.error('Failed to load cart from API:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const syncItem = async (item) => {
    if (item?.id) {
      try {
        await api.put(`${API_URL}/${item.id}`, item);
      } catch (err) {
        console.warn('Sync failed for item:', item, err);
      }
    }
  };

  const addToCart = async (product, quantity = 1, notes = '') => {
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      const updated = cart.map(i =>
        i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
      );
      setCart(updated);
      const item = updated.find(i => i.productId === product.id);
      await syncItem(item);
    } else {
      const newItem = {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        quantity,
        notes
      };
      try {
        const res = await api.post(API_URL, newItem);
        setCart(prev => [...prev, res.data]);
      } catch {
        // fallback if API is offline
        const fallback = { ...newItem, id: Date.now() };
        setCart(prev => [...prev, fallback]);
      }
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    const updated = cart.map(i =>
      i.id === id || i.productId === id ? { ...i, quantity } : i
    );
    setCart(updated);
    const item = updated.find(i => i.id === id || i.productId === id);
    await syncItem(item);
  };

  const addNotes = async (id, notes) => {
    const updated = cart.map(i =>
      i.id === id || i.productId === id ? { ...i, notes } : i
    );
    setCart(updated);
    const item = updated.find(i => i.id === id || i.productId === id);
    await syncItem(item);
  };

  const removeFromCart = async (id) => {
    const item = cart.find(i => i.id === id || i.productId === id);
    setCart(prev => prev.filter(i => i.id !== id && i.productId !== id));
    if (item?.id) {
      try {
        await api.delete(`${API_URL}/${item.id}`);
      } catch (err) {
        console.warn('Delete failed:', item.id, err);
      }
    }
  };

  const clearCart = async () => {
    for (const item of cart) {
      if (item?.id) {
        try {
          await api.delete(`${API_URL}/${item.id}`);
        } catch (err) {
          console.warn('Failed to delete item during clearCart:', item.id, err);
        }
      }
    }
    setCart([]);
  };

  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cart,
      isLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      addNotes,
      clearCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
