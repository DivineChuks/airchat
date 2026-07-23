import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  if (total > 1) pages.push(total);

  return pages;
}

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
      <p className="text-xs text-neutral-400">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={hrefFor(Math.max(1, page - 1))}
          aria-disabled={page <= 1}
          className={`flex items-center gap-1 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 ${
            page <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Link>

        <div className="mx-1 flex items-center gap-1">
          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e-${i}`} className="px-1.5 text-xs text-neutral-400">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={hrefFor(p)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition ${
                  p === page
                    ? "bg-blue-700 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {p}
              </Link>
            )
          )}
        </div>

        <Link
          href={hrefFor(Math.min(totalPages, page + 1))}
          aria-disabled={page >= totalPages}
          className={`flex items-center gap-1 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 ${
            page >= totalPages ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
