"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
        A
      </div>
      <span className="text-sm font-semibold text-neutral-900">Airchat</span>
    </div>
  );
}

export function DashboardShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-neutral-200 bg-neutral-100 sm:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-neutral-200 px-4">
          <Brand />
        </div>
        <Sidebar />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-64 max-w-[80%] flex-col bg-neutral-100 shadow-xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar username={username} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
