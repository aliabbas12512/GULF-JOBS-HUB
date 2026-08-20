import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { buildTemplateWorkbook } from "@/lib/excel/template";
import { getCountries, getCategories, getLocations } from "@/lib/db/reference-data";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [countries, categories, locations] = await Promise.all([
    getCountries(),
    getCategories(),
    getLocations(),
  ]);
  const countryById = new Map(countries.map((c) => [c.id, c.name]));

  const buffer = buildTemplateWorkbook({
    countries: countries.map((c) => c.name),
    categories: categories.map((c) => c.name),
    cities: locations.map((l) => ({
      name: l.name,
      country: countryById.get(l.country_id) ?? "",
    })),
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="gulf-job-hub-bulk-upload-template.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
