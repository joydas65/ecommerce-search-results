"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { WishlistButton } from "@/components/search/product-actions";

export function ProductDetailActions({ product }: { product: Product }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <button
        type="button"
        onClick={() => setIsAddedToCart(true)}
        className="h-11 rounded-sm bg-[#ffe11b] px-4 text-sm font-semibold text-zinc-950 transition hover:bg-[#ffd814]"
      >
        {isAddedToCart ? "Added to cart" : "Add to cart"}
      </button>
      <button
        type="button"
        className="h-11 rounded-sm bg-[#fb641b] px-4 text-sm font-semibold text-white transition hover:bg-[#e85b18]"
      >
        Buy now
      </button>
      <WishlistButton
        product={product}
        className="h-11 rounded-sm bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
      />
    </div>
  );
}
