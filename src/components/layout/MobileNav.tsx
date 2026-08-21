"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SessionUser } from "@/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/categories", label: "Categories" },
  { href: "/locations", label: "Locations" },
];

export function MobileNav({ session }: { session: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const overlay = open && (
    <div className="fixed inset-0 top-16 z-[100] overflow-y-auto bg-white">
      <nav className="container-page flex flex-col gap-1 py-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            {link.label}
          </Link>
        ))}

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
          {session ? (
            <>
              <span className="px-3 text-sm text-slate-500">
                Signed in as <strong className="text-slate-800">{session.name}</strong>
              </span>
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="outline" fullWidth>
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="outline" fullWidth onClick={() => setOpen(false)}>
                Login
              </Button>
              <Button href="/signup" fullWidth onClick={() => setOpen(false)}>
                Sign Up
              </Button>
            </>
          )}
          <Button href="/jobs" variant="gold" fullWidth onClick={() => setOpen(false)}>
            View All Jobs
          </Button>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </div>
  );
}
