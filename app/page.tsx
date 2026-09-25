import { UserButton } from "@clerk/nextjs";

// Signed-in landing page. Middleware already guarantees only an
// authenticated, allow-listed-domain user reaches this point.
// The actual intake form lives at /intake-form/index.html (static file,
// also gated by middleware) and is embedded below in an iframe so none of
// its existing vanilla-JS PDF logic has to be ported into React.
export default function Home() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          borderBottom: "1px solid #ddd",
          background: "#fafafa",
        }}
      >
        <strong>Client Intake</strong>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      <iframe
        src="/intake-form/index.html"
        title="Personal Injury Intake"
        style={{ flex: 1, border: "none" }}
      />
    </div>
  );
}
