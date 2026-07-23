"use client";

import { Download } from "lucide-react";

export function ExportBar({ exportHref }: { exportHref: string }) {
  return (
    <a
      href={exportHref}
      className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
    >
      <Download className="h-3.5 w-3.5" />
      Export CSV
    </a>
  );
}
