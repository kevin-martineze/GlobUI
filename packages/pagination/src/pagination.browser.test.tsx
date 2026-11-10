import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { useState } from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
import { getPageRange } from "./get-page-range"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Controlled({ pageCount, onPage }: { pageCount: number; onPage?: (page: number) => void }) {
  const [current, setCurrent] = useState(1)
  const go = (next: number) => {
    setCurrent(next)
    onPage?.(next)
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild disabled={current === 1}>
            <button type="button" disabled={current === 1} onClick={() => go(current - 1)} />
          </PaginationPrevious>
        </PaginationItem>
        {getPageRange({ page: current, pageCount }).map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink asChild isActive={item === current}>
                <button type="button" onClick={() => go(item)}>
                  {item}
                </button>
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext asChild disabled={current === pageCount}>
            <button type="button" disabled={current === pageCount} onClick={() => go(current + 1)}>
              Next
            </button>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

describe("Pagination", () => {
  it("passes axe with links and the current page marked", async () => {
    await render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/a" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/a" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/b" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    await expect.element(page.getByRole("link", { name: "1" })).toHaveAttribute("aria-current", "page")
    await expectNoA11yViolations()
  })

  it("the disabled previous link cannot be followed", async () => {
    await render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled href="/prev" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
    const prev = page.getByRole("link", { name: "Go to previous page" }).element() as HTMLAnchorElement
    expect(prev.getAttribute("aria-disabled")).toBe("true")
    expect(prev.hasAttribute("href")).toBe(false)
  })

  it("controlled buttons move the current page and disable the ends", async () => {
    const onPage = vi.fn()
    await render(<Controlled pageCount={5} onPage={onPage} />)
    await expect.element(page.getByRole("button", { name: "Go to previous page" })).toBeDisabled()
    await userEvent.click(page.getByRole("button", { name: "Go to next page" }))
    expect(onPage).toHaveBeenLastCalledWith(2)
    await expect.element(page.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page")
    await expectNoA11yViolations()
  })
})
