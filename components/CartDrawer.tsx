"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";

// ---------------------------------------------------------------------------
// Price formatter
// ---------------------------------------------------------------------------

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, total } = useCart();

  // -------------------------------------------------------------------------
  // Close handler
  // -------------------------------------------------------------------------

  const close = useCallback(() => setOpen(false), [setOpen]);

  // -------------------------------------------------------------------------
  // Escape key
  // -------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // -------------------------------------------------------------------------
  // Body scroll lock
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ---- Backdrop ---- */}
          <motion.div
            key="cart-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[60] bg-rich-black/40 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          {/* ---- Drawer ---- */}
          <motion.aside
            key="cart-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-[70] flex w-full max-w-md flex-col bg-cream"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* ---- Header ---- */}
            <div className="flex items-center justify-between border-b border-warm-gray/40 px-6 py-5">
              <h2 className="font-heading text-h2 text-rich-black">
                Your Cart
              </h2>
              <button
                type="button"
                onClick={close}
                className="flex items-center justify-center text-rich-black/60 transition-colors duration-200 hover:text-rich-black"
                aria-label="Close cart"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* ---- Content ---- */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                /* ---- Empty state ---- */
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <p className="font-body text-body text-rich-black/60">
                    Your cart is empty
                  </p>
                  <Link
                    href="/globe"
                    onClick={close}
                    className="font-body text-sm text-bronze underline underline-offset-4 transition-colors duration-200 hover:text-bronze-dark"
                  >
                    Explore pieces from around the world
                  </Link>
                </div>
              ) : (
                /* ---- Item list ---- */
                <ul className="px-6 py-4">
                  {items.map((item, index) => (
                    <li
                      key={item.pieceId}
                      className={`flex items-start justify-between gap-4 py-4 ${
                        index < items.length - 1
                          ? "border-b border-warm-gray/20"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/pieces/${item.slug}`}
                          onClick={close}
                          className="font-heading text-lg text-rich-black transition-colors duration-200 hover:text-bronze"
                        >
                          {item.name}
                        </Link>
                        <span className="font-body text-sm text-bronze">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.pieceId)}
                        className="mt-1 flex-shrink-0 text-rich-black/40 transition-colors duration-200 hover:text-terracotta"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 4.5H15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7 4.5V3C7 2.44772 7.44772 2 8 2H10C10.5523 2 11 2.44772 11 3V4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.5 4.5L5.1 14.5C5.14472 15.2956 5.79218 15.9286 6.58889 15.9286H11.4111C12.2078 15.9286 12.8553 15.2956 12.9 14.5L13.5 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.5 7.5V12.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.5 7.5V12.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ---- Footer (only when items exist) ---- */}
            {items.length > 0 && (
              <div className="border-t border-warm-gray/40 px-6 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-body text-body text-rich-black/70">
                    Subtotal
                  </span>
                  <span className="font-heading text-h2 text-rich-black">
                    {formatPrice(total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Checkout coming soon!")}
                  className="w-full rounded-lg bg-bronze py-4 font-body font-medium text-body text-cream shadow-soft transition-colors duration-300 hover:bg-bronze-dark"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
