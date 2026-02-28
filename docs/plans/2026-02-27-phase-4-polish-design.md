# Phase 4: Polish & Deploy-Ready — Design Document

## Context

Phases 1–3 are complete and merged. The app has a homepage with 3D hero preview, interactive 3D globe navigation, product pages with hotspots and story panels, cart infrastructure (Context + drawer), sticky navigation, and an about page. Phase 4 is the final polish pass: SEO, accessibility, visual refinements, and a homepage redesign.

## Approach

Focused polish across five areas: SEO metadata, error handling, accessibility, visual transitions, and a homepage redesign that replaces the heavy 3D hero with a fast typography-driven layout. No new features — just refinement. User will handle Vercel deployment separately.

## Components

### 1. SEO & Metadata

**Root layout** (`app/layout.tsx`):
- Add `metadataBase: new URL("https://auntysebis.com")` (placeholder URL)
- Add shared `openGraph` and `twitter` fields to root metadata
- These become defaults inherited by all pages

**Per-page OG overrides**:
- Globe page and About page already have title/description — add `openGraph` fields
- Product pages already have `generateMetadata` — extend with OG fields

**Dynamic OG images for products** (`app/pieces/[id]/opengraph-image.tsx`):
- Uses Next.js `ImageResponse` API (built-in, no deps)
- Renders a branded card: piece name in heading font, price, short description
- Cream background with bronze accent bar
- 1200x630px (standard OG size)

**Static OG fallback** (`public/og-default.jpg`):
- Simple branded card for non-product pages
- "Aunty Sebi's Jewelry — Handcrafted Stories from Around the World"

**Sitemap** (`app/sitemap.ts`):
- Dynamic, pulls slugs from `getAllPieces()`
- Includes: `/`, `/globe`, `/about`, `/pieces/[slug]` for each piece

**Robots** (`app/robots.ts`):
- Allow all crawlers
- Reference sitemap URL

### 2. Error & 404 Handling

**`app/not-found.tsx`**:
- Branded 404 page matching cream/bronze aesthetic
- Heading: "Page Not Found"
- Subtitle copy with link back to globe
- Framer Motion fade-in entrance
- Respects reduced motion

### 3. Accessibility Polish

**Skip-to-content link** (`components/ClientProviders.tsx`):
- Visually hidden anchor, appears on focus
- Jumps to `#main-content`
- Styled with bronze background when visible

**Main content landmarks** (each page):
- Add `id="main-content"` to the primary `<main>` element on each page

**Focus-visible styles** (`app/globals.css`):
- `:focus-visible` ring styles for interactive elements
- Bronze ring, 2px, 2px offset
- Consistent across buttons, links, inputs

### 4. Visual Polish

**Route loading states**:
- `app/globe/loading.tsx` — Uses existing `LoadingState` component
- `app/pieces/[id]/loading.tsx` — Uses existing `LoadingState` component
- These are automatic Next.js Suspense boundaries for route transitions

**Page transition wrapper** (`app/template.tsx`):
- Framer Motion fade (opacity 0→1, 200ms)
- Wraps all page content via Next.js template convention
- Respects `prefers-reduced-motion`

**Nav route loading indicator** (`components/Navigation.tsx`):
- Thin bronze progress bar at top of navigation
- Appears during route transitions (detected via `usePathname()` changes)
- Animates width 0→100% then fades out

### 5. Homepage Redesign

**Remove 3D hero** (`app/page.tsx`):
- Remove `HeroPreview3D` dynamic import and usage
- Eliminates GLB model download on homepage (major perf win)

**Typography-only hero**:
- Large editorial headline using `font-heading` (Cormorant Garamond)
- Generous whitespace, strong type hierarchy
- Decorative bronze horizontal rule as accent
- Subtitle paragraph
- CTA button linking to `/globe`
- Staggered Framer Motion fade-up entrance (keeping existing pattern)
- Convert from client component to server component where possible (no 3D = no dynamic import needed). Keep as client component only for Framer Motion animations.

## Files

| File | Action |
|------|--------|
| app/layout.tsx | Modify — add metadataBase, OG defaults |
| app/page.tsx | Modify — replace 3D hero with typography |
| app/not-found.tsx | Create — branded 404 page |
| app/sitemap.ts | Create — dynamic sitemap |
| app/robots.ts | Create — robots.txt |
| app/template.tsx | Create — page transition wrapper |
| app/globe/loading.tsx | Create — route loading state |
| app/pieces/[id]/loading.tsx | Create — route loading state |
| app/pieces/[id]/opengraph-image.tsx | Create — dynamic OG image |
| app/pieces/[id]/page.tsx | Modify — extend OG metadata |
| app/globe/page.tsx | Modify — extend OG metadata |
| app/about/page.tsx | Modify — extend OG metadata |
| app/globals.css | Modify — focus-visible styles |
| components/ClientProviders.tsx | Modify — add skip-to-content link |
| components/Navigation.tsx | Modify — add route progress bar |
| public/og-default.jpg | Create — static OG fallback image |

## Decisions

- **Remove 3D homepage hero:** Heavy for a landing page. Typography-driven is faster, more elegant.
- **Dynamic OG images via ImageResponse:** Built into Next.js, no external service needed.
- **template.tsx for page transitions:** Next.js convention — re-renders on navigation, unlike layout.tsx.
- **No Vercel config:** Next.js on Vercel works zero-config. User handles deployment.
- **Bronze focus rings:** Matches brand palette, visible on both cream and dark backgrounds.
