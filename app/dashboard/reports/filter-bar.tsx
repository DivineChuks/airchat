"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const STATUSES = ["new", "assigned", "in_progress", "resolved", "closed"];
const PRIORITIES = ["low", "medium", "high", "critical"];

function toTitleCase(value: string) {
  return value
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  // Debounce the search box so navigation doesn't fire on every keystroke.
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (search === current) return;
    const handle = setTimeout(() => updateParam("search", search), 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="min-w-55 flex-1">
        <label className="mb-1 block text-xs font-medium text-neutral-500">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Message, reference, citizen..."
          className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Status</label>
        <select
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-indigo-500"
        >
          <option value="">All</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {toTitleCase(s)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-500">Priority</label>
        <select
          defaultValue={searchParams.get("priority") ?? ""}
          onChange={(e) => updateParam("priority", e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm text-neutral-900 outline-none focus:border-indigo-500"
        >
          <option value="">All</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {toTitleCase(p)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
