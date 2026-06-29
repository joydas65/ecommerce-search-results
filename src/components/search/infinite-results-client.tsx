"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import type { Product, SearchRequest, SearchResponse } from "@/types/product";
import { createSearchHref } from "@/lib/url-state/search-params";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import {
  ProductResultRow,
  ProductResultRowSkeleton,
} from "./product-result-row";

interface InfiniteResultsClientProps {
  request: SearchRequest;
  initialResponse: SearchResponse;
}

const toProductsApiHref = (
  request: SearchRequest,
  response: SearchResponse,
) => {
  const href = createSearchHref(request, {
    mode: "infinite",
    page: response.page + 1,
    cursor: response.nextCursor,
    limit: response.limit,
  });

  return href === "/" ? "/api/products" : `/api/products${href.slice(1)}`;
};

const appendUniqueProducts = (current: Product[], incoming: Product[]) => {
  const productIds = new Set(current.map((product) => product.id));

  return [
    ...current,
    ...incoming.filter((product) => !productIds.has(product.id)),
  ];
};

export function InfiniteResultsClient({
  request,
  initialResponse,
}: InfiniteResultsClientProps) {
  const [products, setProducts] = useState(initialResponse.products);
  const [latestResponse, setLatestResponse] = useState(initialResponse);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState(
    `Showing ${initialResponse.rangeEnd} of ${initialResponse.total} products`,
  );
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const inFlightRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (
      inFlightRef.current ||
      !latestResponse.hasNextPage ||
      !latestResponse.nextCursor
    ) {
      return;
    }

    inFlightRef.current = true;
    setIsFetching(true);
    setErrorMessage(null);

    try {
      const apiResponse = await fetch(toProductsApiHref(request, latestResponse), {
        headers: { accept: "application/json" },
        cache: "no-store",
      });

      if (!apiResponse.ok) {
        throw new Error("Product batch request failed");
      }

      const nextResponse = (await apiResponse.json()) as SearchResponse;

      startTransition(() => {
        setProducts((currentProducts) =>
          appendUniqueProducts(currentProducts, nextResponse.products),
        );
        setLatestResponse(nextResponse);
        setStatusMessage(
          `Showing ${nextResponse.rangeEnd} of ${nextResponse.total} products`,
        );
      });
    } catch {
      setErrorMessage("We couldn't load more products. Try again.");
    } finally {
      inFlightRef.current = false;
      setIsFetching(false);
    }
  }, [latestResponse, request, startTransition]);

  const sentinelRef = useIntersectionObserver({
    enabled: latestResponse.hasNextPage && !isFetching && !errorMessage,
    onIntersect: loadMore,
  });
  const isLoading = isFetching || isPending;

  return (
    <>
      <div aria-busy={isLoading}>
        {products.map((product, index) => (
          <ProductResultRow
            key={product.id}
            product={product}
            imagePriority={index === 0 && latestResponse.cursor === undefined}
          />
        ))}
      </div>

      {isLoading && (
        <div aria-label="Loading more products">
          {Array.from({ length: Math.min(2, latestResponse.limit) }, (_, index) => (
            <ProductResultRowSkeleton key={index} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      <div className="border-t border-zinc-100 bg-white p-5 text-center">
        <p className="text-sm font-medium text-zinc-700">
          Showing {products.length} of {latestResponse.total} products
        </p>
        <p className="sr-only" aria-live="polite">
          {statusMessage}
        </p>
        {errorMessage && (
          <p role="alert" className="mt-2 text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        )}
        {latestResponse.hasNextPage ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={isLoading}
            className="mt-3 inline-flex h-10 items-center rounded-sm bg-[#2874f0] px-5 text-sm font-semibold text-white transition hover:bg-[#1f5fc5] disabled:cursor-wait disabled:bg-[#8bb8ff]"
          >
            {isLoading ? "Loading more" : "Load more"}
          </button>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">End of results</p>
        )}
      </div>
    </>
  );
}
