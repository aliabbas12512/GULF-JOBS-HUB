import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions governing your use of Gulf Job Hub.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const updated = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <ContentPage title="Terms & Conditions" subtitle={`Last updated: ${updated}`}>
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your access to and use of{" "}
        {settings.site_name}. By using this website, you agree to be bound by these Terms.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Use of the Platform</h2>
      <p>
        {settings.site_name} provides a listing of job opportunities across the Gulf region for
        informational purposes. We do our best to ensure listings are accurate and up to date, but we
        do not guarantee the accuracy, completeness or availability of any listing at any given time.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Applying for Jobs</h2>
      <p>
        All applications are made directly with the employer or their representative via the contact
        details provided (WhatsApp, email or phone). {settings.site_name} is not a party to any
        employment agreement, offer, or communication between a job seeker and an employer, and is
        not responsible for the outcome of any application.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Account Responsibilities</h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You agree to provide accurate information when creating an account.</li>
        <li>You must not use the platform for any unlawful or fraudulent purpose.</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-900">Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Post, upload or transmit any unlawful, misleading or fraudulent content.</li>
        <li>Attempt to gain unauthorized access to any part of the platform or its systems.</li>
        <li>Scrape, harvest or bulk-collect listings without prior written permission.</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-900">Intellectual Property</h2>
      <p>
        The {settings.site_name} name, logo and platform design are the property of{" "}
        {settings.site_name}. Job listing content remains the property of the respective employer or
        source.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Limitation of Liability</h2>
      <p>
        {settings.site_name} is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To
        the fullest extent permitted by law, we are not liable for any indirect, incidental or
        consequential damages arising from your use of the platform or reliance on any listing.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the platform after changes
        constitutes acceptance of the revised Terms.
      </p>

      <h2 className="text-lg font-bold text-navy-900">Contact</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href={`mailto:${settings.contact_email}`} className="font-medium text-brand-600 hover:underline">
          {settings.contact_email}
        </a>
        .
      </p>
    </ContentPage>
  );
}
