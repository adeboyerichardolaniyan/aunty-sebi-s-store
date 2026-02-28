# Phase 4: Polish & Deploy-Ready — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Final polish pass — SEO metadata, OG images, 404 page, accessibility, visual transitions, and a homepage redesign replacing the heavy 3D hero.

**Architecture:** Incremental improvements across existing files. No new features — refinement only. Dynamic OG images via Next.js ImageResponse API. Page transitions via template.tsx. Homepage redesign removes WebGL dependency for faster initial load.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, Framer Motion, Next.js ImageResponse API (built-in)

---

### Task 1: Sitemap & Robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Step 1: Create the sitemap**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";

const BASE_URL = "https://auntysebis.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pieceSlugs = getAllSlugs();

  const pieceUrls = pieceSlugs.map((slug) => ({
    url: `${BASE_URL}/pieces/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/globe`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...pieceUrls,
  ];
}
```

**Step 2: Create robots.ts**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://auntysebis.com/sitemap.xml",
  };
}
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds. Sitemap and robots.txt will be generated at build time.

**Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: add dynamic sitemap and robots.txt"
```

---

### Task 2: Root Layout Metadata + OG Defaults

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Update root metadata**

In `app/layout.tsx`, replace the existing `metadata` export (lines 20-24) with:

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://auntysebis.com"),
  title: {
    default: "Aunty Sebi's Jewelry | Handcrafted Stories from Around the World",
    template: "%s | Aunty Sebi's Jewelry",
  },
  description:
    "Each piece carries the heritage of multiple cultures, united by artisan hands into singular works of wearable art. Explore handcrafted jewelry with immersive 3D storytelling.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aunty Sebi's Jewelry",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Aunty Sebi's Jewelry — Handcrafted Stories from Around the World",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

**Step 2: Update per-page titles to use template**

Since root layout now has `title.template: "%s | Aunty Sebi's Jewelry"`, update the page metadata to use short titles:

In `app/globe/page.tsx`, change the metadata title to:
```ts
title: "Explore Pieces from Around the World",
```
(Remove the " | Aunty Sebi's Jewelry" suffix — the template adds it automatically.)

In `app/about/page.tsx`, change the metadata title to:
```ts
title: "About",
```

In `app/pieces/[id]/page.tsx`, change `generateMetadata` return (line 20) to:
```ts
return {
  title: piece.name,
  description: piece.description,
};
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds. Page titles will render as "About | Aunty Sebi's Jewelry", etc.

**Step 4: Commit**

```bash
git add app/layout.tsx app/globe/page.tsx app/about/page.tsx app/pieces/[id]/page.tsx
git commit -m "feat: add metadataBase, OG defaults, and title template"
```

---

### Task 3: Per-Page OG Metadata

**Files:**
- Modify: `app/globe/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/pieces/[id]/page.tsx`

**Step 1: Add OG fields to globe page**

In `app/globe/page.tsx`, update the metadata export:

```ts
export const metadata: Metadata = {
  title: "Explore Pieces from Around the World",
  description:
    "Discover handcrafted jewelry from Ghana, Iran, and Nigeria. Explore the origins of each piece on our interactive globe.",
  openGraph: {
    title: "Explore Pieces from Around the World",
    description:
      "Discover handcrafted jewelry from Ghana, Iran, and Nigeria. Explore the origins of each piece on our interactive globe.",
  },
};
```

**Step 2: Add OG fields to about page**

In `app/about/page.tsx`, update the metadata export:

```ts
export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Aunty Sebi's handcrafted jewelry. Learn about our artisan philosophy, cultural heritage, and commitment to honoring craft traditions from around the world.",
  openGraph: {
    title: "About Aunty Sebi's Jewelry",
    description:
      "The story behind Aunty Sebi's handcrafted jewelry. Learn about our artisan philosophy, cultural heritage, and commitment to honoring craft traditions from around the world.",
  },
};
```

**Step 3: Add OG fields to product pages**

In `app/pieces/[id]/page.tsx`, update `generateMetadata` to:

```ts
export function generateMetadata({ params }: PageProps): Metadata {
  const piece = getPieceBySlug(params.id);
  if (!piece) return { title: "Piece Not Found" };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: piece.currency,
    minimumFractionDigits: 0,
  }).format(piece.price);

  return {
    title: piece.name,
    description: piece.description,
    openGraph: {
      title: `${piece.name} — ${formattedPrice}`,
      description: piece.description,
    },
  };
}
```

**Step 4: Verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add app/globe/page.tsx app/about/page.tsx app/pieces/[id]/page.tsx
git commit -m "feat: add per-page Open Graph metadata"
```

---

