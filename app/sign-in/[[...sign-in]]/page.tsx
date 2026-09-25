import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <SignIn
        // Send people straight to Microsoft instead of showing every
        // sign-in method Clerk supports. Remove this if you'd rather let
        // people choose (e.g. email/password as a backup for IT).
        initialValues={{}}
        appearance={{ elements: { footer: { display: "none" } } }}
      />
    </div>
  );
}
