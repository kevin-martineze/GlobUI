import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

function Basic(props: { value?: string; orientation?: "horizontal" | "vertical"; defaultValue?: string }) {
  return (
    <Tabs {...props}>
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>Password</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account panel</TabsContent>
      <TabsContent value="billing">Billing panel</TabsContent>
      <TabsContent value="team">Team panel</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("moves with ArrowRight, skips the disabled tab, and loops", async () => {
    await render(<Basic defaultValue="account" />)
    const account = page.getByRole("tab", { name: "Account" })
    await account.element().focus()

    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByRole("tab", { name: "Billing" })).toHaveFocus()
    await expect.element(page.getByRole("tab", { name: "Billing" })).toHaveAttribute("aria-selected", "true")

    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByRole("tab", { name: "Team" })).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    await expect.element(account).toHaveFocus()
    await expectNoA11yViolations()
  })

  it("moves backwards with ArrowLeft, skipping the disabled tab", async () => {
    await render(<Basic defaultValue="billing" />)
    await page.getByRole("tab", { name: "Billing" }).element().focus()
    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(page.getByRole("tab", { name: "Account" })).toHaveFocus()
  })

  it("jumps with Home and End", async () => {
    await render(<Basic defaultValue="billing" />)
    await page.getByRole("tab", { name: "Billing" }).element().focus()
    await userEvent.keyboard("{End}")
    await expect.element(page.getByRole("tab", { name: "Team" })).toHaveFocus()
    await userEvent.keyboard("{Home}")
    await expect.element(page.getByRole("tab", { name: "Account" })).toHaveFocus()
  })

  it("uses Up and Down in a vertical list", async () => {
    await render(<Basic defaultValue="account" orientation="vertical" />)
    await page.getByRole("tab", { name: "Account" }).element().focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(page.getByRole("tab", { name: "Billing" })).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(page.getByRole("tab", { name: "Billing" })).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(page.getByRole("tab", { name: "Account" })).toHaveFocus()
  })

  it("gives the first enabled tab tabIndex 0 when value matches no tab", async () => {
    await render(<Basic value="does-not-exist" />)
    await expect.element(page.getByRole("tab", { name: "Account" })).toHaveAttribute("tabindex", "0")
    await expect.element(page.getByRole("tab", { name: "Billing" })).toHaveAttribute("tabindex", "-1")
    expect(page.getByRole("tab", { name: "Password" }).element().getAttribute("tabindex")).not.toBe("0")
  })

  it("shows the panel for the selected tab only", async () => {
    await render(<Basic defaultValue="billing" />)
    await expect.element(page.getByText("Billing panel")).toBeVisible()
    expect(page.getByText("Account panel").elements()).toHaveLength(0)
  })
})
