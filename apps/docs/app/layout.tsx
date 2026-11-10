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
