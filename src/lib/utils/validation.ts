import { z } from "zod";

export const employmentTypeEnum = z.enum([
  "full_time",
  "part_time",
  "contract",
  "temporary",
  "internship",
]);

export const jobStatusEnum = z.enum(["draft", "published", "expired"]);

export const jobFormSchema = z.object({
  title: z.string().trim().min(3, "Job title is required"),
  companyName: z.string().trim().min(1, "Company name is required"),
  companyLogoUrl: z.string().trim().optional().nullable(),
  countryId: z.string().uuid("Select a country"),
  locationId: z.string().uuid("Select a city"),
  locationDetail: z.string().trim().optional().nullable(),
  categoryId: z.string().uuid("Select a category"),
  employmentType: employmentTypeEnum,
  experienceMin: z.coerce.number().int().min(0).max(50).optional().nullable(),
  experienceMax: z.coerce.number().int().min(0).max(50).optional().nullable(),
  salaryMin: z.coerce.number().min(0).optional().nullable(),
  salaryMax: z.coerce.number().min(0).optional().nullable(),
  salaryCurrency: z.string().min(3).max(3).default("SAR"),
  salaryIsVisible: z.boolean().default(true),
  description: z.string().trim().min(20, "Job description is required"),
  responsibilities: z.string().trim().optional().nullable(),
  requirements: z.string().trim().optional().nullable(),
  qualifications: z.string().trim().optional().nullable(),
  benefits: z.string().trim().optional().nullable(),
  whatsappNumber: z.string().trim().optional().nullable(),
  contactEmail: z
    .string()
    .trim()
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "Invalid email",
    })
    .optional()
    .nullable(),
  phoneNumber: z.string().trim().optional().nullable(),
  reference: z.string().trim().optional().nullable(),
  applicationDeadline: z.string().trim().optional().nullable(),
  publishedDate: z.string().trim().optional().nullable(),
  status: jobStatusEnum.default("draft"),
});

export type JobFormInput = z.infer<typeof jobFormSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const settingsSchema = z.object({
  siteName: z.string().trim().min(1),
  tagline: z.string().trim().min(1),
  logoUrl: z.string().trim().optional().nullable(),
  contactEmail: z.string().trim().email(),
  whatsappNumber: z.string().trim().optional().nullable(),
  phoneNumber: z.string().trim().optional().nullable(),
  seoTitle: z.string().trim().min(1),
  seoDescription: z.string().trim().min(1),
  facebook: z.string().trim().optional().nullable(),
  twitter: z.string().trim().optional().nullable(),
  linkedin: z.string().trim().optional().nullable(),
  instagram: z.string().trim().optional().nullable(),
  headerEnabled: z.boolean().default(false),
  homepageEnabled: z.boolean().default(false),
  jobsPageEnabled: z.boolean().default(false),
  jobDetailsEnabled: z.boolean().default(false),
  sidebarEnabled: z.boolean().default(false),
  headerCode: z.string().optional().nullable(),
  homepageCode: z.string().optional().nullable(),
  jobsPageCode: z.string().optional().nullable(),
  jobDetailsCode: z.string().optional().nullable(),
  sidebarCode: z.string().optional().nullable(),
});
