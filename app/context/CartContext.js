'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

// Helper function to match cart item ID
const matchId = (item, id) => item.id === id || item.productId === id;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1️⃣ Load cart from API or localStorage on first render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cart');
        setCart(response.data);
      } catch (error) {
        console.error('API cart fetch failed. Falling back to localStorage.', error);
        const local = localStorage.getItem('cart');
        if (local) setCart(JSON.parse(local));
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // 2️⃣ Save cart to localStorage + optionally sync with API
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart));
      syncCart(); // Sync with backend when cart updates
    }
  }, [cart, isLoading]);

  // 3️⃣ Sync cart with json-server
  const syncCart = async () => {
    try {
      for (const item of cart) {
        if (item.id) {
          await axios.put(`http://localhost:3000/cart/${item.id}`, item);
        } else {
          const response = await axios.post(`http://localhost:3000/cart`, item);
          setCart(prev =>
            prev.map(i => (i === item ? response.data : i))
          );
        }
      }
    } catch (err) {
      console.error('Error syncing cart to API:', err);
    }
  };

  // 4️⃣ Add to cart
  const addToCart = async (product, quantity = 1, notes = '') => {
    const existingItem = cart.find(item => item.productId === Number(product.id));

    if (existingItem) {
      const updatedCart = cart.map(item =>
        matchId(item, product.id)
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
      setCart(updatedCart);
    } else {
      const newItem = {
        productId: Number(product.id),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        notes,
      };

      try {
        const response = await axios.post('http://localhost:5000/cart', newItem);
        setCart(prev => [...prev, response.data]);
      } catch (err) {
        console.error('Error adding to API cart. Adding locally.', err);
        setCart(prev => [...prev, newItem]);
      }
    }
  };

  // 5️⃣ Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cart.map(item =>
      matchId(item, itemId) ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    try {
      const item = cart.find(i => matchId(i, itemId));
      if (item?.id) {
        await axios.put(`http://localhost:3000/cart/${item.id}`, {
          ...item,
          quantity,
        });
      }
    } catch (err) {
      console.error('Failed to update quantity in API:', err);
    }
  };

  // 6️⃣ Add special notes
  const addNotes = async (itemId, notes) => {
    const updatedCart = cart.map(item =>
      matchId(item, itemId) ? { ...item, notes } : item
    );
    setCart(updatedCart);

    try {
      const item = cart.find(i => matchId(i, itemId));
      if (item?.id) {
        await axios.put(`http://localhost:3000/cart/${item.id}`, {
          ...item,
          notes,
        });
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  // 7️⃣ Remove item
  const removeFromCart = async (itemId) => {
    const itemToRemove = cart.find(i => matchId(i, itemId));
    setCart(cart.filter(item => !matchId(item, itemId)));

    try {
      if (itemToRemove?.id) {
        await axios.delete(`http://localhost:3000/cart/${itemToRemove.id}`);
      }
    } catch (err) {
      console.error('Failed to remove item from API:', err);
    }
  };

  // 8️⃣ Clear all items
  const clearCart = async () => {
    try {
      for (const item of cart) {
        if (item?.id) {
          await axios.delete(`http://localhost:3000/cart/${item.id}`);
        }
      }
    } catch (err) {
      console.error('Failed to clear cart from API:', err);
    }
    setCart([]);
  };

  // 9️⃣ Get total price
  const getTotalPrice = () =>
    cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  // ✅ Provide everything to the rest of app
  const value = {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    addNotes,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use in components
export function useCart() {
  return useContext(CartContext);
}
