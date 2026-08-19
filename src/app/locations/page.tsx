import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getCountries, getLocations, getLocationJobCounts } from "@/lib/db/reference-data";

export const metadata: Metadata = {
  title: "Browse Jobs by Location",
  description: "Explore Gulf job opportunities by country and city - Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.",
  alternates: { canonical: "/locations" },
};

export default async function LocationsPage() {
  const [countries, locations, counts] = await Promise.all([
    getCountries(),
    getLocations(),
    getLocationJobCounts(),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Browse Jobs by Location</h1>
        <p className="mt-2 text-sm text-slate-500">
          Find opportunities across every major Gulf city.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {countries.map((country) => {
          const cities = locations.filter((l) => l.country_id === country.id);
          const countryTotal = cities.reduce((sum, c) => sum + (counts[c.id] ?? 0), 0);
          return (
            <div key={country.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <Link
                  href={`/locations/${country.slug}`}
                  className="text-base font-bold text-navy-900 hover:text-brand-700"
                >
                  {country.name}
                </Link>
                <span className="text-xs text-slate-400">
                  {countryTotal} {countryTotal === 1 ? "job" : "jobs"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {cities.map((city) => (
                  <Link
                    key={city.id}
                    href={`/locations/${country.slug}?city=${city.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-700"
                  >
                    <MapPin className="h-3 w-3" aria-hidden />
                    {city.name}
                    <span className="text-slate-400">({counts[city.id] ?? 0})</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
