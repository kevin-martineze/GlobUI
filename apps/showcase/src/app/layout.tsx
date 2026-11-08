import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { Toaster } from "@glob-ui/toast";
import "./globals.css";

const globSans = Bricolage_Grotesque({
  variable: "--font-glob-sans",
  subsets: ["latin"],
});

// Runs during HTML parsing, before first paint, so a stored theme never flashes.
// Keep in sync with THEME_KEY in page.tsx.
const themeScript = `try{var t=localStorage.getItem("glob-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`

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
      // The theme script sets data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
