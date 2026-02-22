import type { Metadata } from "next";
import "./globals.css";
import Header from "./UI/Header/Header";

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
        <Header />
        <div className="page-wrapper">{children}</div>
      </body>
    </html>
  );
}
