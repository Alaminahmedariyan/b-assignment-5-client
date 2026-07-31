import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { ApiMeta } from '@/types/gear';

interface GearPaginationProps {
  meta: ApiMeta;
  /** Query string of active filters, WITHOUT the `page` param */
  baseQuery: string;
  /** Route to paginate within — defaults to /gear for backward compatibility */
  basePath?: string;
}

export function GearPagination({
  meta,
  baseQuery,
  basePath = '/gear',
}: GearPaginationProps) {
  const { page: currentPage, totalPage } = meta;

  if (totalPage <= 1) {
    return null;
  }

  const buildHref = (page: number) => {
    const params = new URLSearchParams(baseQuery);
    params.set('page', String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages = Array.from(
    { length: totalPage },
    (_, index) => index + 1,
  ).filter(
    (page) =>
      page === 1 ||
      page === totalPage ||
      Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex size-9 items-center justify-center rounded-full border border-border/60 transition-colors ${
          currentPage === 1
            ? 'pointer-events-none opacity-40'
            : 'hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        <ChevronLeft className="size-4" />
      </Link>

      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        const showEllipsis =
          previousPage !== undefined && page - previousPage > 1;

        return (
          <span key={page} className="flex items-center gap-1.5">
            {showEllipsis && (
              <span className="px-1 text-sm text-muted-foreground">…</span>
            )}

            <Link
              href={buildHref(page)}
              className={`flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-border/60 hover:border-primary/40 hover:bg-primary/5'
              }`}
            >
              {page}
            </Link>
          </span>
        );
      })}

      <Link
        href={buildHref(Math.min(totalPage, currentPage + 1))}
        aria-disabled={currentPage === totalPage}
        className={`flex size-9 items-center justify-center rounded-full border border-border/60 transition-colors ${
          currentPage === totalPage
            ? 'pointer-events-none opacity-40'
            : 'hover:border-primary/40 hover:bg-primary/5'
        }`}
      >
        <ChevronRight className="size-4" />
      </Link>
    </nav>
  );
}