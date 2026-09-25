/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // The form itself changes rarely once it's stable, so let browsers
        // hold onto it for a week instead of re-fetching (or even
        // re-validating) on every visit. "private" (not "public") keeps this
        // to each browser's own cache rather than any shared/corporate
        // proxy in between, since these files still sit behind Clerk auth.
        // If you push an update to public/intake-form/, staff on a machine
        // that already cached the old version won't see it until their
        // cache naturally expires (up to 7 days) or they hard-refresh
        // (Ctrl/Cmd+Shift+R) — see README's "Updating the form itself".
        source: "/intake-form/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, max-age=604800",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
