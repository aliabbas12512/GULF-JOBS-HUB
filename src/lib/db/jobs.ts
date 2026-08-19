import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { JOBS_PER_PAGE } from "@/lib/constants";
import { generateJobReference } from "./reference";
import { slugify } from "@/lib/utils/slug";
import type { JobWithRelations, JobStatus, EmploymentType } from "@/types";
import type { TablesInsert, TablesUpdate } from "@/types/database";

// Keyword is interpolated into a PostgREST .or() filter string - strip
// characters that have structural meaning there (",", "(", ")") so a
// search term can't widen or alter the intended filter clauses.
function sanitizeSearchKeyword(raw: string): string {
  return raw.replace(/[,()]/g, " ").trim();
}

const JOB_SELECT = `
  *,
  company:companies(*),
  category:categories(*),
  country:countries(*),
  location:locations(*)
`;

export type PublicJobFilters = {
  keyword?: string;
  countrySlug?: string;
  locationSlug?: string;
  categorySlug?: string;
  employmentType?: EmploymentType;
  experienceMin?: number;
  sort?: "latest" | "oldest" | "relevant";
  page?: number;
  pageSize?: number;
};

export async function listPublicJobs(filters: PublicJobFilters): Promise<{
  jobs: JobWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? JOBS_PER_PAGE;

  let query = supabaseAdmin
    .from("jobs")
    .select(JOB_SELECT, { count: "exact" })
    .eq("status", "published");

  if (filters.keyword && filters.keyword.trim()) {
    const kw = sanitizeSearchKeyword(filters.keyword);
    const { data: matchingCompanies } = await supabaseAdmin
      .from("companies")
      .select("id")
      .ilike("name", `%${kw}%`);
    const companyIds = (matchingCompanies ?? []).map((c) => c.id);
    const orClauses = [`title.ilike.%${kw}%`, `description.ilike.%${kw}%`];
    if (companyIds.length > 0) {
      orClauses.push(`company_id.in.(${companyIds.join(",")})`);
    }
    query = query.or(orClauses.join(","));
  }

  if (filters.countrySlug) {
    const { data: country } = await supabaseAdmin
      .from("countries")
      .select("id")
      .eq("slug", filters.countrySlug)
      .maybeSingle();
    if (country) query = query.eq("country_id", country.id);
  }

  if (filters.locationSlug) {
    const { data: location } = await supabaseAdmin
      .from("locations")
      .select("id")
      .eq("slug", filters.locationSlug)
      .maybeSingle();
    if (location) query = query.eq("location_id", location.id);
  }

  if (filters.categorySlug) {
    const { data: category } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("slug", filters.categorySlug)
      .maybeSingle();
    if (category) query = query.eq("category_id", category.id);
  }

  if (filters.employmentType) {
    query = query.eq("employment_type", filters.employmentType);
  }

  if (filters.experienceMin != null) {
    query = query.gte("experience_max", filters.experienceMin);
  }

  if (filters.sort === "oldest") {
    query = query.order("published_date", { ascending: true });
  } else {
    query = query.order("published_date", { ascending: false });
  }
  query = query.order("created_at", { ascending: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    jobs: (data ?? []) as unknown as JobWithRelations[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getLatestPublishedJobs(limit = 6): Promise<JobWithRelations[]> {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select(JOB_SELECT)
    .eq("status", "published")
    .order("published_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as JobWithRelations[];
}

export async function getJobBySlug(slug: string): Promise<JobWithRelations | null> {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select(JOB_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as JobWithRelations) ?? null;
}

export async function getJobById(id: string): Promise<JobWithRelations | null> {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select(JOB_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as JobWithRelations) ?? null;
}

export async function getRelatedJobs(job: JobWithRelations, limit = 4): Promise<JobWithRelations[]> {
  let query = supabaseAdmin
    .from("jobs")
    .select(JOB_SELECT)
    .eq("status", "published")
    .neq("id", job.id)
    .limit(limit);
  if (job.category_id) query = query.eq("category_id", job.category_id);
  const { data, error } = await query.order("published_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as JobWithRelations[];
}

export type AdminJobFilters = {
  keyword?: string;
  status?: JobStatus;
  categoryId?: string;
  countryId?: string;
  page?: number;
  pageSize?: number;
};

export async function listAdminJobs(filters: AdminJobFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 20;

  let query = supabaseAdmin.from("jobs").select(JOB_SELECT, { count: "exact" });

  if (filters.keyword && filters.keyword.trim()) {
    const kw = sanitizeSearchKeyword(filters.keyword);
    query = query.or(`title.ilike.%${kw}%,reference.ilike.%${kw}%`);
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);
  if (filters.countryId) query = query.eq("country_id", filters.countryId);

  query = query.order("created_at", { ascending: false });
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  return {
    jobs: (data ?? []) as unknown as JobWithRelations[],
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
  };
}

export async function getDashboardStats() {
  const [total, published, draft, expired, today, events] = await Promise.all([
    supabaseAdmin.from("jobs").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("jobs").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabaseAdmin.from("jobs").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabaseAdmin.from("jobs").select("id", { count: "exact", head: true }).eq("status", "expired"),
    supabaseAdmin
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabaseAdmin.from("job_events").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalJobs: total.count ?? 0,
    publishedJobs: published.count ?? 0,
    draftJobs: draft.count ?? 0,
    expiredJobs: expired.count ?? 0,
    jobsPostedToday: today.count ?? 0,
    totalEvents: events.count ?? 0,
  };
}

export async function ensureCompanyByName(name: string, logoUrl?: string | null): Promise<string> {
  const trimmed = name.trim();
  const slugBase = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const { data: existing } = await supabaseAdmin
    .from("companies")
    .select("id")
    .ilike("name", trimmed)
    .maybeSingle();
  if (existing) {
    if (logoUrl) {
      await supabaseAdmin.from("companies").update({ logo_url: logoUrl }).eq("id", existing.id);
    }
    return existing.id;
  }

  let slug = slugBase || "company";
  let suffix = 0;
  for (;;) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const { data: taken } = await supabaseAdmin
      .from("companies")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!taken) {
      slug = candidate;
      break;
    }
    suffix++;
  }

  const { data: created, error } = await supabaseAdmin
    .from("companies")
    .insert({ name: trimmed, slug, logo_url: logoUrl ?? null })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return created.id;
}

export async function ensureUniqueJobSlug(base: string): Promise<string> {
  let slug = base;
  let suffix = 0;
  for (;;) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const { data: taken } = await supabaseAdmin
      .from("jobs")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!taken) return candidate;
    suffix++;
  }
}

export async function createJob(
  insert: Omit<TablesInsert<"jobs">, "reference"> & { reference?: string | null }
) {
  const reference = insert.reference?.trim() || (await generateJobReference());
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .insert({ ...insert, reference })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateJob(id: string, update: TablesUpdate<"jobs">) {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteJob(id: string) {
  const { error } = await supabaseAdmin.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function incrementJobViews(id: string) {
  await supabaseAdmin.rpc("increment_job_views", { job_id: id });
}

export type BulkImportRow = {
  rowNumber: number;
  title: string;
  companyName: string;
  countryId: string;
  locationId: string;
  locationDetail: string | null;
  categoryId: string;
  employmentType: string;
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  qualifications: string | null;
  benefits: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  reference: string | null;
  applicationDeadline: string | null;
  status: string;
};

export async function bulkImportJobs(rows: BulkImportRow[]) {
  let imported = 0;
  const failed: { rowNumber: number; errors: string[] }[] = [];

  for (const row of rows) {
    try {
      const companyId = await ensureCompanyByName(row.companyName);
      const slug = await ensureUniqueJobSlug(slugify(row.title));
      const reference = row.reference && row.reference.trim() ? row.reference.trim() : await generateJobReference();

      await createJob({
        title: row.title,
        slug,
        reference,
        company_id: companyId,
        category_id: row.categoryId,
        country_id: row.countryId,
        location_id: row.locationId,
        location_detail: row.locationDetail,
        employment_type: row.employmentType as TablesInsert<"jobs">["employment_type"],
        experience_min: row.experienceMin,
        experience_max: row.experienceMax,
        salary_min: row.salaryMin,
        salary_max: row.salaryMax,
        salary_currency: row.salaryCurrency,
        description: row.description,
        responsibilities: row.responsibilities,
        requirements: row.requirements,
        qualifications: row.qualifications,
        benefits: row.benefits,
        whatsapp_number: row.whatsappNumber,
        contact_email: row.contactEmail,
        phone_number: row.phoneNumber,
        application_deadline: row.applicationDeadline,
        status: row.status as TablesInsert<"jobs">["status"],
      });
      imported++;
    } catch (err) {
      failed.push({
        rowNumber: row.rowNumber,
        errors: [err instanceof Error ? err.message : "Unknown error while importing this row."],
      });
    }
  }

  return { imported, failed };
}
