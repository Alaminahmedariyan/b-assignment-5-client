import { Skeleton } from "../components/ui/skeleton";



const PublicLoading = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      
      {/* Hero Skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-5 w-96" />
      </section>

      {/* Blog Cards */}
      <section className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border p-4"
          >
            <Skeleton className="aspect-video w-full rounded-lg" />

            <Skeleton className="h-6 w-3/4" />

            <Skeleton className="h-4 w-full" />

            <Skeleton className="h-4 w-2/3" />

            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </section>

    </main>
  );
};

export default PublicLoading;