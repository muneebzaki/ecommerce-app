'use client';
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart from API
  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cart');
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Fallback to localStorage if API fails
        if (typeof window !== 'undefined') {
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            setCart(JSON.parse(localCart));
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    getCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
      // Attempt to sync with API
      if (cart.length > 0) {
        syncCartWithApi();
      }
    }
  }, [cart, isLoading]);

  // Sync cart with API
  const syncCartWithApi = async () => {
    try {
      // For simplicity, we'll just get each cart item and update or add it
      for (const item of cart) {
        if (item.id) {
          await axios.put(`http://localhost:5000/cart/${item.id}`, item);
        } else {
          const response = await axios.post('http://localhost:5000/cart', item);
          // Update local cart item with ID from server
          setCart(prevCart => 
            prevCart.map(cartItem => 
              cartItem === item ? { ...response.data } : cartItem
            )
          );
        }
      }
    } catch (error) {
      console.error('Error syncing cart with API:', error);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1, notes = '') => {
    console.log('CartContext addToCart called with:', product, quantity);
    
    if (!product || !product.id) {
      console.error('Invalid product provided to addToCart');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      console.log('Updating existing item in cart');
      const updatedCart = cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: (item.quantity || 1) + quantity } 
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item
      console.log('Adding new item to cart');
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        notes
      };

      try {
        const response = await axios.post('http://localhost:5000/cart', newItem);
        console.log('API response:', response.data);
        setCart(prevCart => [...prevCart, response.data]);
      } catch (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local state if API fails
        console.log('Falling back to local state for cart');
        setCart(prevCart => [...prevCart, newItem]);
      }
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === itemId || item.productId === itemId
        ? { ...item, quantity } 
        : item
    );
    
    setCart(updatedCart);
    
    try {
      const item = cart.find(i => i.id === itemId || i.productId === itemId);
      if (item && item.id) {
        await axios.put(`http://localhost:5000/cart/${item.id}`, { ...item, quantity });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Add notes to item
  const addNotes = async (itemId, notes) => {
    const updatedCart = cart.map(item => 
      item.id === itemId || item.productId === itemId
        ? { ...item, notes } 
        : item
    );
    
    setCart(updatedCart);
    
    try {
      const item = cart.find(i => i.id === itemId || i.productId === itemId);
      if (item && item.id) {
        await axios.put(`http://localhost:5000/cart/${item.id}`, { ...item, notes });
      }
    } catch (error) {
      console.error('Error updating cart item notes:', error);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const itemToRemove = cart.find(item => item.id === itemId || item.productId === itemId);
    
    setCart(cart.filter(item => item.id !== itemId && item.productId !== itemId));
    
    try {
      if (itemToRemove && itemToRemove.id) {
        await axios.delete(`http://localhost:5000/cart/${itemToRemove.id}`);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      // Delete all items from API
      for (const item of cart) {
        if (item.id) {
          await axios.delete(`http://localhost:5000/cart/${item.id}`);
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
    
    setCart([]);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const contextValue = {
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    addNotes,
    getTotalPrice,
    isLoading
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 