import Link from "next/link";
import { listAdminJobs } from "@/lib/db/jobs";
import { getCategories, getCountries } from "@/lib/db/reference-data";
import { JobRowActions } from "@/components/admin/JobRowActions";
import { Pagination } from "@/components/jobs/Pagination";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";
import { JOB_STATUS_LABELS } from "@/lib/constants";
import type { JobStatus } from "@/types";

export const metadata = { title: "All Jobs" };

type SearchParamsT = {
  keyword?: string;
  status?: string;
  category?: string;
  country?: string;
  page?: string;
};

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsT>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ jobs, total, totalPages }, categories, countries] = await Promise.all([
    listAdminJobs({
      keyword: params.keyword,
      status: params.status as JobStatus | undefined,
      categoryId: params.category,
      countryId: params.country,
      page,
    }),
    getCategories(),
    getCountries(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Jobs</h1>
          <p className="mt-1 text-sm text-slate-500">{total} jobs total</p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Add New Job
        </Link>
      </div>

      <form
        method="get"
        className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          type="text"
          name="keyword"
          defaultValue={params.keyword}
          placeholder="Search title or reference..."
          className="select-field lg:col-span-2"
        />
        <select name="status" defaultValue={params.status ?? ""} className="select-field">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="expired">Expired</option>
        </select>
        <select name="category" defaultValue={params.category ?? ""} className="select-field">
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="country" defaultValue={params.country ?? ""} className="select-field">
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 lg:col-span-5 lg:w-fit"
        >
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{job.title}</p>
                  <p className="text-xs text-slate-400">
                    {job.company?.name} &middot; {job.location?.name}, {job.country?.name}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{job.reference}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={
                      job.status === "published"
                        ? "success"
                        : job.status === "draft"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {JOB_STATUS_LABELS[job.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{formatDate(job.published_date)}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{job.views_count}</td>
                <td className="px-4 py-3">
                  <JobRowActions jobId={job.id} status={job.status} slug={job.slug} />
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">
                  No jobs found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        basePath="/admin/jobs"
        searchParams={params as Record<string, string | undefined>}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
