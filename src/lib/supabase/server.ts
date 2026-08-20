import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Lazily construct the client so a missing env var only throws when a
// query actually runs (request time), not when this module is merely
// imported. Header/Footer import this transitively on every page via
// lib/db/settings.ts, so an eager throw at module-evaluation time would
// fail the production build for the *entire* site the moment env vars
// are missing during a deploy - instead we want that single request to
// fail with a clear runtime error while the rest of the build succeeds.
let cachedClient: SupabaseClient<Database> | null = null;

function getClient(): SupabaseClient<Database> {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cachedClient = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cachedClient;
}

// Server-only client. Never import this file from a Client Component -
// the key it holds must never reach the browser bundle.
export const supabaseAdmin: SupabaseClient<Database> = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
