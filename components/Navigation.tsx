"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASING } from "@/lib/timing";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCROLL_THRESHOLD = 20;

const DARK_ROUTES = ["/globe"];

const NAV_LINKS = [
  { href: "/globe", label: "Globe" },
  { href: "/about", label: "About" },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Navigation() {
  const pathname = usePathname();
  const { toggleCart, itemCount } = useCart();
  const prefersReduced = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);

  const isDarkPage = DARK_ROUTES.some((route) => pathname.startsWith(route));

  // -----------------------------------------------------------------------
  // Scroll listener
  // -----------------------------------------------------------------------

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // -----------------------------------------------------------------------
  // Style helpers
  // -----------------------------------------------------------------------

  const textColor = isDarkPage ? "text-cream" : "text-rich-black";

  const activeLinkClass = (href: string) =>
    pathname === href ? "text-bronze" : textColor;

  const backgroundClass = scrolled
    ? isDarkPage
      ? "bg-rich-black/70 backdrop-blur-xl"
      : "bg-cream/70 backdrop-blur-xl"
    : "bg-transparent";

  // -----------------------------------------------------------------------
  // Animation variants
  // -----------------------------------------------------------------------

  const navEasing = EASING.ui.slice() as number[];

  const navVariants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: -12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: navEasing },
        },
      };

  const badgeVariants = prefersReduced
    ? {
        hidden: { opacity: 1, scale: 1 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1, transition: { duration: 0 } },
      }
    : {
        hidden: { opacity: 0, scale: 0 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
          },
        },
        exit: {
          opacity: 0,
          scale: 0,
          transition: { duration: 0.15 },
        },
      };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-300 ease-smooth ${backgroundClass}`}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 md:px-8">
        {/* ---- Logo ---- */}
        <Link
          href="/"
          className={`font-heading text-h2 leading-none tracking-tight transition-colors duration-300 ${
            pathname === "/" ? "text-bronze" : textColor
          } hover:text-bronze`}
        >
          Aunty Sebi&apos;s
        </Link>

        {/* ---- Right-side links ---- */}
        <div className="flex items-center gap-4 md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-sm tracking-wide transition-colors duration-300 ${activeLinkClass(
                link.href,
              )} hover:text-bronze`}
            >
              {link.label}
            </Link>
          ))}

          {/* ---- Cart button ---- */}
          <button
            type="button"
            onClick={toggleCart}
            className={`relative flex items-center justify-center transition-colors duration-300 ${textColor} hover:text-bronze`}
            aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
          >
            {/* Shopping bag SVG — stroke-based, 20x20 */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M5 6L3 9V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V9L15 6H5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 9H17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M13 9V5C13 3.34315 11.6569 2 10 2C8.34315 2 7 3.34315 7 5V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* ---- Cart badge ---- */}
            <AnimatePresence mode="wait">
              {itemCount > 0 && (
                <motion.span
                  key="cart-badge"
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bronze text-[10px] font-medium leading-none text-white"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
