import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function buildHref(basePath: string, params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  return `${basePath}?${next.toString()}`;
}

export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
}: {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    if (v && k !== "page") params.set(k, v);
  });

  const pages: (number | "ellipsis")[] = [];
  const windowSize = 1;
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= windowSize) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <PageLink
        disabled={page <= 1}
        href={buildHref(basePath, params, page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageLink>

      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span key={`e-${idx}`} className="px-2 text-sm text-slate-400">
            &hellip;
          </span>
        ) : (
          <PageLink key={p} href={buildHref(basePath, params, p)} active={p === page}>
            {p}
          </PageLink>
        )
      )}

      <PageLink
        disabled={page >= totalPages}
        href={buildHref(basePath, params, page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const classes = cn(
    "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors",
    active
      ? "bg-brand-600 text-white"
      : "text-slate-600 hover:bg-slate-100",
    disabled && "pointer-events-none opacity-40"
  );

  if (disabled) {
    return (
      <span className={classes} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
