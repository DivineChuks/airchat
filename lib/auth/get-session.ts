import { createAuthServerClient } from "@/lib/supabase/auth-server";

export async function getSession() {
  const supabase = await createAuthServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  return { username: user.email ?? "admin" };
}
