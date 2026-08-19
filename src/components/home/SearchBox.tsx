import { Search } from "lucide-react";
import { getCountries, getLocations, getCategories } from "@/lib/db/reference-data";

export async function SearchBox() {
  const [countries, locations, categories] = await Promise.all([
    getCountries(),
    getLocations(),
    getCategories(),
  ]);

  return (
    <form
      action="/jobs"
      method="get"
      className="mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl shadow-navy-950/10 sm:flex-row sm:items-stretch sm:p-3"
    >
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
        <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
        <input
          type="text"
          name="keyword"
          placeholder="Job title, keyword or company"
          className="w-full border-0 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          aria-label="Job title, keyword or company"
        />
      </div>

      <select
        name="place"
        defaultValue=""
        aria-label="Location"
        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:max-w-[180px]"
      >
        <option value="">All Locations</option>
        <optgroup label="Countries">
          {countries.map((c) => (
            <option key={c.id} value={`country:${c.slug}`}>
              {c.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Cities">
          {locations.map((l) => (
            <option key={l.id} value={`city:${l.slug}`}>
              {l.name}
            </option>
          ))}
        </optgroup>
      </select>

      <select
        name="category"
        defaultValue=""
        aria-label="Category"
        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 sm:max-w-[180px]"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gold-600"
      >
        <Search className="h-4 w-4" aria-hidden />
        Search Jobs
      </button>
    </form>
  );
}
