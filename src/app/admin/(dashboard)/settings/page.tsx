import { getSiteSettings, getAdSlots, getSocialLinks } from "@/lib/db/settings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata = { title: "Site Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  const adSlots = getAdSlots(settings);
  const social = getSocialLinks(settings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Control site-wide branding, contact info, SEO defaults and ad slots without touching code.
        </p>
      </div>
      <SettingsForm settings={settings} adSlots={adSlots} social={social} />
    </div>
  );
}
