# BrowseLab Ecommerce Search Results

BrowseLab is a portfolio-focused ecommerce search results experience built with Next.js, TypeScript, Tailwind CSS, remote real-photo product imagery, and mock backend data.

The goal is to demonstrate a polished marketplace-style product surface: URL-driven search state, advanced filtering, sorting, responsive grid and list presentations, fixed pagination, and observer-driven infinite browsing.

## Current Status

Implemented in this foundation milestone:

- Next.js App Router project with TypeScript and Tailwind CSS.
- Project-specific metadata and visual system.
- Mock product fixtures in a dedicated data module, expanded to 48 products for realistic infinite browsing.
- Remote real-photo product imagery from `images.unsplash.com`, configured through `next.config.ts`.
- Typed product, filter, sort, browsing-mode, facet, request, and response contracts.
- Search service that matches product text, catalog keywords, and common synonyms, then filters, sorts, paginates, builds facets, and returns backend-like metadata.
- Cursor-style mock backend route at `/api/products` with `cursor`, `limit`, `hasNextPage`, and `nextCursor` response metadata.
- Product detail pages at `/products/[id]` with return-to-results navigation, Walmart-inspired product-detail structure, Flipkart-style visual language, product imagery, offers, highlights, actions, and related results.
- URL search-param parsing for query, sort, page, page size, browsing mode, presentation view, and filters.
- URL-driven fixed pagination with shareable page numbers, visible page context, and page-size controls.
- Client infinite feed that uses `IntersectionObserver`, appends cursor batches, and keeps an accessible "Load more" fallback.
- Lazy product image loading through `next/image`, with priority reserved for the first visible row.
- Responsive marketplace grid as the default discovery layout, with a list view available for comparison-heavy browsing.
- Stable product row/card layouts with intrinsic sizing, offscreen rendering optimization, and skeleton placeholders for route transitions and incremental batches.
- Marketplace-style ecommerce search results screen with:
  - Blue utility header with prominent search.
  - Desktop filter panel.
  - Mobile collapsible filter section.
  - Sort controls.
  - Fixed view and infinite feed mode switch.
  - Grid and list presentation switch backed by the `view` URL parameter.
  - Product result cards and rows with images, ratings, pricing, delivery cues, and offers.
  - Applied filter chips.
  - Empty state with separate clear-search, clear-filter, and view-all recovery actions.
  - Fixed pagination with URL-backed per-page controls.
  - Infinite loading controls.
  - Skeleton shell for search/page transitions and matching skeleton cards or rows while more products load.
  - Product detail navigation from each result row.
  - Product detail layout with a thumbnail media rail, center product facts, sticky buy box, purchase options, and delivery choices.
  - Local-storage wishlist toggle.

Not implemented yet:

- Client-side debounced search.
- Device-derived fixed page size.
- Compare drawer.
- Unit tests and Playwright tests.
- Deployment configuration.

## Architecture

```txt
next.config.ts
src/
  app/
    (search)/
      loading.tsx
      page.tsx
    api/
      products/
        route.ts
    products/
      [id]/
        loading.tsx
        not-found.tsx
        page.tsx
    layout.tsx
    globals.css
  components/
    product/
      product-detail-actions.tsx
    search/
      infinite-results-client.tsx
      product-actions.tsx
      product-result-row.tsx
      search-results-loading.tsx
      search-results-shell.tsx
  data/
    products.ts
  lib/
    products/
      catalog.ts
      search-config.ts
      search.ts
    url-state/
      search-params.ts
  hooks/
    use-intersection-observer.ts
  types/
    product.ts
```

The UI consumes a typed `SearchResponse` rather than reading product arrays directly. This keeps the mock data behind a backend-like boundary and makes it easier to replace the local service with a real API later.

## Mock Backend Strategy

The current backend is intentionally mocked, but it behaves like an API contract:

- `src/data/products.ts` owns 48 product fixtures and real-photo image metadata.
- `src/lib/products/catalog.ts` owns product-detail lookup and related-product selection.
- `src/lib/products/search.ts` owns keyword matching, synonym expansion, filtering, sorting, facet generation, pagination, and response metadata.
- `src/app/api/products/route.ts` exposes the same typed search contract through a mock API endpoint for client-side infinite loading.
- UI components receive request/response objects and do not own product search logic.

`next.config.ts` allowlists `images.unsplash.com` for product photos. The app still uses mock product data; only the imagery is photo-based.

## Local Development

Use Node.js 20 or newer. On this machine:

```bash
source ~/nvm/bin/nvm.sh && nvm use v20
npm run dev
```

Open `http://localhost:3000`.

## Verification

Current verified commands:

```bash
source ~/nvm/bin/nvm.sh && nvm use v20
npm run lint
npm run build
```

The initial scaffold needed `npm install --registry=https://registry.npmjs.org` to restore Tailwind optional native packages required for production builds.

## Quality Standard

Every milestone should include a consistency audit across:

- README claims.
- Source comments.
- Test names and fixtures.
- Mock backend data shape.
- Search response metadata.
- UX behavior described in documentation.

Tests are not present yet, so this README does not claim test coverage.

## Portfolio Framing

The main showcase feature is the browsing-mode decision:

- Fixed view: explicit URL-addressable pagination with a controlled number of visible products and per-page controls.
- Infinite feed: observer-driven cursor loading for discovery-heavy product exploration, with a manual fallback for accessibility and resilience.

The secondary product decision is presentation mode:

- Grid view: default marketplace discovery layout with 4 columns on desktop and responsive fallback columns on smaller screens.
- List view: detail-forward comparison layout for shoppers who need richer product facts before opening the product detail page.

Future work will add device-derived page-size rules for fixed view, then protect both browsing and presentation modes with unit and Playwright coverage.
