import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Items(props: { type: "single" | "multiple"; collapsible?: boolean; onValueChange?: (v: never) => void }) {
  const rest = { ...props }
  return (
    <Accordion {...(rest as Record<string, unknown>)} {...({} as object)}>
      <AccordionItem value="a">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in 2 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c" disabled>
        <AccordionTrigger>Disabled</AccordionTrigger>
        <AccordionContent>Hidden.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

const expanded = (name: string) => page.getByRole("button", { name }).element().getAttribute("aria-expanded")

describe("Accordion", () => {
  it("single: opening one item closes the other", async () => {
    await render(<Items type="single" />)
    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    await expect.element(page.getByText("Ships in 2 days.")).toBeVisible()

    await userEvent.click(page.getByRole("button", { name: "Returns" }))
    await expect.element(page.getByRole("button", { name: "Returns" })).toHaveAttribute("aria-expanded", "true")
    await expect.element(page.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-expanded", "false")
    await expectNoA11yViolations()
  })

  it("single without collapsible: the open item cannot be closed by its trigger", async () => {
    await render(<Items type="single" />)
    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    expect(expanded("Shipping")).toBe("true")
  })

  it("single collapsible: the open item closes when its trigger is clicked again", async () => {
    await render(<Items type="single" collapsible />)
    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    await expect.element(page.getByRole("button", { name: "Shipping" })).toHaveAttribute("aria-expanded", "false")
  })

  it("multiple: several items can be open at once", async () => {
    const onValueChange = vi.fn()
    await render(<Items type="multiple" onValueChange={onValueChange as never} />)
    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    await userEvent.click(page.getByRole("button", { name: "Returns" }))
    expect(expanded("Shipping")).toBe("true")
    expect(expanded("Returns")).toBe("true")
  })

  it("a disabled item does not open", async () => {
    await render(<Items type="single" />)
    await expect.element(page.getByRole("button", { name: "Disabled" })).toBeDisabled()
    await userEvent.click(page.getByRole("button", { name: "Disabled" }), { force: true })
    expect(expanded("Disabled")).toBe("false")
  })

  it("keeps closed content inert and out of the accessibility tree", async () => {
    await render(<Items type="single" />)
    expect(page.getByText("Ships in 2 days.").elements()).toHaveLength(1)
    const panel = document.querySelector('[role="region"][id]') ?? document.querySelector("[inert]")
    expect(panel).not.toBeNull()
    expect(panel!.hasAttribute("inert")).toBe(true)

    await userEvent.click(page.getByRole("button", { name: "Shipping" }))
    await expect.element(page.getByText("Ships in 2 days.")).toBeVisible()
    expect(document.querySelector('[role="region"][id]')!.hasAttribute("inert")).toBe(false)
  })
})
