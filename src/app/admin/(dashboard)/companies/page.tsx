import { getCompanies } from "@/lib/db/reference-data";
import { CompanyManager } from "@/components/admin/CompanyManager";

export const metadata = { title: "Companies" };

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
        <p className="mt-1 text-sm text-slate-500">
          Companies are created automatically when adding jobs, or manually here.
        </p>
      </div>
      <CompanyManager companies={companies} />
    </div>
  );
}
