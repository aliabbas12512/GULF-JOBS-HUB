import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jobFormSchema } from "@/lib/utils/validation";
import { createJob, ensureCompanyByName, ensureUniqueJobSlug } from "@/lib/db/jobs";
import { slugify } from "@/lib/utils/slug";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = jobFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid job data." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  try {
    const companyId = await ensureCompanyByName(data.companyName, data.companyLogoUrl);
    const slug = await ensureUniqueJobSlug(slugify(data.title));

    const insert = {
      reference: data.reference?.trim() || null,
      title: data.title,
      slug,
      company_id: companyId,
      category_id: data.categoryId,
      country_id: data.countryId,
      location_id: data.locationId,
      location_detail: data.locationDetail ?? null,
      employment_type: data.employmentType,
      experience_min: data.experienceMin ?? null,
      experience_max: data.experienceMax ?? null,
      salary_min: data.salaryMin ?? null,
      salary_max: data.salaryMax ?? null,
      salary_currency: data.salaryCurrency,
      salary_is_visible: data.salaryIsVisible,
      description: data.description,
      responsibilities: data.responsibilities ?? null,
      requirements: data.requirements ?? null,
      qualifications: data.qualifications ?? null,
      benefits: data.benefits ?? null,
      whatsapp_number: data.whatsappNumber ?? null,
      contact_email: data.contactEmail || null,
      phone_number: data.phoneNumber ?? null,
      application_deadline: data.applicationDeadline || null,
      published_date: data.publishedDate || new Date().toISOString().slice(0, 10),
      status: data.status,
    };

    const job = await createJob(insert);
    return NextResponse.json({ ok: true, job });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create job." },
      { status: 500 }
    );
  }
}
