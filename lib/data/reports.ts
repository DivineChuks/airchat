import { MOCK_REPORTS } from "@/lib/data/mock-reports";
import type {
  PriorityLevel,
  Report,
  ReportStatus,
} from "@/lib/supabase/types";

// This module is the single seam between the UI and the report data source.
// Every function is async and returns the same shape a Supabase query would,
// so pages can be built and demoed against MOCK_REPORTS now and swapped to
// real `supabase.from("reports")...` calls later without touching callers.

export interface ReportFilters {
  search?: string;
  lga?: string;
  ward?: string;
  category?: string;
  status?: ReportStatus;
  priority?: PriorityLevel;
  dateFrom?: string;
  dateTo?: string;
}

export async function getReports(filters: ReportFilters = {}): Promise<Report[]> {
  let results = [...MOCK_REPORTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.message.toLowerCase().includes(q) ||
        r.summary?.toLowerCase().includes(q) ||
        r.reference_number.toLowerCase().includes(q) ||
        r.citizen_name?.toLowerCase().includes(q)
    );
  }
  if (filters.lga) results = results.filter((r) => r.lga === filters.lga);
  if (filters.ward) results = results.filter((r) => r.ward === filters.ward);
  if (filters.category) results = results.filter((r) => r.category === filters.category);
  if (filters.status) results = results.filter((r) => r.status === filters.status);
  if (filters.priority) results = results.filter((r) => r.priority === filters.priority);
  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom).getTime();
    results = results.filter((r) => new Date(r.created_at).getTime() >= from);
  }
  if (filters.dateTo) {
    const to = new Date(filters.dateTo).getTime();
    results = results.filter((r) => new Date(r.created_at).getTime() <= to);
  }

  return results;
}

