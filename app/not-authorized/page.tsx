import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function NotAuthorized() {
  const user = await currentUser();
  const primary = user?.primaryEmailAddress;
  const unverified = primary && primary.verification?.status !== "verified";

  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh", textAlign: "center" }}>
      <div>
        <h1>Not authorized</h1>
        <p>This email address isn&apos;t approved to use the intake form.</p>
        {primary && (
          <p style={{ color: "#666" }}>
            Signed in as <strong>{primary.emailAddress}</strong>
            {unverified && " (not verified)"}
          </p>
        )}
        <SignOutButton>
          <button>Sign out and try a different account</button>
        </SignOutButton>
      </div>
    </div>
  );
}
