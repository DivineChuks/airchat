"use client";

import { LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/login/actions";

const PAGE_TITLES: { test: (pathname: string) => boolean; title: string }[] = [
  { test: (p) => p === "/dashboard", title: "Overview" },
  { test: (p) => p === "/dashboard/settings", title: "Settings" },
  { test: (p) => p === "/reports", title: "Issue Management" },
  { test: (p) => p.startsWith("/reports/"), title: "Report Details" },
];

function pageTitleFor(pathname: string): string {
  return PAGE_TITLES.find((entry) => entry.test(pathname))?.title ?? "Airchat";
}

export function Topbar({
  username,
  onMenuClick,
}: {
  username: string;
  onMenuClick?: () => void;
}) {
  const initial = username.charAt(0).toUpperCase();
  const pathname = usePathname();
  const title = pageTitleFor(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="-ml-1.5 rounded-lg p-1.5 text-neutral-600 transition hover:bg-neutral-100 sm:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-sm font-semibold tracking-tight text-neutral-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
            {initial}
          </div>
          <span className="hidden text-sm font-medium text-neutral-700 sm:inline">{username}</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
