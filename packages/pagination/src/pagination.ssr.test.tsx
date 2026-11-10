import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"

describe("Pagination (SSR)", () => {
  it("marks the current page and disables previous on the first page", () => {
    const html = renderToString(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled href="/p/0" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive href="/p/1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/p/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/p/2" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Pagination"')
    expect(html).toContain('aria-current="page"')
    // The disabled previous link has no href and is aria-disabled.
    expect(html).toMatch(/aria-label="Go to previous page"[^>]*aria-disabled="true"/)
    expect(html).not.toMatch(/href="\/p\/0"/)
    expect(html).toContain("More pages")
    expect(html).toMatch(/aria-label="Go to next page"[^>]*href="\/p\/2"/)
  })
})
