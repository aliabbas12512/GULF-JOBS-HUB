import { getCountries, getLocations, getCategories } from "@/lib/db/reference-data";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/constants";
import { Search } from "lucide-react";

export type JobsSearchParams = {
  keyword?: string;
  place?: string;
  category?: string;
  type?: string;
  experience?: string;
  sort?: string;
};

export async function JobFilters({ params }: { params: JobsSearchParams }) {
  const [countries, locations, categories] = await Promise.all([
    getCountries(),
    getLocations(),
    getCategories(),
  ]);

  return (
    <form action="/jobs" method="get" className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Keyword
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
            <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            <input
              type="text"
              name="keyword"
              defaultValue={params.keyword ?? ""}
              placeholder="Job title, company..."
              className="w-full border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <Field label="Location">
          <select name="place" defaultValue={params.place ?? ""} className="select-field">
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
        </Field>

        <Field label="Category">
          <select name="category" defaultValue={params.category ?? ""} className="select-field">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Job Type">
          <select name="type" defaultValue={params.type ?? ""} className="select-field">
            <option value="">All Types</option>
            {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sort By">
          <select name="sort" defaultValue={params.sort ?? "latest"} className="select-field">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="relevant">Most Relevant</option>
          </select>
        </Field>
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <a href="/jobs" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Clear Filters
        </a>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}
