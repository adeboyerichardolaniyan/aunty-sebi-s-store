# Phase 3: E-commerce Infrastructure — Design Document

## Context

Phases 1 (3D product viewer) and 2 (globe navigation) are complete and merged. The app has a homepage, interactive 3D globe, and product pages with hotspots. The "Add to Cart" button on product pages is styled but non-functional. Phase 3 adds cart infrastructure, navigation, and an about page. Snipcart will be wired in later — this phase builds the cart UI and state management.

## Approach

React Context + useReducer for cart state. No external dependencies. Cart drawer (slide-out panel) rather than a cart page, keeping users in the immersive experience. Minimal sticky navigation across all pages.

## Components

### 1. Cart State — `lib/cart-context.tsx`

React Context with useReducer. Persisted to localStorage.

**CartItem shape:**
```ts
{
  pieceId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  quantity: number;
  image: string;
}
```

**State:** `{ items: CartItem[], isOpen: boolean }`

**Actions:** ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_CART, TOGGLE_CART

**Hook:** `useCart()` returns items, isOpen, addItem, removeItem, updateQuantity, clearCart, toggleCart, itemCount, total.

addItem checks stock before adding. Each piece has stock: 1, so no duplicates allowed.

### 2. Cart Drawer — `components/CartDrawer.tsx`

Slide-out panel from right side. Overlays content.

- Backdrop: semi-transparent overlay with blur
- Header: "Your Cart" + close button
- Item list: piece name, price, remove button
- Footer: subtotal + "Proceed to Checkout" button (placeholder — shows toast "Checkout coming soon")
- Empty state: "Your cart is empty" with link to globe
- Framer Motion AnimatePresence for enter/exit
- Close via X, backdrop click, or Escape key
- Body scroll locked when open

### 3. Navigation — `components/Navigation.tsx`

Sticky header across all pages.

- Left: "Aunty Sebi's" text logo (font-heading, links to /)
- Right: Globe, About, Cart icon with item count badge
- Transparent initially, gains backdrop-blur on scroll (via scroll listener)
- Globe page: white text variant (over dark background)
- Other pages: dark text on cream
- Cart icon click opens CartDrawer
- Badge: bronze circle with white count number
- Mobile: same layout, tighter spacing

### 4. About Page

**`app/about/page.tsx`** — Server component with metadata.

**`components/AboutPageClient.tsx`** — Client component:
- Hero heading: "The Story Behind Every Piece"
- Aunty Sebi's story (2-3 paragraphs)
- Artisan philosophy section
- Cultural respect statement
- Contact/CTA at bottom
- Typography-driven, generous whitespace
- Staggered Framer Motion fade-in (matching existing patterns)

### 5. Product Sidebar Update — `components/ProductSidebar.tsx`

Wire existing button to cart:
- Uses useCart().addItem(piece)
- Success state: button shows "Added" with checkmark, reverts after 2s
- Already in cart: shows "In Cart" (disabled)
- Out of stock: shows "Out of Stock" (disabled)

### 6. Layout Update — `app/layout.tsx`

- Wrap children with CartProvider
- Add Navigation component (renders on all pages)
- Add CartDrawer component (renders on all pages, hidden by default)

## Files

| File | Action |
|------|--------|
| lib/cart-context.tsx | Create |
| components/CartDrawer.tsx | Create |
| components/Navigation.tsx | Create |
| components/AboutPageClient.tsx | Create |
| app/about/page.tsx | Create |
| app/layout.tsx | Modify |
| components/ProductSidebar.tsx | Modify |

## Decisions

- **Cart drawer over cart page:** Keeps users immersed, no navigation break
- **Context over Zustand:** Only 3 products, Context is the right complexity
- **No payment processing:** Snipcart integration deferred to later
- **No hamburger menu:** Only 3-4 nav links, fits on mobile without collapse
- **localStorage persistence:** Cart survives page refreshes and sessions
