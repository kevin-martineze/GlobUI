import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { registry } from "@/examples/registry"
import { PreviewRoot } from "@/components/preview-root"

// The live demos of the layout and template pages. Rendered in an iframe there, and in a tab for "Full screen".
// Not for search engines, and not in the sitemap.
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
}

export default async function PreviewPage(props: PageProps<"/preview/[...slug]">) {
  const { slug } = await props.params
  const Example = registry[slug.join("/")]
  if (!Example) notFound()
  return (
    <PreviewRoot>
      <Example />
    </PreviewRoot>
  )
}