### Task 4: Dynamic OG Image for Product Pages

**Files:**
- Create: `app/pieces/[id]/opengraph-image.tsx`

**Step 1: Create the OG image route**

Create `app/pieces/[id]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { getPieceBySlug } from "@/lib/data";

export const runtime = "edge";
export const alt = "Product image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const piece = getPieceBySlug(params.id);

  if (!piece) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF8F3",
            fontFamily: "serif",
            fontSize: 48,
            color: "#1A1A1A",
          }}
        >
          Piece Not Found
        </div>
      ),
      { ...size }
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: piece.currency,
    minimumFractionDigits: 0,
  }).format(piece.price);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#FAF8F3",
          position: "relative",
        }}
      >
        {/* Bronze accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#CD7F32",
          }}
        />

        {/* Origin */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(139, 69, 19, 0.6)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: "16px",
          }}
        >
          {piece.origin.city}, {piece.origin.country}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 64,
            fontFamily: "serif",
            color: "#1A1A1A",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          {piece.name}
        </div>

        {/* Price */}
        <div
          style={{
            fontSize: 36,
            fontFamily: "serif",
            color: "#CD7F32",
            marginBottom: "32px",
          }}
        >
          {formattedPrice}
        </div>

        {/* Bronze divider */}
        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "rgba(205, 127, 50, 0.4)",
            marginBottom: "32px",
          }}
        />

        {/* Description (truncated) */}
        <div
          style={{
            fontSize: 22,
            fontFamily: "sans-serif",
            color: "rgba(26, 26, 26, 0.7)",
            lineHeight: 1.5,
            maxWidth: "800px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {piece.description}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: 18,
            fontFamily: "serif",
            color: "rgba(26, 26, 26, 0.4)",
          }}
        >
          Aunty Sebi&apos;s Jewelry
        </div>
      </div>
    ),
    { ...size }
  );
}
```

**Step 2: Verify**

Run: `npm run build`
Expected: Build succeeds. The OG image route will be generated for each product page.

Note: The ImageResponse API uses Satori under the hood. It supports a subset of CSS (flexbox only, no grid). The styles above use only supported properties.

**Step 3: Commit**

```bash
git add app/pieces/[id]/opengraph-image.tsx
git commit -m "feat: add dynamic OG images for product pages"
```

---

### Task 5: Static OG Fallback Image

**Files:**
- Create: `public/og-default.jpg`

**Step 1: Create a simple OG image**

Since we can't generate a real JPG from code, create a minimal SVG-based placeholder that Next.js can serve. Instead, create a route-based OG image at the root level.

Create `app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aunty Sebi's Jewelry — Handcrafted Stories from Around the World";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF8F3",
          position: "relative",
        }}
      >
        {/* Bronze accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#CD7F32",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontFamily: "serif",
            color: "#1A1A1A",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          Aunty Sebi&apos;s Jewelry
        </div>

        {/* Bronze divider */}
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#CD7F32",
            marginBottom: "24px",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontFamily: "sans-serif",
            color: "rgba(26, 26, 26, 0.6)",
            textAlign: "center",
          }}
        >
          Handcrafted Stories from Around the World
        </div>
      </div>
    ),
    { ...size }
  );
}
```

This replaces the need for a `public/og-default.jpg` — Next.js will generate the image at build time and use it as the default OG image for the root layout.

**Step 2: Update root layout OG config**

In `app/layout.tsx`, remove the `images` array from the `openGraph` config since the `app/opengraph-image.tsx` file auto-registers:

```ts
openGraph: {
  type: "website",
  locale: "en_US",
  siteName: "Aunty Sebi's Jewelry",
},
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add app/opengraph-image.tsx app/layout.tsx
git commit -m "feat: add root-level OG image generation"
```

---

### Task 6: 404 Not Found Page

**Files:**
- Create: `app/not-found.tsx`

**Step 1: Create the 404 page**

Create `app/not-found.tsx`:

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

export default function NotFound() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-16"
    >
      <motion.div
        className="text-center max-w-lg"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReduced ? 0 : 0.5 }}
      >
        <motion.p
          custom={0}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-body text-sm uppercase tracking-widest text-bronze-dark/60 mb-4"
        >
          404
        </motion.p>

        <motion.h1
          custom={0.1}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero text-rich-black mb-6"
        >
          Page Not Found
        </motion.h1>

        <motion.div
          custom={0.2}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-12 h-[2px] bg-bronze/40 mx-auto mb-8"
        />

        <motion.p
          custom={0.3}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="text-body text-rich-black/70 leading-relaxed mb-10"
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist. It may have been
          moved, or the link may be incorrect.
        </motion.p>

        <motion.div
          custom={0.5}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/globe"
            className="inline-block px-8 py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300 hover:shadow-glow"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
