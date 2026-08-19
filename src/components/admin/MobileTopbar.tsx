"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "All Jobs" },
  { href: "/admin/jobs/new", label: "Add Job" },
  { href: "/admin/bulk-upload", label: "Bulk Upload" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/companies", label: "Companies" },
  { href: "/admin/leads", label: "Applications / Leads" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/account", label: "Admin Account" },
];

export function MobileTopbar({ adminName }: { adminName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 bg-navy-950 lg:hidden">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-gold-400">
            <Compass className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-sm font-bold text-white">Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="space-y-1 border-t border-white/10 px-3 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium",
                pathname === item.href
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-white/10 pt-2 text-xs text-slate-400">
            Signed in as {adminName}
          </div>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Logout
            </button>
          </form>
        </nav>
      )}
    </div>
  );
}
