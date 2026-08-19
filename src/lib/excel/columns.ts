export const TEMPLATE_COLUMNS = [
  "Job Title",
  "Company Name",
  "Country",
  "City",
  "Location",
  "Category",
  "Employment Type",
  "Experience Min",
  "Experience Max",
  "Salary Min",
  "Salary Max",
  "Salary Currency",
  "Job Description",
  "Responsibilities",
  "Requirements",
  "Qualifications",
  "Benefits",
  "WhatsApp",
  "Email",
  "Phone",
  "Job Reference",
  "Application Deadline",
  "Status",
] as const;

export type TemplateColumn = (typeof TEMPLATE_COLUMNS)[number];

export const REQUIRED_COLUMNS: TemplateColumn[] = [
  "Job Title",
  "Company Name",
  "Country",
  "City",
  "Category",
  "Employment Type",
  "Job Description",
  "Status",
];

export const EMPLOYMENT_TYPE_VALUES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Temporary",
  "Internship",
];

export const STATUS_VALUES = ["Draft", "Published", "Expired"];

export const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "full time": "full_time",
  fulltime: "full_time",
  "part time": "part_time",
  parttime: "part_time",
  contract: "contract",
  temporary: "temporary",
  internship: "internship",
};

export const STATUS_MAP: Record<string, string> = {
  draft: "draft",
  published: "published",
  publish: "published",
  expired: "expired",
};

export const EXAMPLE_ROW: Record<TemplateColumn, string | number> = {
  "Job Title": "Senior Civil Engineer",
  "Company Name": "Al Falak Engineering Group",
  Country: "Saudi Arabia",
  City: "Riyadh",
  Location: "Al Olaya District",
  Category: "Civil",
  "Employment Type": "Full Time",
  "Experience Min": 5,
  "Experience Max": 9,
  "Salary Min": 12000,
  "Salary Max": 16000,
  "Salary Currency": "SAR",
  "Job Description": "Lead structural design and site execution for large-scale commercial developments.",
  Responsibilities: "Lead civil design reviews\nCoordinate with structural and MEP teams\nSupervise site engineers",
  Requirements: "Bachelor's degree in Civil Engineering\n5+ years GCC experience",
  Qualifications: "BSc Civil Engineering",
  Benefits: "Housing allowance\nAnnual flight ticket\nMedical insurance",
  WhatsApp: "966500000001",
  Email: "careers@example.com",
  Phone: "966112220001",
  "Job Reference": "",
  "Application Deadline": "",
  Status: "Published",
};
