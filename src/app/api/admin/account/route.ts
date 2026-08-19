import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/auth/password";
import { updateAdminPassword } from "@/lib/db/auth";

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const { data: record } = await supabaseAdmin
    .from("admins")
    .select("password_hash")
    .eq("id", admin.id)
    .maybeSingle();

  if (!record || !(await verifyPassword(currentPassword, record.password_hash))) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  await updateAdminPassword(admin.id, newPassword);
  return NextResponse.json({ ok: true });
}
