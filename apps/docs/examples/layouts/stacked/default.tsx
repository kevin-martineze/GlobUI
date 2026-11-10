import { StackedLayout } from "@glob-ui/stacked-layout"
import { LayoutNavTrigger } from "@glob-ui/layout"
import { PageLayout } from "@glob-ui/page-layout"

const SECTIONS = Array.from({ length: 12 }, (_, i) => `Section ${i + 1}`)

export default function StackedDefault() {
  return (
    <StackedLayout
      header={
        <>
          <LayoutNavTrigger />
          <strong>Docs</strong>
          <nav aria-label="Top" className="ml-auto hidden gap-4 text-sm lg:flex">
            <a href="#guides" className="no-underline">Guides</a>
            <a href="#api" className="no-underline">API</a>
          </nav>
        </>
      }
      mobileNav={
        <>
          <a href="#guides" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Guides</a>
          <a href="#api" className="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">API</a>
        </>
      }
      navLabel="Site"
      footer={<p className="text-sm text-fd-muted-foreground">Footer</p>}
    >
      <PageLayout>
        {SECTIONS.map((section) => (
          <section key={section} className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{section}</h2>
            <p>Text of the section. The header stays in view while the document scrolls.</p>
          </section>
        ))}
      </PageLayout>
    </StackedLayout>
  )
}
