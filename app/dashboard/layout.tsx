import { getSession } from "@/lib/auth/get-session";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts already redirects unauthenticated requests before this renders;
  // the session lookup here is only to display the logged-in username.
  const session = await getSession();

  return (
    <DashboardShell username={session?.username ?? "admin"}>
      {children}
    </DashboardShell>
  );
}
