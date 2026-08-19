import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn how Gulf Job Hub uses cookies.",
  alternates: { canonical: "/cookie-policy" },
};

export default async function CookiePolicyPage() {
  const settings = await getSiteSettings();
  const updated = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <ContentPage title="Cookie Policy" subtitle={`Last updated: ${updated}`}>
      <p>
        This Cookie Policy explains how {settings.site_name} uses cookies and similar technologies
        when you visit our website.
      </p>

      <h2 className="text-lg font-bold text-navy-900">What Are Cookies?</h2>
      <p>
        Cookies are small text files stored on your device that help websites function correctly and
        remember information about your visit.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Cookies We Use</h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          <strong>Essential cookies:</strong> used to keep you signed in to your account securely.
          These cannot be disabled as they are required for the site to function.
        </li>
        <li>
          <strong>Advertising cookies:</strong> if ad slots are enabled, our advertising partners
          (such as Google AdSense) may set cookies to serve relevant ads and measure performance.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-navy-900">Managing Cookies</h2>
      <p>
        Most web browsers let you control cookies through their settings. You can usually delete
        existing cookies and block new ones, though disabling essential cookies may prevent you from
        staying signed in.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Contact</h2>
      <p>
        Questions about this Cookie Policy can be sent to{" "}
        <a href={`mailto:${settings.contact_email}`} className="font-medium text-brand-600 hover:underline">
          {settings.contact_email}
        </a>
        .
      </p>
    </ContentPage>
  );
}
