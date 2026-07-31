export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] animate-pulse bg-muted/20">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Sidebar skeleton */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="space-y-1 rounded-2xl border border-border/60 bg-card p-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-9 rounded-xl bg-muted" />
            ))}
          </div>
        </aside>

        {/* Content skeleton */}
        <main className="min-w-0 flex-1 space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-lg bg-muted" />
            <div className="h-4 w-72 rounded-lg bg-muted" />
          </div>

          <div className="h-40 rounded-3xl bg-muted" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-2xl bg-muted" />
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-64 rounded-2xl bg-muted" />
            <div className="h-64 rounded-2xl bg-muted" />
          </div>
        </main>
      </div>
    </div>
  );
}