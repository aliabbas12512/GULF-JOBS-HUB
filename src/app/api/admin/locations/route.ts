import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { createLocation } from "@/lib/db/reference-data";
import { slugify } from "@/lib/utils/slug";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const countryId = typeof body?.countryId === "string" ? body.countryId : "";
  if (!name || !countryId) {
    return NextResponse.json({ error: "City name and country are required." }, { status: 400 });
  }

  try {
    const location = await createLocation(countryId, name, slugify(name));
    return NextResponse.json({ ok: true, location });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create city." },
      { status: 500 }
    );
  }
}
