import * as XLSX from "xlsx";
import {
  TEMPLATE_COLUMNS,
  REQUIRED_COLUMNS,
  EMPLOYMENT_TYPE_VALUES,
  STATUS_VALUES,
  EXAMPLE_ROW,
} from "./columns";

export function buildTemplateWorkbook(options: {
  countries: string[];
  categories: string[];
}): Buffer {
  const wb = XLSX.utils.book_new();

  const jobsSheetData: (string | number)[][] = [
    [...TEMPLATE_COLUMNS],
    TEMPLATE_COLUMNS.map((c) => EXAMPLE_ROW[c]),
  ];
  const jobsSheet = XLSX.utils.aoa_to_sheet(jobsSheetData);
  jobsSheet["!cols"] = TEMPLATE_COLUMNS.map((c) => ({
    wch: Math.max(16, Math.min(40, c.length + 6)),
  }));
  XLSX.utils.book_append_sheet(wb, jobsSheet, "Jobs");

  const instructions = [
    ["Gulf Job Hub - Bulk Job Upload Template"],
    [""],
    ["How to use this template:"],
    ["1. Fill one row per job in the 'Jobs' sheet. Do not change the header row."],
    ["2. Keep the example row as a reference, or delete it before uploading."],
    ["3. Required columns must not be left empty:"],
    [REQUIRED_COLUMNS.join(", ")],
    ["4. 'Country' and 'City' must exactly match values on the 'Accepted Values' sheet."],
    ["5. 'Category' must exactly match a value on the 'Accepted Values' sheet."],
    ["6. 'Employment Type' must be one of: " + EMPLOYMENT_TYPE_VALUES.join(", ")],
    ["7. 'Status' must be one of: " + STATUS_VALUES.join(", ") + ". Published jobs go live immediately; Draft jobs stay hidden."],
    ["8. 'Job Reference' can be left blank - a unique reference is generated automatically."],
    ["9. 'Application Deadline' format: YYYY-MM-DD (e.g. 2026-12-31). Leave blank if not applicable."],
    ["10. For multi-line fields (Responsibilities, Requirements, Qualifications, Benefits), put one item per line within the cell (Alt+Enter in Excel)."],
    ["11. Salary fields are optional numbers only (no currency symbols)."],
    ["12. Save the file as .xlsx and upload it on the Bulk Job Upload page."],
    [""],
    ["Column reference:"],
    ["Job Title", "Required. The job title."],
    ["Company Name", "Required. Created automatically if it does not exist yet."],
    ["Country", "Required. Must match Accepted Values sheet."],
    ["City", "Required. Must match Accepted Values sheet (belongs to the Country)."],
    ["Location", "Optional. Free-text area/district/address detail."],
    ["Category", "Required. Must match Accepted Values sheet."],
    ["Employment Type", "Required. One of the accepted employment types."],
    ["Experience Min / Max", "Optional. Whole numbers of years."],
    ["Salary Min / Max / Currency", "Optional. Numbers only; currency is a 3-letter code (e.g. SAR)."],
    ["Job Description", "Required. Full job description."],
    ["Responsibilities / Requirements / Qualifications / Benefits", "Optional. One item per line."],
    ["WhatsApp / Email / Phone", "Optional. Used for the Apply buttons on the job page."],
    ["Job Reference", "Optional. Auto-generated if left blank."],
    ["Application Deadline", "Optional. YYYY-MM-DD."],
    ["Status", "Required. Draft, Published or Expired."],
  ];
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructions);
  instructionsSheet["!cols"] = [{ wch: 34 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, instructionsSheet, "Instructions");

  const acceptedRows: (string | number)[][] = [
    ["Countries", "Categories", "Employment Types", "Status"],
  ];
  const maxLen = Math.max(
    options.countries.length,
    options.categories.length,
    EMPLOYMENT_TYPE_VALUES.length,
    STATUS_VALUES.length
  );
  for (let i = 0; i < maxLen; i++) {
    acceptedRows.push([
      options.countries[i] ?? "",
      options.categories[i] ?? "",
      EMPLOYMENT_TYPE_VALUES[i] ?? "",
      STATUS_VALUES[i] ?? "",
    ]);
  }
  const acceptedSheet = XLSX.utils.aoa_to_sheet(acceptedRows);
  acceptedSheet["!cols"] = [{ wch: 22 }, { wch: 22 }, { wch: 20 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, acceptedSheet, "Accepted Values");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buf as Buffer;
}
