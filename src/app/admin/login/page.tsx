import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-navy-950 px-4 py-14">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-gold-400">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-white">Admin Portal</h1>
          <p className="mt-1.5 text-sm text-slate-400">Sign in to manage Gulf Job Hub</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-6 shadow-xl sm:p-8">
          <LoginForm endpoint="/api/admin/auth/login" redirectTo="/admin" />
        </div>
      </div>
    </div>
  );
}
