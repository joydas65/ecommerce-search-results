import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="min-h-screen bg-[#f1f3f6]">
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
          <Link href="/" className="text-xl font-bold tracking-tight text-white">
            BrowseLab
          </Link>
          <form action="/" className="grid min-w-0 grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="missing-product-search">
              Search products
            </label>
            <input
              id="missing-product-search"
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
            <Link href="/">Results</Link>
            <span>Wishlist</span>
            <span>Compare</span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-3 py-3">
        <div className="bg-white p-8 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase text-zinc-400">
            Product unavailable
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-950">
            We could not find this product
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">
            The item may have been removed from the mock catalog or the link may
            be outdated. Browse current results or search for a similar product.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-sm bg-[#2874f0] px-5 text-sm font-semibold text-white transition hover:bg-[#1f5fc5]"
          >
            Browse products
          </Link>
        </div>
      </section>
    </main>
  );
}
