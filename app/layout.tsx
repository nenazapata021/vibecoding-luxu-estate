import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxe Estate | Premium Real Estate & Sanctuary Homes",
  description: "Discover luxury modern homes, villas, penthouses, and apartments in exclusive locations. Find your sanctuary with Luxe Estate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background-light text-nordic-dark">
        {children}
      </body>
    </html>
  );
}

