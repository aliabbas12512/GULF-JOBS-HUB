import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { buildErrorReportWorkbook, type InvalidRow } from "@/lib/excel/import";

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.invalid)) {
    return NextResponse.json({ error: "No error data provided." }, { status: 400 });
  }

  const buffer = buildErrorReportWorkbook(body.invalid as InvalidRow[]);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="gulf-job-hub-import-errors.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
