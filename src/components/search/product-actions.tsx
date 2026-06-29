"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { Product } from "@/types/product";

const wishlistStorageKey = "browselab:wishlist";
const wishlistChangeEvent = "browselab:wishlist-change";

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

export function WishlistButton({
  product,
  className = "h-9 rounded-md bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800",
}: {
  product: Product;
  className?: string;
}) {
  const wishlistSnapshot = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistSnapshot,
    () => "[]",
  );
  const isSaved = parseWishlist(wishlistSnapshot).has(product.id);

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
    <button
      type="button"
      onClick={toggleWishlist}
      aria-pressed={isSaved}
      className={className}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}

export function ProductActions({
  product,
  detailsHref = `/products/${product.id}`,
}: {
  product: Product;
  detailsHref?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link
        href={detailsHref}
        className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 text-sm font-medium text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
      >
        View details
      </Link>
      <WishlistButton product={product} />
    </div>
  );
}
