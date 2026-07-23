import Link from "next/link";
import { getPaginatedReports, type ReportFilters } from "@/lib/data/reports";
import { PriorityBadge, StatusBadge } from "@/components/dashboard/badges";
import { ExportBar } from "./export-bar";
import { FilterBar } from "./filter-bar";
import { Pagination } from "./pagination";
import type { PriorityLevel, ReportStatus } from "@/lib/supabase/types";

const PAGE_SIZE = 10;

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const get = (key: string) => (typeof sp[key] === "string" ? (sp[key] as string) : "");

  const filters: ReportFilters = {
    search: get("search") || undefined,
    status: (get("status") as ReportStatus) || undefined,
    priority: (get("priority") as PriorityLevel) || undefined,
  };
  const page = Math.max(1, parseInt(get("page") || "1", 10) || 1);

  const { reports, total, totalPages } = await getPaginatedReports(filters, page, PAGE_SIZE);

  const filterQuery = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v) as [string, string][]
  ).toString();

  const pageHref = (p: number) => {
    const params = new URLSearchParams(filterQuery);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/reports${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-800">{total}</span> reports
        </p>
        <ExportBar
          exportHref={`/reports/export${filterQuery ? `?${filterQuery}` : ""}`}
        />
      </div>

      <FilterBar />

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/60 text-left text-xs font-medium tracking-wide text-neutral-500 uppercase">
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Citizen</th>
              <th className="px-4 py-3 font-medium">Community</th>
              <th className="px-4 py-3 font-medium">Issue</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {reports.map((r) => (
              <tr key={r.id} className="align-top transition-colors hover:bg-blue-50/40">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-400">
                  <Link href={`/reports/${r.id}`} className="hover:text-blue-700">
                    {r.reference_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-700">{r.citizen_name ?? "Anonymous"}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {r.community ?? "—"}
                  <div className="text-xs text-neutral-400">
                    {r.lga}
                    {r.ward ? `, ${r.ward}` : ""}
                  </div>
                </td>
                <td className="max-w-70 px-4 py-3 text-neutral-700">
                  <Link href={`/reports/${r.id}`} className="line-clamp-2 hover:text-blue-700">
                    {r.summary ?? r.message}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                  {r.category ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <PriorityBadge priority={r.priority} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                  {r.department ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-400">
                  {formatDate(r.created_at)}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-neutral-400">
                  No reports match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} hrefFor={pageHref} />
      </div>
    </div>
  );
}
