"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Trash2, Eye } from "lucide-react";
import type { JobStatus } from "@/types";

export function JobRowActions({ jobId, status, slug }: { jobId: string; status: JobStatus; slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function updateStatus(newStatus: JobStatus) {
    setBusy(true);
    await fetch(`/api/admin/jobs/${jobId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(false);
    router.refresh();
  }

  async function duplicate() {
    setBusy(true);
    const res = await fetch(`/api/admin/jobs/${jobId}/duplicate`, { method: "POST" });
    setBusy(false);
    if (res.ok) router.refresh();
  }

  async function remove() {
    setBusy(true);
    const res = await fetch(`/api/admin/jobs/${jobId}`, { method: "DELETE" });
    setBusy(false);
    setConfirming(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/jobs/${slug}`}
        target="_blank"
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        title="View job"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <Link
        href={`/admin/jobs/${jobId}/edit`}
        className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50"
      >
        Edit
      </Link>

      <select
        value={status}
        disabled={busy}
        onChange={(e) => updateStatus(e.target.value as JobStatus)}
        className="rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="expired">Expired</option>
      </select>

      <button
        type="button"
        onClick={duplicate}
        disabled={busy}
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        title="Duplicate job"
      >
        <Copy className="h-4 w-4" />
      </button>

      {confirming ? (
        <span className="flex items-center gap-1.5 text-xs">
          <span className="text-rose-600">Delete?</span>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="rounded-md bg-rose-600 px-2 py-1 font-semibold text-white hover:bg-rose-700"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-md border border-slate-200 px-2 py-1 text-slate-600"
          >
            No
          </button>
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50"
          title="Delete job"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
