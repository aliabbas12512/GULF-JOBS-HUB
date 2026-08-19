"use client";

import { Input, Select } from "@/components/ui/Field";
import { ManageList, InlineCreateForm, type ManageListItem } from "@/components/admin/ManageList";
import type { Country, Location } from "@/types";

export function LocationManager({
  countries,
  locations,
}: {
  countries: Country[];
  locations: Location[];
}) {
  const countryById = new Map(countries.map((c) => [c.id, c]));
  const items: ManageListItem[] = locations.map((l) => ({
    id: l.id,
    primary: l.name,
    secondary: countryById.get(l.country_id)?.name ?? "",
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Add City</h2>
        <div className="mt-4">
          <InlineCreateForm
            onSubmit={async (formData) => {
              const res = await fetch("/api/admin/locations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: formData.get("name"),
                  countryId: formData.get("countryId"),
                }),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                return { error: data.error || "Could not add city." };
              }
              return {};
            }}
          >
            <div className="w-full max-w-xs">
              <Select name="countryId" required defaultValue="">
                <option value="" disabled>
                  Select country
                </option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-full max-w-xs">
              <Input name="name" placeholder="e.g. Al Khobar" required />
            </div>
          </InlineCreateForm>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          All Cities ({locations.length})
        </h2>
        <ManageList items={items} deleteEndpoint={(id) => `/api/admin/locations/${id}`} />
      </div>
    </div>
  );
}
