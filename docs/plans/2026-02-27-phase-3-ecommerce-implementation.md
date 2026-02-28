# Phase 3: E-commerce Infrastructure — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add cart infrastructure (Context + localStorage), cart drawer UI, site-wide navigation, about page, and wire the existing "Add to Cart" button.

**Architecture:** React Context + useReducer for cart state, persisted to localStorage. Cart drawer slides out from right. Sticky navigation bar on all pages. No payment processing yet — Snipcart comes later.

**Tech Stack:** React Context, useReducer, Framer Motion (animations), Next.js App Router, Tailwind CSS

---

### Task 1: Create Cart Context and Provider

**Files:**
- Create: `lib/cart-context.tsx`
- Reference: `lib/types.ts` (Piece interface)

**Step 1: Create `lib/cart-context.tsx`**

This file exports CartProvider, useCart hook, and CartItem type. Uses useReducer with localStorage persistence.

```tsx
"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Piece } from "@/lib/types";

// --- Types ---

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

// --- Reducer ---

const STORAGE_KEY = "aunty-sebi-cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const piece = action.piece;
      // Don't add duplicates (stock is 1 per piece)
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

// --- Context ---

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignore quota errors
    }
  }, [state.items]);

  const addItem = useCallback((piece: Piece) => {
    dispatch({ type: "ADD_ITEM", piece });
  }, []);

  const removeItem = useCallback((pieceId: string) => {
    dispatch({ type: "REMOVE_ITEM", pieceId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: "TOGGLE_CART" });
  }, []);

  const setOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: "SET_OPEN", isOpen });
  }, []);

  const isInCart = useCallback(
    (pieceId: string) => state.items.some((item) => item.pieceId === pieceId),
    [state.items]
  );

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors related to cart-context.tsx

**Step 3: Commit**

```bash
git add lib/cart-context.tsx
git commit -m "feat: add cart context with useReducer and localStorage persistence"
```

---

### Task 2: Create Navigation Component

**Files:**
- Create: `components/Navigation.tsx`
- Reference: `lib/cart-context.tsx` (useCart hook)

**Step 1: Create `components/Navigation.tsx`**

Sticky header with logo, nav links, and cart icon. Transparent initially, gains backdrop-blur on scroll. Supports light variant for dark backgrounds (globe page).

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function Navigation() {
  const pathname = usePathname();
  const { toggleCart, itemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);

  // Dark pages where nav text should be light
  const isDarkPage = pathname === "/globe";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = isDarkPage ? "text-cream" : "text-rich-black";
  const hoverColor = isDarkPage
    ? "hover:text-bronze"
    : "hover:text-bronze-dark";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDarkPage
            ? "bg-rich-black/70 backdrop-blur-xl shadow-soft"
            : "bg-cream/70 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className={`font-heading text-xl md:text-2xl ${textColor} ${hoverColor} transition-colors duration-200`}
        >
          Aunty Sebi&rsquo;s
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-5 md:gap-8">
          <Link
            href="/globe"
            className={`font-body text-sm ${textColor} ${hoverColor} transition-colors duration-200 ${
              pathname === "/globe" ? "text-bronze" : ""
            }`}
          >
            Globe
          </Link>
          <Link
            href="/about"
            className={`font-body text-sm ${textColor} ${hoverColor} transition-colors duration-200 ${
              pathname === "/about" ? "text-bronze" : ""
            }`}
          >
            About
          </Link>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            aria-label={`Shopping cart, ${itemCount} items`}
            className={`relative p-2 ${textColor} ${hoverColor} transition-colors duration-200`}
          >
            {/* Shopping bag SVG icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>

            {/* Badge */}
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-bronze text-cream text-[10px] font-body font-medium rounded-full flex items-center justify-center leading-none"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

**Step 3: Commit**

```bash
git add components/Navigation.tsx
git commit -m "feat: add sticky navigation with cart icon and scroll blur"
```

---

### Task 3: Create Cart Drawer Component

**Files:**
- Create: `components/CartDrawer.tsx`
- Reference: `lib/cart-context.tsx` (useCart hook)

**Step 1: Create `components/CartDrawer.tsx`**

Slide-out panel from right. Uses Framer Motion AnimatePresence. Locks body scroll when open.

```tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, total } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, setOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(total);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-rich-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-cream shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-warm-gray/40">
              <h2 className="font-heading text-h2 text-rich-black">
                Your Cart
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="p-2 text-rich-black/50 hover:text-rich-black transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-rich-black/40 font-body text-body mb-6">
                    Your cart is empty
                  </p>
                  <Link
                    href="/globe"
                    onClick={() => setOpen(false)}
                    className="text-bronze font-body text-sm hover:text-bronze-dark transition-colors"
                  >
                    Explore pieces from around the world
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.pieceId}
                      className="flex items-start gap-4 py-4 border-b border-warm-gray/20 last:border-0"
                    >
                      <div className="flex-1">
                        <Link
                          href={`/pieces/${item.slug}`}
                          onClick={() => setOpen(false)}
                          className="font-heading text-lg text-rich-black hover:text-bronze transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-bronze font-body text-sm mt-1">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: item.currency,
                            minimumFractionDigits: 0,
                          }).format(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.pieceId)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="p-1.5 text-rich-black/30 hover:text-terracotta transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-warm-gray/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-body text-sm text-rich-black/60">
                    Subtotal
                  </span>
                  <span className="font-heading text-h2 text-rich-black">
                    {formattedTotal}
                  </span>
                </div>
                <button
                  onClick={() => {
                    alert("Checkout coming soon!");
                  }}
                  className="w-full py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

