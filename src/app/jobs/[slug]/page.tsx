import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Briefcase, Clock, Calendar, Hash, ChevronRight } from "lucide-react";
import { getJobBySlug, getRelatedJobs, incrementJobViews } from "@/lib/db/jobs";
import { logJobEvent } from "@/lib/db/analytics";
import { getSiteSettings, getAdSlots } from "@/lib/db/settings";
import { ApplyButtons } from "@/components/jobs/ApplyButtons";
import { ApplyTracker } from "@/components/jobs/ApplyTracker";
import { StickyApplyBar } from "@/components/jobs/StickyApplyBar";
import { JobCard } from "@/components/jobs/JobCard";
import { CompanyLogo } from "@/components/jobs/CompanyLogo";
import { AdSlot } from "@/components/ads/AdSlot";
import { Badge } from "@/components/ui/Badge";
import {
  formatDate,
  formatExperience,
  formatRelativeDate,
  formatSalary,
  linesToList,
} from "@/lib/utils/format";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/constants";
import { buildJobPostingSchema, buildBreadcrumbSchema } from "@/lib/seo/jobPostingSchema";
import { safeJsonLd } from "@/lib/utils/jsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sbtjobshub.online";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job || job.status !== "published") {
    return { title: "Job Not Found" };
  }

  const locationLabel = [job.location?.name, job.country?.name].filter(Boolean).join(", ");
  const title = `${job.title} - ${job.company?.name ?? "Gulf Job Hub"}`;
  const description = job.description.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteUrl}/jobs/${job.slug}`,
    },
    twitter: { card: "summary", title, description },
    other: locationLabel ? { "job:location": locationLabel } : undefined,
  };
}

export default async function JobDetailsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job || job.status !== "published") {
    notFound();
  }

  void incrementJobViews(job.id);
  void logJobEvent(job.id, "view");

  const [related, settings] = await Promise.all([getRelatedJobs(job), getSiteSettings()]);
  const adSlots = getAdSlots(settings);

  const experience = formatExperience(job);
  const salary = formatSalary(job);
  const locationLabel = [job.location?.name, job.country?.name].filter(Boolean).join(", ");

  const jobPostingLd = buildJobPostingSchema(job, siteUrl);
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Jobs", url: `${siteUrl}/jobs` },
    { name: job.title, url: `${siteUrl}/jobs/${job.slug}` },
  ]);

  const responsibilities = linesToList(job.responsibilities);
  const requirements = linesToList(job.requirements);
  const qualifications = linesToList(job.qualifications);
  const benefits = linesToList(job.benefits);

  return (
    <div className="pb-24 sm:pb-0">
      <ApplyTracker />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jobPostingLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />

      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-6">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/jobs" className="hover:text-brand-600">
              Jobs
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate text-slate-700">{job.title}</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <CompanyLogo name={job.company?.name} logoUrl={job.company?.logo_url} size="lg" />
              <div>
                <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{job.title}</h1>
                <p className="mt-1.5 text-base font-medium text-slate-600">
                  {job.company?.name ?? "Confidential Company"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
                    {job.location_detail ? `${job.location_detail}, ` : ""}
                    {locationLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-slate-400" aria-hidden />
                    {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" aria-hidden />
                    Posted {formatRelativeDate(job.published_date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Hash className="h-4 w-4 text-slate-400" aria-hidden />
                    Ref: {job.reference}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden w-full max-w-xs sm:block">
              <ApplyButtons job={job} />
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {job.category?.name && <Badge tone="brand">{job.category.name}</Badge>}
            {experience && <Badge tone="neutral">Experience: {experience}</Badge>}
            {salary && <Badge tone="gold">{salary}</Badge>}
            {job.country?.name && <Badge tone="neutral">{job.country.name}</Badge>}
          </div>

          <Section title="Job Description">
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {job.description}
            </p>
          </Section>

          {responsibilities.length > 0 && (
            <Section title="Responsibilities">
              <BulletList items={responsibilities} />
            </Section>
          )}

          {requirements.length > 0 && (
            <Section title="Requirements">
              <BulletList items={requirements} />
            </Section>
          )}

          {qualifications.length > 0 && (
            <Section title="Qualifications">
              <BulletList items={qualifications} />
            </Section>
          )}

          {benefits.length > 0 && (
            <Section title="Benefits">
              <BulletList items={benefits} />
            </Section>
          )}

          <div className="rounded-2xl border-2 border-brand-100 bg-brand-50 p-6">
            <h2 className="text-lg font-bold text-navy-900">Apply for this Job</h2>
            <p className="mt-1 text-sm text-slate-600">
              Contact the employer directly using one of the options below.
            </p>
            <div className="mt-5">
              <ApplyButtons job={job} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900">Job Overview</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <OverviewRow icon={Hash} label="Reference" value={job.reference} />
              <OverviewRow
                icon={Briefcase}
                label="Employment Type"
                value={EMPLOYMENT_TYPE_LABELS[job.employment_type]}
              />
              {experience && <OverviewRow icon={Clock} label="Experience" value={experience} />}
              <OverviewRow icon={Calendar} label="Posted On" value={formatDate(job.published_date)} />
              {job.application_deadline && (
                <OverviewRow
                  icon={Calendar}
                  label="Apply Before"
                  value={formatDate(job.application_deadline)}
                />
              )}
              <OverviewRow icon={MapPin} label="Location" value={locationLabel} />
            </dl>
          </div>

          <AdSlot enabled={adSlots.sidebar_enabled} code={adSlots.sidebar_code} label="Sidebar" />
        </aside>
      </div>

      <div className="container-page pb-10">
        <AdSlot
          enabled={adSlots.job_details_enabled}
          code={adSlots.job_details_code}
          label="Job details"
        />
      </div>

      {related.length > 0 && (
        <div className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="container-page">
            <h2 className="text-xl font-bold text-navy-900">Similar Jobs</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <JobCard key={r.id} job={r} />
              ))}
            </div>
          </div>
        </div>
      )}

      <StickyApplyBar job={job} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-navy-900">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function OverviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="inline-flex items-center gap-1.5 text-slate-500">
        <Icon className="h-4 w-4 shrink-0" aria-hidden />
        {label}
      </span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}
