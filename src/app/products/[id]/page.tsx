import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailActions } from "@/components/product/product-detail-actions";
import { ProductResultRow } from "@/components/search/product-result-row";
import {
  getProductById,
  getProductIds,
  getRelatedProducts,
} from "@/lib/products/catalog";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamicParams = false;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const getFirst = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const getSafeReturnTo = (value: string | undefined) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

const getDiscount = (price: number, originalPrice: number | undefined) => {
  if (!originalPrice) {
    return undefined;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export function generateStaticParams() {
  return getProductIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Product not found | BrowseLab",
    };
  }

  return {
    title: `${product.name} | BrowseLab`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const [{ id }, rawSearchParams] = await Promise.all([params, searchParams]);
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const returnToHref = getSafeReturnTo(getFirst(rawSearchParams.returnTo));
  const relatedProducts = getRelatedProducts(product.id, 3);
  const discount = getDiscount(product.price, product.originalPrice);
  const highlights = Array.from(
    new Set([
      product.inStock ? "In stock" : "Restocking soon",
      product.freeShipping ? "Free delivery" : "Standard delivery",
      ...product.badges,
    ]),
  );

  return (
    <main className="min-h-screen bg-[#f1f3f6]">
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            BrowseLab
          </Link>
          <form action="/" className="grid min-w-0 grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="product-detail-search">
              Search products
            </label>
            <input
              id="product-detail-search"
              name="q"
              placeholder="Search for products, brands and more"
              className="h-11 min-w-0 rounded-l-sm border-0 bg-white px-4 text-sm text-zinc-950 shadow-sm outline-none"
            />
            <button
              type="submit"
              className="h-11 rounded-r-sm bg-[#ffe11b] px-5 text-sm font-semibold text-zinc-950 shadow-sm transition hover:bg-[#ffd814]"
            >
              Search
            </button>
          </form>
          <div className="hidden items-center gap-4 text-sm font-semibold text-white md:flex">
            <Link href={returnToHref}>Results</Link>
            <span>Wishlist</span>
            <span>Compare</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-3 py-3">
        <nav className="mb-3 text-sm">
          <Link
            href={returnToHref}
            className="font-semibold text-[#2874f0] transition hover:text-[#1f5fc5]"
          >
            Back to results
          </Link>
          <span className="mx-2 text-zinc-400">/</span>
          <span className="text-zinc-500">{product.category}</span>
        </nav>

        <section className="grid gap-3 lg:grid-cols-[430px_minmax(0,1fr)]">
          <div className="bg-white p-4 shadow-sm">
            <div className="sticky top-[76px] space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50">
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 430px"
                  className="object-contain p-8"
                  priority
                />
              </div>
              <ProductDetailActions product={product} />
            </div>
          </div>

          <div className="space-y-3">
            <section className="bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase text-zinc-400">
                {product.brand}
              </p>
              <h1 className="mt-2 text-2xl font-semibold leading-tight text-zinc-950">
                {product.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-sm bg-[#388e3c] px-2 py-0.5 text-xs font-semibold text-white">
                  {product.rating.toFixed(1)} stars
                </span>
                <span className="text-sm font-medium text-zinc-500">
                  {product.reviewCount.toLocaleString()} ratings
                </span>
                <span className="text-sm text-zinc-400">| {product.category}</span>
              </div>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <p className="text-3xl font-semibold text-zinc-950">
                  {formatCurrency(product.price)}
                </p>
                {product.originalPrice && (
                  <p className="pb-1 text-base text-zinc-500 line-through">
                    {formatCurrency(product.originalPrice)}
                  </p>
                )}
                {discount && (
                  <p className="pb-1 text-base font-semibold text-[#388e3c]">
                    {discount}% off
                  </p>
                )}
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                {product.description}
              </p>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">
                Available offers
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-sm border border-zinc-200 p-3">
                  <p className="text-sm font-semibold text-zinc-950">
                    Bank offer available
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Extra savings can apply at checkout on selected cards.
                  </p>
                </div>
                <div className="rounded-sm border border-zinc-200 p-3">
                  <p className="text-sm font-semibold text-zinc-950">
                    {product.freeShipping ? "Free delivery" : "Standard delivery"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Delivery estimate updates with location and stock status.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">
                Highlights
              </h2>
              <ul className="mt-4 grid gap-2 text-sm text-zinc-600 sm:grid-cols-2">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">
                Product details
              </h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Colors</dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {product.colors.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Sizes</dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {product.sizes.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Stock</dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {product.inStock ? "Available" : "Restocking soon"}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Added to catalog</dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {product.createdAt}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-3 shadow-sm">
            <div className="border-b border-zinc-100 bg-white p-4">
              <h2 className="text-lg font-semibold text-zinc-950">
                Similar products
              </h2>
            </div>
            {relatedProducts.map((relatedProduct) => (
              <ProductResultRow
                key={relatedProduct.id}
                product={relatedProduct}
                returnToHref={returnToHref}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
