import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/Sidebar";
import { MobileTopbar } from "@/components/admin/MobileTopbar";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | Admin - Gulf Job Hub" },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-100">
      <Sidebar adminName={admin.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar adminName={admin.name} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
