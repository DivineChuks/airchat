"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white ring-1 ring-white/15">
        A
      </div>
      <span className="text-sm font-semibold tracking-tight text-white">Airchat</span>
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
    <div className="flex min-h-screen bg-slate-50 text-neutral-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 shrink-0 flex-col bg-blue-900 sm:flex">
        <div className="flex h-14 shrink-0 items-center border-b border-white/10 px-4">
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
          <aside className="relative flex h-full w-64 max-w-[80%] flex-col bg-blue-900 shadow-xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col sm:ml-60">
        <Topbar username={username} onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
