/**
 * Safely serialize an object for embedding in a <script type="application/ld+json">
 * tag. JSON.stringify does not escape "<", so a value containing
 * "</script>" could break out of the tag and inject markup - escape it the
 * same way frameworks like Next.js's own head-manager do.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
