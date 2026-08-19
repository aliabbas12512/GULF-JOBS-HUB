import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { getJobById, createJob, ensureUniqueJobSlug } from "@/lib/db/jobs";
import { slugify } from "@/lib/utils/slug";

export async function POST(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/jobs/[id]/duplicate">
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  const original = await getJobById(id);
  if (!original) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  try {
    const newTitle = `${original.title} (Copy)`;
    const slug = await ensureUniqueJobSlug(slugify(newTitle));

    const job = await createJob({
      title: newTitle,
      slug,
      company_id: original.company_id,
      category_id: original.category_id,
      country_id: original.country_id,
      location_id: original.location_id,
      location_detail: original.location_detail,
      employment_type: original.employment_type,
      experience_min: original.experience_min,
      experience_max: original.experience_max,
      salary_min: original.salary_min,
      salary_max: original.salary_max,
      salary_currency: original.salary_currency,
      salary_is_visible: original.salary_is_visible,
      description: original.description,
      responsibilities: original.responsibilities,
      requirements: original.requirements,
      qualifications: original.qualifications,
      benefits: original.benefits,
      whatsapp_number: original.whatsapp_number,
      contact_email: original.contact_email,
      phone_number: original.phone_number,
      application_deadline: original.application_deadline,
      published_date: new Date().toISOString().slice(0, 10),
      status: "draft",
    });

    return NextResponse.json({ ok: true, job });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not duplicate job." },
      { status: 500 }
    );
  }
}
