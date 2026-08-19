import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createCompany } from "@/lib/db/reference-data";
import { slugify } from "@/lib/utils/slug";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const logoUrl = typeof body?.logoUrl === "string" ? body.logoUrl.trim() : null;
  if (!name) return NextResponse.json({ error: "Company name is required." }, { status: 400 });

  try {
    const company = await createCompany(name, slugify(name), logoUrl || null);
    return NextResponse.json({ ok: true, company });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create company." },
      { status: 500 }
    );
  }
}
