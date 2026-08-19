import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createCategory } from "@/lib/db/reference-data";
import { slugify } from "@/lib/utils/slug";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Category name is required." }, { status: 400 });

  try {
    const category = await createCategory(name, slugify(name));
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create category." },
      { status: 500 }
    );
  }
}
