import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();
  const initialized = useRef(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/cart');
      const cartData = res.data.cart;
      setCart(cartData);
      const count = cartData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 404) {
        setCart({ items: [], totalAmount: 0 });
        setCartCount(0);
      }
    }
  }, [user]);

  useEffect(() => {
    if (initialized.current) return;

    if (user) {
      initialized.current = true;
      fetchCart();
    } else {
      setCart(null);
      setCartCount(0);
      initialized.current = false;
    }
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    try {
      const res = await api.post('/cart/add', { productId, quantity });
      const cartData = res.data.cart;
      setCart(cartData);
      const count = cartData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      setCartCount(count);
      toast.success('Added to cart!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/cart/update/${itemId}`, { quantity });
      const cartData = res.data.cart;
      setCart(cartData);
      const count = cartData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      setCartCount(count);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      toast.error(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/remove/${itemId}`);
      const cartData = res.data.cart;
      setCart(cartData);
      const count = cartData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      setCartCount(count);
      toast.success('Item removed from cart');
      return { success: true };
    } catch (error) {
      toast.error('Failed to remove item');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart/clear');
      const cartData = res.data.cart;
      setCart(cartData);
      setCartCount(0);
      toast.success('Cart cleared');
      return { success: true };
    } catch (error) {
      toast.error('Failed to clear cart');
      return { success: false };
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart,
      fetchCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};