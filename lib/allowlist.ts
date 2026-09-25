// Only staff at these firms' email domains can reach the form, even if
// Clerk's own sign-up is left open to anyone.
export const ALLOWED_EMAIL_DOMAINS = ["10xlaw.com", "thebermanlawgroup.com"];

// Individual addresses allowed in regardless of domain (e.g. an admin's
// personal account). Keep these lowercase.
export const ALLOWED_EMAILS: string[] = [];

export function isEmailAllowed(email: string | null | undefined): boolean {
  const normalizedEmail = (email ?? "").trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];
  return (
    ALLOWED_EMAILS.includes(normalizedEmail) ||
    ALLOWED_EMAIL_DOMAINS.includes(domain ?? "")
  );
}
