import { requireAdmin } from "@/lib/auth/session";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata = { title: "Admin Account" };

export default async function AdminAccountPage() {
  const admin = await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Account</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your administrator account.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Account Details</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-800">{admin?.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-800">{admin?.email}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Change Password</h2>
        <div className="mt-5">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
