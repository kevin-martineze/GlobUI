import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Popover, PopoverTrigger, PopoverContent } from "./popover"
import { Button } from "../../button/src/button"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

// Popover content stays in the DOM when closed; ask the browser whether it is shown.
const popoverOpen = () => !!document.querySelector('[role="dialog"]:popover-open')

function Basic(props: { onOpenChange?: (open: boolean) => void }) {
  return (
    <div>
      <Popover {...props}>
        <PopoverTrigger asChild>
          <Button>Filters</Button>
        </PopoverTrigger>
        <PopoverContent>
          <button>Apply</button>
        </PopoverContent>
      </Popover>
      <p>Outside text</p>
    </div>
  )
}

describe("Popover", () => {
  it("opens with the trigger, moves focus inside, and reports aria-expanded", async () => {
    await render(<Basic />)
    const trigger = page.getByRole("button", { name: "Filters" })
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(trigger)
    await expect.poll(popoverOpen).toBe(true)
    await expect.element(trigger).toHaveAttribute("aria-expanded", "true")
    await expect.element(page.getByRole("button", { name: "Apply" })).toHaveFocus()
    // Named by its trigger.
    await expect.element(page.getByRole("dialog", { name: "Filters" })).toBeInTheDocument()
    await expectNoA11yViolations()
  })

  it("closes when the trigger is clicked again (does not reopen)", async () => {
    await render(<Basic />)
    const trigger = page.getByRole("button", { name: "Filters" })
    await userEvent.click(trigger)
    await expect.poll(popoverOpen).toBe(true)

    await userEvent.click(trigger)
    await expect.poll(popoverOpen).toBe(false)
    await expect.element(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("closes on Escape and returns focus to the trigger", async () => {
    await render(<Basic />)
    const trigger = page.getByRole("button", { name: "Filters" })
    await userEvent.click(trigger)
    await expect.element(page.getByRole("button", { name: "Apply" })).toHaveFocus()

    await userEvent.keyboard("{Escape}")
    await expect.poll(popoverOpen).toBe(false)
    await expect.element(trigger).toHaveFocus()
  })

  it("light-dismisses on an outside click without reopening", async () => {
    const onOpenChange = vi.fn()
    await render(<Basic onOpenChange={onOpenChange} />)
    await userEvent.click(page.getByRole("button", { name: "Filters" }))
    await expect.poll(popoverOpen).toBe(true)

    await userEvent.click(page.getByText("Outside text"))
    await expect.poll(popoverOpen).toBe(false)
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })
})

describe("Popover autofocus", () => {
  it("focuses the [data-autofocus] element inside the content, not the first focusable one", async () => {
    await render(
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>
          <button>First</button>
          <button data-autofocus>Chosen</button>
        </PopoverContent>
      </Popover>
    )
    await expect.poll(() => document.activeElement?.textContent).toBe("Chosen")
  })
})
