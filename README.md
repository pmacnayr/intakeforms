# 10X Law Intake — Clerk + Microsoft auth wrapper

This wraps the existing intake form (unchanged, at `public/intake-form/`) in
a minimal Next.js app so that no one can reach it without signing in with a
`@10xlaw.com` Microsoft 365 account. Auth is handled by Clerk; Clerk's
Microsoft connector talks to your Azure AD tenant on your behalf.

## What's here

- `middleware.ts` — runs on every request (including the static form files),
  requires a signed-in Clerk session, and checks the user's email domain.
- `app/page.tsx` — the signed-in landing page; embeds the untouched intake
  form in an iframe.
- `app/sign-in`, `app/sign-up` — Clerk's hosted auth UI.
- `app/not-authorized` — shown if someone signs in with a non-firm account.
- `public/intake-form/` — your existing form, copied in as-is.

## One-time setup

### 1. Create the Clerk app
1. Sign up at clerk.com, create an application.
2. Dashboard → **Configure → SSO Connections → Microsoft** → enable it.
   - For local testing you can use Clerk's shared dev credentials.
   - For production you must supply your own Azure AD app registration's
     **Client ID** and **Client Secret**. In Azure Portal: App registrations
     → New registration → note the redirect URI Clerk shows you and paste it
     into "Redirect URI" in Azure → generate a client secret under
     "Certificates & secrets" → paste both into Clerk.
   - Under "Supported account types" in Azure, choose single-tenant (only
     your firm) unless you specifically want other orgs' M365 users to be
     able to authenticate — the domain check in `middleware.ts` blocks
     everyone else regardless, so single-tenant is the simpler, redundant-safe
     choice.
3. Dashboard → **Configure → Sessions → Customize session token** → add:
   ```json
   { "email": "{{user.primary_email_address}}" }
   ```
   This is what lets `middleware.ts` read the signed-in user's email domain
   without an extra API call.
4. (Recommended for an internal tool) Dashboard → **Configure → Restrictions**
   → turn OFF public sign-up, and either invite staff individually or add
   `10xlaw.com` under allowlisted domains. This blocks account creation at
   the Clerk layer too, on top of the domain check in middleware — belt and
   suspenders.
5. Copy the Publishable Key and Secret Key from **API Keys** into
   `.env.local` (copy `.env.local.example` → `.env.local` first).

### 2. Update the allowed domain
Edit `ALLOWED_EMAIL_DOMAINS` in `middleware.ts` — it's `10xlaw.com` as a
placeholder.

### 3. Run locally
```
npm install
npm run dev
```
Visit `http://localhost:3000` — you should be redirected to sign in before
seeing the form.

### 4. Deploy
Push this folder to a GitHub repo and import it into Vercel (or any host
that runs Next.js). Add the same two env vars from `.env.local` in the
host's environment variable settings. Point your DNS (e.g.
`intake.10xlaw.com`) at it.

## Updating the form itself

The form's own files live at `public/intake-form/` — currently 7 files:
`index.html`, `logo.png`, `bodymap.png`, `pdf-data.js` (10X Law), and
`berman_logo.png`, `berman_bodymap.png`, `pdf-data-berman.js` (Berman Law
Group — the form has a toggle at the top to switch between the two firms).
To push a change to the form later, replace those files with the latest
version and redeploy — no changes needed elsewhere in this project.

One difference from the version of the form you edit inside Claude: the
download button here saves the PDF with a normal browser download (an
`<a download>` link) instead of Claude's own downloads API, since that API
only exists inside a Claude Artifact. This file already has that fallback
built in (see `savePdfBlob` near the bottom of `index.html`'s script) — if
you copy over a newer `index.html` from Claude, keep that function and the
`downloadBtn` handler that calls it, since the version straight out of
Claude assumes `window.claude` always exists.

## Notes

- The PDF is still built and downloaded entirely in the browser — nothing
  about the intake answers or the generated PDF is sent to Clerk or to this
  app's server. Clerk only ever sees who is logged in, not what they filled
  out.
- If someone tries to hit `/intake-form/index.html` directly without being
  signed in, `middleware.ts`'s matcher covers that path too, so they're
  bounced to sign-in first — the iframe on `/` isn't the only thing gating
  it.