export interface PaginatedReports {
  reports: Report[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getPaginatedReports(
  filters: ReportFilters = {},
  page = 1,
  pageSize = 20
): Promise<PaginatedReports> {
  const all = await getReports(filters);
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    reports: all.slice(start, start + pageSize),
    total: all.length,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getReportById(id: string): Promise<Report | null> {
  return MOCK_REPORTS.find((r) => r.id === id) ?? null;
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  // Demo-only: mutates the in-memory fixture array. This is a stand-in for a
  // real `supabase.from("reports").update(...)` call and only persists for
  // the lifetime of this server process.
  const report = MOCK_REPORTS.find((r) => r.id === id);
  if (report) {
    report.status = status;
    report.updated_at = new Date().toISOString();
  }
}

export interface ImportRowInput {
  message: string;
  reference_number?: string | null;
  citizen_name?: string | null;
  phone?: string | null;
  summary?: string | null;
  category?: string | null;
  subcategory?: string | null;
  priority?: string | null;
  status?: string | null;
  department?: string | null;
  lga?: string | null;
  ward?: string | null;
  community?: string | null;
  language?: string | null;
  sentiment?: string | null;
  created_at?: string | null;
}

const VALID_PRIORITIES: PriorityLevel[] = ["low", "medium", "high", "critical"];
const VALID_STATUSES: ReportStatus[] = ["new", "assigned", "in_progress", "resolved", "closed"];
const VALID_SENTIMENTS = ["positive", "neutral", "negative"] as const;

function coercePriority(value?: string | null): PriorityLevel {
  const norm = (value ?? "").toLowerCase().trim();
  return (VALID_PRIORITIES as string[]).includes(norm) ? (norm as PriorityLevel) : "medium";
}

function coerceStatus(value?: string | null): ReportStatus {
  const norm = (value ?? "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  return (VALID_STATUSES as string[]).includes(norm) ? (norm as ReportStatus) : "new";
}

function coerceSentiment(value?: string | null): Report["sentiment"] {
  const norm = (value ?? "").toLowerCase().trim();
  return (VALID_SENTIMENTS as readonly string[]).includes(norm)
    ? (norm as (typeof VALID_SENTIMENTS)[number])
    : null;
}

let importSequence = MOCK_REPORTS.length;

export async function importReports(
  rows: ImportRowInput[]
): Promise<{ inserted: number; skipped: number }> {
  // Demo-only: mutates the in-memory fixture array, standing in for a real
  // batch `supabase.from("reports").insert(...)` call.
  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    const message = row.message?.trim();
    if (!message) {
      skipped += 1;
      continue;
    }
    importSequence += 1;
    const now = new Date().toISOString();
    const parsedDate = row.created_at ? new Date(row.created_at) : null;
    const createdAt = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : now;

    MOCK_REPORTS.push({
      id: `import-${Date.now()}-${importSequence}`,
      reference_number: row.reference_number?.trim() || `AC-${String(100000 + importSequence).padStart(6, "0")}`,
      constituent_id: null,
      citizen_name: row.citizen_name?.trim() || null,
      phone: row.phone?.trim() || null,
      telegram_user_id: null,
      message,
      summary: row.summary?.trim() || (message.length > 60 ? message.slice(0, 57) + "..." : message),
      category: row.category?.trim() || null,
      subcategory: row.subcategory?.trim() || null,
      priority: coercePriority(row.priority),
      status: coerceStatus(row.status),
      department: row.department?.trim() || null,
      lga: row.lga?.trim() || null,
      ward: row.ward?.trim() || null,
      community: row.community?.trim() || null,
      latitude: null,
      longitude: null,
      language: row.language?.trim() || null,
      sentiment: coerceSentiment(row.sentiment),
      source_channel: "import",
      n8n_execution_id: null,
      created_at: createdAt,
      updated_at: now,
    });
    inserted += 1;
  }

  MOCK_REPORTS.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return { inserted, skipped };
}

export async function getReportFacets() {
  const lgas = new Set<string>();
  const wards = new Set<string>();
  const categories = new Set<string>();
  for (const r of MOCK_REPORTS) {
    if (r.lga) lgas.add(r.lga);
    if (r.ward) wards.add(r.ward);
    if (r.category) categories.add(r.category);
  }
  return {
    lgas: [...lgas].sort(),
    wards: [...wards].sort(),
    categories: [...categories].sort(),
    statuses: ["new", "assigned", "in_progress", "resolved", "closed"] as ReportStatus[],
    priorities: ["low", "medium", "high", "critical"] as PriorityLevel[],
  };
}

export interface DashboardStats {
  citizensEngaged: number;
  reportsReceived: number;
  communitiesCovered: number;
  openCases: number;
  closedCases: number;
  criticalCases: number;
  avgResponseHours: number;
  reportsByDay: { date: string; count: number }[];
  reportsByCategory: { category: string; count: number }[];
  reportsByLga: { lga: string; count: number }[];
  sentimentBreakdown: { sentiment: string; count: number }[];
  recentActivity: Report[];
  topLga: string | null;
  topIssue: string | null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const reports = MOCK_REPORTS;

  const constituentIds = new Set(reports.map((r) => r.constituent_id).filter(Boolean));
  const communities = new Set(reports.map((r) => r.community).filter(Boolean));
  const openStatuses: ReportStatus[] = ["new", "assigned", "in_progress"];
  const openCases = reports.filter((r) => openStatuses.includes(r.status)).length;
  const closedCases = reports.filter((r) => r.status === "resolved" || r.status === "closed").length;
  const criticalCases = reports.filter((r) => r.priority === "critical").length;

  const resolvedDurations = reports
    .filter((r) => r.status === "resolved" || r.status === "closed")
    .map((r) => (new Date(r.updated_at).getTime() - new Date(r.created_at).getTime()) / 36e5);
  const avgResponseHours = resolvedDurations.length
    ? Math.round(
        (resolvedDurations.reduce((a, b) => a + b, 0) / resolvedDurations.length) * 10
      ) / 10
    : 0;

  const dayBuckets = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of reports) {
    const key = r.created_at.slice(0, 10);
    if (dayBuckets.has(key)) dayBuckets.set(key, (dayBuckets.get(key) ?? 0) + 1);
  }
  const reportsByDay = [...dayBuckets.entries()].map(([date, count]) => ({ date, count }));

  const categoryBuckets = new Map<string, number>();
  for (const r of reports) {
    if (!r.category) continue;
    categoryBuckets.set(r.category, (categoryBuckets.get(r.category) ?? 0) + 1);
  }
  const reportsByCategory = [...categoryBuckets.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  const lgaBuckets = new Map<string, number>();
  for (const r of reports) {
    if (!r.lga) continue;
    lgaBuckets.set(r.lga, (lgaBuckets.get(r.lga) ?? 0) + 1);
  }
  const reportsByLga = [...lgaBuckets.entries()]
    .map(([lga, count]) => ({ lga, count }))
    .sort((a, b) => b.count - a.count);

  const sentimentBuckets = new Map<string, number>();
  for (const r of reports) {
    if (!r.sentiment) continue;
    sentimentBuckets.set(r.sentiment, (sentimentBuckets.get(r.sentiment) ?? 0) + 1);
  }
  const sentimentBreakdown = [...sentimentBuckets.entries()].map(([sentiment, count]) => ({
    sentiment,
    count,
  }));

  const recentActivity = [...reports]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return {
    citizensEngaged: constituentIds.size,
    reportsReceived: reports.length,
    communitiesCovered: communities.size,
    openCases,
    closedCases,
    criticalCases,
    avgResponseHours,
    reportsByDay,
    reportsByCategory,
    reportsByLga,
    sentimentBreakdown,
    recentActivity,
    topLga: reportsByLga[0]?.lga ?? null,
    topIssue: reportsByCategory[0]?.category ?? null,
  };
}
