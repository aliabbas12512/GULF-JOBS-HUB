import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { validateFileMeta, parseWorkbook, validateRows } from "@/lib/excel/import";
import { getCountries, getCategories, getLocations } from "@/lib/db/reference-data";
import { bulkImportJobs, type BulkImportRow } from "@/lib/db/jobs";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const mode = request.nextUrl.searchParams.get("mode") === "commit" ? "commit" : "preview";

  if (mode === "commit") {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.rows)) {
      return NextResponse.json({ error: "No rows provided." }, { status: 400 });
    }
    const rows = body.rows as BulkImportRow[];
    if (rows.length === 0) {
      return NextResponse.json({ error: "No valid rows to import." }, { status: 400 });
    }
    if (rows.length > 2000) {
      return NextResponse.json({ error: "Too many rows in a single import (max 2000)." }, { status: 400 });
    }
    const result = await bulkImportJobs(rows);
    return NextResponse.json(result);
  }

  // preview mode
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const metaError = validateFileMeta({ name: file.name, type: file.type, size: file.size });
  if (metaError) {
    return NextResponse.json({ error: metaError }, { status: 400 });
  }

  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch {
    return NextResponse.json({ error: "Could not read the uploaded file." }, { status: 400 });
  }

  let rawRows;
  try {
    rawRows = parseWorkbook(buffer);
  } catch {
    return NextResponse.json(
      { error: "Could not parse this file. Please make sure it is a valid .xlsx file based on the template." },
      { status: 400 }
    );
  }

  if (rawRows.length === 0) {
    return NextResponse.json({ error: "The uploaded file has no data rows." }, { status: 400 });
  }
  if (rawRows.length > 2000) {
    return NextResponse.json({ error: "Too many rows in a single file (max 2000)." }, { status: 400 });
  }

  const [countries, categories, locations] = await Promise.all([
    getCountries(),
    getCategories(),
    getLocations(),
  ]);

  const { valid, invalid } = validateRows(rawRows, { countries, categories, locations });

  return NextResponse.json({
    totalRows: rawRows.length,
    valid,
    invalid,
  });
}
