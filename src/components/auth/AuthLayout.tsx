import Link from "next/link";
import { Compass } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-14">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
              <Compass className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xl font-bold text-navy-900">Gulf Job Hub</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  );
}
