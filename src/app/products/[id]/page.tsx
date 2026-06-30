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
import type { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamicParams = false;

const secondaryNavItems = [
  "Departments",
  "Deals",
  "New arrivals",
  "Best sellers",
  "Mobiles",
  "Home",
  "Fashion",
  "Grocery",
  "Plus offers",
];

const colorSwatchClassNames: Record<string, string> = {
  Black: "bg-zinc-950",
  Blue: "bg-blue-600",
  Coral: "bg-orange-400",
  Cream: "bg-yellow-100",
  Gray: "bg-zinc-400",
  Indigo: "bg-indigo-600",
  Navy: "bg-blue-950",
  Olive: "bg-lime-800",
  Sage: "bg-emerald-200",
  Silver: "bg-zinc-300",
  Tan: "bg-amber-200",
  White: "bg-white",
};

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

const getFeatureBullets = (product: Product, highlights: string[]) => {
  const keywordSummary = product.keywords.slice(0, 3).join(", ");

  return [
    product.description,
    `Popular for ${keywordSummary}.`,
    `${product.reviewCount.toLocaleString()} customer ratings with ${product.rating.toFixed(1)} stars.`,
    ...highlights.slice(0, 4),
  ];
};

const getMomentumLabel = (product: Product) => {
  const roundedViews = Math.max(100, Math.floor(product.reviewCount / 50) * 50);

  return `${roundedViews}+ viewed since yesterday`;
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
  const featureBullets = getFeatureBullets(product, highlights);
  const galleryTiles = ["Main", "Detail", "In use", "+3"];

  return (
    <main className="min-h-screen bg-[#f1f3f6]">
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
        <div className="mx-auto grid max-w-[1500px] gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
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

      <nav className="bg-white shadow-sm" aria-label="Featured departments">
        <div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto px-3 py-2">
          {secondaryNavItems.map((item) => (
            <Link
              key={item}
              href="/"
              className="shrink-0 rounded-full bg-[#eff6ff] px-4 py-2 text-xs font-semibold text-[#1f5fc5] transition hover:bg-[#dbeafe]"
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] px-3 py-3">
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

        <section className="grid gap-3 lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)] xl:grid-cols-[minmax(420px,560px)_minmax(0,1fr)_340px]">
          <section className="bg-white p-4 shadow-sm">
            <div className="sticky top-[132px] grid gap-4 sm:grid-cols-[76px_minmax(0,1fr)]">
              <div className="flex gap-2 overflow-x-auto sm:flex-col">
                {galleryTiles.map((label, index) => (
                  <div
                    key={label}
                    className={`grid h-20 w-20 shrink-0 place-items-center rounded-sm border bg-white p-1 text-center text-[11px] font-semibold ${
                      index === 0
                        ? "border-[#2874f0] text-[#2874f0]"
                        : "border-zinc-200 text-zinc-500"
                    }`}
                  >
                    {index < 3 ? (
                      <span className="relative block h-12 w-12">
                        <Image
                          src={product.image.src}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </span>
                    ) : (
                      <span className="text-lg text-zinc-950">{label}</span>
                    )}
                    <span>{index < 3 ? label : "More"}</span>
                  </div>
                ))}
              </div>

              <div className="relative min-h-[430px] overflow-hidden rounded-sm border border-zinc-100 bg-zinc-50 lg:min-h-[560px]">
                <div className="absolute right-3 top-3 z-10 grid gap-2">
                  {["Share", "Save", "Zoom"].map((action) => (
                    <span
                      key={action}
                      className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-[10px] font-semibold text-zinc-600 shadow-sm"
                    >
                      {action}
                    </span>
                  ))}
                </div>
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="object-contain p-8 lg:p-12"
                  priority
                />
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <section className="bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-sm border border-[#2874f0] px-2 py-1 text-xs font-semibold text-[#2874f0]">
                  {getMomentumLabel(product)}
                </span>
                <span className="rounded-sm bg-zinc-950 px-2 py-1 text-xs font-semibold text-white">
                  Overall pick
                </span>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase text-zinc-400">
                Visit the {product.brand} store
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

              <div className="mt-5 border-t border-zinc-100 pt-5">
                <div>
                  <p className="text-sm font-semibold text-zinc-950">
                    Size:{" "}
                    <span className="font-medium text-zinc-600">
                      {product.sizes[0]}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={size}
                        className={`rounded-sm border px-4 py-3 text-sm font-semibold ${
                          index === 0
                            ? "border-zinc-950 text-zinc-950"
                            : "border-zinc-200 text-zinc-600"
                        }`}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-semibold text-zinc-950">
                    Color:{" "}
                    <span className="font-medium text-zinc-600">
                      {product.colors[0]}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <span
                        key={color}
                        className={`flex items-center gap-2 rounded-sm border px-3 py-2 text-sm font-medium ${
                          index === 0
                            ? "border-[#2874f0] text-[#2874f0]"
                            : "border-zinc-200 text-zinc-600"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full border border-zinc-200 ${colorSwatchClassNames[color] ?? "bg-zinc-200"}`}
                        />
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                Key item features
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700">
                {featureBullets.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href="#product-details"
                className="mt-3 inline-flex text-sm font-semibold text-[#2874f0] transition hover:text-[#1f5fc5]"
              >
                View all item details
              </Link>
            </section>

            <section id="product-details" className="bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-zinc-950">
                Product details
              </h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-zinc-500">Brand</dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {product.brand}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500">Category</dt>
                  <dd className="mt-1 font-medium text-zinc-950">
                    {product.category}
                  </dd>
                </div>
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
              {discount && (
                <p className="mt-4 text-sm font-semibold text-[#388e3c]">
                  Current catalog discount: {discount}% off.
                </p>
              )}
            </section>
          </section>

          <ProductDetailActions product={product} />
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
