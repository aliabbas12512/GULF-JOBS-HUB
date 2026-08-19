import type { Tables } from "./database";

export type Job = Tables<"jobs">;
export type Company = Tables<"companies">;
export type Category = Tables<"categories">;
export type Country = Tables<"countries">;
export type Location = Tables<"locations">;
export type Admin = Tables<"admins">;
export type AppUser = Tables<"users">;
export type SiteSettings = Tables<"site_settings">;
export type JobEvent = Tables<"job_events">;

export type JobWithRelations = Job & {
  company: Company | null;
  category: Category | null;
  country: Country | null;
  location: Location | null;
};

export type EmploymentType = Job["employment_type"];
export type JobStatus = Job["status"];

export type AdSlots = {
  header_enabled: boolean;
  homepage_enabled: boolean;
  jobs_page_enabled: boolean;
  job_details_enabled: boolean;
  sidebar_enabled: boolean;
  header_code: string;
  homepage_code: string;
  jobs_page_code: string;
  job_details_code: string;
  sidebar_code: string;
};

export type SocialLinks = {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "jobseeker";
};