**Step 3: Commit**

```bash
git add components/CartDrawer.tsx
git commit -m "feat: add cart drawer with slide-out panel and item management"
```

---

### Task 4: Wire Cart into Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update `app/layout.tsx`**

Wrap children with CartProvider. Add Navigation and CartDrawer. Since layout.tsx is a server component, create a client wrapper for the providers.

The updated layout should be:

```tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aunty Sebi's Jewelry | Handcrafted Stories from Around the World",
  description:
    "Each piece carries the heritage of multiple cultures, united by artisan hands into singular works of wearable art. Explore handcrafted jewelry with immersive 3D storytelling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${inter.variable} bg-cream text-rich-black font-body antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
```

**Step 2: Create `components/ClientProviders.tsx`**

Client wrapper that combines CartProvider, Navigation, and CartDrawer:

```tsx
"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import Navigation from "@/components/Navigation";
import CartDrawer from "@/components/CartDrawer";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Navigation />
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
```

**Step 3: Verify it compiles and runs**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

Run: `npm run dev` — verify homepage loads with navigation bar visible

**Step 4: Commit**

```bash
git add app/layout.tsx components/ClientProviders.tsx
git commit -m "feat: wire cart provider, navigation, and cart drawer into layout"
```

---

### Task 5: Wire "Add to Cart" Button in ProductSidebar

**Files:**
- Modify: `components/ProductSidebar.tsx`

**Step 1: Update ProductSidebar.tsx**

Replace the non-functional button with cart-aware logic. Add useState for "added" feedback animation. Import and use `useCart`.

Changes to make:
1. Add imports: `useState, useEffect` from react, `useCart` from cart-context
2. Inside the component, add cart logic:

```tsx
const { addItem, isInCart } = useCart();
const [justAdded, setJustAdded] = useState(false);
const inCart = isInCart(piece.id);
const outOfStock = piece.stock <= 0;

const handleAddToCart = () => {
  if (inCart || outOfStock) return;
  addItem(piece);
  setJustAdded(true);
};

useEffect(() => {
  if (!justAdded) return;
  const timer = setTimeout(() => setJustAdded(false), 2000);
  return () => clearTimeout(timer);
}, [justAdded]);
```

3. Replace the button JSX (the existing `motion.button` at lines 174-181) with:

```tsx
<motion.button
  variants={prefersReduced ? noItemVariants : itemVariants}
  whileHover={!inCart && !outOfStock ? { scale: 1.02 } : undefined}
  whileTap={!inCart && !outOfStock ? { scale: 0.98 } : undefined}
  onClick={handleAddToCart}
  disabled={inCart || outOfStock}
  className={`mt-4 w-full py-4 font-body font-medium text-body rounded-lg shadow-soft transition-colors duration-300 ${
    outOfStock
      ? "bg-warm-gray text-rich-black/40 cursor-not-allowed"
      : inCart
        ? "bg-patina text-cream cursor-default"
        : "bg-bronze text-cream hover:bg-bronze-dark"
  }`}
>
  {outOfStock
    ? "Out of Stock"
    : justAdded
      ? "Added \u2713"
      : inCart
        ? "In Cart"
        : `Add to Cart \u2014 ${formattedPrice}`}
</motion.button>
```

**Step 2: Verify it compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

**Step 3: Test manually**

Run: `npm run dev` — navigate to a product page, click "Add to Cart", verify:
- Button changes to "Added ✓" briefly, then "In Cart"
- Cart icon badge shows 1
- Opening cart drawer shows the item

**Step 4: Commit**

```bash
git add components/ProductSidebar.tsx
git commit -m "feat: wire add-to-cart button with feedback states"
```

---

### Task 6: Create About Page

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/AboutPageClient.tsx`

**Step 1: Create `app/about/page.tsx`**

Server component with metadata:

```tsx
import type { Metadata } from "next";
import AboutPageClient from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About | Aunty Sebi's Jewelry",
  description:
    "The story behind Aunty Sebi's handcrafted jewelry. Learn about our artisan philosophy, cultural heritage, and commitment to honoring craft traditions from around the world.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
