"use server";

import { revalidatePath } from "next/cache";
import { updateReportStatus } from "@/lib/data/reports";
import type { ReportStatus } from "@/lib/supabase/types";

export async function updateReportStatusAction(id: string, status: ReportStatus) {
  await updateReportStatus(id, status);
  revalidatePath("/reports");
  revalidatePath("/dashboard");
}
