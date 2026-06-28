import { products } from "@/data/products";
import type {
  Product,
  ProductFilters,
  SearchFacets,
  SearchRequest,
  SearchResponse,
} from "@/types/product";

const contains = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase());

const querySynonyms: Record<string, string[]> = {
  mobile: ["mobile accessory", "smartwatch", "fitness band", "bluetooth"],
  phone: ["mobile accessory", "bluetooth", "portable"],
  laptop: ["laptop bag", "monitor stand", "office"],
  shoe: ["shoes", "sneakers", "footwear"],
  shoes: ["sneakers", "running", "footwear"],
  headphone: ["headphones", "wireless", "bluetooth"],
  headphones: ["headphones", "wireless", "bluetooth"],
};

const normalizeQuery = (query: string) => query.trim().toLowerCase();

const getQueryTokens = (query: string) => {
  const normalizedQuery = normalizeQuery(query);
  const directTokens = normalizedQuery
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  const expandedTokens = directTokens.flatMap((token) => querySynonyms[token] ?? []);

  return [...new Set([normalizedQuery, ...directTokens, ...expandedTokens])].filter(
    Boolean,
  );
};

const getSearchableValues = (product: Product) => [
  product.name,
  product.brand,
  product.category,
  product.description,
  product.badges.join(" "),
  product.keywords.join(" "),
];

const matchesQuery = (product: Product, query: string) => {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = getSearchableValues(product);

  return getQueryTokens(normalizedQuery).some((token) =>
    searchableValues.some((value) => contains(value, token)),
  );
};

const matchesFilters = (product: Product, filters: ProductFilters) => {
  const hasCategory =
    filters.categories.length === 0 ||
    filters.categories.includes(product.category);
  const hasBrand =
    filters.brands.length === 0 || filters.brands.includes(product.brand);
  const hasColor =
    filters.colors.length === 0 ||
    filters.colors.some((color) => product.colors.includes(color));
  const aboveMinPrice =
    filters.minPrice === undefined || product.price >= filters.minPrice;
  const belowMaxPrice =
    filters.maxPrice === undefined || product.price <= filters.maxPrice;
  const aboveRating =
    filters.minRating === undefined || product.rating >= filters.minRating;
  const hasStock = !filters.inStock || product.inStock;
  const hasShipping = !filters.freeShipping || product.freeShipping;
  const hasSale = !filters.onSale || product.isOnSale;

  return (
    matchesQuery(product, filters.query) &&
    hasCategory &&
    hasBrand &&
    hasColor &&
    aboveMinPrice &&
    belowMaxPrice &&
    aboveRating &&
    hasStock &&
    hasShipping &&
    hasSale
  );
};

const relevanceScore = (product: Product, query: string) => {
  if (!query.trim()) {
    return product.rating * 10 + product.reviewCount / 100;
  }

  const normalizedQuery = normalizeQuery(query);
  const queryTokens = getQueryTokens(normalizedQuery);
  let score = 0;

  if (product.name.toLowerCase().includes(normalizedQuery)) score += 50;
  if (product.brand.toLowerCase().includes(normalizedQuery)) score += 30;
  if (product.category.toLowerCase().includes(normalizedQuery)) score += 20;
  if (product.description.toLowerCase().includes(normalizedQuery)) score += 10;
  if (product.keywords.some((keyword) => contains(keyword, normalizedQuery))) {
    score += 28;
  }

  for (const token of queryTokens) {
    if (product.name.toLowerCase().includes(token)) score += 12;
    if (product.category.toLowerCase().includes(token)) score += 8;
    if (product.keywords.some((keyword) => contains(keyword, token))) score += 10;
  }

  return score + product.rating * 4 + product.reviewCount / 200;
};

const sortProducts = (items: Product[], request: SearchRequest) => {
  return [...items].sort((a, b) => {
    switch (request.sort) {
      case "newest":
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "relevance":
      default:
        return (
          relevanceScore(b, request.filters.query) -
          relevanceScore(a, request.filters.query)
        );
    }
  });
};

const countBy = <T extends string>(
  items: Product[],
  getValues: (product: Product) => T[],
) => {
  const counts = new Map<T, number>();

  for (const product of items) {
    for (const value of getValues(product)) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
};

const buildFacets = (items: Product[]): SearchFacets => {
  const prices = items.map((product) => product.price);

  return {
    categories: countBy(items, (product) => [product.category]),
    brands: countBy(items, (product) => [product.brand]),
    colors: countBy(items, (product) => product.colors),
    priceRange: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
  };
};

const countAppliedFilters = (filters: ProductFilters) =>
  filters.categories.length +
  filters.brands.length +
  filters.colors.length +
  (filters.minPrice === undefined ? 0 : 1) +
  (filters.maxPrice === undefined ? 0 : 1) +
  (filters.minRating === undefined ? 0 : 1) +
  (filters.inStock ? 1 : 0) +
  (filters.freeShipping ? 1 : 0) +
  (filters.onSale ? 1 : 0);

export const searchProducts = (request: SearchRequest): SearchResponse => {
  const startedAt = performance.now();
  const filteredProducts = products.filter((product) =>
    matchesFilters(product, request.filters),
  );
  const sortedProducts = sortProducts(filteredProducts, request);
  const pageCount = Math.max(
    1,
    Math.ceil(sortedProducts.length / request.pageSize),
  );
  const normalizedPage = Math.min(Math.max(request.page, 1), pageCount);
  const start = (normalizedPage - 1) * request.pageSize;
  const end = start + request.pageSize;
  const visibleProducts = sortedProducts.slice(start, end);
  const hasNextPage = end < sortedProducts.length;

  return {
    products: visibleProducts,
    total: sortedProducts.length,
    page: normalizedPage,
    pageSize: request.pageSize,
    pageCount,
    mode: request.mode,
    hasNextPage,
    nextCursor: hasNextPage ? String(normalizedPage + 1) : undefined,
    facets: buildFacets(filteredProducts),
    appliedFilterCount: countAppliedFilters(request.filters),
    queryTimeMs: Math.max(8, Math.round(performance.now() - startedAt + 18)),
  };
};
