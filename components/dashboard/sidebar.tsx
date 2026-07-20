"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileWarning, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/reports", label: "Reports", icon: FileWarning },
];

const FOOTER_ITEM = { href: "/dashboard/settings", label: "Settings", icon: Settings };

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: typeof Settings;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
          onNavigate={onNavigate}
        />
      ))}

      <div className="mt-auto border-t border-neutral-200 pt-3">
        <NavLink
          href={FOOTER_ITEM.href}
          label={FOOTER_ITEM.label}
          icon={FOOTER_ITEM.icon}
          isActive={pathname.startsWith(FOOTER_ITEM.href)}
          onNavigate={onNavigate}
        />
      </div>
    </nav>
  );
}
