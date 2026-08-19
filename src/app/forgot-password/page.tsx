import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/db/settings";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request help recovering your Gulf Job Hub account.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: true },
};

export default async function ForgotPasswordPage() {
  const settings = await getSiteSettings();
  const mailto = `mailto:${settings.contact_email}?subject=${encodeURIComponent(
    "Password Reset Request"
  )}&body=${encodeURIComponent(
    "Hello,\n\nI would like to reset the password for my Gulf Job Hub account.\n\nAccount email: \n\nThank you."
  )}`;

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll help you get back into your account"
      footer={
        <>
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to Login
          </Link>
        </>
      }
    >
      <p className="text-sm text-slate-600">
        Send our support team a password reset request from the email address on your account and
        we&apos;ll get you back in quickly.
      </p>
      <Button href={mailto} fullWidth size="lg" className="mt-6">
        Email Support to Reset Password
      </Button>
    </AuthLayout>
  );
}
