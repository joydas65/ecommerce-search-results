export type BrowsingMode = "fixed" | "infinite";

export type SortOption =
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";

export type ProductCategory =
  | "Audio"
  | "Bags"
  | "Footwear"
  | "Home Office"
  | "Kitchen"
  | "Wearables";

export type ProductTone =
  | "graphite"
  | "sage"
  | "coral"
  | "indigo"
  | "amber"
  | "steel";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  keywords: string[];
  inStock: boolean;
  freeShipping: boolean;
  isNew: boolean;
  isOnSale: boolean;
  createdAt: string;
  badges: string[];
  tone: ProductTone;
}

export interface ProductFilters {
  query: string;
  categories: ProductCategory[];
  brands: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
  freeShipping: boolean;
  onSale: boolean;
}

export interface SearchRequest {
  filters: ProductFilters;
  sort: SortOption;
  page: number;
  pageSize: number;
  cursor?: string;
  limit: number;
  mode: BrowsingMode;
}

export interface SearchFacets {
  categories: Array<{ value: ProductCategory; count: number }>;
  brands: Array<{ value: string; count: number }>;
  colors: Array<{ value: string; count: number }>;
  priceRange: { min: number; max: number };
}

export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  cursor?: string;
  limit: number;
  rangeStart: number;
  rangeEnd: number;
  pageCount: number;
  mode: BrowsingMode;
  hasNextPage: boolean;
  nextCursor?: string;
  facets: SearchFacets;
  appliedFilterCount: number;
  queryTimeMs: number;
}
