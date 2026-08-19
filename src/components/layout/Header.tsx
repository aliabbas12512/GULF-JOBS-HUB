import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/db/settings";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Jobs" },
  { href: "/categories", label: "Categories" },
  { href: "/locations", label: "Locations" },
];

export async function Header() {
  const [session, settings] = await Promise.all([getSession(), getSiteSettings()]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo siteName={settings.site_name} />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <span className="text-sm text-slate-600">
                Hi, <strong className="font-semibold text-slate-900">{session.name}</strong>
              </span>
              <form action="/api/auth/logout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Login
              </Button>
              <Button href="/signup" size="sm">
                Sign Up
              </Button>
            </>
          )}
        </div>

        <MobileNav session={session} />
      </div>
    </header>
  );
}
