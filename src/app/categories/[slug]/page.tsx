import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { listPublicJobs } from "@/lib/db/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/jobs/EmptyState";
import { Pagination } from "@/components/jobs/Pagination";

type Params = { slug: string };
type SearchParamsT = { page?: string };

async function getCategory(slug: string) {
  const { data } = await supabaseAdmin.from("categories").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} Jobs`,
    description: `Browse the latest ${category.name} jobs across the Gulf region.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParamsT>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { jobs, total, totalPages } = await listPublicJobs({ categorySlug: slug, page });

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{category.name} Jobs</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {total} {total === 1 ? "job" : "jobs"} available in {category.name}.
        </p>
      </div>

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={`No ${category.name} jobs found right now.`}
          description="Check back soon or browse all open positions."
          clearHref="/jobs"
        />
      )}

      <Pagination basePath={`/categories/${slug}`} searchParams={{}} page={page} totalPages={totalPages} />
    </div>
  );
}
