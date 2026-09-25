import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

export const metadata = {
  title: "10X Law Intake",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
