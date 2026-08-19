import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

export async function logJobEvent(jobId: string, eventType: Enums<"event_type">) {
  await supabaseAdmin.from("job_events").insert({ job_id: jobId, event_type: eventType });
}

export async function logSearchQuery(query: string, resultsCount: number) {
  if (!query.trim()) return;
  await supabaseAdmin.from("search_queries").insert({ query: query.trim(), results_count: resultsCount });
}

export async function getMostViewedJobs(limit = 10) {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("id, title, slug, views_count")
    .order("views_count", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLeadEvents(limit = 50, offset = 0) {
  const { data, count, error } = await supabaseAdmin
    .from("job_events")
    .select("id, event_type, created_at, job:jobs(id, title, slug, reference)", { count: "exact" })
    .in("event_type", ["apply_click", "whatsapp_click", "email_click", "call_click"])
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return { events: data ?? [], total: count ?? 0 };
}

export async function getTopSearchQueries(limit = 10) {
  const { data, error } = await supabaseAdmin
    .from("search_queries")
    .select("query")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const q = row.query.toLowerCase().trim();
    counts[q] = (counts[q] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([query, count]) => ({ query, count }));
}

export async function getEventCounts() {
  const types: Enums<"event_type">[] = ["view", "apply_click", "whatsapp_click", "email_click", "call_click"];
  const results = await Promise.all(
    types.map((t) =>
      supabaseAdmin.from("job_events").select("id", { count: "exact", head: true }).eq("event_type", t)
    )
  );
  const out: Record<string, number> = {};
  types.forEach((t, i) => {
    out[t] = results[i].count ?? 0;
  });
  return out;
}
