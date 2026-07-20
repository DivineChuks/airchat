"use server";

import { revalidatePath } from "next/cache";
import { importReports, type ImportRowInput } from "@/lib/data/reports";

export async function importReportsAction(rows: ImportRowInput[]) {
  const result = await importReports(rows);
  revalidatePath("/dashboard/reports");
  revalidatePath("/dashboard");
  return result;
}
