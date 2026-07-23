import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Server-only: uses the service role key, which bypasses Row Level Security.
// Never import this from a Client Component or expose the key to the browser.
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to read Supabase data."
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
