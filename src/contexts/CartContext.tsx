/**
 * CartContext — manages shopping bag state with duration-based pricing.
 *
 * Each CartItem tracks:
 * - `duration`: selected month count (e.g. 1, 3, 6, 12)
 * - `unitPrice`: numeric price for that duration (from the product's price JSON)
 * - `price`: formatted display price string (e.g. "৳400")
 *
 * Items are keyed by `id + duration` — same product with different durations = separate line items.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  /** Formatted display price for the selected duration (e.g. "৳400") */
  price: string;
  /** Raw numeric price for the selected duration */
  unitPrice: number;
  /** Selected rental duration in months */
  duration: number;
  image: string;
  quantity: number;
  category: string;
}

export interface FavoriteItem {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface CartContextType {
  cartItems: CartItem[];
  favorites: FavoriteItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: number, duration: number, newQuantity: number) => void;
  removeFromCart: (id: number, duration: number) => void;
  clearCart: () => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (id: number) => boolean;
  getItemQuantity: (id: number) => number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "linea-cart";
const FAVORITES_KEY = "linea-favorites";

/** Composite key for cart items: same product + different duration = different line item */
function cartKey(id: number, duration: number) {
  return `${id}-${duration}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>(CART_KEY, [])
  );
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    loadFromStorage<FavoriteItem[]>(FAVORITES_KEY, [])
  );

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.duration === item.duration
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.duration === item.duration
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, duration: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => !(item.id === id && item.duration === duration))
      );
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id && item.duration === duration
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (id: number, duration: number) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.duration === duration))
    );
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      if (exists) return prev.filter((f) => f.id !== item.id);
      return [...prev, item];
    });
  };

  const isFavorite = (id: number) => favorites.some((f) => f.id === id);

  /** Total quantity across all durations for a given product id */
  const getItemQuantity = (id: number) => {
    return cartItems
      .filter((i) => i.id === id)
      .reduce((sum, i) => sum + i.quantity, 0);
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        favorites,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleFavorite,
        isFavorite,
        getItemQuantity,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