```

**Step 2: Verify**

Run: `npm run dev`
Visit: `http://localhost:3000/nonexistent-page`
Expected: Branded 404 page with heading, divider, and CTA.

**Step 3: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add branded 404 page"
```

---

### Task 7: Accessibility — Skip-to-Content & Focus Styles

**Files:**
- Modify: `components/ClientProviders.tsx`
- Modify: `app/globals.css`
- Modify: `app/page.tsx` (add `id="main-content"` to `<main>`)
- Modify: `components/AboutPageClient.tsx` (add `id="main-content"` to `<main>`)
- Modify: `components/GlobePageClient.tsx` (add `id="main-content"`)
- Modify: `components/ProductPageClient.tsx` (add `id="main-content"`)

**Step 1: Add skip-to-content link in ClientProviders**

In `components/ClientProviders.tsx`, update to:

```tsx
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
```

**Step 2: Add focus-visible and skip-to-content styles**

In `app/globals.css`, add after the existing `@layer base` block:

```css
@layer components {
  .skip-to-content {
    @apply absolute -top-full left-4 z-[100] px-4 py-2 bg-bronze text-cream font-body text-sm rounded-b-lg transition-all duration-200;
  }

  .skip-to-content:focus {
    @apply top-0;
  }
}

@layer base {
  /* Focus-visible styles for accessibility */
  :focus-visible {
    @apply outline-none ring-2 ring-bronze ring-offset-2 ring-offset-cream;
  }

  /* Remove default focus ring for mouse users */
  :focus:not(:focus-visible) {
    @apply outline-none ring-0;
  }
}
```

**Step 3: Add `id="main-content"` to each page's main element**

In `app/page.tsx` (the homepage), the `<main>` element needs `id="main-content"`. This will be handled in the homepage redesign (Task 10), so no change needed here yet.

In `components/AboutPageClient.tsx`, update line 31:
```tsx
<main id="main-content" className="pt-24 pb-20 px-6 md:px-12">
```

In `components/GlobePageClient.tsx`, find the outermost container div and add `id="main-content"`. Look for the root element (likely a `<div>` or `<main>`) and add the id attribute.

In `components/ProductPageClient.tsx`, update line 31:
```tsx
<div id="main-content" className="min-h-screen flex flex-col lg:flex-row pt-16">
```

**Step 4: Verify**

Run: `npm run dev`
- Press Tab on any page — skip-to-content link should appear
- Press Enter — page scrolls to main content
- Tab through interactive elements — bronze focus rings visible

**Step 5: Commit**

```bash
git add components/ClientProviders.tsx app/globals.css components/AboutPageClient.tsx components/GlobePageClient.tsx components/ProductPageClient.tsx
git commit -m "feat: add skip-to-content link and focus-visible styles"
```

---

### Task 8: Route Loading States

**Files:**
- Create: `app/globe/loading.tsx`
- Create: `app/pieces/[id]/loading.tsx`

**Step 1: Create globe loading state**

Create `app/globe/loading.tsx`:

```tsx
import LoadingState from "@/components/LoadingState";

export default function GlobeLoading() {
  return (
    <div className="relative min-h-screen bg-rich-black">
      <LoadingState isLoading={true} />
    </div>
  );
}
```

**Step 2: Create product page loading state**

Create `app/pieces/[id]/loading.tsx`:

```tsx
import LoadingState from "@/components/LoadingState";

export default function PieceLoading() {
  return (
    <div className="relative min-h-screen">
      <LoadingState isLoading={true} />
    </div>
  );
}
```

**Step 3: Verify**

Run: `npm run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add app/globe/loading.tsx app/pieces/[id]/loading.tsx
git commit -m "feat: add route-level loading states for globe and product pages"
```

---

### Task 9: Page Transition Wrapper + Nav Progress Bar

**Files:**
- Create: `app/template.tsx`
- Modify: `components/Navigation.tsx`

**Step 1: Create page transition template**

Create `app/template.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

**Step 2: Add route progress bar to Navigation**

In `components/Navigation.tsx`, add a route change indicator. Add these imports at the top:

```ts
import { useState, useEffect, useCallback, useRef } from "react";
```

Inside the `Navigation` component, after the existing `scrolled` state, add:

```tsx
// -----------------------------------------------------------------------
// Route change progress bar
// -----------------------------------------------------------------------

const [isNavigating, setIsNavigating] = useState(false);
const previousPathname = useRef(pathname);

useEffect(() => {
  if (pathname !== previousPathname.current) {
    setIsNavigating(true);
    previousPathname.current = pathname;
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }
}, [pathname]);
```

