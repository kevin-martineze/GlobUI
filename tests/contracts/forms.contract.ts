// Phase 10d-1 contracts: the behaviour and accessibility of the form and primitive components, written once and run
// in every framework that ports them. They come from the React package tests. Two React tests stay React-only:
// "controlled value stays until the parent updates it" (Switch, Slider), because each framework has its own controlled
// model (props in React, `bind:` in Svelte).
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { FormsAdapter } from "./types"

const OK_SRC =
  "data:image/svg+xml;utf8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#0a0"/></svg>')

const SEGMENTED_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month", disabled: true },
  { value: "year", label: "Year" },
]

const formData = (name: string) => new FormData(document.querySelector("form")!).get(name)

export function formsContract(render: FormsAdapter) {
  describe(`Button (${render.name})`, () => {
    it("is disabled and aria-busy while loading", async () => {
      await render.button({ label: "Save changes", loading: true })
      const button = page.getByRole("button", { name: /Save changes/ })
      await expect.element(button).toHaveAttribute("aria-busy", "true")
      await expect.element(button).toBeDisabled()
    })

    it("renders a link with the button styles", async () => {
      await render.buttonLink({ label: "Read the docs", href: "#docs" })
      await expect.element(page.getByRole("link", { name: "Read the docs" })).toHaveAttribute("href", "#docs")
      expect(page.getByRole("button").elements()).toHaveLength(0)
      await expectNoA11yViolations()
    })

    it("does not fire onClick when disabled", async () => {
      const onClick = vi.fn()
      await render.button({ label: "Off", disabled: true, onClick })
      await expect.element(page.getByRole("button", { name: "Off" })).toBeDisabled()
      expect(onClick).not.toHaveBeenCalled()
    })
  })

  describe(`Field (${render.name})`, () => {
    it("wires the label, description and error to an Input", async () => {
      await render.fieldWithInput({ label: "Email", description: "Work address", error: "Enter a valid email" })
      const input = page.getByRole("textbox", { name: "Email" })
      await expect.element(input).toHaveAttribute("aria-invalid", "true")
      await expect.element(input).toHaveAccessibleDescription("Work address Enter a valid email")
      await expectNoA11yViolations()
    })

    it("names a RadioGroup with its label", async () => {
      await render.fieldWithRadioGroup({ label: "Plan" })
      await expect.element(page.getByRole("radiogroup", { name: "Plan" })).toBeVisible()
    })

    it("joins the Field label and the Checkbox label in the accessible name", async () => {
      await render.fieldWithCheckbox({ label: "Terms", checkboxLabel: "I accept the terms" })
      await expect.element(page.getByRole("checkbox", { name: /Terms.*I accept the terms/ })).toBeVisible()
    })

    it("names a Slider with its label and passes axe", async () => {
      await render.fieldWithSlider({ label: "Brightness", description: "Between 0 and 100" })
      await expect.element(page.getByRole("slider", { name: "Brightness" })).toBeInTheDocument()
      await expectNoA11yViolations()
    })
  })

  describe(`Checkbox (${render.name})`, () => {
    it("shows the indeterminate state and clears it on click", async () => {
      await render.checkbox({ label: "Select all", indeterminate: true })
      const box = page.getByRole("checkbox", { name: "Select all" })
      expect((box.element() as HTMLInputElement).indeterminate).toBe(true)
      await userEvent.click(box)
      expect((box.element() as HTMLInputElement).indeterminate).toBe(false)
      expect((box.element() as HTMLInputElement).checked).toBe(true)
      await expectNoA11yViolations()
    })

    it("toggles with Space", async () => {
      await render.checkbox({ label: "Accept" })
      const box = page.getByRole("checkbox", { name: "Accept" })
      ;(box.element() as HTMLElement).focus()
      await userEvent.keyboard(" ")
      await expect.element(box).toBeChecked()
      await userEvent.keyboard(" ")
      await expect.element(box).not.toBeChecked()
    })
  })

  describe(`Switch (${render.name})`, () => {
    it("toggles and reports the change", async () => {
      const onCheckedChange = vi.fn()
      await render.switch({ label: "Notifications", onCheckedChange })
      const sw = page.getByRole("switch", { name: "Notifications" })
      await expect.element(sw).toHaveAttribute("aria-checked", "false")
      await userEvent.click(sw)
      await expect.element(sw).toHaveAttribute("aria-checked", "true")
      expect(onCheckedChange).toHaveBeenCalledWith(true)
      await expectNoA11yViolations()
    })

    it("submits a hidden input only while on", async () => {
      await render.switch({ label: "Marketing", name: "marketing", value: "yes", defaultChecked: false })
      expect(document.querySelector('input[name="marketing"]')).toBeNull()
      await userEvent.click(page.getByRole("switch", { name: "Marketing" }))
      expect(document.querySelector<HTMLInputElement>('input[name="marketing"]')?.value).toBe("yes")
    })
  })

  describe(`RadioGroup (${render.name})`, () => {
    it("uses the native radio pattern: one tab stop, arrows select and wrap", async () => {
      const onValueChange = vi.fn()
      await render.radioGroup({ defaultValue: "free", name: "plan", onValueChange })
      await expectNoA11yViolations()
      ;(page.getByRole("radio", { name: "Free" }).element() as HTMLElement).focus()
      await userEvent.keyboard("{ArrowDown}")
      expect(onValueChange).toHaveBeenLastCalledWith("pro")
      await expect.element(page.getByRole("radio", { name: "Pro" })).toBeChecked()
      await userEvent.keyboard("{ArrowUp}")
      await expect.element(page.getByRole("radio", { name: "Free" })).toBeChecked()
      await userEvent.keyboard("{ArrowUp}")
      await expect.element(page.getByRole("radio", { name: "Team" })).toBeChecked()
    })

    it("submits the selected value with a native form", async () => {
      await render.radioGroup({ defaultValue: "free", name: "plan", inForm: true })
      expect(formData("plan")).toBe("free")
      ;(page.getByRole("radio", { name: "Pro" }).element() as HTMLElement).focus()
      await userEvent.keyboard("{Space}")
      expect(formData("plan")).toBe("pro")
    })
  })

  describe(`Separator (${render.name})`, () => {
    it("is exposed as a separator and passes axe", async () => {
      await render.separator()
      await expect.element(page.getByRole("separator")).toBeInTheDocument()
      await expectNoA11yViolations()
    })
  })

  describe(`Avatar (${render.name})`, () => {
    it("shows initials from alt when the image fails to load", async () => {
      await render.avatar({ src: "/does-not-exist.png", alt: "Ana Torres" })
      await expect.element(page.getByText("AT", { exact: true })).toBeVisible()
      await expectNoA11yViolations()
    })

    it("resets when src changes: a new image replaces the fallback", async () => {
      const avatar = await render.avatar({ src: "/does-not-exist.png", alt: "Ana Torres" })
      await expect.element(page.getByText("AT", { exact: true })).toBeVisible()
      await avatar.setSrc(OK_SRC)
      await expect.poll(() => page.getByText("AT", { exact: true }).elements().length).toBe(0)
      await expect.element(page.getByRole("img", { name: "Ana Torres" })).toBeVisible()
    })

    it("goes back to the fallback when the new src is missing", async () => {
      const avatar = await render.avatar({ src: OK_SRC, alt: "Ana Torres" })
      await expect.element(page.getByRole("img", { name: "Ana Torres" })).toBeVisible()
      await avatar.setSrc("/does-not-exist.png")
      await expect.element(page.getByText("AT", { exact: true })).toBeVisible()
    })
  })

  describe(`Progress (${render.name})`, () => {
    it("is named by aria-labelledby and passes axe", async () => {
      await render.progress({ label: "Upload", value: 60 })
      await expect.element(page.getByRole("progressbar", { name: "Upload" })).toHaveAttribute("aria-valuenow", "60")
      await expectNoA11yViolations()
    })

    it("drops the value while indeterminate", async () => {
      await render.progress({ label: "Sync", value: null })
      await expect.element(page.getByRole("progressbar", { name: "Sync" })).not.toHaveAttribute("aria-valuenow")
    })
  })

  describe(`Slider (${render.name})`, () => {
    it("moves with the arrow keys, Home, End and PageDown, and reports each value", async () => {
      const onValueChange = vi.fn()
      await render.slider({ label: "Volume", defaultValue: 50, onValueChange })
      const input = page.getByRole("slider", { name: "Volume" }).element() as HTMLInputElement
      input.focus()
      await userEvent.keyboard("{ArrowRight}")
      expect(input.value).toBe("51")
      await userEvent.keyboard("{Home}")
      expect(input.value).toBe("0")
      await userEvent.keyboard("{End}")
      expect(input.value).toBe("100")
      await userEvent.keyboard("{PageDown}")
      expect(input.value).toBe("90")
      expect(onValueChange).toHaveBeenLastCalledWith(90)
    })

    it("sets the fill variable from the value", async () => {
      await render.slider({ label: "Fill", min: 0, max: 200, defaultValue: 50 })
      const input = page.getByRole("slider", { name: "Fill" }).element() as HTMLInputElement
      expect(input.style.getPropertyValue("--glob-slider-fill")).toBe("25%")
    })
  })

  describe(`Toggle (${render.name})`, () => {
    it("flips aria-pressed on click and reports the change", async () => {
      const onPressedChange = vi.fn()
      await render.toggle({ label: "Bold", onPressedChange })
      const toggle = page.getByRole("button", { name: "Bold" })
      await expect.element(toggle).toHaveAttribute("aria-pressed", "false")
      await userEvent.click(toggle)
      await expect.element(toggle).toHaveAttribute("aria-pressed", "true")
      expect(onPressedChange).toHaveBeenCalledWith(true)
      await expectNoA11yViolations()
    })
  })

  describe(`ToggleGroup (${render.name})`, () => {
    const button = (name: string) => page.getByRole("button", { name })

    it("single: pressing one item releases the other, and pressing it again clears the choice", async () => {
      const onValueChange = vi.fn()
      await render.toggleGroup({
        type: "single",
        label: "Align",
        items: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ],
        onValueChange,
      })
      await userEvent.click(button("Left"))
      await expect.element(button("Left")).toHaveAttribute("aria-pressed", "true")
      await userEvent.click(button("Center"))
      await expect.element(button("Left")).toHaveAttribute("aria-pressed", "false")
      expect(onValueChange).toHaveBeenLastCalledWith("center")
      await userEvent.click(button("Center"))
      expect(onValueChange).toHaveBeenLastCalledWith("")
      await expectNoA11yViolations()
    })

    it("multiple: several items stay pressed", async () => {
      const onValueChange = vi.fn()
      await render.toggleGroup({
        type: "multiple",
        label: "Styles",
        items: [
          { value: "b", label: "Bold" },
          { value: "i", label: "Italic" },
        ],
        onValueChange,
      })
      await userEvent.click(button("Bold"))
      await userEvent.click(button("Italic"))
      expect(onValueChange).toHaveBeenLastCalledWith(["b", "i"])
      await expect.element(button("Bold")).toHaveAttribute("aria-pressed", "true")
      await expect.element(button("Italic")).toHaveAttribute("aria-pressed", "true")
    })

    it("arrows move focus, skip a disabled item, and Tab leaves the group", async () => {
      await render.toggleGroup({
        type: "single",
        label: "Views",
        withOutsideButtons: true,
        items: [
          { value: "a", label: "A" },
          { value: "b", label: "B", disabled: true },
          { value: "c", label: "C" },
        ],
      })
      await userEvent.click(button("Before"))
      await userEvent.tab()
      expect(document.activeElement?.textContent?.trim()).toBe("A")
      await userEvent.keyboard("{ArrowRight}")
      expect(document.activeElement?.textContent?.trim()).toBe("C")
      await userEvent.tab()
      expect(document.activeElement?.textContent?.trim()).toBe("After")
    })
  })

  describe(`Segmented (${render.name})`, () => {
    const radio = (name: string) => page.getByRole("radio", { name })
    const checked = () => document.querySelector('[role="radio"][aria-checked="true"]')?.textContent?.trim()

    it("is a radiogroup of radios with one tab stop on the checked option", async () => {
      await render.segmented({ options: SEGMENTED_OPTIONS, defaultValue: "week" })
      await expect.element(page.getByRole("radiogroup", { name: "Range" })).toBeVisible()
      await expect.element(radio("Week")).toHaveAttribute("aria-checked", "true")
      await expect.element(radio("Week")).toHaveAttribute("tabindex", "0")
      await expect.element(radio("Day")).toHaveAttribute("tabindex", "-1")
      await expectNoA11yViolations()
    })

    it("arrows move focus and select, skipping the disabled option, and wrap around", async () => {
      const onChange = vi.fn()
      await render.segmented({ options: SEGMENTED_OPTIONS, defaultValue: "day", onChange })
      ;(radio("Day").element() as HTMLElement).focus()
      await userEvent.keyboard("{ArrowRight}")
      expect(checked()).toBe("Week")
      expect(onChange).toHaveBeenLastCalledWith("week")
      await userEvent.keyboard("{ArrowRight}")
      expect(checked()).toBe("Year")
      await userEvent.keyboard("{ArrowRight}")
      expect(checked()).toBe("Day")
      await userEvent.keyboard("{ArrowLeft}")
      expect(checked()).toBe("Year")
    })

    it("submits the checked value with a native form", async () => {
      await render.segmented({ options: SEGMENTED_OPTIONS, defaultValue: "week", name: "range", inForm: true })
      expect(formData("range")).toBe("week")
      ;(radio("Year").element() as HTMLElement).focus()
      await userEvent.keyboard("{Space}")
      expect(formData("range")).toBe("year")
    })
  })
}
