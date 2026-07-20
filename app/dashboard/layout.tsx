import { getSession } from "@/lib/auth/get-session";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts already redirects unauthenticated requests before this renders;
  // the session lookup here is only to display the logged-in username.
  const session = await getSession();

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-200 bg-neutral-100 sm:flex">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-neutral-200 px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
            A
          </div>
          <span className="text-sm font-semibold text-neutral-900">Airchat</span>
        </div>
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar username={session?.username ?? "admin"} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
