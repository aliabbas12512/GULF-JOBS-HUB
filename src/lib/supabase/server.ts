import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

// Server-only client. Never import this file from a Client Component -
// the key it holds must never reach the browser bundle.
export const supabaseAdmin = createClient<Database>(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});
