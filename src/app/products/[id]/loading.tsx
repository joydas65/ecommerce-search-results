const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-zinc-100 ${className}`} />
);

const secondaryNavPlaceholders = Array.from({ length: 9 }, (_, index) => index);

export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[#f1f3f6]" aria-label="Loading product">
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
        <div className="mx-auto grid max-w-[1500px] gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
          <div className="text-xl font-bold tracking-tight text-white">
            BrowseLab
          </div>
          <div className="grid min-w-0 grid-cols-[1fr_auto]">
            <div className="h-11 rounded-l-sm bg-white/95" />
            <div className="h-11 w-24 rounded-r-sm bg-[#ffe11b]/80" />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <div className="h-4 w-16 rounded bg-white/60" />
            <div className="h-4 w-16 rounded bg-white/60" />
            <div className="h-4 w-20 rounded bg-white/60" />
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm" aria-label="Loading departments">
        <div className="mx-auto flex max-w-[1500px] gap-2 overflow-x-auto px-3 py-2">
          {secondaryNavPlaceholders.map((item) => (
            <SkeletonBlock key={item} className="h-8 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1500px] px-3 py-3">
        <div className="mb-3 flex items-center gap-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-16" />
        </div>

        <section className="grid gap-3 lg:grid-cols-[minmax(360px,520px)_minmax(0,1fr)] xl:grid-cols-[minmax(420px,560px)_minmax(0,1fr)_340px]">
          <section className="bg-white p-4 shadow-sm">
            <div className="sticky top-[132px] grid gap-4 sm:grid-cols-[76px_minmax(0,1fr)]">
              <div className="flex gap-2 overflow-x-auto sm:flex-col">
                {Array.from({ length: 4 }, (_, index) => (
                  <SkeletonBlock
                    key={index}
                    className="h-20 w-20 shrink-0 rounded-sm"
                  />
                ))}
              </div>
              <SkeletonBlock className="min-h-[430px] rounded-sm lg:min-h-[560px]" />
            </div>
          </section>

          <section className="space-y-3">
            <section className="bg-white p-5 shadow-sm">
              <div className="flex gap-2">
                <SkeletonBlock className="h-7 w-40" />
                <SkeletonBlock className="h-7 w-24" />
              </div>
              <SkeletonBlock className="mt-5 h-3 w-36" />
              <SkeletonBlock className="mt-3 h-8 w-3/4" />
              <div className="mt-4 flex gap-2">
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-32" />
              </div>
              <div className="mt-6 border-t border-zinc-100 pt-5">
                <SkeletonBlock className="h-4 w-24" />
                <div className="mt-3 flex gap-2">
                  <SkeletonBlock className="h-14 w-16" />
                  <SkeletonBlock className="h-14 w-16" />
                  <SkeletonBlock className="h-14 w-16" />
                </div>
                <SkeletonBlock className="mt-5 h-4 w-24" />
                <div className="mt-3 flex gap-2">
                  <SkeletonBlock className="h-11 w-24" />
                  <SkeletonBlock className="h-11 w-24" />
                  <SkeletonBlock className="h-11 w-24" />
                </div>
              </div>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SkeletonBlock className="h-24 rounded-sm" />
                <SkeletonBlock className="h-24 rounded-sm" />
              </div>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-5 space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <SkeletonBlock key={index} className="h-4 w-full" />
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-3 lg:col-span-2 xl:col-span-1">
            <section className="bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="mt-2 h-9 w-28" />
                </div>
                <SkeletonBlock className="h-7 w-24 rounded-full" />
              </div>
              <SkeletonBlock className="mt-4 h-4 w-28" />
              <SkeletonBlock className="mt-2 h-4 w-full" />
              <div className="mt-4 grid gap-2">
                <SkeletonBlock className="h-11 rounded-sm" />
                <SkeletonBlock className="h-11 rounded-sm" />
                <SkeletonBlock className="h-11 rounded-sm" />
              </div>
            </section>

            <section className="bg-white p-4 shadow-sm">
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-3 grid gap-2">
                <SkeletonBlock className="h-20 rounded-sm" />
                <SkeletonBlock className="h-20 rounded-sm" />
              </div>
            </section>

            <section className="bg-white p-4 shadow-sm">
              <SkeletonBlock className="h-5 w-44" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <SkeletonBlock className="h-24 rounded-sm" />
                <SkeletonBlock className="h-24 rounded-sm" />
                <SkeletonBlock className="h-24 rounded-sm" />
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
