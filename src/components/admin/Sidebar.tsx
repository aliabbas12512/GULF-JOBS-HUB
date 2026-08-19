"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  UploadCloud,
  Layers,
  MapPin,
  Building2,
  Users,
  Settings,
  UserCog,
  LogOut,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/jobs", label: "All Jobs", icon: Briefcase },
  { href: "/admin/jobs/new", label: "Add Job", icon: PlusCircle },
  { href: "/admin/bulk-upload", label: "Bulk Upload", icon: UploadCloud },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/locations", label: "Locations", icon: MapPin },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/leads", label: "Applications / Leads", icon: Users },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/account", label: "Admin Account", icon: UserCog },
];

export function Sidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-navy-950 text-slate-300 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-gold-400">
          <Compass className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-sm font-bold text-white">Gulf Job Hub Admin</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-600 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="mb-2 truncate px-3 text-xs text-slate-400">
          Signed in as <span className="font-medium text-slate-200">{adminName}</span>
        </div>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
