import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { SiteSettings, AdSlots, SocialLinks } from "@/types";
import type { TablesUpdate } from "@/types/database";

const DEFAULT_AD_SLOTS: AdSlots = {
  header_enabled: false,
  homepage_enabled: false,
  jobs_page_enabled: false,
  job_details_enabled: false,
  sidebar_enabled: false,
  header_code: "",
  homepage_code: "",
  jobs_page_code: "",
  job_details_code: "",
  sidebar_code: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export function getAdSlots(settings: SiteSettings): AdSlots {
  return { ...DEFAULT_AD_SLOTS, ...(settings.ad_slots as Partial<AdSlots>) };
}

export function getSocialLinks(settings: SiteSettings): SocialLinks {
  return (settings.social_links as SocialLinks) ?? {};
}

export async function updateSiteSettings(update: TablesUpdate<"site_settings">) {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .update(update)
    .eq("id", 1)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
