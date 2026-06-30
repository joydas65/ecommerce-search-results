import Link from "next/link";
import type {
  BrowsingMode,
  ProductCategory,
  SearchRequest,
  SearchResponse,
  SortOption,
} from "@/types/product";
import {
  createClearFiltersHref,
  createClearSearchHref,
  createResetSearchHref,
  createSearchHref,
} from "@/lib/url-state/search-params";
import { InfiniteResultsClient } from "./infinite-results-client";
import { ProductResultRow } from "./product-result-row";

interface SearchResultsShellProps {
  request: SearchRequest;
  response: SearchResponse;
}

const categories: ProductCategory[] = [
  "Audio",
  "Bags",
  "Footwear",
  "Home Office",
  "Kitchen",
  "Wearables",
];

const sortLabels: Record<SortOption, string> = {
  relevance: "Relevance",
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Customer Rating",
};

const modeLabels: Record<BrowsingMode, string> = {
  fixed: "Fixed view",
  infinite: "Infinite feed",
};

const popularSearches = [
  "mobile",
  "headphones",
  "sneakers",
  "backpack",
  "desk",
  "kitchen",
];
const fixedPageSizeOptions = [4, 8, 12];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const getAppliedFilters = (request: SearchRequest) => {
  const filters = request.filters;
  const chips = [
    ...filters.categories,
    ...filters.brands,
    ...filters.colors,
  ];

  if (filters.minPrice !== undefined) {
    chips.push(`From ${formatCurrency(filters.minPrice)}`);
  }
  if (filters.maxPrice !== undefined) {
    chips.push(`Under ${formatCurrency(filters.maxPrice)}`);
  }
  if (filters.minRating !== undefined) {
    chips.push(`${filters.minRating}+ stars`);
  }
  if (filters.inStock) chips.push("In stock");
  if (filters.freeShipping) chips.push("Free shipping");
  if (filters.onSale) chips.push("On sale");

  return chips;
};

function PreservedFilterFields({ request }: { request: SearchRequest }) {
  return (
    <>
      {request.filters.categories.map((category) => (
        <input key={category} type="hidden" name="category" value={category} />
      ))}
      {request.filters.brands.map((brand) => (
        <input key={brand} type="hidden" name="brand" value={brand} />
      ))}
      {request.filters.colors.map((color) => (
        <input key={color} type="hidden" name="color" value={color} />
      ))}
      {request.filters.minPrice !== undefined && (
        <input
          type="hidden"
          name="minPrice"
          value={request.filters.minPrice}
        />
      )}
      {request.filters.maxPrice !== undefined && (
        <input
          type="hidden"
          name="maxPrice"
          value={request.filters.maxPrice}
        />
      )}
      {request.filters.minRating !== undefined && (
        <input
          type="hidden"
          name="rating"
          value={request.filters.minRating}
        />
      )}
      {request.filters.inStock && (
        <input type="hidden" name="inStock" value="true" />
      )}
      {request.filters.freeShipping && (
        <input type="hidden" name="freeShipping" value="true" />
      )}
      {request.filters.onSale && (
        <input type="hidden" name="onSale" value="true" />
      )}
    </>
  );
}

function SearchForm({ request }: { request: SearchRequest }) {
  return (
    <form action="/" className="grid min-w-0 grid-cols-[1fr_auto]">
      <label className="sr-only" htmlFor="product-search">
        Search products
      </label>
      <input
        id="product-search"
        name="q"
        defaultValue={request.filters.query}
        placeholder="Search for products, brands and more"
        className="h-11 min-w-0 rounded-l-sm border-0 bg-white px-4 text-sm text-zinc-950 shadow-sm outline-none"
      />
      <input type="hidden" name="sort" value={request.sort} />
      <input type="hidden" name="mode" value={request.mode} />
      <input type="hidden" name="pageSize" value={request.pageSize} />
      {request.mode === "infinite" && (
        <input type="hidden" name="limit" value={request.limit} />
      )}
      <PreservedFilterFields request={request} />
      <button
        type="submit"
        className="h-11 rounded-r-sm bg-[#ffe11b] px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-[#ffd814]"
      >
        Search
      </button>
    </form>
  );
}

