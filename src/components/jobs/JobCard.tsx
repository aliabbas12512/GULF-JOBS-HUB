import Link from "next/link";
import { MapPin, Clock, Briefcase } from "lucide-react";
import type { JobWithRelations } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "./CompanyLogo";
import {
  formatRelativeDate,
  formatExperience,
  formatSalary,
  truncate,
} from "@/lib/utils/format";
import { EMPLOYMENT_TYPE_LABELS } from "@/lib/constants";

export function JobCard({ job }: { job: JobWithRelations }) {
  const experience = formatExperience(job);
  const salary = formatSalary(job);
  const locationLabel = [job.location?.name, job.country?.name].filter(Boolean).join(", ");

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md sm:p-6">
      <div className="flex items-start gap-4">
        <CompanyLogo name={job.company?.name} logoUrl={job.company?.logo_url} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/jobs/${job.slug}`}
            className="line-clamp-2 text-base font-semibold text-slate-900 hover:text-brand-700 sm:text-lg"
          >
            {job.title}
          </Link>
          <p className="mt-0.5 truncate text-sm font-medium text-slate-600">
            {job.company?.name ?? "Confidential Company"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-slate-400" aria-hidden />
          {locationLabel || "Gulf Region"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="h-4 w-4 text-slate-400" aria-hidden />
          {EMPLOYMENT_TYPE_LABELS[job.employment_type]}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-slate-400" aria-hidden />
          Posted {formatRelativeDate(job.published_date)}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-500">
        {truncate(job.description, 160)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {job.category?.name && (
          <Badge tone="brand">{job.category.name}</Badge>
        )}
        {experience && <Badge tone="neutral">{experience}</Badge>}
        {salary && <Badge tone="gold">{salary}</Badge>}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Ref: {job.reference}
        </span>
        <Button href={`/jobs/${job.slug}`} size="sm">
          Apply Now
        </Button>
      </div>
    </div>
  );
}
