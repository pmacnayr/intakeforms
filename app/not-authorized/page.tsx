import { SignOutButton } from "@clerk/nextjs";

export default function NotAuthorized() {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh", textAlign: "center" }}>
      <div>
        <h1>Not authorized</h1>
        <p>Your Microsoft account isn&apos;t on the approved firm domain.</p>
        <SignOutButton>
          <button>Sign out and try a different account</button>
        </SignOutButton>
      </div>
    </div>
  );
}
