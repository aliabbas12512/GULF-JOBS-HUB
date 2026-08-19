import type { Metadata } from "next";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { ContentPage } from "@/components/layout/ContentPage";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Gulf Job Hub team.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <ContentPage title="Contact Us" subtitle="We'd love to hear from you">
      <p>
        Whether you have a question about a job listing, feedback on the platform, or a partnership
        inquiry, reach out using any of the channels below.
      </p>

      <div className="not-prose mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ContactCard
          icon={Mail}
          label="Email"
          value={settings.contact_email}
          href={`mailto:${settings.contact_email}`}
        />
        {settings.phone_number && (
          <ContactCard icon={Phone} label="Phone" value={settings.phone_number} href={`tel:${settings.phone_number}`} />
        )}
        {settings.whatsapp_number && (
          <ContactCard
            icon={MessageCircle}
            label="WhatsApp"
            value={settings.whatsapp_number}
            href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
          />
        )}
      </div>
    </ContentPage>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center hover:border-brand-300 hover:shadow-sm"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </a>
  );
}
