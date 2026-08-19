"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { SiteSettings, AdSlots, SocialLinks } from "@/types";

export function SettingsForm({
  settings,
  adSlots,
  social,
}: {
  settings: SiteSettings;
  adSlots: AdSlots;
  social: SocialLinks;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      siteName: form.get("siteName"),
      tagline: form.get("tagline"),
      logoUrl: form.get("logoUrl") || null,
      contactEmail: form.get("contactEmail"),
      whatsappNumber: form.get("whatsappNumber") || null,
      phoneNumber: form.get("phoneNumber") || null,
      seoTitle: form.get("seoTitle"),
      seoDescription: form.get("seoDescription"),
      facebook: form.get("facebook") || null,
      twitter: form.get("twitter") || null,
      linkedin: form.get("linkedin") || null,
      instagram: form.get("instagram") || null,
      headerEnabled: form.get("headerEnabled") === "on",
      homepageEnabled: form.get("homepageEnabled") === "on",
      jobsPageEnabled: form.get("jobsPageEnabled") === "on",
      jobDetailsEnabled: form.get("jobDetailsEnabled") === "on",
      sidebarEnabled: form.get("sidebarEnabled") === "on",
      headerCode: form.get("headerCode") || "",
      homepageCode: form.get("homepageCode") || "",
      jobsPageCode: form.get("jobsPageCode") || "",
      jobDetailsCode: form.get("jobDetailsCode") || "",
      sidebarCode: form.get("sidebarCode") || "",
    };

    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save settings.");
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Settings saved successfully.
        </div>
      )}

      <Section title="General">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="siteName" required>
              Website Name
            </Label>
            <Input id="siteName" name="siteName" defaultValue={settings.site_name} required />
          </div>
          <div>
            <Label htmlFor="tagline" required>
              Tagline
            </Label>
            <Input id="tagline" name="tagline" defaultValue={settings.tagline} required />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input id="logoUrl" name="logoUrl" type="url" defaultValue={settings.logo_url ?? ""} />
          </div>
        </div>
      </Section>

      <Section title="Contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="contactEmail" required>
              Contact Email
            </Label>
            <Input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contact_email} required />
          </div>
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input id="whatsappNumber" name="whatsappNumber" defaultValue={settings.whatsapp_number ?? ""} />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" defaultValue={settings.phone_number ?? ""} />
          </div>
        </div>
      </Section>

      <Section title="SEO Defaults">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <Label htmlFor="seoTitle" required>
              Default SEO Title
            </Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={settings.seo_title} required />
          </div>
          <div>
            <Label htmlFor="seoDescription" required>
              Default SEO Description
            </Label>
            <Textarea id="seoDescription" name="seoDescription" defaultValue={settings.seo_description} required />
          </div>
        </div>
      </Section>

      <Section title="Social Links">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="facebook">Facebook URL</Label>
            <Input id="facebook" name="facebook" type="url" defaultValue={social.facebook ?? ""} />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter / X URL</Label>
            <Input id="twitter" name="twitter" type="url" defaultValue={social.twitter ?? ""} />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" name="linkedin" type="url" defaultValue={social.linkedin ?? ""} />
          </div>
          <div>
            <Label htmlFor="instagram">Instagram URL</Label>
            <Input id="instagram" name="instagram" type="url" defaultValue={social.instagram ?? ""} />
          </div>
        </div>
      </Section>

      <Section title="AdSense / Ad Slots">
        <div className="space-y-6">
          <AdSlotField
            name="header"
            label="Header Ad Slot"
            enabled={adSlots.header_enabled}
            code={adSlots.header_code}
          />
          <AdSlotField
            name="homepage"
            label="Homepage Ad Slot"
            enabled={adSlots.homepage_enabled}
            code={adSlots.homepage_code}
          />
          <AdSlotField
            name="jobsPage"
            label="Jobs Page Ad Slot"
            enabled={adSlots.jobs_page_enabled}
            code={adSlots.jobs_page_code}
          />
          <AdSlotField
            name="jobDetails"
            label="Job Details Ad Slot"
            enabled={adSlots.job_details_enabled}
            code={adSlots.job_details_code}
          />
          <AdSlotField
            name="sidebar"
            label="Sidebar Ad Slot"
            enabled={adSlots.sidebar_enabled}
            code={adSlots.sidebar_code}
          />
        </div>
      </Section>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

function AdSlotField({
  name,
  label,
  enabled,
  code,
}: {
  name: string;
  label: string;
  enabled: boolean;
  code: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        <label className="inline-flex items-center gap-2 text-xs text-slate-500">
          <input
            type="checkbox"
            name={`${name}Enabled`}
            defaultChecked={enabled}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Enabled
        </label>
      </div>
      <Textarea
        name={`${name}Code`}
        defaultValue={code}
        placeholder="Paste ad slot HTML/script here"
        className="mt-3 font-mono text-xs"
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