function FilterFormContent({
  request,
  response,
}: {
  request: SearchRequest;
  response: SearchResponse;
}) {
  const brands = response.facets.brands.slice(0, 6);
  const colors = response.facets.colors.slice(0, 8);
  const preferenceFilters: Array<[string, string, boolean]> = [
    ["inStock", "In stock", request.filters.inStock],
    ["freeShipping", "Free delivery", request.filters.freeShipping],
    ["onSale", "Deals", request.filters.onSale],
  ];

  return (
    <form action="/" className="space-y-6">
      <input type="hidden" name="q" value={request.filters.query} />
      <input type="hidden" name="sort" value={request.sort} />
      <input type="hidden" name="mode" value={request.mode} />
      <input type="hidden" name="pageSize" value={request.pageSize} />
      {request.mode === "infinite" && (
        <input type="hidden" name="limit" value={request.limit} />
      )}

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Category
        </legend>
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center justify-between gap-3 text-sm text-zinc-700"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value={category}
                defaultChecked={request.filters.categories.includes(category)}
                className="h-4 w-4 rounded-sm border-zinc-300 accent-[#2874f0]"
              />
              {category}
            </span>
            <span className="text-xs text-zinc-400">
              {response.facets.categories.find(
                (facet) => facet.value === category,
              )?.count ?? 0}
            </span>
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Brand
        </legend>
        {brands.map((brand) => (
          <label
            key={brand.value}
            className="flex items-center justify-between gap-3 text-sm text-zinc-700"
          >
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                name="brand"
                value={brand.value}
                defaultChecked={request.filters.brands.includes(brand.value)}
                className="h-4 w-4 rounded-sm border-zinc-300 accent-[#2874f0]"
              />
              {brand.value}
            </span>
            <span className="text-xs text-zinc-400">{brand.count}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Customer Rating
        </legend>
        {[4, 4.5].map((rating) => (
          <label
            key={rating}
            className="flex items-center gap-2 text-sm text-zinc-700"
          >
            <input
              type="radio"
              name="rating"
              value={rating}
              defaultChecked={request.filters.minRating === rating}
              className="h-4 w-4 accent-[#2874f0]"
            />
            {rating}+ stars
          </label>
        ))}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Price
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-zinc-500">
            Min
            <input
              type="number"
              name="minPrice"
              min="0"
              defaultValue={request.filters.minPrice}
              className="mt-1 h-9 w-full rounded-sm border border-zinc-200 px-2 text-sm text-zinc-950"
            />
          </label>
          <label className="text-xs text-zinc-500">
            Max
            <input
              type="number"
              name="maxPrice"
              min="0"
              defaultValue={request.filters.maxPrice}
              className="mt-1 h-9 w-full rounded-sm border border-zinc-200 px-2 text-sm text-zinc-950"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Color
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => (
            <label
              key={color.value}
              className="flex items-center gap-2 text-sm text-zinc-700"
            >
              <input
                type="checkbox"
                name="color"
                value={color.value}
                defaultChecked={request.filters.colors.includes(color.value)}
                className="h-4 w-4 rounded-sm border-zinc-300 accent-[#2874f0]"
              />
              {color.value}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Availability
        </legend>
        {preferenceFilters.map(([name, label, checked]) => (
          <label
            key={name}
            className="flex items-center gap-2 text-sm text-zinc-700"
          >
            <input
              type="checkbox"
              name={name}
              value="true"
              defaultChecked={checked}
              className="h-4 w-4 rounded-sm border-zinc-300 accent-[#2874f0]"
            />
            {label}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        className="h-10 w-full rounded-sm bg-[#2874f0] text-sm font-semibold text-white transition hover:bg-[#1f5fc5]"
      >
        Apply filters
      </button>
    </form>
  );
}

function FilterRail({
  request,
  response,
}: {
  request: SearchRequest;
  response: SearchResponse;
}) {
  return (
    <aside className="hidden bg-white shadow-sm lg:block">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 p-4">
        <h2 className="text-lg font-semibold text-zinc-950">Filters</h2>
        {response.appliedFilterCount > 0 && (
          <Link
            href={createClearFiltersHref(request)}
            className="text-xs font-semibold uppercase text-[#2874f0]"
          >
            Clear all
          </Link>
        )}
      </div>
      <div className="p-4">
        <FilterFormContent request={request} response={response} />
      </div>
    </aside>
  );
}

function MobileFilters({
  request,
  response,
}: {
  request: SearchRequest;
  response: SearchResponse;
}) {
  return (
    <details className="bg-white shadow-sm lg:hidden">
      <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-zinc-950">
        Filters and preferences
        <span className="text-xs font-medium text-zinc-500">
          {response.appliedFilterCount} active
        </span>
      </summary>
      <div className="border-t border-zinc-200 p-4">
        <FilterFormContent request={request} response={response} />
      </div>
    </details>
  );
}

function ModeSwitch({ request }: { request: SearchRequest }) {
  const options: BrowsingMode[] = ["fixed", "infinite"];

  return (
    <div className="flex rounded-sm border border-zinc-200 bg-white">
      {options.map((mode) => (
        <Link
          key={mode}
          href={createSearchHref(request, {
            mode,
            page: 1,
            cursor: undefined,
          })}
          className={`px-3 py-2 text-xs font-semibold transition ${
            request.mode === mode
              ? "bg-[#2874f0] text-white"
              : "text-zinc-600 hover:text-[#2874f0]"
          }`}
        >
          {modeLabels[mode]}
        </Link>
      ))}
    </div>
  );
}

function ResultsHeader({
  request,
  response,
}: {
  request: SearchRequest;
  response: SearchResponse;
}) {
  const start = response.rangeStart;
  const end = response.rangeEnd;
  const appliedFilters = getAppliedFilters(request);
  const hasQuery = Boolean(request.filters.query);

  return (
    <section className="bg-white shadow-sm">
      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs text-zinc-500">
              Showing {start}-{end} of {response.total} results
              {request.filters.query ? ` for "${request.filters.query}"` : ""}
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-950">
              Search results
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Mock backend response in {response.queryTimeMs}ms
            </p>
          </div>
          <ModeSwitch request={request} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hasQuery ? (
            <Link
              href={createClearSearchHref(request)}
              className="rounded-full border border-[#2874f0]/30 bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2874f0] transition hover:bg-[#dbeafe]"
            >
              Search: {request.filters.query} x
            </Link>
          ) : (
            <>
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Popular
              </span>
              {popularSearches.map((query) => (
                <Link
                  key={query}
                  href={createSearchHref(request, {
                    q: query,
                    page: 1,
                    cursor: undefined,
                  })}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-[#2874f0] hover:text-[#2874f0]"
                >
                  {query}
                </Link>
              ))}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3">
          <span className="mr-1 text-sm font-semibold text-zinc-950">
            Sort By
          </span>
          {Object.entries(sortLabels).map(([value, label]) => (
            <Link
              key={value}
              href={createSearchHref(request, {
                sort: value as SortOption,
                page: 1,
                cursor: undefined,
              })}
              className={`border-b-2 px-2 py-1 text-sm font-medium transition ${
                request.sort === value
                  ? "border-[#2874f0] text-[#2874f0]"
                  : "border-transparent text-zinc-600 hover:text-[#2874f0]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {appliedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {appliedFilters.map((filter) => (
              <span
                key={filter}
                className="rounded-sm border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600"
              >
                {filter}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ResultsPagination({
  request,
  response,
}: {
  request: SearchRequest;
  response: SearchResponse;
}) {
  const pages = Array.from({ length: response.pageCount }, (_, index) => index + 1);

  return (
    <div className="border-t border-zinc-100 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-950">
            Page {response.page} of {response.pageCount}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Showing {response.rangeStart}-{response.rangeEnd} of{" "}
            {response.total} products
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="Products per page"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Per page
          </span>
          {fixedPageSizeOptions.map((pageSize) => (
            <Link
              key={pageSize}
              href={createSearchHref(request, {
                page: 1,
                pageSize,
                cursor: undefined,
                limit: undefined,
              })}
              aria-current={response.pageSize === pageSize ? "true" : undefined}
              className={`min-w-10 rounded-sm border px-3 py-2 text-center text-xs font-semibold transition ${
                response.pageSize === pageSize
                  ? "border-[#2874f0] bg-[#eff6ff] text-[#2874f0]"
                  : "border-zinc-200 text-zinc-700 hover:border-[#2874f0] hover:text-[#2874f0]"
              }`}
            >
              {pageSize}
            </Link>
          ))}
        </div>
      </div>

      <nav
        aria-label="Product results pages"
        className="mt-5 flex flex-wrap items-center justify-center gap-2"
      >
        <Link
          href={createSearchHref(request, {
            page: Math.max(1, response.page - 1),
            cursor: undefined,
          })}
          aria-disabled={response.page === 1}
          className="rounded-sm border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-[#2874f0] hover:text-[#2874f0] aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Previous
        </Link>
        {pages.map((page) => (
          <Link
            key={page}
            href={createSearchHref(request, { page, cursor: undefined })}
            aria-current={response.page === page ? "page" : undefined}
            className={`min-w-10 rounded-sm border px-3 py-2 text-center text-sm font-semibold transition ${
              response.page === page
                ? "border-[#2874f0] bg-[#2874f0] text-white"
                : "border-zinc-200 text-zinc-700 hover:border-[#2874f0] hover:text-[#2874f0]"
            }`}
          >
            {page}
          </Link>
        ))}
        <Link
          href={createSearchHref(request, {
            page: Math.min(response.pageCount, response.page + 1),
            cursor: undefined,
          })}
          aria-disabled={response.page === response.pageCount}
          className="rounded-sm border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-[#2874f0] hover:text-[#2874f0] aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          Next
        </Link>
      </nav>
    </div>
  );
}

export function SearchResultsShell({
  request,
  response,
}: SearchResultsShellProps) {
  const currentResultsHref = createSearchHref(request, {});
  const hasQuery = Boolean(request.filters.query);
  const hasAppliedFilters = response.appliedFilterCount > 0;
  const emptyStateActions = [
    ...(hasAppliedFilters
      ? [{ href: createClearFiltersHref(request), label: "Clear filters" }]
      : []),
    ...(hasQuery
      ? [{ href: createClearSearchHref(request), label: "Clear search" }]
      : []),
    { href: createResetSearchHref(), label: "View all products" },
  ];

  return (
    <main className="min-h-screen bg-[#f1f3f6]">
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            BrowseLab
          </Link>
          <SearchForm request={request} />
          <div className="hidden items-center gap-4 text-sm font-semibold text-white md:flex">
            <span>Wishlist</span>
            <span>Compare</span>
            <span>{modeLabels[request.mode]}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-3 px-3 py-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          <MobileFilters request={request} response={response} />
          <FilterRail request={request} response={response} />
        </div>

        <section className="min-w-0 shadow-sm">
          <ResultsHeader request={request} response={response} />

          {response.products.length > 0 ? (
            response.mode === "infinite" ? (
              <InfiniteResultsClient
                key={currentResultsHref}
                request={request}
                initialResponse={response}
                returnToHref={currentResultsHref}
              />
            ) : (
              <div>
                {response.products.map((product, index) => (
                  <ProductResultRow
                    key={product.id}
                    product={product}
                    imagePriority={index === 0 && response.page === 1}
                    returnToHref={currentResultsHref}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="border-t border-zinc-100 bg-white p-10 text-center">
              <h2 className="text-lg font-semibold text-zinc-950">
                No products found
              </h2>
              <p className="mt-2 text-sm text-zinc-500">
                We searched product names, brands, categories, and catalog
                keywords. Try a broader query or reset the active state.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {popularSearches.map((query) => (
                  <Link
                    key={query}
                    href={createSearchHref(request, {
                      q: query,
                      page: 1,
                      cursor: undefined,
                    })}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:border-[#2874f0] hover:text-[#2874f0]"
                  >
                    Try {query}
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {emptyStateActions.map((action, index) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`inline-flex h-10 items-center rounded-sm px-4 text-sm font-semibold transition ${
                      index === 0
                        ? "bg-[#2874f0] text-white hover:bg-[#1f5fc5]"
                        : "border border-zinc-200 bg-white text-zinc-700 hover:border-[#2874f0] hover:text-[#2874f0]"
                    }`}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {response.products.length > 0 && response.mode === "fixed" && (
            <ResultsPagination request={request} response={response} />
          )}
        </section>
      </div>
    </main>
  );
}
