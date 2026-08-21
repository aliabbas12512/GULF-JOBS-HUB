export const SITE_NAME = "Gulf Job Hub";
export const SITE_TAGLINE = "Find Your Next Career in the Gulf";

// Google AdSense publisher account (site-wide, not a per-slot ad unit).
// Loads the adsbygoogle.js script and enables Auto ads / account
// verification. Individual ad units still need their own data-ad-slot
// codes, configured per-placement in Admin -> Site Settings -> Ad Slots.
export const ADSENSE_CLIENT_ID = "ca-pub-8319075361814777";

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  temporary: "Temporary",
  internship: "Internship",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  expired: "Expired",
};

export const JOBS_PER_PAGE = 12;

export const SALARY_CURRENCIES = [
  "SAR",
  "AED",
  "QAR",
  "KWD",
  "BHD",
  "OMR",
  "USD",
];
