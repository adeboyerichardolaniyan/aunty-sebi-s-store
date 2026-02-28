"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Piece } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  pieceId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; piece: Piece }
  | { type: "REMOVE_ITEM"; pieceId: string }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_OPEN"; isOpen: boolean }
  | { type: "HYDRATE"; items: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (piece: Piece) => void;
  removeItem: (pieceId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (isOpen: boolean) => void;
  itemCount: number;
  total: number;
  isInCart: (pieceId: string) => boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = "aunty-sebi-cart";

const initialState: CartState = {
  items: [],
  isOpen: false,
};

// Validate shape of items from localStorage to guard against schema drift
function isCartItem(val: unknown): val is CartItem {
  return (
    typeof val === "object" &&
    val !== null &&
    typeof (val as CartItem).pieceId === "string" &&
    typeof (val as CartItem).name === "string" &&
    typeof (val as CartItem).slug === "string" &&
    typeof (val as CartItem).price === "number" &&
    typeof (val as CartItem).currency === "string" &&
    typeof (val as CartItem).quantity === "number" &&
    typeof (val as CartItem).image === "string"
  );
}

// Lazy initializer — reads localStorage synchronously to avoid flash of empty cart
function getInitialState(): CartState {
  if (typeof window === "undefined") return initialState;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(isCartItem)) {
        return { items: parsed, isOpen: false };
      }
    }
  } catch {
    // fall through
  }
  return initialState;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { piece } = action;
      // Prevent duplicates — each piece is one-of-a-kind (stock: 1)
      if (state.items.some((item) => item.pieceId === piece.id)) {
        return state;
      }
      const newItem: CartItem = {
        pieceId: piece.id,
        name: piece.name,
        slug: piece.slug,
        price: piece.price,
        currency: piece.currency,
        quantity: 1,
        image: piece.images[0] ?? "",
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.pieceId !== action.pieceId),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "SET_OPEN":
      return { ...state, isOpen: action.isOpen };

    case "HYDRATE":
      return { ...state, items: action.items };

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<CartContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  // Persist items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Silently ignore quota or access errors
    }
  }, [state.items]);

  // Stable action dispatchers
  const addItem = useCallback(
    (piece: Piece) => dispatch({ type: "ADD_ITEM", piece }),
    [],
  );

  const removeItem = useCallback(
    (pieceId: string) => dispatch({ type: "REMOVE_ITEM", pieceId }),
    [],
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  const setOpen = useCallback(
    (isOpen: boolean) => dispatch({ type: "SET_OPEN", isOpen }),
    [],
  );

  const isInCart = useCallback(
    (pieceId: string) => state.items.some((item) => item.pieceId === pieceId),
    [state.items],
  );

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    addItem,
    removeItem,
    clearCart,
    toggleCart,
    setOpen,
    itemCount,
    total,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