```

**Step 2: Create `components/AboutPageClient.tsx`**

Client component with staggered animations matching existing patterns:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASING } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useReducedMotion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: EASING.gentle.slice() as number[],
    },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

export default function AboutPageClient() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <main className="min-h-screen pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <motion.h1
          custom={0.1}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero text-rich-black mb-4"
        >
          The Story Behind Every Piece
        </motion.h1>

        <motion.div
          custom={0.2}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-12 h-[2px] bg-bronze/40 mb-10"
        />

        {/* Aunty Sebi's Story */}
        <motion.div
          custom={0.35}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="space-y-5 mb-14"
        >
          <p className="text-body text-rich-black/80 leading-relaxed">
            Aunty Sebi has spent decades travelling the world, drawn to the
            quiet workshops where artisans shape metal, stone, and thread into
            objects that carry the weight of their cultures. Each piece in this
            collection was chosen — or commissioned — because it tells a story
            that deserves to be worn.
          </p>
          <p className="text-body text-rich-black/80 leading-relaxed">
            From the bronze casters of Kumasi to the goldsmiths of Persepolis,
            from the mask carvers of Benin City to the silversmiths of Lalibela —
            every tradition represented here has been practiced for centuries.
            These are not reproductions. They are living continuations of
            ancient craft.
          </p>
        </motion.div>

        {/* Artisan Philosophy */}
        <motion.div
          custom={0.5}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          <h2 className="font-heading text-h1 text-rich-black mb-5">
            Artisan Philosophy
          </h2>
          <div className="space-y-5">
            <p className="text-body text-rich-black/80 leading-relaxed">
              We believe jewelry should mean something. Not just as adornment,
              but as a bridge between the hands that made it and the person who
              wears it. Every piece is sourced directly from artisan workshops,
              ensuring fair compensation and the continuation of traditional
              techniques.
            </p>
            <p className="text-body text-rich-black/80 leading-relaxed">
              No two pieces are identical. The lost-wax process, hand-forged
              filigree, and traditional patina treatments that give each work its
              character are inherently individual. What you wear is yours alone.
            </p>
          </div>
        </motion.div>

        {/* Cultural Respect */}
        <motion.div
          custom={0.65}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          <h2 className="font-heading text-h1 text-rich-black mb-5">
            Cultural Respect
          </h2>
          <p className="text-body text-rich-black/80 leading-relaxed">
            The cultures represented in this collection are not aesthetic
            resources to be mined. They are living traditions with deep
            spiritual, social, and historical significance. We work closely with
            artisan communities to ensure every piece is presented with the
            context and reverence it deserves. When you purchase from Aunty
            Sebi&rsquo;s, a portion of each sale returns to the artisan
            workshops that make this work possible.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          custom={0.8}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="pt-6 border-t border-warm-gray/30"
        >
          <p className="text-body text-rich-black/60 leading-relaxed mb-6">
            Ready to discover a piece that speaks to you?
          </p>
          <Link
            href="/globe"
            className="inline-block px-8 py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
```

**Step 3: Verify it compiles and runs**

Run: `npx tsc --noEmit --pretty`
Expected: No errors

Run: `npm run dev` — navigate to `/about`, verify page renders with staggered animations

**Step 4: Commit**

```bash
git add app/about/page.tsx components/AboutPageClient.tsx
git commit -m "feat: add about page with artisan story and cultural respect statement"
```

---

### Task 7: Adjust Page Layouts for Navigation

**Files:**
- Modify: `app/page.tsx` — add top padding for nav
- Modify: `components/GlobePageClient.tsx` — ensure globe renders under nav
- Modify: `components/ProductPageClient.tsx` — add top padding for nav

**Step 1: Update homepage**

In `app/page.tsx`, the `<main>` already has `py-16` which gives enough room. But add `pt-20` to ensure clearance under the fixed nav:

Change line 38:
```tsx
// FROM:
<main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
// TO:
<main className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16">
```

**Step 2: Update product page**

In `components/ProductPageClient.tsx`, the layout starts at the very top. Add padding-top on mobile (desktop has the sticky sidebar which works fine):

Change line 31:
```tsx
// FROM:
<div className="min-h-screen flex flex-col lg:flex-row">
// TO:
<div className="min-h-screen flex flex-col lg:flex-row pt-16">
```

**Step 3: Globe page needs no changes**

The globe page is full-screen (`absolute inset-0`) with the nav overlaying it — this is the intended behavior. The nav is already set to transparent with white text on `/globe`.

**Step 4: Verify pages look correct**

Run: `npm run dev` — check homepage, product page, globe page, about page all have proper spacing under nav

**Step 5: Commit**

```bash
git add app/page.tsx components/ProductPageClient.tsx
git commit -m "fix: add top padding to pages for fixed navigation clearance"
```

---

### Task 8: Build Verification

**Step 1: Run full build**

Run: `npm run build`
Expected: Build completes with no TypeScript or ESLint errors

**Step 2: Test all routes**

Run: `npm run dev` and manually verify:
1. `/` — Homepage loads with nav, 3D preview, CTA
2. `/globe` — Globe loads, nav has white text, pins visible
3. `/pieces/akan-heritage-ring` — Product page, "Add to Cart" works
4. Click "Add to Cart" → button shows "Added ✓" → "In Cart"
5. Cart icon badge shows 1
6. Click cart icon → drawer slides open with item
7. Click "Remove" → item removed, badge disappears
8. `/about` — About page loads with content
9. Nav links work on all pages
10. Cart persists on page refresh (localStorage)

**Step 3: Fix any issues found**

Address any TypeScript, styling, or functional issues.

**Step 4: Final commit if needed**

```bash
git add -A
git commit -m "fix: address build issues"
```
