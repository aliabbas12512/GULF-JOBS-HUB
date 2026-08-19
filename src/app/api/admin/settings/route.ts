import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { settingsSchema } from "@/lib/utils/validation";
import { updateSiteSettings } from "@/lib/db/settings";
import type { AdSlots, SocialLinks } from "@/types";

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid settings data." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const social: SocialLinks = {
    facebook: data.facebook || undefined,
    twitter: data.twitter || undefined,
    linkedin: data.linkedin || undefined,
    instagram: data.instagram || undefined,
  };

  const adSlots: AdSlots = {
    header_enabled: data.headerEnabled,
    homepage_enabled: data.homepageEnabled,
    jobs_page_enabled: data.jobsPageEnabled,
    job_details_enabled: data.jobDetailsEnabled,
    sidebar_enabled: data.sidebarEnabled,
    header_code: data.headerCode ?? "",
    homepage_code: data.homepageCode ?? "",
    jobs_page_code: data.jobsPageCode ?? "",
    job_details_code: data.jobDetailsCode ?? "",
    sidebar_code: data.sidebarCode ?? "",
  };

  try {
    const settings = await updateSiteSettings({
      site_name: data.siteName,
      tagline: data.tagline,
      logo_url: data.logoUrl || null,
      contact_email: data.contactEmail,
      whatsapp_number: data.whatsappNumber || null,
      phone_number: data.phoneNumber || null,
      seo_title: data.seoTitle,
      seo_description: data.seoDescription,
      social_links: social,
      ad_slots: adSlots,
    });
    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update settings." },
      { status: 500 }
    );
  }
}
