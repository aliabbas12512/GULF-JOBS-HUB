import type { Job } from "@/types";

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month ago";
  if (diffMonths < 12) return `${diffMonths} months ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatExperience(job: Pick<Job, "experience_min" | "experience_max">): string | null {
  const { experience_min, experience_max } = job;
  if (experience_min == null && experience_max == null) return null;
  if (experience_min != null && experience_max != null) {
    if (experience_min === experience_max) return `${experience_min} Years`;
    return `${experience_min}–${experience_max} Years`;
  }
  if (experience_min != null) return `${experience_min}+ Years`;
  return `Up to ${experience_max} Years`;
}

export function formatSalary(
  job: Pick<Job, "salary_min" | "salary_max" | "salary_currency" | "salary_is_visible">
): string | null {
  if (!job.salary_is_visible) return null;
  const { salary_min, salary_max, salary_currency } = job;
  if (salary_min == null && salary_max == null) return null;
  const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
  if (salary_min != null && salary_max != null) {
    return `${salary_currency} ${fmt(salary_min)} - ${fmt(salary_max)} / month`;
  }
  const val = salary_min ?? salary_max;
  return `${salary_currency} ${fmt(val as number)} / month`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function linesToList(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
