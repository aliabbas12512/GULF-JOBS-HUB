import Link from "next/link";
import { Compass } from "lucide-react";

export function Logo({ siteName = "Gulf Job Hub" }: { siteName?: string }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
        <Compass className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-lg font-bold tracking-tight text-navy-900">
        {siteName}
      </span>
    </Link>
  );
}
