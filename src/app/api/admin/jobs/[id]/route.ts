import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { jobFormSchema } from "@/lib/utils/validation";
import { updateJob, deleteJob, ensureCompanyByName } from "@/lib/db/jobs";
import type { TablesUpdate } from "@/types/database";

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/jobs/[id]">
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const body = await request.json().catch(() => null);

  // Support partial updates (e.g. status-only changes from the jobs list)
  if (body && typeof body === "object" && "status" in body && Object.keys(body).length === 1) {
    if (!["draft", "published", "expired"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    try {
      const job = await updateJob(id, { status: body.status });
      return NextResponse.json({ ok: true, job });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Could not update job." },
        { status: 500 }
      );
    }
  }

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

    const update: TablesUpdate<"jobs"> = {
      title: data.title,
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
      published_date: data.publishedDate || undefined,
      status: data.status,
    };
    if (data.reference?.trim()) update.reference = data.reference.trim();

    const job = await updateJob(id, update);
    return NextResponse.json({ ok: true, job });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update job." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/jobs/[id]">
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  try {
    await deleteJob(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete job." },
      { status: 500 }
    );
  }
}
