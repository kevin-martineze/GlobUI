import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const globSans = Bricolage_Grotesque({
  variable: "--font-glob-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlobUI",
  description: "A component library for React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${globSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
