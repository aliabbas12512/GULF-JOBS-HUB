import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import { getCategories, getCategoryJobCounts } from "@/lib/db/reference-data";

export const metadata: Metadata = {
  title: "Browse Jobs by Category",
  description: "Explore Gulf job opportunities by category - Engineering, IT, Healthcare, Construction, and more.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const [categories, counts] = await Promise.all([getCategories(), getCategoryJobCounts()]);

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Browse Jobs by Category</h1>
        <p className="mt-2 text-sm text-slate-500">
          Find opportunities in your field across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and
          Oman.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Layers className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-slate-900 group-hover:text-brand-700">
                {category.name}
              </h2>
              <p className="text-xs text-slate-500">
                {counts[category.id] ?? 0} open {counts[category.id] === 1 ? "job" : "jobs"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
