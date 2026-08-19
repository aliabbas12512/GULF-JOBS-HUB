import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { listPublicJobs } from "@/lib/db/jobs";
import { getLocationsByCountry } from "@/lib/db/reference-data";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/jobs/EmptyState";
import { Pagination } from "@/components/jobs/Pagination";
import { cn } from "@/lib/utils/cn";

type Params = { slug: string };
type SearchParamsT = { city?: string; page?: string };

async function getCountry(slug: string) {
  const { data } = await supabaseAdmin.from("countries").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountry(slug);
  if (!country) return { title: "Location Not Found" };
  return {
    title: `Jobs in ${country.name}`,
    description: `Browse the latest jobs in ${country.name}.`,
    alternates: { canonical: `/locations/${slug}` },
  };
}

export default async function LocationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParamsT>;
}) {
  const { slug } = await params;
  const { city, page: pageParam } = await searchParams;
  const country = await getCountry(slug);
  if (!country) notFound();

  const cities = await getLocationsByCountry(country.id);
  const page = Math.max(1, Number(pageParam) || 1);
  const { jobs, total, totalPages } = await listPublicJobs({
    countrySlug: slug,
    locationSlug: city,
    page,
  });

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Jobs in {country.name}</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {total} {total === 1 ? "job" : "jobs"} available.
        </p>
      </div>

      {cities.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href={`/locations/${slug}`}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium",
              !city
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 text-slate-600 hover:border-brand-300"
            )}
          >
            All Cities
          </Link>
          {cities.map((c) => (
            <Link
              key={c.id}
              href={`/locations/${slug}?city=${c.slug}`}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium",
                city === c.slug
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-slate-600 hover:border-brand-300"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No jobs found in ${country.name} right now.`}
          description="Check back soon or browse all open positions."
          clearHref="/jobs"
        />
      )}

      <Pagination
        basePath={`/locations/${slug}`}
        searchParams={{ city }}
        page={page}
        totalPages={totalPages}
      />
    </div>
  );
}
