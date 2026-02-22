import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Lil Amazon",
  description: "My project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
