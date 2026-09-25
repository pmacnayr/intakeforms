import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isEmailAllowed } from "./lib/allowlist";

// Everything requires a signed-in session EXCEPT Clerk's own sign-in/sign-up
// pages. This matcher also covers /intake-form/* so the static form files in
// /public are gated too — Next's default behavior only protects page routes,
// not files served straight out of /public, so we have to say so explicitly.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/not-authorized",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    await auth.protect();
    return;
  }

  // Fast path: the email claim added via Clerk Dashboard → Sessions →
  // Customize session token ({ "email": "{{user.primary_email_address}}" }).
  let email =
    (sessionClaims?.email as string | undefined) ??
    (sessionClaims?.primaryEmailAddress as string | undefined);

  // Fallback when that claim isn't configured: look the user up via Clerk's
  // API. Only a verified primary email counts. This costs an API call per
  // request, so configuring the claim is still recommended.
  if (!email) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primary = user.primaryEmailAddress;
    if (primary?.verification?.status === "verified") {
      email = primary.emailAddress;
    }
  }

  if (!isEmailAllowed(email)) {
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
