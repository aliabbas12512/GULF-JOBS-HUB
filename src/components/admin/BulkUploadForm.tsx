"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type NormalizedRow = Record<string, unknown> & { rowNumber: number; title: string };
type InvalidRow = { rowNumber: number; errors: string[]; data: Record<string, string> };

type PreviewResult = {
  totalRows: number;
  valid: NormalizedRow[];
  invalid: InvalidRow[];
};

type CommitResult = {
  imported: number;
  failed: { rowNumber: number; errors: string[] }[];
};

export function BulkUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<CommitResult | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError(null);
    setPreview(null);
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/jobs/bulk-import?mode=preview", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not process this file.");
      } else {
        setPreview(data);
      }
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function confirmImport() {
    if (!preview || preview.valid.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/jobs/bulk-import?mode=commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: preview.valid }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Import failed.");
      } else {
        setResult(data);
        router.refresh();
      }
    } catch {
      setError("Import failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadErrorReport() {
    if (!preview || preview.invalid.length === 0) return;
    const res = await fetch("/api/admin/jobs/bulk-error-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invalid: preview.invalid }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gulf-job-hub-import-errors.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setFileName(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <UploadCloud className="h-6 w-6" aria-hidden />
        </div>
        <h2 className="mt-4 text-sm font-semibold text-slate-900">Upload Excel File</h2>
        <p className="mt-1 text-xs text-slate-500">
          .xlsx files only, based on the official template, max 5MB.
        </p>
        <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
          <FileSpreadsheet className="h-4 w-4" aria-hidden />
          Choose File
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {fileName && <p className="mt-3 text-xs text-slate-500">Selected: {fileName}</p>}
        {loading && <p className="mt-3 text-xs font-medium text-brand-600">Processing...</p>}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      {preview && !result && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Import Preview</h2>
          <div className="flex flex-wrap gap-4">
            <SummaryPill
              icon={CheckCircle2}
              tone="success"
              label="Valid Rows"
              value={preview.valid.length}
            />
            <SummaryPill
              icon={AlertTriangle}
              tone="danger"
              label="Rows with Errors"
              value={preview.invalid.length}
            />
            <SummaryPill icon={FileSpreadsheet} tone="brand" label="Total Rows" value={preview.totalRows} />
          </div>

          {preview.invalid.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-rose-100">
              <table className="w-full min-w-[600px] text-left text-xs">
                <thead className="bg-rose-50 text-rose-700">
                  <tr>
                    <th className="px-3 py-2">Row</th>
                    <th className="px-3 py-2">Job Title</th>
                    <th className="px-3 py-2">Errors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {preview.invalid.slice(0, 50).map((row) => (
                    <tr key={row.rowNumber}>
                      <td className="px-3 py-2 font-medium text-slate-700">{row.rowNumber}</td>
                      <td className="px-3 py-2 text-slate-600">{row.data["Job Title"] || "-"}</td>
                      <td className="px-3 py-2 text-rose-600">{row.errors.join("; ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.invalid.length > 50 && (
                <p className="px-3 py-2 text-xs text-slate-400">
                  Showing first 50 of {preview.invalid.length} rows with errors. Download the full
                  report below.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button onClick={confirmImport} disabled={loading || preview.valid.length === 0}>
              {loading ? "Importing..." : `Confirm Import (${preview.valid.length} jobs)`}
            </Button>
            {preview.invalid.length > 0 && (
              <Button variant="outline" onClick={downloadErrorReport}>
                Download Error Report
              </Button>
            )}
            <Button variant="ghost" onClick={reset}>
              Start Over
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-emerald-700">Import Complete</h2>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            Successfully Imported: {result.imported} Jobs
          </p>
          {result.failed.length > 0 && (
            <>
              <p className="mt-1 text-sm font-medium text-rose-600">Failed: {result.failed.length} Jobs</p>
              <ul className="mt-3 space-y-1 text-xs text-rose-600">
                {result.failed.map((f) => (
                  <li key={f.rowNumber}>
                    Row {f.rowNumber} - {f.errors.join("; ")}
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="mt-5 flex gap-3">
            <Button href="/admin/jobs">View Jobs</Button>
            <Button variant="outline" onClick={reset}>
              Upload Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  tone: "success" | "danger" | "brand";
}) {
  const toneClasses = {
    success: "bg-emerald-50 text-emerald-700",
    danger: "bg-rose-50 text-rose-700",
    brand: "bg-brand-50 text-brand-700",
  }[tone];

  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${toneClasses}`}>
      <Icon className="h-4 w-4" aria-hidden />
      {value} {label}
    </div>
  );
}
