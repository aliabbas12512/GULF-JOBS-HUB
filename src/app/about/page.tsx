import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Gulf Job Hub, a dedicated job portal connecting talent with employers across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <ContentPage title="About Us" subtitle={`Learn more about ${settings.site_name}`}>
      <p>
        {settings.site_name} is a dedicated recruitment platform focused entirely on career
        opportunities across the Gulf Cooperation Council (GCC) region - Saudi Arabia, the United
        Arab Emirates, Qatar, Kuwait, Bahrain and Oman. Our mission is simple: make it fast, clear
        and reliable for job seekers to find genuine opportunities, and for employers to reach the
        right candidates.
      </p>
      <h2 className="text-lg font-bold text-navy-900">What We Do</h2>
      <p>
        We aggregate and publish job listings across major industries including Engineering,
        Construction, Oil &amp; Gas, IT &amp; Software, Healthcare, Finance, Sales, Hospitality and
        more. Every listing includes clear details on location, salary (where disclosed), experience
        requirements and a direct way to apply - via WhatsApp, email or phone - without unnecessary
        forms or delays.
      </p>
      <h2 className="text-lg font-bold text-navy-900">Our Commitment</h2>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>Clear, accurate and up-to-date job information.</li>
        <li>A fast, mobile-friendly experience for job seekers on the go.</li>
        <li>Direct, transparent communication between candidates and employers.</li>
        <li>A clean, professional platform free of clutter and misleading content.</li>
      </ul>
      <h2 className="text-lg font-bold text-navy-900">Get in Touch</h2>
      <p>
        Have a question, feedback, or want to report an issue with a listing? Visit our{" "}
        <a href="/contact" className="font-medium text-brand-600 hover:underline">
          Contact page
        </a>{" "}
        or email us at{" "}
        <a href={`mailto:${settings.contact_email}`} className="font-medium text-brand-600 hover:underline">
          {settings.contact_email}
        </a>
        .
      </p>
    </ContentPage>
  );
}
