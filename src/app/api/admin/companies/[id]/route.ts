import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { deleteCompany } from "@/lib/db/reference-data";

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/companies/[id]">
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;

  try {
    await deleteCompany(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete this company." },
      { status: 400 }
    );
  }
}
