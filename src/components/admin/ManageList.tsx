"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export type ManageListItem = {
  id: string;
  primary: string;
  secondary?: string;
};

export function ManageList({
  items,
  deleteEndpoint,
  emptyLabel = "Nothing added yet.",
}: {
  items: ManageListItem[];
  deleteEndpoint: (id: string) => string;
  emptyLabel?: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onDelete(id: string, label: string) {
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setPendingId(id);
    setError(null);
    const res = await fetch(deleteEndpoint(id), { method: "DELETE" });
    setPendingId(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not delete this item.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {items.length === 0 && <p className="text-sm text-slate-400">{emptyLabel}</p>}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5"
        >
          <div>
            <p className="text-sm font-medium text-slate-800">{item.primary}</p>
            {item.secondary && <p className="text-xs text-slate-400">{item.secondary}</p>}
          </div>
          <button
            type="button"
            onClick={() => onDelete(item.id, item.primary)}
            disabled={pendingId === item.id}
            className="rounded-md p-1.5 text-rose-500 hover:bg-rose-50 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function InlineCreateForm({
  onSubmit,
  children,
  submitLabel = "Add",
}: {
  onSubmit: (formData: FormData) => Promise<{ error?: string }>;
  children: ReactNode;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await onSubmit(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    e.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      {children}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Adding..." : submitLabel}
      </button>
      {error && <p className="w-full text-sm text-rose-600">{error}</p>}
    </form>
  );
}
