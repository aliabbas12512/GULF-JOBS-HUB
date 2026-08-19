import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { SessionUser } from "@/types";

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const { data: admin } = await supabaseAdmin
    .from("admins")
    .select("*")
    .ilike("email", email.trim())
    .maybeSingle();
  if (!admin) return null;
  const valid = await verifyPassword(password, admin.password_hash);
  if (!valid) return null;
  return { id: admin.id, name: admin.name, email: admin.email, role: "admin" };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .ilike("email", email.trim())
    .maybeSingle();
  if (!user) return null;
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return null;
  return { id: user.id, name: user.name, email: user.email, role: "jobseeker" };
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<SessionUser | { error: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .ilike("email", normalizedEmail)
    .maybeSingle();
  if (existing) return { error: "An account with this email already exists." };

  const password_hash = await hashPassword(password);
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({ name: name.trim(), email: normalizedEmail, password_hash })
    .select()
    .single();
  if (error) return { error: "Could not create account. Please try again." };
  return { id: data.id, name: data.name, email: data.email, role: "jobseeker" };
}

export async function updateAdminPassword(adminId: string, newPassword: string) {
  const password_hash = await hashPassword(newPassword);
  const { error } = await supabaseAdmin
    .from("admins")
    .update({ password_hash })
    .eq("id", adminId);
  if (error) throw new Error(error.message);
}

export async function getAdminById(id: string) {
  const { data, error } = await supabaseAdmin.from("admins").select("id, name, email, created_at").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
