import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function generateJobReference(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = `GJH-${Math.floor(100000 + Math.random() * 900000)}`;
    const { data } = await supabaseAdmin
      .from("jobs")
      .select("id")
      .eq("reference", candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  return `GJH-${Date.now()}`;
}
