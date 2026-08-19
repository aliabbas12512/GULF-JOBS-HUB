import { Building2 } from "lucide-react";

export function CompanyLogo({
  name,
  logoUrl,
  size = "md",
}: {
  name?: string | null;
  logoUrl?: string | null;
  size?: "md" | "lg";
}) {
  const dimensions = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const iconSize = size === "lg" ? "h-8 w-8" : "h-6 w-6";

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={name ? `${name} logo` : "Company logo"}
        className={`${dimensions} shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1.5`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`flex ${dimensions} shrink-0 items-center justify-center rounded-xl bg-navy-50 text-navy-700 ring-1 ring-inset ring-slate-200`}
    >
      <Building2 className={iconSize} aria-hidden />
    </div>
  );
}
