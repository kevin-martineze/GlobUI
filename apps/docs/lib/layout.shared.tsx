import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

export const GITHUB_URL = "https://github.com/kevin-martineze/GlobUI"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "GlobUI",
    },
    links: [
      { text: "Docs", url: "/docs" },
      { text: "GitHub", url: GITHUB_URL, external: true },
    ],
    githubUrl: GITHUB_URL,
  }
}
