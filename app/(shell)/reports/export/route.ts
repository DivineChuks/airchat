import type { NextRequest } from "next/server";
import { getReports } from "@/lib/data/reports";
import { toCsv } from "@/lib/csv";
import type { PriorityLevel, ReportStatus } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const reports = await getReports({
    search: params.get("search") || undefined,
    lga: params.get("lga") || undefined,
    ward: params.get("ward") || undefined,
    category: params.get("category") || undefined,
    status: (params.get("status") as ReportStatus) || undefined,
    priority: (params.get("priority") as PriorityLevel) || undefined,
    dateFrom: params.get("dateFrom") || undefined,
    dateTo: params.get("dateTo") || undefined,
  });

  const csv = toCsv(reports, [
    { key: "reference_number", header: "Reference" },
    { key: "citizen_name", header: "Citizen" },
    { key: "community", header: "Community" },
    { key: "lga", header: "LGA" },
    { key: "ward", header: "Ward" },
    { key: "message", header: "Issue" },
    { key: "category", header: "Category" },
    { key: "subcategory", header: "Subcategory" },
    { key: "priority", header: "Priority" },
    { key: "status", header: "Status" },
    { key: "department", header: "Assigned Department" },
    { key: "sentiment", header: "Sentiment" },
    { key: "source_channel", header: "Source" },
    { key: "created_at", header: "Date" },
  ]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="airchat-reports-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
