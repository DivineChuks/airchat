import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getReportById } from "@/lib/data/reports";
import { PriorityBadge } from "@/components/dashboard/badges";
import { StatusSelect } from "../status-select";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-neutral-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-800">{value ?? "—"}</dd>
    </div>
  );
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReportById(id);
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/dashboard/reports"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to reports
      </Link>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs text-neutral-400">{report.reference_number}</p>
            <h1 className="mt-1 text-lg font-semibold text-neutral-900">
              {report.summary ?? report.message}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={report.priority} />
            <StatusSelect id={report.id} status={report.status} />
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-neutral-50 p-4">
          <p className="text-xs font-medium text-neutral-400">Full message</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800">
            {report.message}
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
          <Field label="Citizen" value={report.citizen_name} />
          <Field label="Phone" value={report.phone} />
          <Field label="Source" value={report.source_channel} />
          <Field label="LGA" value={report.lga} />
          <Field label="Ward" value={report.ward} />
          <Field label="Community" value={report.community} />
          <Field label="Category" value={report.category} />
          <Field label="Subcategory" value={report.subcategory} />
          <Field label="Assigned department" value={report.department} />
          <Field label="Language" value={report.language} />
          <Field label="Sentiment" value={report.sentiment} />
          <Field label="Reported" value={formatDateTime(report.created_at)} />
          <Field label="Last updated" value={formatDateTime(report.updated_at)} />
        </dl>
      </div>
    </div>
  );
}
