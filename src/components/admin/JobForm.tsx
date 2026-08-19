"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Select, Textarea, FieldHint } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EMPLOYMENT_TYPE_LABELS, SALARY_CURRENCIES } from "@/lib/constants";
import type { Country, Location, Category, JobWithRelations } from "@/types";

type Props = {
  mode: "create" | "edit";
  jobId?: string;
  countries: Country[];
  locations: Location[];
  categories: Category[];
  initialJob?: JobWithRelations;
};

export function JobForm({ mode, jobId, countries, locations, categories, initialJob }: Props) {
  const router = useRouter();
  const [countryId, setCountryId] = useState(initialJob?.country_id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredLocations = useMemo(
    () => locations.filter((l) => l.country_id === countryId),
    [locations, countryId]
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      companyName: form.get("companyName"),
      companyLogoUrl: form.get("companyLogoUrl") || null,
      countryId: form.get("countryId"),
      locationId: form.get("locationId"),
      locationDetail: form.get("locationDetail") || null,
      categoryId: form.get("categoryId"),
      employmentType: form.get("employmentType"),
      experienceMin: form.get("experienceMin") || null,
      experienceMax: form.get("experienceMax") || null,
      salaryMin: form.get("salaryMin") || null,
      salaryMax: form.get("salaryMax") || null,
      salaryCurrency: form.get("salaryCurrency"),
      salaryIsVisible: form.get("salaryIsVisible") === "on",
      description: form.get("description"),
      responsibilities: form.get("responsibilities") || null,
      requirements: form.get("requirements") || null,
      qualifications: form.get("qualifications") || null,
      benefits: form.get("benefits") || null,
      whatsappNumber: form.get("whatsappNumber") || null,
      contactEmail: form.get("contactEmail") || null,
      phoneNumber: form.get("phoneNumber") || null,
      reference: form.get("reference") || null,
      applicationDeadline: form.get("applicationDeadline") || null,
      publishedDate: form.get("publishedDate") || null,
      status: form.get("status"),
    };

    const url = mode === "create" ? "/api/admin/jobs" : `/api/admin/jobs/${jobId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save this job. Please check the form and try again.");
      setLoading(false);
      return;
    }

    router.push("/admin/jobs");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <FormSection title="Job Basics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title" required>
              Job Title
            </Label>
            <Input id="title" name="title" defaultValue={initialJob?.title} required />
          </div>

          <div>
            <Label htmlFor="companyName" required>
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              defaultValue={initialJob?.company?.name}
              required
            />
          </div>

          <div>
            <Label htmlFor="companyLogoUrl">Company Logo URL</Label>
            <Input
              id="companyLogoUrl"
              name="companyLogoUrl"
              type="url"
              placeholder="https://..."
              defaultValue={initialJob?.company?.logo_url ?? ""}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Location & Category">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="countryId" required>
              Country
            </Label>
            <Select
              id="countryId"
              name="countryId"
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              required
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="locationId" required>
              City
            </Label>
            <Select
              id="locationId"
              name="locationId"
              defaultValue={initialJob?.location_id ?? ""}
              required
              disabled={!countryId}
            >
              <option value="">Select city</option>
              {filteredLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
            <FieldHint>Select a country first</FieldHint>
          </div>

          <div>
            <Label htmlFor="categoryId" required>
              Category
            </Label>
            <Select id="categoryId" name="categoryId" defaultValue={initialJob?.category_id ?? ""} required>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <Label htmlFor="locationDetail">Location (area/district detail)</Label>
            <Input
              id="locationDetail"
              name="locationDetail"
              placeholder="e.g. Al Olaya District"
              defaultValue={initialJob?.location_detail ?? ""}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Employment Details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="employmentType" required>
              Employment Type
            </Label>
            <Select
              id="employmentType"
              name="employmentType"
              defaultValue={initialJob?.employment_type ?? "full_time"}
              required
            >
              {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="experienceMin">Experience Min (years)</Label>
            <Input
              id="experienceMin"
              name="experienceMin"
              type="number"
              min={0}
              max={50}
              defaultValue={initialJob?.experience_min ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="experienceMax">Experience Max (years)</Label>
            <Input
              id="experienceMax"
              name="experienceMax"
              type="number"
              min={0}
              max={50}
              defaultValue={initialJob?.experience_max ?? ""}
            />
          </div>

          <div>
            <Label htmlFor="status" required>
              Job Status
            </Label>
            <Select id="status" name="status" defaultValue={initialJob?.status ?? "draft"} required>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="expired">Expired</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="salaryMin">Salary Min</Label>
            <Input id="salaryMin" name="salaryMin" type="number" min={0} defaultValue={initialJob?.salary_min ?? ""} />
          </div>
          <div>
            <Label htmlFor="salaryMax">Salary Max</Label>
            <Input id="salaryMax" name="salaryMax" type="number" min={0} defaultValue={initialJob?.salary_max ?? ""} />
          </div>
          <div>
            <Label htmlFor="salaryCurrency">Currency</Label>
            <Select id="salaryCurrency" name="salaryCurrency" defaultValue={initialJob?.salary_currency ?? "SAR"}>
              {SALARY_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="salaryIsVisible"
                defaultChecked={initialJob?.salary_is_visible ?? true}
                className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Show salary publicly
            </label>
          </div>

          <div>
            <Label htmlFor="publishedDate">Published Date</Label>
            <Input
              id="publishedDate"
              name="publishedDate"
              type="date"
              defaultValue={initialJob?.published_date ?? new Date().toISOString().slice(0, 10)}
            />
          </div>
          <div>
            <Label htmlFor="applicationDeadline">Application Deadline</Label>
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              defaultValue={initialJob?.application_deadline ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="reference">Job Reference</Label>
            <Input
              id="reference"
              name="reference"
              placeholder="Auto-generated if left blank"
              defaultValue={initialJob?.reference ?? ""}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Job Content">
        <div className="space-y-5">
          <div>
            <Label htmlFor="description" required>
              Job Description
            </Label>
            <Textarea id="description" name="description" required defaultValue={initialJob?.description} />
          </div>
          <div>
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              defaultValue={initialJob?.responsibilities ?? ""}
            />
            <FieldHint>One item per line</FieldHint>
          </div>
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea id="requirements" name="requirements" defaultValue={initialJob?.requirements ?? ""} />
            <FieldHint>One item per line</FieldHint>
          </div>
          <div>
            <Label htmlFor="qualifications">Qualifications</Label>
            <Textarea
              id="qualifications"
              name="qualifications"
              defaultValue={initialJob?.qualifications ?? ""}
            />
            <FieldHint>One item per line</FieldHint>
          </div>
          <div>
            <Label htmlFor="benefits">Benefits</Label>
            <Textarea id="benefits" name="benefits" defaultValue={initialJob?.benefits ?? ""} />
            <FieldHint>One item per line</FieldHint>
          </div>
        </div>
      </FormSection>

      <FormSection title="Application Contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              placeholder="966500000000"
              defaultValue={initialJob?.whatsapp_number ?? ""}
            />
            <FieldHint>Digits only, with country code</FieldHint>
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={initialJob?.contact_email ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" defaultValue={initialJob?.phone_number ?? ""} />
          </div>
        </div>
      </FormSection>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
        <Button href="/admin/jobs" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : mode === "create" ? "Publish Job" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}
