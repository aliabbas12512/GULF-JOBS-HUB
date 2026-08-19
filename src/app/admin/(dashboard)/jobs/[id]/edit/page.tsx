import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/JobForm";
import { getJobById } from "@/lib/db/jobs";
import { getCountries, getLocations, getCategories } from "@/lib/db/reference-data";

export const metadata = { title: "Edit Job" };

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job, countries, locations, categories] = await Promise.all([
    getJobById(id),
    getCountries(),
    getLocations(),
    getCategories(),
  ]);

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Job</h1>
        <p className="mt-1 text-sm text-slate-500">{job.title}</p>
      </div>
      <JobForm
        mode="edit"
        jobId={job.id}
        initialJob={job}
        countries={countries}
        locations={locations}
        categories={categories}
      />
    </div>
  );
}
