import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { GlobUILogo } from "@/components/logo-mark"

export const GITHUB_URL = "https://github.com/kevin-martineze/GlobUI"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // The title is wrapped in the nav link to "/"; the logo's title is its accessible name.
      title: <GlobUILogo title="glob.ui home" className="h-6 w-auto" />,
    },
    links: [
      { text: "Docs", url: "/docs" },
      { text: "GitHub", url: GITHUB_URL, external: true },
    ],
    githubUrl: GITHUB_URL,
  }
}
