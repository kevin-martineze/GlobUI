import type { MetadataRoute } from "next"
import { source } from "@/lib/source"

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages().map((page) => ({
    url: `${base}${page.url}`,
    lastModified: new Date(),
  }))
  return [{ url: base, lastModified: new Date() }, ...pages]
}
