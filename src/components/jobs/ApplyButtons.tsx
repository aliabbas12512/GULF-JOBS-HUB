import { MessageCircle, Mail, Phone } from "lucide-react";
import type { JobWithRelations } from "@/types";

function buildWhatsappHref(job: JobWithRelations): string | null {
  if (!job.whatsapp_number) return null;
  const digits = job.whatsapp_number.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const message = `Hello, I would like to apply for the position of "${job.title}" (Ref: ${job.reference}) listed on Gulf Job Hub.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function buildEmailHref(job: JobWithRelations): string | null {
  if (!job.contact_email) return null;
  const subject = `Application for ${job.title} (Ref: ${job.reference})`;
  const body = `Hello,\n\nI would like to apply for the position of "${job.title}" (Ref: ${job.reference}) listed on Gulf Job Hub.\n\nPlease find my CV attached.\n\nThank you.`;
  return `mailto:${job.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildCallHref(job: JobWithRelations): string | null {
  const number = job.phone_number || job.whatsapp_number;
  if (!number) return null;
  const digits = number.replace(/[^0-9+]/g, "");
  return `tel:${digits}`;
}

export function getApplyLinks(job: JobWithRelations) {
  return {
    whatsapp: buildWhatsappHref(job),
    email: buildEmailHref(job),
    call: buildCallHref(job),
  };
}

export function ApplyButtons({
  job,
  variant = "full",
}: {
  job: JobWithRelations;
  variant?: "full" | "compact";
}) {
  const links = getApplyLinks(job);
  const hasAny = links.whatsapp || links.email || links.call;

  if (!hasAny) {
    return (
      <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Application contact details are not available for this job.
      </p>
    );
  }

  const size = variant === "compact" ? "text-xs px-3 py-2.5" : "text-sm px-5 py-3.5";

  return (
    <div className={variant === "compact" ? "grid grid-cols-3 gap-2" : "flex flex-col gap-3 sm:flex-row"}>
      {links.whatsapp && (
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-track="whatsapp_click"
          data-job-id={job.id}
          className={`apply-track flex flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp font-bold text-white transition-colors hover:bg-whatsapp-dark ${size}`}
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
          {variant === "compact" ? "WhatsApp" : "APPLY VIA WHATSAPP"}
        </a>
      )}
      {links.email && (
        <a
          href={links.email}
          data-track="email_click"
          data-job-id={job.id}
          className={`apply-track flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 font-bold text-white transition-colors hover:bg-brand-700 ${size}`}
        >
          <Mail className="h-5 w-5 shrink-0" aria-hidden />
          {variant === "compact" ? "Email" : "APPLY VIA EMAIL"}
        </a>
      )}
      {links.call && (
        <a
          href={links.call}
          data-track="call_click"
          data-job-id={job.id}
          className={`apply-track flex flex-1 items-center justify-center gap-2 rounded-xl bg-navy-900 font-bold text-white transition-colors hover:bg-navy-800 ${size}`}
        >
          <Phone className="h-5 w-5 shrink-0" aria-hidden />
          {variant === "compact" ? "Call" : "CALL TO APPLY"}
        </a>
      )}
    </div>
  );
}
