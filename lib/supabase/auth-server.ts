import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Anon-key client for Server Components/Actions, backed by the request's
// cookies. Used only for `supabase.auth.*` calls (sign in/out, reading the
// current user) — data reads use the service role client in server.ts.
export async function createAuthServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set for auth."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component render, where cookies can't be
          // written — proxy.ts refreshes the session for those requests.
        }
      },
    },
  });
}
