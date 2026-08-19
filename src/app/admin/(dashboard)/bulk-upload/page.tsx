import { Download } from "lucide-react";
import { BulkUploadForm } from "@/components/admin/BulkUploadForm";

export const metadata = { title: "Bulk Job Upload" };

export default function BulkUploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bulk Job Upload</h1>
        <p className="mt-1 text-sm text-slate-500">
          Import many jobs at once using the official Excel template.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Step 1 - Get the Template</h2>
        <p className="mt-2 text-sm text-slate-600">
          Download the official template, fill in your jobs, and keep the column headers unchanged.
          The template includes an Instructions sheet and a list of accepted Countries, Categories,
          Employment Types and Statuses.
        </p>
        <a
          href="/api/admin/jobs/bulk-template"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download Excel Template
        </a>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
          Step 2 - Upload &amp; Import
        </h2>
        <BulkUploadForm />
      </div>
    </div>
  );
}
