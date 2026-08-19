import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gulfjobhub.com";

// Regenerate hourly so newly published/bulk-imported jobs appear in the
// sitemap without requiring a full redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: jobs }, { data: categories }, { data: countries }] = await Promise.all([
    supabaseAdmin
      .from("jobs")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("updated_at", { ascending: false })
      .limit(5000),
    supabaseAdmin.from("categories").select("slug"),
    supabaseAdmin.from("countries").select("slug"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/jobs`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${siteUrl}/categories`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/locations`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/cookie-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const jobRoutes: MetadataRoute.Sitemap = (jobs ?? []).map((job) => ({
    url: `${siteUrl}/jobs/${job.slug}`,
    lastModified: job.updated_at,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${siteUrl}/categories/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const countryRoutes: MetadataRoute.Sitemap = (countries ?? []).map((c) => ({
    url: `${siteUrl}/locations/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticRoutes, ...jobRoutes, ...categoryRoutes, ...countryRoutes];
}
