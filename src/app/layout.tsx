import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrowseLab | Ecommerce Search Results",
  description:
    "A portfolio-grade ecommerce search results experience with mock backend data, filtering, sorting, and flexible browsing modes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-zinc-100 text-zinc-950">
        {children}
      </body>
    </html>
  );
}
