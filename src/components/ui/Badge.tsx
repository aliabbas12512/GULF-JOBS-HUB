import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "brand" | "gold" | "neutral" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  gold: "bg-amber-50 text-gold-600",
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
