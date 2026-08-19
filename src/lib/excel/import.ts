import * as XLSX from "xlsx";
import { z } from "zod";
import {
  TEMPLATE_COLUMNS,
  REQUIRED_COLUMNS,
  EMPLOYMENT_TYPE_MAP,
  STATUS_MAP,
  type TemplateColumn,
} from "./columns";
import type { Category, Country, Location } from "@/types";

export type ParsedRawRow = Record<TemplateColumn, string>;

export type NormalizedJobRow = {
  rowNumber: number;
  title: string;
  companyName: string;
  countryId: string;
  locationId: string;
  locationDetail: string | null;
  categoryId: string;
  employmentType: "full_time" | "part_time" | "contract" | "temporary" | "internship";
  experienceMin: number | null;
  experienceMax: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  qualifications: string | null;
  benefits: string | null;
  whatsappNumber: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  reference: string | null;
  applicationDeadline: string | null;
  status: "draft" | "published" | "expired";
};

export type InvalidRow = {
  rowNumber: number;
  errors: string[];
  data: Partial<ParsedRawRow>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/octet-stream",
  "application/zip",
];

export function validateFileMeta(file: { name: string; type: string; size: number }): string | null {
  if (!file.name.toLowerCase().endsWith(".xlsx")) {
    return "Only .xlsx files are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size is 5MB.";
  }
  if (file.type && !ALLOWED_MIME.includes(file.type)) {
    return "Unrecognized file type. Please upload a valid .xlsx file.";
  }
  return null;
}

export function parseWorkbook(buffer: Buffer): ParsedRawRow[] {
  // Untrusted admin-uploaded file: parse defensively, values-only, no formula
  // evaluation / macro execution (xlsx never executes macros; cellFormula is
  // left disabled by default here).
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: false, cellFormula: false });
  const sheetName = wb.SheetNames.includes("Jobs") ? "Jobs" : wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });
  return rows.map((row) => {
    const normalized: Partial<ParsedRawRow> = {};
    for (const col of TEMPLATE_COLUMNS) {
      const value = row[col];
      normalized[col] = value == null ? "" : String(value).trim();
    }
    return normalized as ParsedRawRow;
  });
}

const emailCheck = z.string().email();

export function validateRows(
  rawRows: ParsedRawRow[],
  refData: { countries: Country[]; categories: Category[]; locations: Location[] }
): { valid: NormalizedJobRow[]; invalid: InvalidRow[] } {
  const valid: NormalizedJobRow[] = [];
  const invalid: InvalidRow[] = [];

  const countryByName = new Map(refData.countries.map((c) => [c.name.toLowerCase(), c]));
  const categoryByName = new Map(refData.categories.map((c) => [c.name.toLowerCase(), c]));
  const seenReferences = new Set<string>();

  rawRows.forEach((raw, idx) => {
    const rowNumber = idx + 2; // header is row 1
    const errors: string[] = [];

    for (const col of REQUIRED_COLUMNS) {
      if (!raw[col] || raw[col].trim() === "") {
        errors.push(`Missing ${col}`);
      }
    }

    const country = raw.Country ? countryByName.get(raw.Country.toLowerCase()) : undefined;
    if (raw.Country && !country) errors.push(`Invalid Country: "${raw.Country}"`);

    let location: Location | undefined;
    if (raw.City && country) {
      location = refData.locations.find(
        (l) => l.country_id === country.id && l.name.toLowerCase() === raw.City.toLowerCase()
      );
      if (!location) errors.push(`Invalid City: "${raw.City}" for country "${raw.Country}"`);
    }

    const category = raw.Category ? categoryByName.get(raw.Category.toLowerCase()) : undefined;
    if (raw.Category && !category) errors.push(`Invalid Category: "${raw.Category}"`);

    const employmentType = raw["Employment Type"]
      ? EMPLOYMENT_TYPE_MAP[raw["Employment Type"].toLowerCase()]
      : undefined;
    if (raw["Employment Type"] && !employmentType) {
      errors.push(`Invalid Employment Type: "${raw["Employment Type"]}"`);
    }

    const status = raw.Status ? STATUS_MAP[raw.Status.toLowerCase()] : undefined;
    if (raw.Status && !status) errors.push(`Invalid Status: "${raw.Status}"`);

    if (raw.Email && !emailCheck.safeParse(raw.Email).success) {
      errors.push(`Invalid Email: "${raw.Email}"`);
    }

    let applicationDeadline: string | null = null;
    if (raw["Application Deadline"]) {
      const d = new Date(raw["Application Deadline"]);
      if (Number.isNaN(d.getTime())) {
        errors.push(`Invalid Application Deadline: "${raw["Application Deadline"]}"`);
      } else {
        applicationDeadline = d.toISOString().slice(0, 10);
      }
    }

    const parseNum = (val: string, label: string): number | null => {
      if (!val) return null;
      const n = Number(val);
      if (Number.isNaN(n)) {
        errors.push(`Invalid ${label}: "${val}"`);
        return null;
      }
      return n;
    };

    const experienceMin = parseNum(raw["Experience Min"], "Experience Min");
    const experienceMax = parseNum(raw["Experience Max"], "Experience Max");
    const salaryMin = parseNum(raw["Salary Min"], "Salary Min");
    const salaryMax = parseNum(raw["Salary Max"], "Salary Max");

    if (raw["Job Reference"]) {
      const ref = raw["Job Reference"].trim();
      if (seenReferences.has(ref.toLowerCase())) {
        errors.push(`Duplicate Job Reference in file: "${ref}"`);
      }
      seenReferences.add(ref.toLowerCase());
    }

    if (errors.length > 0) {
      invalid.push({ rowNumber, errors, data: raw });
      return;
    }

    valid.push({
      rowNumber,
      title: raw["Job Title"],
      companyName: raw["Company Name"],
      countryId: country!.id,
      locationId: location!.id,
      locationDetail: raw.Location || null,
      categoryId: category!.id,
      employmentType: employmentType as NormalizedJobRow["employmentType"],
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      salaryCurrency: raw["Salary Currency"]?.toUpperCase() || "USD",
      description: raw["Job Description"],
      responsibilities: raw.Responsibilities || null,
      requirements: raw.Requirements || null,
      qualifications: raw.Qualifications || null,
      benefits: raw.Benefits || null,
      whatsappNumber: raw.WhatsApp || null,
      contactEmail: raw.Email || null,
      phoneNumber: raw.Phone || null,
      reference: raw["Job Reference"] || null,
      applicationDeadline,
      status: status as NormalizedJobRow["status"],
    });
  });

  return { valid, invalid };
}

// Neutralize CSV/Excel formula injection: a cell starting with =, +, - or @
// is interpreted as a formula by Excel when the sheet is reopened. Since
// these values are echoed back from an uploaded file, prefix them with a
// tab so they round-trip as inert text.
function sanitizeCell(value: string): string {
  return /^[=+\-@]/.test(value) ? `\t${value}` : value;
}

export function buildErrorReportWorkbook(invalid: InvalidRow[]): Buffer {
  const wb = XLSX.utils.book_new();
  const rows = [
    ["Row", "Errors", ...TEMPLATE_COLUMNS],
    ...invalid.map((r) => [
      r.rowNumber,
      sanitizeCell(r.errors.join("; ")),
      ...TEMPLATE_COLUMNS.map((c) => sanitizeCell(String(r.data[c] ?? ""))),
    ]),
  ];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet["!cols"] = [{ wch: 6 }, { wch: 50 }, ...TEMPLATE_COLUMNS.map(() => ({ wch: 20 }))];
  XLSX.utils.book_append_sheet(wb, sheet, "Errors");
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
