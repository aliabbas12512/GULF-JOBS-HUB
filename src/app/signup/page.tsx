import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free Gulf Job Hub account.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: true },
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Gulf Job Hub to save and track jobs"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Login
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
