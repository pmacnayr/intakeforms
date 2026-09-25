import { SignUp } from "@clerk/nextjs";

// Included for completeness, but for an internal staff tool you'll likely
// want self-serve sign-up OFF (invite-only instead) — see README.
export default function SignUpPage() {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <SignUp />
    </div>
  );
}
