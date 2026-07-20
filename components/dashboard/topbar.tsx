import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

export function Topbar({ username }: { username: string }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
      <div className="text-sm text-neutral-500">
        Data source: <span className="text-amber-600">sample data</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-700">{username}</span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
