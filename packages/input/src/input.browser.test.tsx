import { describe, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Input } from "./input"
import { Textarea } from "../../textarea/src/textarea"
import { PhoneInput } from "../../phone-input/src/phone-input"
import { expectPlaceholderContrast, withTheme } from "../../../tests/browser/contrast"

// axe does not check placeholders, so the contrast is checked here in both themes.
describe.each(["light", "dark"] as const)("placeholder contrast (%s)", (theme) => {
  it("Input", async () => {
    await withTheme(theme, async () => {
      await render(<Input placeholder="you@example.com" aria-label="Email" />)
      await expectPlaceholderContrast(page.getByRole("textbox", { name: "Email" }).element(), "Input")
    })
  })

  it("Textarea", async () => {
    await withTheme(theme, async () => {
      await render(<Textarea placeholder="Tell us more" aria-label="Message" />)
      await expectPlaceholderContrast(page.getByRole("textbox", { name: "Message" }).element(), "Textarea")
    })
  })

  it("PhoneInput (the telephone field, inside its surface)", async () => {
    await withTheme(theme, async () => {
      await render(<PhoneInput placeholder="555 000 0000" aria-label="Phone" />)
      await expectPlaceholderContrast(page.getByRole("textbox", { name: "Phone" }).element(), "PhoneInput")
    })
  })
})
