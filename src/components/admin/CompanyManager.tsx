"use client";

import { Input } from "@/components/ui/Field";
import { ManageList, InlineCreateForm, type ManageListItem } from "@/components/admin/ManageList";
import type { Company } from "@/types";

export function CompanyManager({ companies }: { companies: Company[] }) {
  const items: ManageListItem[] = companies.map((c) => ({
    id: c.id,
    primary: c.name,
    secondary: c.logo_url ?? undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Add Company</h2>
        <div className="mt-4">
          <InlineCreateForm
            onSubmit={async (formData) => {
              const res = await fetch("/api/admin/companies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: formData.get("name"),
                  logoUrl: formData.get("logoUrl"),
                }),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                return { error: data.error || "Could not add company." };
              }
              return {};
            }}
          >
            <div className="w-full max-w-xs">
              <Input name="name" placeholder="Company name" required />
            </div>
            <div className="w-full max-w-xs">
              <Input name="logoUrl" placeholder="Logo URL (optional)" type="url" />
            </div>
          </InlineCreateForm>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          All Companies ({companies.length})
        </h2>
        <ManageList items={items} deleteEndpoint={(id) => `/api/admin/companies/${id}`} />
      </div>
    </div>
  );
}
