"use client";

import { useRef, useState, useTransition } from "react";
import Papa from "papaparse";
import { UploadCloud, X, CheckCircle2, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { importReportsAction } from "./import-actions";
import type { ImportRowInput } from "@/lib/data/reports";

const TARGET_FIELDS: { key: keyof ImportRowInput | "ignore"; label: string }[] = [
  { key: "ignore", label: "Ignore this column" },
  { key: "message", label: "Issue / message (required)" },
  { key: "reference_number", label: "Reference number" },
  { key: "citizen_name", label: "Citizen name" },
  { key: "phone", label: "Phone" },
  { key: "summary", label: "Summary" },
  { key: "category", label: "Category" },
  { key: "subcategory", label: "Subcategory" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "department", label: "Assigned department" },
  { key: "lga", label: "LGA" },
  { key: "ward", label: "Ward" },
  { key: "community", label: "Community" },
  { key: "language", label: "Language" },
  { key: "sentiment", label: "Sentiment" },
  { key: "created_at", label: "Date reported" },
];

const ALIASES: Record<string, string[]> = {
  message: ["message", "complaint", "issue", "description", "report", "details", "narrative"],
  reference_number: ["reference", "referencenumber", "ref", "refno", "id", "ticketid"],
  citizen_name: ["name", "citizenname", "fullname", "reportedby", "citizen"],
  phone: ["phone", "phonenumber", "mobile", "contact", "contactnumber"],
  summary: ["summary", "shortdescription"],
  category: ["category", "issuecategory", "type", "issuetype"],
  subcategory: ["subcategory", "subtype"],
  priority: ["priority", "urgency", "severity"],
  status: ["status", "state"],
  department: ["department", "ministry", "agency", "assigneddepartment"],
  lga: ["lga", "localgovernment", "localgovernmentarea"],
  ward: ["ward"],
  community: ["community", "area", "location", "neighborhood"],
  language: ["language", "lang"],
  sentiment: ["sentiment", "mood", "tone"],
  created_at: ["date", "createdat", "timestamp", "datereported", "reportdate", "dateofreport"],
};

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function guessMapping(headers: string[]): Record<string, keyof ImportRowInput | "ignore"> {
  const mapping: Record<string, keyof ImportRowInput | "ignore"> = {};
  for (const header of headers) {
    const normalized = normalizeHeader(header);
    let matched: keyof ImportRowInput | "ignore" = "ignore";
    for (const [field, aliases] of Object.entries(ALIASES)) {
      if (aliases.includes(normalized)) {
        matched = field as keyof ImportRowInput;
        break;
      }
    }
    mapping[header] = matched;
  }
  return mapping;
}

type ParsedState = {
  headers: string[];
  rows: Record<string, string>[];
  mapping: Record<string, keyof ImportRowInput | "ignore">;
};

export function ImportExportBar({ exportHref }: { exportHref: string }) {
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<ParsedState | null>(null);
  const [result, setResult] = useState<{ inserted: number; skipped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function reset() {
    setParsed(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file: File) {
    setError(null);
    setResult(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        if (headers.length === 0 || results.data.length === 0) {
          setError("Couldn't find any rows in that file.");
          return;
        }
        setParsed({ headers, rows: results.data, mapping: guessMapping(headers) });
      },
      error: (err) => setError(err.message),
    });
  }

  function updateMapping(header: string, field: keyof ImportRowInput | "ignore") {
    if (!parsed) return;
    setParsed({ ...parsed, mapping: { ...parsed.mapping, [header]: field } });
  }

  function confirmImport() {
    if (!parsed) return;
    const messageHeader = Object.entries(parsed.mapping).find(([, v]) => v === "message")?.[0];
    if (!messageHeader) {
      setError('Map at least one column to "Issue / message" before importing.');
      return;
    }

    const rows: ImportRowInput[] = parsed.rows.map((row) => {
      const out: Partial<Record<keyof ImportRowInput, string>> = {};
      for (const [header, field] of Object.entries(parsed.mapping)) {
        if (field === "ignore") continue;
        const value = row[header];
        if (value !== undefined && value !== "") out[field] = value;
      }
      return { message: "", ...out } as ImportRowInput;
    });

    startTransition(async () => {
      const res = await importReportsAction(rows);
      setResult(res);
      router.refresh();
    });
  }

  return (
    <div className="flex w-full flex-col items-end gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Import CSV
        </button>
        <a
          href={exportHref}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </a>
      </div>

      {open && (
        <div className="w-full rounded-2xl border border-neutral-200 bg-white p-4 text-left">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-700">
              Import reports from CSV (e.g. exported from Google Sheets)
            </h2>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close import panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!parsed && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
              <UploadCloud className="mx-auto mb-2 h-6 w-6 text-neutral-400" />
              <p className="mb-3 text-sm text-neutral-500">Choose a .csv file to upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="mx-auto block text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-indigo-500"
              />
            </div>
          )}

          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          {parsed && !result && (
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="mb-2 text-xs font-medium text-neutral-500">
                  Map columns ({parsed.rows.length} rows detected)
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {parsed.headers.map((header) => (
                    <div key={header} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2.5 py-1.5">
                      <span className="min-w-0 flex-1 truncate text-xs text-neutral-600" title={header}>
                        {header}
                      </span>
                      <select
                        value={parsed.mapping[header]}
                        onChange={(e) => updateMapping(header, e.target.value as keyof ImportRowInput | "ignore")}
                        className="rounded-md border border-neutral-300 bg-white px-1.5 py-1 text-xs text-neutral-700 outline-none"
                      >
                        {TARGET_FIELDS.map((f) => (
                          <option key={f.key} value={f.key}>
                            {f.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-neutral-200">
                <table className="w-full min-w-125 text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
                      {parsed.headers.map((h) => (
                        <th key={h} className="whitespace-nowrap px-2.5 py-1.5 font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {parsed.rows.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {parsed.headers.map((h) => (
                          <td key={h} className="whitespace-nowrap px-2.5 py-1.5 text-neutral-600">
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsed.rows.length > 5 && (
                  <p className="border-t border-neutral-200 px-2.5 py-1.5 text-xs text-neutral-400">
                    +{parsed.rows.length - 5} more rows
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={confirmImport}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
                >
                  {isPending ? "Importing..." : `Import ${parsed.rows.length} rows`}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  Choose a different file
                </button>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Imported {result.inserted} report{result.inserted === 1 ? "" : "s"}
              {result.skipped > 0 ? ` (${result.skipped} skipped — missing issue text)` : ""}.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
