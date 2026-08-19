"use client";

import { Input } from "@/components/ui/Field";
import { ManageList, InlineCreateForm, type ManageListItem } from "@/components/admin/ManageList";
import type { Category } from "@/types";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const items: ManageListItem[] = categories.map((c) => ({
    id: c.id,
    primary: c.name,
    secondary: c.slug,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Add Category</h2>
        <div className="mt-4">
          <InlineCreateForm
            onSubmit={async (formData) => {
              const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.get("name") }),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                return { error: data.error || "Could not add category." };
              }
              return {};
            }}
          >
            <div className="w-full max-w-xs">
              <Input name="name" placeholder="e.g. Renewable Energy" required />
            </div>
          </InlineCreateForm>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          All Categories ({categories.length})
        </h2>
        <ManageList items={items} deleteEndpoint={(id) => `/api/admin/categories/${id}`} />
      </div>
    </div>
  );
}
