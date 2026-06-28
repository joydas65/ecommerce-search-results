"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product } from "@/types/product";

const wishlistStorageKey = "browselab:wishlist";
const wishlistChangeEvent = "browselab:wishlist-change";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const parseWishlist = (snapshot: string) => {
  try {
    return new Set<string>(JSON.parse(snapshot));
  } catch {
    return new Set<string>();
  }
};

const getWishlistSnapshot = () =>
  typeof window === "undefined"
    ? "[]"
    : (localStorage.getItem(wishlistStorageKey) ?? "[]");

const subscribeToWishlist = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(wishlistChangeEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(wishlistChangeEvent, onStoreChange);
  };
};

export function ProductActions({ product }: { product: Product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => "[]",
  );
  const isSaved = parseWishlist(wishlistSnapshot).has(product.id);

  useEffect(() => {
    if (!isQuickViewOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsQuickViewOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isQuickViewOpen]);

  const toggleWishlist = () => {
    const wishlist = parseWishlist(getWishlistSnapshot());

    if (wishlist.has(product.id)) {
      wishlist.delete(product.id);
    } else {
      wishlist.add(product.id);
    }

    localStorage.setItem(wishlistStorageKey, JSON.stringify([...wishlist]));
    window.dispatchEvent(new Event(wishlistChangeEvent));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsQuickViewOpen(true)}
          className="h-9 rounded-md border border-zinc-200 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          Quick view
        </button>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={isSaved}
          className="h-9 rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>

      {isQuickViewOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`quick-view-${product.id}`}
            className="w-full max-w-lg rounded-lg bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-zinc-500">
                  {product.brand}
                </p>
                <h2
                  id={`quick-view-${product.id}`}
                  className="mt-1 text-xl font-semibold text-zinc-950"
                >
                  {product.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickViewOpen(false)}
                aria-label="Close quick view"
                className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-white">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="160px"
                    className="object-contain p-2"
                  />
                </div>
                <p className="text-2xl font-semibold text-zinc-950">
                  {formatCurrency(product.price)}
                </p>
                {product.originalPrice && (
                  <p className="mt-1 text-sm text-zinc-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-sm leading-6 text-zinc-600">
                  {product.description}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-zinc-100 p-3">
                    <p className="text-zinc-500">Rating</p>
                    <p className="font-semibold text-zinc-950">
                      {product.rating.toFixed(1)} stars
                    </p>
                  </div>
                  <div className="rounded-md bg-zinc-100 p-3">
                    <p className="text-zinc-500">Stock</p>
                    <p className="font-semibold text-zinc-950">
                      {product.inStock ? "Available" : "Restocking"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500">
                  Colors: {product.colors.join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
