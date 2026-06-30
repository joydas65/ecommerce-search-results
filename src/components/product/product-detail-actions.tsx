"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { WishlistButton } from "@/components/search/product-actions";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const getDiscount = (product: Product) => {
  if (!product.originalPrice) {
    return undefined;
  }

  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );
};

export function ProductDetailActions({ product }: { product: Product }) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [purchaseMode, setPurchaseMode] = useState<"one-time" | "subscribe">(
    "one-time",
  );
  const discount = getDiscount(product);

  return (
    <aside className="space-y-3 lg:col-span-2 xl:col-span-1">
      <div className="xl:sticky xl:top-[132px]">
        <section className="bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-zinc-500">
                Online price
              </p>
              <p className="mt-1 text-3xl font-semibold text-zinc-950">
                {formatCurrency(product.price)}
              </p>
              {product.originalPrice && (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-zinc-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  {discount && (
                    <span className="text-sm font-semibold text-[#388e3c]">
                      {discount}% off
                    </span>
                  )}
                </div>
              )}
            </div>
            <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2874f0]">
              Bank offer
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-[#388e3c]">
            {product.freeShipping ? "Free delivery" : "Delivery calculated"}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Easy returns and secure mock checkout for portfolio demo flow.
          </p>

          <div className="mt-4 grid gap-2">
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
        </section>

        <section className="mt-3 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-950">
            Purchase options
          </h2>
          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => setPurchaseMode("one-time")}
              aria-pressed={purchaseMode === "one-time"}
              className={`flex items-center justify-between rounded-sm border p-3 text-left text-sm transition ${
                purchaseMode === "one-time"
                  ? "border-zinc-950 bg-white"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <span>
                <span className="block font-semibold text-zinc-950">
                  One-time purchase
                </span>
                <span className="text-xs text-zinc-500">
                  Best for immediate checkout
                </span>
              </span>
              <span className="font-semibold text-zinc-950">
                {formatCurrency(product.price)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPurchaseMode("subscribe")}
              aria-pressed={purchaseMode === "subscribe"}
              className={`flex items-center justify-between rounded-sm border p-3 text-left text-sm transition ${
                purchaseMode === "subscribe"
                  ? "border-[#2874f0] bg-[#eff6ff]"
                  : "border-zinc-200 bg-zinc-50"
              }`}
            >
              <span>
                <span className="block font-semibold text-zinc-950">
                  Subscribe and save
                </span>
                <span className="text-xs text-zinc-500">
                  Mock recurring delivery option
                </span>
              </span>
              <span className="font-semibold text-[#388e3c]">5% off</span>
            </button>
          </div>
        </section>

        <section className="mt-3 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-950">
            How you will get this item
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-sm border border-zinc-950 p-3">
              <p className="font-semibold text-zinc-950">Shipping</p>
              <p className="mt-1 text-zinc-500">
                {product.inStock ? "Arrives tomorrow" : "When restocked"}
              </p>
            </div>
            <div className="rounded-sm border border-zinc-200 p-3">
              <p className="font-semibold text-zinc-950">Pickup</p>
              <p className="mt-1 text-zinc-500">As soon as today</p>
            </div>
            <div className="rounded-sm border border-zinc-200 p-3">
              <p className="font-semibold text-zinc-950">Delivery</p>
              <p className="mt-1 text-zinc-500">In 40 mins</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Ships to demo location. Availability updates with stock status.
          </p>
        </section>
      </div>
    </aside>
  );
}
