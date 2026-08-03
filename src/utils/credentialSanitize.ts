/**
 * Strip paste artifacts (ZWSP/BOM/NBSP/newlines) that break login when
 * credentials are copied from email/password managers.
 * Safe for client + server import.
 */
export function sanitizeCredentialText(value: string): string {
  return value
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u2028\u2029]/g, '')
    .replace(/[\r\n\t]+/g, '')
    .trim();
}

/** Normalize identity for comparisons without leaking via case branches. */
export function normalizeIdentity(value: string): string {
  return sanitizeCredentialText(value).toLowerCase();
}

/** Sanitize password the same way on set and verify so paste always matches. */
export function sanitizePassword(value: string): string {
  return sanitizeCredentialText(value);
}
