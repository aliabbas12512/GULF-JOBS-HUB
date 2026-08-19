import type { JobWithRelations } from "@/types";

const EMPLOYMENT_TYPE_SCHEMA: Record<string, string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACTOR",
  temporary: "TEMPORARY",
  internship: "INTERN",
};

export function buildJobPostingSchema(job: JobWithRelations, siteUrl: string) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.company?.name ?? "Gulf Job Hub",
      value: job.reference,
    },
    datePosted: job.published_date,
    employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employment_type] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company?.name ?? "Confidential Employer",
      sameAs: siteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location?.name,
        addressCountry: job.country?.name,
      },
    },
    directApply: true,
    url: `${siteUrl}/jobs/${job.slug}`,
  };

  if (job.application_deadline) {
    schema.validThrough = new Date(job.application_deadline).toISOString();
  }

  if (job.salary_is_visible && (job.salary_min != null || job.salary_max != null)) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.salary_currency,
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min ?? job.salary_max,
        maxValue: job.salary_max ?? job.salary_min,
        unitText: "MONTH",
      },
    };
  }

  return schema;
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
