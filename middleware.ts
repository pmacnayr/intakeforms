import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Everything requires a signed-in session EXCEPT Clerk's own sign-in/sign-up
// pages. This matcher also covers /intake-form/* so the static form files in
// /public are gated too — Next's default behavior only protects page routes,
// not files served straight out of /public, so we have to say so explicitly.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/not-authorized",
]);

// Restrict to your firm's email domain even though the Microsoft OAuth
// connection itself might be left open to multiple tenants in Clerk's
// dashboard. Change this to your real domain (or set several).
const ALLOWED_EMAIL_DOMAINS = ["10xlaw.com"];

// Individual addresses allowed in regardless of domain (e.g. an admin's
// personal account). Keep these lowercase.
const ALLOWED_EMAILS = ["ryancampeau@gmail.com"];

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    await auth.protect();
    return;
  }

  const email =
    (sessionClaims?.email as string | undefined) ??
    (sessionClaims?.primaryEmailAddress as string | undefined) ??
    "";
  const normalizedEmail = email.trim().toLowerCase();
  const domain = normalizedEmail.split("@")[1];

  const allowed =
    ALLOWED_EMAILS.includes(normalizedEmail) ||
    ALLOWED_EMAIL_DOMAINS.includes(domain ?? "");

  if (!allowed) {
    return NextResponse.redirect(new URL("/not-authorized", req.url));
  }
});

export const config = {
  matcher: [
    // Protect every route, including static files in /public, except
    // Next's internals and the sign-in/sign-up UI's own assets.
    "/((?!_next/static|_next/image|favicon.ico).*)",
    "/(api|trpc)(.*)",
  ],
};
