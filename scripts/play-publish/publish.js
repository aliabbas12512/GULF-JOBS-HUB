#!/usr/bin/env node
/**
 * Publishes Gulf Job Hub's Android app bundle to Google Play.
 *
 * Requires two things that must be supplied via environment variables,
 * never hardcoded here or committed to git:
 *
 *   GOOGLE_SERVICE_ACCOUNT_JSON  - path to the service account key file,
 *                                  downloaded from Google Cloud Console,
 *                                  linked to your app in Play Console
 *                                  under Setup -> API access.
 *   AAB_PATH                     - path to the signed .aab file generated
 *                                  by PWABuilder (or Bubblewrap).
 *
 * Optional:
 *   PACKAGE_NAME  (default: co.median.android.lpqyqnb - the Median.co
 *                  app ID for Gulf Job Hub; override if you rebuild
 *                  under a different package)
 *   TRACK         (default: internal - use "production" only when ready
 *                  to go live to everyone)
 *
 * What this script does NOT cover (Google's public API has no endpoint
 * for these - they must be completed once, manually, in the Play Console
 * UI before the app can go live):
 *   - Content rating questionnaire
 *   - Some parts of the Data Safety form (basic fields are attempted here
 *     where the API supports them; verify in the Play Console UI)
 *
 * Usage:
 *   GOOGLE_SERVICE_ACCOUNT_JSON=/path/to/key.json \
 *   AAB_PATH=/path/to/app.aab \
 *   node publish.js
 */

const fs = require("fs");
const { google } = require("googleapis");

const PACKAGE_NAME = process.env.PACKAGE_NAME || "co.median.android.lpqyqnb";
const TRACK = process.env.TRACK || "internal";
const SERVICE_ACCOUNT_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const AAB_PATH = process.env.AAB_PATH;

const APP_TITLE = "Gulf Job Hub";
const SHORT_DESCRIPTION =
  "Find your next career across Saudi Arabia, UAE, Qatar, Kuwait, Bahrain and Oman.";
const FULL_DESCRIPTION = `Gulf Job Hub is a dedicated job search platform for the Gulf region, covering Saudi Arabia, the United Arab Emirates, Qatar, Kuwait, Bahrain and Oman.

FIND JOBS FAST
Browse the latest openings across Engineering, Construction, Oil & Gas, IT & Software, Healthcare, Finance, Sales, Hospitality, and many more industries. Filter by location, category, employment type and experience level to find exactly what you're looking for.

APPLY DIRECTLY
No lengthy forms. Apply to any job in seconds via WhatsApp, email or a direct phone call - straight to the employer.

STAY UPDATED
New jobs are added regularly. Search and browse by country or city across every major Gulf location.

Gulf Job Hub is built for job seekers who want a fast, clean, and reliable way to find their next opportunity in the Gulf.`;

function requireEnv(name, value) {
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  requireEnv("GOOGLE_SERVICE_ACCOUNT_JSON", SERVICE_ACCOUNT_PATH);
  requireEnv("AAB_PATH", AAB_PATH);

  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`Service account file not found: ${SERVICE_ACCOUNT_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(AAB_PATH)) {
    console.error(`AAB file not found: ${AAB_PATH}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ["https://www.googleapis.com/auth/androidpublisher"],
  });

  const androidpublisher = google.androidpublisher({ version: "v3", auth });

  console.log(`Creating edit for ${PACKAGE_NAME}...`);
  const edit = await androidpublisher.edits.insert({ packageName: PACKAGE_NAME });
  const editId = edit.data.id;
  console.log(`Edit created: ${editId}`);

  console.log(`Uploading ${AAB_PATH}...`);
  const bundle = await androidpublisher.edits.bundles.upload({
    packageName: PACKAGE_NAME,
    editId,
    media: { mimeType: "application/octet-stream", body: fs.createReadStream(AAB_PATH) },
  });
  const versionCode = bundle.data.versionCode;
  console.log(`Uploaded. versionCode: ${versionCode}`);

  console.log(`Assigning versionCode ${versionCode} to track "${TRACK}"...`);
  await androidpublisher.edits.tracks.update({
    packageName: PACKAGE_NAME,
    editId,
    track: TRACK,
    requestBody: {
      track: TRACK,
      releases: [
        {
          versionCodes: [String(versionCode)],
          status: "completed",
        },
      ],
    },
  });

  console.log("Updating store listing (en-US)...");
  await androidpublisher.edits.listings.update({
    packageName: PACKAGE_NAME,
    editId,
    language: "en-US",
    requestBody: {
      language: "en-US",
      title: APP_TITLE,
      shortDescription: SHORT_DESCRIPTION,
      fullDescription: FULL_DESCRIPTION,
    },
  });

  console.log("Committing edit...");
  await androidpublisher.edits.commit({ packageName: PACKAGE_NAME, editId });

  console.log("\nDone. Release created on track:", TRACK);
  console.log(
    "Next: open Play Console -> your app -> check the Content rating questionnaire and Data Safety form are complete, then promote the release from",
    TRACK,
    "to Production when ready."
  );
}

main().catch((err) => {
  console.error("\nPublish failed:");
  console.error(err.response?.data ? JSON.stringify(err.response.data, null, 2) : err);
  process.exit(1);
});
