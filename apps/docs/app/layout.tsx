import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Bricolage_Grotesque } from "next/font/google"
import { RootProvider } from "fumadocs-ui/provider/next"
import { Toaster } from "@glob-ui/toast"
import "./global.css"

const globSans = Bricolage_Grotesque({
  variable: "--font-glob-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "GlobUI",
    template: "%s – GlobUI",
  },
  description: "An accessible React component library. One package per component, design tokens, dark mode.",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/brand/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: "GlobUI",
    description: "An accessible React component library. One package per component, design tokens, dark mode.",
    images: [{ url: "/brand/og.png", width: 1200, height: 630, alt: "GlobUI: an accessible React component library" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og.png"],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${globSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        {/*
         * One toggle drives both systems: next-themes sets `class` (Fumadocs' .dark) and
         * `data-theme` (GlobUI's tokens) on <html>. The blocking script runs before paint.
         */}
        <RootProvider
          theme={{
            attribute: ["class", "data-theme"],
            defaultTheme: "system",
            enableSystem: true,
          }}
        >
          {children}
        </RootProvider>
        <Toaster />
      </body>
    </html>
  )
}
