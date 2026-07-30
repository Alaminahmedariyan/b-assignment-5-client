export default function GearDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 h-4 w-56 rounded bg-muted" />

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {/* Gallery */}
          <div className="aspect-[4/3] rounded-3xl bg-muted" />

          {/* Title block */}
          <div className="space-y-3">
            <div className="h-5 w-32 rounded-full bg-muted" />
            <div className="h-8 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-3/4 rounded bg-muted" />
            </div>
          </div>

          {/* Specs card */}
          <div className="h-40 rounded-3xl bg-muted" />

          {/* Reviews card */}
          <div className="h-32 rounded-3xl bg-muted" />
        </div>

        {/* Booking card */}
        <div className="h-80 rounded-3xl bg-muted" />
      </div>
    </div>
  );
}