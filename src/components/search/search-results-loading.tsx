import { ProductResultRowSkeleton } from "./product-result-row";

const filterSections = ["Category", "Brand", "Customer Rating", "Price", "Color"];

function Bar({
  className = "",
  rounded = "rounded",
}: {
  className?: string;
  rounded?: string;
}) {
  return <div className={`animate-pulse bg-zinc-100 ${rounded} ${className}`} />;
}

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
        <div className="text-xl font-bold tracking-tight text-white">BrowseLab</div>
        <div className="grid min-w-0 grid-cols-[1fr_auto]">
          <Bar className="h-11 rounded-l-sm bg-white/95" rounded="" />
          <Bar className="h-11 w-24 rounded-r-sm bg-[#ffe11b]/80" rounded="" />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Bar className="h-4 w-16 bg-white/60" />
          <Bar className="h-4 w-16 bg-white/60" />
          <Bar className="h-4 w-20 bg-white/60" />
        </div>
      </div>
    </header>
  );
}

function FilterSkeleton() {
  return (
    <aside className="hidden bg-white shadow-sm lg:block">
      <div className="border-b border-zinc-200 p-4">
        <Bar className="h-6 w-20" />
      </div>
      <div className="space-y-6 p-4">
        {filterSections.map((section) => (
          <div key={section} className="space-y-3">
            <Bar className="h-3 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Bar className="h-4 w-4" rounded="rounded-sm" />
                    <Bar className="h-4 w-24" />
                  </div>
                  <Bar className="h-3 w-5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ResultsHeaderSkeleton() {
  return (
    <section className="bg-white shadow-sm">
      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <Bar className="h-3 w-44" />
            <Bar className="h-6 w-36" />
            <Bar className="h-3 w-40" />
          </div>
          <div className="flex rounded-sm border border-zinc-200 bg-white">
            <Bar className="h-9 w-24 rounded-none" />
            <Bar className="h-9 w-28 rounded-none border-l border-zinc-200" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Bar className="h-6 w-16 rounded-full" />
          <Bar className="h-6 w-24 rounded-full" />
          <Bar className="h-6 w-20 rounded-full" />
          <Bar className="h-6 w-24 rounded-full" />
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-3">
          <Bar className="h-5 w-14" />
          <Bar className="h-5 w-20" />
          <Bar className="h-5 w-16" />
          <Bar className="h-5 w-28" />
          <Bar className="h-5 w-28" />
        </div>
      </div>
    </section>
  );
}

export function SearchResultsLoading() {
  return (
    <main className="min-h-screen bg-[#f1f3f6]" aria-label="Loading product results">
      <HeaderSkeleton />
      <div className="mx-auto grid max-w-7xl gap-3 px-3 py-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="bg-white p-4 shadow-sm lg:hidden">
            <Bar className="h-5 w-44" />
          </div>
          <FilterSkeleton />
        </div>
        <section className="min-w-0 shadow-sm">
          <ResultsHeaderSkeleton />
          {Array.from({ length: 6 }, (_, index) => (
            <ProductResultRowSkeleton key={index} />
          ))}
        </section>
      </div>
    </main>
  );
}
