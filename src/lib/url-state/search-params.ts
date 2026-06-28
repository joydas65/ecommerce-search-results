import type {
  BrowsingMode,
  ProductCategory,
  SearchRequest,
  SortOption,
} from "@/types/product";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const categories: ProductCategory[] = [
  "Audio",
  "Bags",
  "Footwear",
  "Home Office",
  "Kitchen",
  "Wearables",
];

const sortOptions: SortOption[] = [
  "relevance",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
];

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const getMany = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => item.split(","));
  }

  return value ? value.split(",") : [];
};

const toNumber = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toPositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const toCursor = (value: string | undefined) => {
  const cursor = value?.trim();
  return cursor ? cursor : undefined;
};

const toBoolean = (value: string | undefined) => value === "true";

export const parseSearchParams = (
  searchParams: RawSearchParams,
): SearchRequest => {
  const sort = getFirst(searchParams.sort);
  const mode = getFirst(searchParams.mode);
  const pageSize = toPositiveInteger(getFirst(searchParams.pageSize), 8);
  const limit = toPositiveInteger(getFirst(searchParams.limit), pageSize);

  return {
    filters: {
      query: getFirst(searchParams.q) ?? "",
      categories: getMany(searchParams.category).filter(
        (value): value is ProductCategory =>
          categories.includes(value as ProductCategory),
      ),
      brands: getMany(searchParams.brand),
      colors: getMany(searchParams.color),
      minPrice: toNumber(getFirst(searchParams.minPrice)),
      maxPrice: toNumber(getFirst(searchParams.maxPrice)),
      minRating: toNumber(getFirst(searchParams.rating)),
      inStock: toBoolean(getFirst(searchParams.inStock)),
      freeShipping: toBoolean(getFirst(searchParams.freeShipping)),
      onSale: toBoolean(getFirst(searchParams.onSale)),
    },
    sort:
      sort && sortOptions.includes(sort as SortOption)
        ? (sort as SortOption)
        : "relevance",
    page: toPositiveInteger(getFirst(searchParams.page), 1),
    pageSize,
    cursor: toCursor(getFirst(searchParams.cursor)),
    limit,
    mode: mode === "infinite" ? "infinite" : "fixed",
  };
};

type SearchHrefUpdates = Partial<{
  q: string;
  sort: SortOption;
  page: number;
  mode: BrowsingMode;
  pageSize: number;
  cursor: string | undefined;
  limit: number | undefined;
}>;

const hasUpdate = <Key extends keyof SearchHrefUpdates>(
  updates: SearchHrefUpdates,
  key: Key,
) => Object.prototype.hasOwnProperty.call(updates, key);

export const createSearchHref = (
  request: SearchRequest,
  updates: SearchHrefUpdates,
) => {
  const params = new URLSearchParams();
  const query = hasUpdate(updates, "q")
    ? (updates.q ?? "")
    : request.filters.query;
  const sort = updates.sort ?? request.sort;
  const page = updates.page ?? request.page;
  const mode = updates.mode ?? request.mode;
  const pageSize = updates.pageSize ?? request.pageSize;
  const cursor = hasUpdate(updates, "cursor")
    ? updates.cursor
    : request.cursor;
  const limit = updates.limit ?? request.limit;

  if (query) params.set("q", query);
  if (sort !== "relevance") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  if (mode !== "fixed") params.set("mode", mode);
  if (pageSize !== 8) params.set("pageSize", String(pageSize));
  if (mode === "infinite" && cursor) params.set("cursor", cursor);
  if (mode === "infinite" && limit !== 8) params.set("limit", String(limit));

  for (const category of request.filters.categories) {
    params.append("category", category);
  }
  for (const brand of request.filters.brands) {
    params.append("brand", brand);
  }
  for (const color of request.filters.colors) {
    params.append("color", color);
  }
  if (request.filters.minPrice !== undefined) {
    params.set("minPrice", String(request.filters.minPrice));
  }
  if (request.filters.maxPrice !== undefined) {
    params.set("maxPrice", String(request.filters.maxPrice));
  }
  if (request.filters.minRating !== undefined) {
    params.set("rating", String(request.filters.minRating));
  }
  if (request.filters.inStock) params.set("inStock", "true");
  if (request.filters.freeShipping) params.set("freeShipping", "true");
  if (request.filters.onSale) params.set("onSale", "true");

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
};

export const createClearFiltersHref = (request: SearchRequest) =>
  createSearchHref(
    {
      ...request,
      filters: {
        query: request.filters.query,
        categories: [],
        brands: [],
        colors: [],
        inStock: false,
        freeShipping: false,
        onSale: false,
      },
      page: 1,
    },
    { page: 1, cursor: undefined },
  );

export const createClearSearchHref = (request: SearchRequest) =>
  createSearchHref(
    {
      ...request,
      filters: {
        ...request.filters,
        query: "",
      },
      page: 1,
    },
    { q: "", page: 1, cursor: undefined },
  );

export const createResetSearchHref = () => "/";
