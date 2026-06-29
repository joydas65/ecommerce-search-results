import Image from "next/image";
import type { Product } from "@/types/product";
import { ProductActions } from "./product-actions";

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

export function ProductResultRow({
  product,
  imagePriority = false,
}: {
  product: Product;
  imagePriority?: boolean;
}) {
  const discount = getDiscount(product);
  const imageLoadingProps = imagePriority
    ? { priority: true }
    : { loading: "lazy" as const };
  const highlights = Array.from(
    new Set([
      product.inStock ? "In stock" : "Restocking soon",
      product.freeShipping ? "Free delivery" : "Standard delivery",
      ...product.badges.slice(0, 2),
    ]),
  );

  return (
    <article className="grid min-h-[220px] gap-4 border-t border-zinc-100 bg-white p-4 transition [contain-intrinsic-size:220px] [content-visibility:auto] hover:shadow-md md:grid-cols-[180px_minmax(0,1fr)_220px]">
      <div className="flex items-start justify-center">
        <div className="relative aspect-[4/3] w-full max-w-[220px] overflow-hidden rounded-sm bg-zinc-50">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(max-width: 768px) 60vw, 180px"
            className="object-contain p-3"
            {...imageLoadingProps}
          />
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-400">
            {product.brand}
          </p>
          <h2 className="mt-1 text-lg font-semibold leading-snug text-zinc-950">
            {product.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-[#388e3c] px-2 py-0.5 text-xs font-semibold text-white">
              {product.rating.toFixed(1)} stars
            </span>
            <span className="text-sm font-medium text-zinc-500">
              {product.reviewCount.toLocaleString()} ratings
            </span>
            <span className="text-sm text-zinc-400">| {product.category}</span>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          {product.description}
        </p>

        <ul className="grid gap-1 text-sm text-zinc-600 sm:grid-cols-2">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-400" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-zinc-500">
          Colors: {product.colors.join(", ")} · Sizes: {product.sizes.join(", ")}
        </p>
      </div>

      <div className="flex flex-col justify-between gap-4 md:items-end">
        <div className="space-y-1 md:text-right">
          <p className="text-2xl font-semibold text-zinc-950">
            {formatCurrency(product.price)}
          </p>
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            {product.originalPrice && (
              <span className="text-sm text-zinc-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-[#388e3c]">
                {discount}% off
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-[#388e3c]">
            {product.freeShipping ? "Free delivery" : "Delivery calculated"}
          </p>
          <p className="text-xs text-zinc-500">Bank offer available</p>
        </div>
        <div className="w-full md:w-[190px]">
          <ProductActions product={product} />
        </div>
      </div>
    </article>
  );
}

export function ProductResultRowSkeleton() {
  return (
    <article
      aria-hidden="true"
      className="grid min-h-[220px] gap-4 border-t border-zinc-100 bg-white p-4 md:grid-cols-[180px_minmax(0,1fr)_220px]"
    >
      <div className="flex items-start justify-center">
        <div className="aspect-[4/3] w-full max-w-[220px] animate-pulse rounded-sm bg-zinc-100" />
      </div>
      <div className="space-y-3">
        <div className="h-3 w-20 animate-pulse rounded bg-zinc-100" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-zinc-100" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-sm bg-zinc-100" />
          <div className="h-5 w-28 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="h-3 w-32 animate-pulse rounded bg-zinc-100" />
          <div className="h-3 w-28 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
      <div className="space-y-3 md:text-right">
        <div className="ml-auto h-7 w-20 animate-pulse rounded bg-zinc-100" />
        <div className="ml-auto h-4 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="ml-auto h-9 w-full animate-pulse rounded bg-zinc-100" />
      </div>
    </article>
  );
}
