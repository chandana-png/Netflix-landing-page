import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netflix",
  description: "Netflix-style landing page powered by TMDB"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

