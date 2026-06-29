const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded bg-zinc-100 ${className}`} />
);

export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-[#f1f3f6]" aria-label="Loading product">
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-sm">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
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

      <div className="mx-auto max-w-7xl px-3 py-3">
        <div className="mb-3 flex items-center gap-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-16" />
        </div>

        <section className="grid gap-3 lg:grid-cols-[430px_minmax(0,1fr)]">
          <div className="bg-white p-4 shadow-sm">
            <div className="sticky top-[76px] space-y-4">
              <SkeletonBlock className="aspect-[4/3] w-full rounded-sm" />
              <div className="grid gap-2 sm:grid-cols-3">
                <SkeletonBlock className="h-11 rounded-sm" />
                <SkeletonBlock className="h-11 rounded-sm" />
                <SkeletonBlock className="h-11 rounded-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <section className="bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="mt-3 h-7 w-2/3" />
              <div className="mt-4 flex gap-2">
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-32" />
              </div>
              <div className="mt-6 flex items-end gap-3">
                <SkeletonBlock className="h-9 w-28" />
                <SkeletonBlock className="h-5 w-20" />
                <SkeletonBlock className="h-5 w-16" />
              </div>
              <div className="mt-5 space-y-2">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-4/5" />
              </div>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-5 w-36" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SkeletonBlock className="h-20 rounded-sm" />
                <SkeletonBlock className="h-20 rounded-sm" />
              </div>
            </section>

            <section className="bg-white p-5 shadow-sm">
              <SkeletonBlock className="h-5 w-24" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <SkeletonBlock key={index} className="h-4 w-40" />
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
