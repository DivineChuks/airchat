import { cache } from "react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type {
  AkwaIbomMockDataRow,
  PriorityLevel,
  Report,
  ReportStatus,
  SentimentType,
} from "@/lib/supabase/types";

// This module is the single seam between the UI and the report data source:
// the live "Akwa Ibom Mock Data" table in Supabase. All filtering/pagination/
// stats below run in memory over the full row set, which is fine at this
// table's size — swap to server-side query filters if it grows significantly.

const TABLE = "Akwa Ibom Mock Data" as const;

const VALID_PRIORITIES: PriorityLevel[] = ["low", "medium", "high", "critical"];
const VALID_STATUSES: ReportStatus[] = ["new", "assigned", "in_progress", "resolved", "closed"];
const VALID_SENTIMENTS: SentimentType[] = ["positive", "neutral", "negative"];

// The source table uses its own free-text vocabulary ("Urgent", "Open", ...)
// rather than the app's enums, so reads/writes go through these coercions.
function coercePriority(value: string | null): PriorityLevel {
  const norm = (value ?? "").toLowerCase().trim();
  if (norm === "urgent" || norm === "emergency") return "critical";
  return (VALID_PRIORITIES as string[]).includes(norm) ? (norm as PriorityLevel) : "medium";
}

function coerceStatus(value: string | null): ReportStatus {
  const norm = (value ?? "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (norm === "open" || norm === "pending") return "new";
  return (VALID_STATUSES as string[]).includes(norm) ? (norm as ReportStatus) : "new";
}

const STATUS_TO_DB: Record<ReportStatus, string> = {
  new: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

function coerceSentiment(value: string | null): SentimentType | null {
  const norm = (value ?? "").toLowerCase().trim();
  return (VALID_SENTIMENTS as string[]).includes(norm) ? (norm as SentimentType) : null;
}

function parseDate(value: string | null): string {
  const parsed = value ? new Date(value) : null;
  return parsed && !isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
}

function mapRow(row: AkwaIbomMockDataRow): Report {
  const id = String(row.id);
  const ticketId = row.ticket_id != null ? String(row.ticket_id) : id;

  return {
    id,
    reference_number: `AI-${ticketId}`,
    constituent_id: null,
    citizen_name: row.citizen_name,
    phone: null,
    telegram_user_id: null,
    message: row.message ?? "",
    summary: null,
    category: row.category,
    subcategory: row.subcategory,
    priority: coercePriority(row.priority),
    status: coerceStatus(row.status),
    department: row.mda,
    lga: row.lga,
    ward: row.ward,
    community: row.community,
    location: row.Location,
    latitude: null,
    longitude: null,
    language: null,
    sentiment: coerceSentiment(row.sentiment),
    source_channel: row.source_channel || "Other",
    n8n_execution_id: row.n8n_execution_url,
    created_at: parseDate(row.created_at),
    updated_at: parseDate(row.updated_at),
  };
}

// Memoized per request (React cache) so the overview page, reports page, and
// layout can each call into this module without triggering duplicate fetches.
const getAllReports = cache(async (): Promise<Report[]> => {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from(TABLE).select("*");
  if (error) throw new Error(`Failed to load reports from Supabase: ${error.message}`);
  return (data ?? []).map(mapRow);
});

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
  let results = await getAllReports();

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
  const all = await getAllReports();
  return all.find((r) => r.id === id) ?? null;
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from(TABLE)
    .update({ status: STATUS_TO_DB[status], updated_at: new Date().toISOString() })
    .eq("id", Number(id));
  if (error) throw new Error(`Failed to update report status: ${error.message}`);
}

export async function getReportFacets() {
  const reports = await getAllReports();
  const lgas = new Set<string>();
  const wards = new Set<string>();
  const categories = new Set<string>();
  for (const r of reports) {
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
  const reports = await getAllReports();

  // No constituent-linking table behind this dataset — distinct citizen
  // names stand in for "citizens engaged".
  const citizenNames = new Set(reports.map((r) => r.citizen_name).filter(Boolean));
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
    citizensEngaged: citizenNames.size,
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
