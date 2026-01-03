import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DukaPilot - Smart Business Management",
  description: "Multi-tenant stock management and marketplace platform for modern businesses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
