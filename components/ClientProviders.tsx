"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import Navigation from "@/components/Navigation";
import CartDrawer from "@/components/CartDrawer";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <a
        href="#main-content"
        className="skip-to-content"
      >
        Skip to content
      </a>
      <Navigation />
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
