import { getCountries, getLocations } from "@/lib/db/reference-data";
import { LocationManager } from "@/components/admin/LocationManager";

export const metadata = { title: "Locations" };

export default async function AdminLocationsPage() {
  const [countries, locations] = await Promise.all([getCountries(), getLocations()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
        <p className="mt-1 text-sm text-slate-500">Manage countries and cities used across the site.</p>
      </div>
      <LocationManager countries={countries} locations={locations} />
    </div>
  );
}
