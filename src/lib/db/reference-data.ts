import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Category, Country, Location, Company } from "@/types";

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabaseAdmin
    .from("countries")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLocations(): Promise<Location[]> {
  const { data, error } = await supabaseAdmin
    .from("locations")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getLocationsByCountry(countryId: string): Promise<Location[]> {
  const { data, error } = await supabaseAdmin
    .from("locations")
    .select("*")
    .eq("country_id", countryId)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCompanies(): Promise<Company[]> {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCategoryJobCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("category_id")
    .eq("status", "published");
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (!row.category_id) continue;
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function getLocationJobCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("location_id")
    .eq("status", "published");
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (!row.location_id) continue;
    counts[row.location_id] = (counts[row.location_id] ?? 0) + 1;
  }
  return counts;
}

export async function createCategory(name: string, slug: string) {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({ name, slug })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createLocation(countryId: string, name: string, slug: string) {
  const { data, error } = await supabaseAdmin
    .from("locations")
    .insert({ country_id: countryId, name, slug })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLocation(id: string) {
  const { error } = await supabaseAdmin.from("locations").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createCompany(name: string, slug: string, logoUrl?: string | null) {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .insert({ name, slug, logo_url: logoUrl ?? null })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCompany(id: string) {
  const { error } = await supabaseAdmin.from("companies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
