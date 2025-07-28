import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);

  const cartKey = user ? `cart_${user.id || user._id || user.username}` : null;

  // Load cart from localStorage
  useEffect(() => {
    if (cartKey) {
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    }
  }, [cartKey]);

  // Save cart to localStorage
  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey]);

  //  Prevent adding more than stock
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingItem = prev.find((p) => p._id === item._id);
      if (existingItem) {
        if (existingItem.quantity < item.stock) {
          return prev.map((p) =>
            p._id === item._id ? { ...p, quantity: p.quantity + 1 } : p
          );
        } else {
          alert(`Maximum stock reached for "${item.name}".`);
          return prev;
        }
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  //  Prevent increasing quantity above stock
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const newQty = item.quantity + delta;
          if (newQty < 1) return { ...item, quantity: 1 };
          if (newQty > item.stock) {
            alert(`Only ${item.stock} "${item.name}" available in stock.`);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems,addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
