import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "gold";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600 shadow-sm",
  secondary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-900 shadow-sm",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:border-brand-500 hover:text-brand-700",
  ghost: "text-slate-700 hover:bg-slate-100",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark shadow-sm",
  gold: "bg-gold-500 text-white hover:bg-gold-600 shadow-sm",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-6 py-3.5 text-base rounded-lg gap-2",
};

const base =
  "inline-flex items-center justify-center font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children, fullWidth } = props;
  const classes = cn(
    base,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
