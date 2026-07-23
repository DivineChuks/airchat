"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileWarning, Settings } from "lucide-react";

// Overview is intentionally left out of the nav — it's still all seed/mock
// aggregate stats, not something worth surfacing to users yet.
const NAV_ITEMS: { href: string; label: string; icon: typeof Settings; exact?: boolean }[] = [
  { href: "/reports", label: "Reports", icon: FileWarning },
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
      className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
          : "text-blue-100/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-white" />
      )}
      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-blue-100/70 group-hover:text-white"}`} />
      {label}
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-blue-100/50">
        Menu
      </p>
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

      <div className="mt-auto border-t border-white/10 pt-3">
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
