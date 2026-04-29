import React, { createContext, useContext, useState, useEffect } from "react";
import { addKitchenOrder } from "../lib/restaurantData";

interface CartItem { id: string; name: string; price: number; quantity: number; image?: string; }
interface CartContextType {
  items: CartItem[];
  addItem(i: Omit<CartItem, "quantity">): void;
  removeItem(id: string): void;
  updateQuantity(id: string, q: number): void;
  clear(): void;
  total: number;
  count: number;
  isOpen: boolean; setIsOpen(b: boolean): void;
  badgePop: boolean;
  scanMode: boolean; setScanMode(b: boolean): void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("akif-cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [badgePop, setBadgePop] = useState(false);
  const [scanMode, setScanMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("akif-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setBadgePop(true);
    setTimeout(() => setBadgePop(false), 300);
    setTimeout(() => setIsOpen(true), 600);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, q: number) => {
    if (q <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: q } : i));
  };

  const clear = () => setItems([]);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clear, total, count,
      isOpen, setIsOpen, badgePop, scanMode, setScanMode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
