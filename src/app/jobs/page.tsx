import type { Metadata } from "next";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/jobs/EmptyState";
import { Pagination } from "@/components/jobs/Pagination";
import { AdSlot } from "@/components/ads/AdSlot";
import { listPublicJobs } from "@/lib/db/jobs";
import { logSearchQuery } from "@/lib/db/analytics";
import { getSiteSettings, getAdSlots } from "@/lib/db/settings";
import type { EmploymentType } from "@/types";

export const metadata: Metadata = {
  title: "All Jobs",
  description: "Browse all the latest jobs across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.",
  alternates: { canonical: "/jobs" },
};

type SearchParams = {
  keyword?: string;
  place?: string;
  category?: string;
  type?: string;
  experience?: string;
  sort?: string;
  page?: string;
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  let countrySlug: string | undefined;
  let locationSlug: string | undefined;
  if (params.place?.startsWith("country:")) countrySlug = params.place.slice("country:".length);
  if (params.place?.startsWith("city:")) locationSlug = params.place.slice("city:".length);

  const page = Math.max(1, Number(params.page) || 1);
  const sort = (params.sort === "oldest" || params.sort === "relevant" ? params.sort : "latest") as
    | "latest"
    | "oldest"
    | "relevant";

  const [{ jobs, total, totalPages }, settings] = await Promise.all([
    listPublicJobs({
      keyword: params.keyword,
      countrySlug,
      locationSlug,
      categorySlug: params.category,
      employmentType: params.type as EmploymentType | undefined,
      experienceMin: params.experience ? Number(params.experience) : undefined,
      sort,
      page,
    }),
    getSiteSettings(),
  ]);

  if (params.keyword?.trim()) {
    void logSearchQuery(params.keyword, total);
  }

  const adSlots = getAdSlots(settings);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">All Jobs</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {total} {total === 1 ? "job" : "jobs"} found across the Gulf region.
        </p>
      </div>

      <JobFilters params={params} />

      <div className="my-6">
        <AdSlot enabled={adSlots.jobs_page_enabled} code={adSlots.jobs_page_code} label="Jobs listing" />
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState clearHref="/jobs" />
      )}

      <Pagination
        basePath="/jobs"
        searchParams={params as Record<string, string | undefined>}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
