import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"
import { page } from "vitest/browser"
import { Field } from "./field"
import { Input } from "../../input/src/input"
import { Checkbox } from "../../checkbox/src/checkbox"
import { RadioGroup, RadioGroupItem } from "../../radio-group/src/radio-group"
import { Select } from "../../select/src/select"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

describe("Field", () => {
  it("wires label, description and error to an Input", async () => {
    await render(
      <Field label="Email" description="Work address" error="Enter a valid email">
        <Input />
      </Field>
    )
    const input = page.getByRole("textbox", { name: "Email" })
    await expect.element(input).toHaveAttribute("aria-invalid", "true")
    await expect.element(input).toHaveAccessibleDescription("Work address Enter a valid email")
    await expectNoA11yViolations()
  })

  it("wires the label to a Select trigger", async () => {
    await render(
      <Field label="Country">
        <Select options={[{ value: "mx", label: "Mexico" }]} />
      </Field>
    )
    await expect.element(page.getByRole("combobox", { name: "Country" })).toBeVisible()
  })

  it("wires the group label to a RadioGroup", async () => {
    await render(
      <Field label="Plan">
        <RadioGroup defaultValue="free">
          <RadioGroupItem value="free" label="Free" />
          <RadioGroupItem value="pro" label="Pro" />
        </RadioGroup>
      </Field>
    )
    await expect.element(page.getByRole("radiogroup", { name: "Plan" })).toBeVisible()
  })

  it("concatenates the Field label with the Checkbox label in the accessible name", async () => {
    await render(
      <Field label="Terms">
        <Checkbox label="I accept the terms" />
      </Field>
    )
    await expect.element(page.getByRole("checkbox", { name: /Terms.*I accept the terms/ })).toBeVisible()
  })
})
