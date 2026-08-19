import { JobForm } from "@/components/admin/JobForm";
import { getCountries, getLocations, getCategories } from "@/lib/db/reference-data";

export const metadata = { title: "Add New Job" };

export default async function NewJobPage() {
  const [countries, locations, categories] = await Promise.all([
    getCountries(),
    getLocations(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Job</h1>
        <p className="mt-1 text-sm text-slate-500">Create a new job listing.</p>
      </div>
      <JobForm mode="create" countries={countries} locations={locations} categories={categories} />
    </div>
  );
}