Then, inside the `<motion.header>` element, as the first child (before `<nav>`), add:

```tsx
{/* Route progress bar */}
<AnimatePresence>
  {isNavigating && !prefersReduced && (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="absolute bottom-0 left-0 right-0 h-[2px] bg-bronze origin-left"
    />
  )}
</AnimatePresence>
```

Also add `useRef` to the imports from react (line 3):
```ts
import { useState, useEffect, useCallback, useRef } from "react";
```

**Step 3: Verify**

Run: `npm run dev`
- Navigate between pages — subtle fade transition
- Bronze progress bar appears briefly at bottom of nav during transitions

**Step 4: Commit**

```bash
git add app/template.tsx components/Navigation.tsx
git commit -m "feat: add page transition fade and nav route progress bar"
```

---

### Task 10: Homepage Redesign

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace the homepage**

Replace the entire content of `app/page.tsx` with:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EASING } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useReducedMotion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASING.gentle.slice() as number[],
    },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

export default function Home() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16"
    >
      <motion.div
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReduced ? 0 : 1 }}
        className="flex flex-col items-center text-center max-w-3xl"
      >
        {/* Overline */}
        <motion.p
          custom={0.2}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-body text-sm uppercase tracking-[0.2em] text-bronze-dark/60 mb-8"
        >
          Handcrafted Jewelry
        </motion.p>

        {/* Headline */}
        <motion.h1
          custom={0.4}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero md:text-[4.5rem] md:leading-[1.05] text-rich-black mb-8"
        >
          Stories from Around the World
        </motion.h1>

        {/* Bronze accent rule */}
        <motion.div
          custom={0.6}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-16 h-[2px] bg-bronze/50 mb-8"
        />

        {/* Subtitle */}
        <motion.p
          custom={0.8}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="text-body text-rich-black/60 leading-relaxed max-w-xl mb-12"
        >
          Each piece carries the heritage of multiple cultures, united by
          artisan hands into singular works of wearable art.
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={1.1}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/globe"
            className="inline-block px-8 py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300 hover:shadow-glow"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
```

Key changes from the old homepage:
- Removed `HeroPreview3D` dynamic import (no more 3D model loading)
- Added "Handcrafted Jewelry" overline in small caps
- Larger heading on desktop: `text-[4.5rem]`
- Added bronze horizontal rule as decorative accent
- Slightly muted subtitle (`text-rich-black/60` instead of `/70`)
- More generous spacing between elements
- Added `id="main-content"` for skip-to-content

**Step 2: Verify**

Run: `npm run dev`
Visit: `http://localhost:3000`
Expected: Clean typography-driven hero. No 3D model loading. Page loads instantly. Bronze accent rule visible between heading and subtitle.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redesign homepage with typography-only hero, remove 3D preview"
```

---

### Task 11: Build Verification

**Files:** None (verification only)

**Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors.

**Step 2: Test all routes**

Run: `npm run dev`

Verify each route:
- `/` — Typography hero, fast load, no 3D
- `/globe` — Globe loads, loading state shown during transition
- `/about` — About page with staggered animations
- `/pieces/akan-heritage-ring` — Product page with OG metadata
- `/nonexistent` — Branded 404 page

Verify SEO:
- View page source on any page — OG tags present in `<head>`
- `/sitemap.xml` — Valid XML with all routes
- `/robots.txt` — Valid robots.txt

Verify a11y:
- Press Tab on homepage — skip-to-content link appears
- Tab through nav links — bronze focus rings visible
- Escape closes cart drawer

**Step 3: Commit any fixes if needed**

If issues found, fix and commit with descriptive message.

---

## Files Summary

| File | Action |
|------|--------|
| `app/sitemap.ts` | Create |
| `app/robots.ts` | Create |
| `app/layout.tsx` | Modify |
| `app/globe/page.tsx` | Modify |
| `app/about/page.tsx` | Modify |
| `app/pieces/[id]/page.tsx` | Modify |
| `app/pieces/[id]/opengraph-image.tsx` | Create |
| `app/opengraph-image.tsx` | Create |
| `app/not-found.tsx` | Create |
| `components/ClientProviders.tsx` | Modify |
| `app/globals.css` | Modify |
| `components/AboutPageClient.tsx` | Modify |
| `components/GlobePageClient.tsx` | Modify |
| `components/ProductPageClient.tsx` | Modify |
| `app/globe/loading.tsx` | Create |
| `app/pieces/[id]/loading.tsx` | Create |
| `app/template.tsx` | Create |
| `components/Navigation.tsx` | Modify |
| `app/page.tsx` | Modify |
