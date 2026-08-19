import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Gulf Job Hub privacy policy to understand how we collect, use and protect your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const updated = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <ContentPage title="Privacy Policy" subtitle={`Last updated: ${updated}`}>
      <p>
        This Privacy Policy explains how {settings.site_name} (&quot;we&quot;, &quot;us&quot;) collects,
        uses and protects information when you use our website. By using {settings.site_name}, you
        agree to the practices described here.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Information We Collect</h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          <strong>Account information:</strong> name and email address when you create an account.
        </li>
        <li>
          <strong>Usage data:</strong> pages visited, jobs viewed, and search terms, used to improve
          the relevance and quality of listings.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type and device information, collected
          automatically for security and analytics purposes.
        </li>
      </ul>

      <h2 className="text-lg font-bold text-navy-900">How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Operate, maintain and improve the job search experience.</li>
        <li>Allow you to create and manage an account.</li>
        <li>Understand aggregate search and browsing trends to improve listings.</li>
        <li>Detect, prevent and address technical issues or misuse.</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-900">Applying for Jobs</h2>
      <p>
        When you apply for a job via WhatsApp, email or phone from a job listing, you are contacting
        the employer or their representative directly. {settings.site_name} does not control, store
        or process the personal information (such as your CV) that you share directly with an
        employer through these channels.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Cookies</h2>
      <p>
        We use a minimal set of cookies necessary to keep you signed in and to remember your
        preferences. See our{" "}
        <a href="/cookie-policy" className="font-medium text-brand-600 hover:underline">
          Cookie Policy
        </a>{" "}
        for details.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Data Security</h2>
      <p>
        Passwords are stored using industry-standard hashing and are never stored or transmitted in
        plain text. We use reasonable technical and organizational measures to protect your
        information, though no method of transmission over the internet is 100% secure.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Third-Party Advertising</h2>
      <p>
        We may display advertisements from third-party ad networks (such as Google AdSense). These
        networks may use cookies to serve ads based on your prior visits to this and other websites.
        You can opt out of personalized advertising through your ad network&apos;s settings.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your account information at any
        time by contacting us at{" "}
        <a href={`mailto:${settings.contact_email}`} className="font-medium text-brand-600 hover:underline">
          {settings.contact_email}
        </a>
        .
      </p>

      <h2 className="text-lg font-bold text-navy-900">Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected by
        updating the date at the top of this page.
      </p>
    </ContentPage>
  );
}
