import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { PageHeader, PageLayout } from "./page-layout"

describe("PageLayout (SSR)", () => {
  it("renders a server-safe page with a sticky header, content and an aside", () => {
    const html = renderToString(
      <PageLayout header={<PageHeader title="Orders" description="This month" actions={<button>New</button>} />} aside={<p>Filters</p>}>
        <p>Table</p>
      </PageLayout>
    )
    expect(html).toContain('data-layout="page"')
    expect(html).toContain('data-slot="header"')
    expect(html).toContain('data-slot="aside"')
    expect(html).toContain("lg:sticky")
    expect(html).toContain("<h1")
    expect(html).not.toContain("overflow")
    expect(html).not.toContain("100vh")
  })

  it("stacks the aside under the content on small screens", () => {
    const html = renderToString(<PageLayout aside={<p>Side</p>}>Main</PageLayout>)
    expect(html).toContain("lg:flex-row")
    expect(html).not.toMatch(/data-slot="aside"[^>]*hidden/)
  })

  it("renders the title as the page h1", () => {
    const html = renderToString(<PageHeader title="Invoices" />)
    expect(html).toMatch(/<h1[^>]*>Invoices<\/h1>/)
  })
})
