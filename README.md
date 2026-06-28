# BrowseLab Ecommerce Search Results

BrowseLab is a portfolio-focused ecommerce search results experience built with Next.js, TypeScript, Tailwind CSS, local dummy product images, and mock backend data.

The goal is to demonstrate a polished marketplace-style product surface: URL-driven search state, advanced filtering, sorting, responsive result rows, pagination-oriented browsing, and a clear path toward infinite scrolling.

## Current Status

Implemented in this foundation milestone:

- Next.js App Router project with TypeScript and Tailwind CSS.
- Project-specific metadata and visual system.
- Mock product fixtures in a dedicated data module.
- Dummy product image assets in `public/product-images`.
- Typed product, filter, sort, browsing-mode, facet, request, and response contracts.
- Search service that matches product text, catalog keywords, and common synonyms, then filters, sorts, paginates, builds facets, and returns backend-like metadata.
- URL search-param parsing for query, sort, page, page size, mode, and filters.
- Marketplace-style ecommerce search results screen with:
  - Blue utility header with prominent search.
  - Desktop filter panel.
  - Mobile collapsible filter section.
  - Sort controls.
  - Fixed view and infinite feed mode switch.
  - Product result rows with images, ratings, pricing, delivery cues, and offers.
  - Applied filter chips.
  - Empty state with separate clear-search, clear-filter, and view-all recovery actions.
  - Pagination and next-batch controls.
  - Quick-view modal.
  - Local-storage wishlist toggle.

Not implemented yet:

- Client-side debounced search.
- True infinite scroll observer behavior.
- Device-derived fixed page size.
- Compare drawer.
- Unit tests and Playwright tests.
- Deployment configuration.

## Architecture

```txt
public/
  product-images/
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    search/
      search-results-shell.tsx
  data/
    products.ts
  lib/
    products/
      search.ts
    url-state/
      search-params.ts
  types/
    product.ts
```

The UI consumes a typed `SearchResponse` rather than reading product arrays directly. This keeps the mock data behind a backend-like boundary and makes it easier to replace the local service with a real API later.

## Mock Backend Strategy

The current backend is intentionally mocked, but it behaves like an API contract:

- `src/data/products.ts` owns product fixtures.
- `src/lib/products/search.ts` owns keyword matching, synonym expansion, filtering, sorting, facet generation, pagination, and response metadata.
- UI components receive request/response objects and do not own product search logic.

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

- Fixed view: explicit pagination with a controlled number of visible products.
- Infinite feed: cursor-style browsing for discovery-heavy product exploration.

Future work will make this contrast fully interactive with responsive page-size rules and true infinite scrolling.
