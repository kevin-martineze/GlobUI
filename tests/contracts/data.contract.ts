// Phase 10d-4 contracts: the behaviour and accessibility of the data and date components (Table, DataTable, Calendar,
// DatePicker, PhoneInput), written once and run in every framework that ports them. They come from the React package
// tests. The country list tests drive the CountrySelect through PhoneInput, its public entry point.
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { expectNoA11yViolations } from "../browser/a11y"
import type { ContractUser, DataAdapter } from "./types"

export const USERS: ContractUser[] = [
  { id: "1", name: "Ana", city: "Madrid", role: "Admin" },
  { id: "2", name: "Benito", city: "Lima", role: "Editor" },
  { id: "3", name: "Canción", city: "Bogotá", role: "Viewer" },
  { id: "4", name: "Dara", city: "Quito", role: "Viewer" },
  { id: "5", name: "Eli", city: "Lisbon", role: "Editor" },
  { id: "6", name: "Fátima", city: "Cádiz", role: "Viewer" },
  { id: "7", name: "Gus", city: "Oslo", role: "Admin" },
  { id: "8", name: "Hana", city: "Tokyo", role: "Viewer" },
  { id: "9", name: "Ivo", city: "Rome", role: "Editor" },
  { id: "10", name: "Jun", city: "Seoul", role: "Viewer" },
  { id: "11", name: "Kai", city: "Quebec", role: "Viewer" },
  { id: "12", name: "Lia", city: "Vienna", role: "Admin" },
]

const headerOf = (label: string) => Array.from(document.querySelectorAll("th")).find((th) => th.textContent?.includes(label))!
const bodyNames = () => Array.from(document.querySelectorAll("tbody tr")).map((tr) => tr.querySelector("td")?.textContent?.trim())
const dataStatus = () => document.querySelector('[role="status"]')?.textContent?.trim()

const focusedDay = () => (document.activeElement as HTMLElement | null)?.dataset.iso
const tabStops = () => Array.from(document.querySelectorAll<HTMLElement>('[role="grid"] [data-iso][tabindex="0"]'))
const gridHeading = () => document.querySelector('[role="grid"]')?.getAttribute("aria-labelledby")
const headingText = () => document.getElementById(gridHeading() ?? "")?.textContent?.trim()

const pickerOpen = () => !!document.querySelector('[role="dialog"]:popover-open')
const pickerTrigger = () => page.getByRole("button", { name: /Due date/ }).element() as HTMLElement
const hidden = (name: string) => document.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`)?.value

const countryTrigger = () => page.getByRole("combobox", { name: "Country code" })
const countryListOpen = () => !!document.querySelector('[role="listbox"]')?.closest("[popover]")?.matches(":popover-open")
const countrySearch = () => page.getByRole("textbox", { name: "Search countries" })
const countryOptions = () => Array.from(document.querySelectorAll('[role="option"]')).map((o) => o.textContent?.replace(/\s+/g, "") ?? "")
const activeCountry = () => {
  const id = (document.activeElement as HTMLElement | null)?.getAttribute("aria-activedescendant")
  return id ? document.getElementById(id)?.textContent?.replace(/\s+/g, "") : undefined
}

export function dataContract(render: DataAdapter) {
  describe(`Table (${render.name})`, () => {
    it("passes axe with a caption and a footer", async () => {
      await render.table({})
      await expect.element(page.getByRole("table")).toBeInTheDocument()
      await expect.element(page.getByText("Invoices, November")).toBeInTheDocument()
      await expectNoA11yViolations()
    })

    it("with scrollLabel the wrapper is a focusable region with that name", async () => {
      await render.table({ scrollLabel: "Invoices table" })
      const region = page.getByRole("region", { name: "Invoices table" }).element() as HTMLElement
      expect(region.tabIndex).toBe(0)
      region.focus()
      expect(document.activeElement).toBe(region)
      await expectNoA11yViolations()
    })

    it("without scrollLabel the wrapper is neither a region nor focusable", async () => {
      await render.table({})
      const wrapper = document.querySelector("table")!.parentElement!
      expect(wrapper.hasAttribute("role")).toBe(false)
      expect(wrapper.hasAttribute("tabindex")).toBe(false)
    })

    it("striped and sticky-header tables render and pass axe", async () => {
      await render.table({ striped: true, stickyHeader: true })
      await expectNoA11yViolations()
    })

    it("aligns numeric cells to the right", async () => {
      await render.table({})
      const cell = page.getByRole("cell", { name: "$120" }).element() as HTMLElement
      expect(cell.className).toContain("text-right")
      expect(headerOf("Amount").className).toContain("text-right")
    })
  })

  describe(`DataTable (${render.name})`, () => {
    it("sorting: a click toggles aria-sort and the order", async () => {
      await render.dataTable({ data: USERS.slice(0, 4), sorting: true })
      expect(headerOf("Name").getAttribute("aria-sort")).toBe("none")
      await userEvent.click(page.getByRole("button", { name: "Name" }))
      await expect.poll(() => headerOf("Name").getAttribute("aria-sort")).toBe("ascending")
      expect(bodyNames()).toEqual(["Ana", "Benito", "Canción", "Dara"])
      await userEvent.click(page.getByRole("button", { name: "Name" }))
      await expect.poll(() => headerOf("Name").getAttribute("aria-sort")).toBe("descending")
      expect(bodyNames()[0]).toBe("Dara")
    })

    it("without sorting the headers are plain text with no aria-sort", async () => {
      await render.dataTable({ data: USERS.slice(0, 2) })
      expect(headerOf("Name").hasAttribute("aria-sort")).toBe(false)
      expect(headerOf("Name").querySelector("button")).toBeNull()
    })

    it("filtering: narrows rows accent-insensitively and announces the count", async () => {
      await render.dataTable({ data: USERS, globalFilter: true })
      await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "cancion")
      await expect.poll(bodyNames).toEqual(["Canción"])
      await expect.poll(dataStatus).toBe("1 result")
    })

    it("filtering: every word can match any column", async () => {
      await render.dataTable({ data: USERS, globalFilter: true })
      await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "editor lisbon")
      await expect.poll(bodyNames).toEqual(["Eli"])
    })

    it("filtering: shows the empty state when nothing matches", async () => {
      await render.dataTable({ data: USERS, globalFilter: true, emptyState: "Nobody here." })
      await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "zzzz")
      await expect.element(page.getByText("Nobody here.")).toBeVisible()
    })

    it("pagination: moves between pages and announces the page", async () => {
      await render.dataTable({ data: USERS, pagination: true, pageSize: 5 })
      expect(bodyNames().length).toBe(5)
      await expect.element(page.getByRole("button", { name: "Previous page" })).toBeDisabled()
      await userEvent.click(page.getByRole("button", { name: "Next page" }))
      await expect.poll(() => bodyNames()[0]).toBe("Fátima")
      // The live region announces the page; the visible label shows it too.
      await expect.poll(dataStatus).toBe("Page 2 of 3")
      expect(Array.from(document.querySelectorAll("span")).some((el) => el.textContent === "Page 2 of 3")).toBe(true)
    })

    it("pagination: changing the page size shows more rows and goes back to the first page", async () => {
      await render.dataTable({ data: USERS, pagination: true, pageSize: 5, pageSizeOptions: [5, 10] })
      await userEvent.click(page.getByRole("button", { name: "Next page" }))
      await userEvent.click(page.getByRole("combobox", { name: "Rows per page" }))
      await userEvent.click(page.getByRole("option", { name: "10" }))
      await expect.poll(() => bodyNames().length).toBe(10)
      await expect.poll(dataStatus).toBe("Page 1 of 2")
    })

    it("row selection: select all selects the page, and a partial selection makes the header indeterminate", async () => {
      await render.dataTable({ data: USERS.slice(0, 4), rowSelection: true })
      const all = page.getByRole("checkbox", { name: "Select all rows" }).element() as HTMLInputElement
      await userEvent.click(page.getByRole("checkbox", { name: "Select row" }).first())
      await expect.poll(() => all.indeterminate).toBe(true)
      await userEvent.click(all)
      const rows = () => Array.from(document.querySelectorAll("tbody tr")) as HTMLElement[]
      await expect.poll(() => rows().every((tr) => tr.dataset.state === "selected")).toBe(true)
      expect(all.checked).toBe(true)
    })

    it("row selection: the bulk counter reads the selected count", async () => {
      await render.dataTable({ data: USERS.slice(0, 4), rowSelection: true })
      await userEvent.click(page.getByRole("checkbox", { name: "Select row" }).first())
      await expect.element(page.getByText("1 of 4 rows selected")).toBeVisible()
    })

    it("column visibility: hides a column from the Columns menu", async () => {
      await render.dataTable({ data: USERS.slice(0, 2), columnVisibility: true })
      expect(headerOf("City")).toBeTruthy()
      await userEvent.click(page.getByRole("button", { name: "Columns" }))
      await userEvent.click(page.getByRole("menuitemcheckbox", { name: "City" }))
      await expect.poll(() => Array.from(document.querySelectorAll("th")).some((th) => th.textContent?.includes("City"))).toBe(false)
    })

    it("manual mode calls the handlers and does not sort or filter locally", async () => {
      const onSortingChange = vi.fn()
      await render.dataTable({ data: USERS.slice(0, 3), sorting: true, manual: true, state: { sorting: [] }, onSortingChange })
      await userEvent.click(page.getByRole("button", { name: "Name" }))
      expect(onSortingChange).toHaveBeenLastCalledWith([{ id: "name", desc: false }])
      // The data stays in the order it was given.
      expect(bodyNames()).toEqual(["Ana", "Benito", "Canción"])
    })

    it("loading shows skeletons and aria-busy on the table", async () => {
      await render.dataTable({ data: [], loading: true, pagination: true, pageSize: 3 })
      const table = document.querySelector("table")!
      expect(table.getAttribute("aria-busy")).toBe("true")
      expect(document.querySelectorAll("tbody tr").length).toBe(3)
      expect(document.querySelectorAll("tbody .animate-pulse, tbody [class*='animate']").length).toBeGreaterThan(0)
    })

    it("passes axe with every feature on", async () => {
      await render.dataTable({
        data: USERS,
        sorting: true,
        globalFilter: true,
        pagination: true,
        rowSelection: true,
        columnVisibility: true,
        pageSize: 5,
      })
      await expect.element(page.getByRole("region", { name: "Users" })).toBeInTheDocument()
      await expectNoA11yViolations()
    })

    it("does not overflow the page at 375px (the table scrolls inside itself)", async () => {
      await page.viewport(375, 812)
      try {
        await render.dataTable({ data: USERS, sorting: true, globalFilter: true, pagination: true, rowSelection: true, pageSize: 5 })
        await expect.poll(() => document.documentElement.scrollWidth).toBeLessThanOrEqual(375)
      } finally {
        await page.viewport(1280, 800)
      }
    })
  })

  describe(`Calendar (${render.name})`, () => {
    it("is a grid named by its month heading, with column headers and one tab stop", async () => {
      await render.calendar({ month: "2026-11", value: "2026-11-09" })
      const grid = page.getByRole("grid", { name: "November 2026" }).element()
      expect(grid.querySelectorAll('[role="columnheader"]').length).toBe(7)
      expect(tabStops().length).toBe(1)
      expect(tabStops()[0].dataset.iso).toBe("2026-11-09")
      await expectNoA11yViolations()
    })

    it("the selected cell exposes aria-selected", async () => {
      await render.calendar({ month: "2026-11", value: "2026-11-09" })
      const cell = document.querySelector('[role="gridcell"][aria-selected="true"]')
      expect(cell?.querySelector("button")?.dataset.iso).toBe("2026-11-09")
      expect(document.querySelectorAll('[role="gridcell"][aria-selected="true"]').length).toBe(1)
    })

    it("arrows, Home, End, PageUp and PageDown move focus; crossing a month changes the heading", async () => {
      await render.calendar({ defaultMonth: "2026-11", value: "2026-11-09", locale: "en-US" })
      tabStops()[0].focus()
      await userEvent.keyboard("{ArrowRight}")
      await expect.poll(focusedDay).toBe("2026-11-10")
      await userEvent.keyboard("{ArrowDown}")
      await expect.poll(focusedDay).toBe("2026-11-17")
      await userEvent.keyboard("{Home}")
      // The week starts on Sunday (en-US): Home goes to the week's first day.
      await expect.poll(focusedDay).toBe("2026-11-15")
      await userEvent.keyboard("{End}")
      await expect.poll(focusedDay).toBe("2026-11-21")
      await userEvent.keyboard("{PageDown}")
      await expect.poll(focusedDay).toBe("2026-12-21")
      await expect.poll(headingText).toMatch(/December/)
      await userEvent.keyboard("{Shift>}{PageUp}{/Shift}")
      await expect.poll(focusedDay).toBe("2025-12-21")
    })

    it("ArrowLeft from the first day of the month moves into the previous month and shows it", async () => {
      await render.calendar({ defaultMonth: "2026-11", value: "2026-11-01" })
      tabStops()[0].focus()
      await userEvent.keyboard("{ArrowLeft}")
      await expect.poll(focusedDay).toBe("2026-10-31")
      await expect.poll(headingText).toMatch(/October/)
    })

    it("moves the visible month with the next and previous buttons", async () => {
      await render.calendar({ defaultMonth: "2026-11" })
      await userEvent.click(page.getByRole("button", { name: "Next month" }))
      await expect.poll(headingText).toMatch(/December/)
      await userEvent.click(page.getByRole("button", { name: "Previous month" }))
      await expect.poll(headingText).toMatch(/November/)
    })

    it("min blocks the previous month button and keeps days before min unselectable", async () => {
      const onChange = vi.fn()
      await render.calendar({ month: "2026-11", min: "2026-11-05", value: null, onChange })
      await expect.element(page.getByRole("button", { name: "Previous month" })).toBeDisabled()
      // aria-disabled days are not actionable for the user; a plain click must not select them.
      ;(page.getByRole("button", { name: /November 3, 2026/ }).element() as HTMLElement).click()
      expect(onChange).not.toHaveBeenCalled()
    })

    it("max blocks the next month button", async () => {
      await render.calendar({ month: "2026-11", max: "2026-11-20" })
      await expect.element(page.getByRole("button", { name: "Next month" })).toBeDisabled()
    })

    it("isDateDisabled days can receive focus but cannot be selected", async () => {
      const onChange = vi.fn()
      await render.calendar({ month: "2026-11", value: null, onChange, isDateDisabled: (iso) => iso === "2026-11-10" })
      const disabled = page.getByRole("button", { name: /November 10, 2026/ }).element() as HTMLElement
      expect(disabled.getAttribute("aria-disabled")).toBe("true")
      disabled.focus()
      expect(document.activeElement).toBe(disabled)
      disabled.click()
      expect(onChange).not.toHaveBeenCalled()
    })

    it("single: clicking the selected day again keeps it", async () => {
      const onChange = vi.fn()
      await render.calendar({ month: "2026-11", value: "2026-11-09", onChange })
      await userEvent.click(page.getByRole("button", { name: /November 9, 2026/ }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it("single: clicking another day reports it", async () => {
      const onChange = vi.fn()
      await render.calendar({ month: "2026-11", value: "2026-11-09", onChange })
      await userEvent.click(page.getByRole("button", { name: /November 12, 2026/ }))
      expect(onChange).toHaveBeenLastCalledWith("2026-11-12")
    })

    it("range: the second pick sets to, and a pick before from swaps them", async () => {
      const onChange = vi.fn()
      await render.calendar({ mode: "range", month: "2026-11", defaultValue: { from: null, to: null }, onChange })
      await userEvent.click(page.getByRole("button", { name: /November 9, 2026/ }))
      expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-09", to: null })
      await userEvent.click(page.getByRole("button", { name: /November 3, 2026/ }))
      expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-03", to: "2026-11-09" })
    })

    it("range: a new first pick clears to", async () => {
      const onChange = vi.fn()
      await render.calendar({ mode: "range", month: "2026-11", value: { from: "2026-11-03", to: "2026-11-09" }, onChange })
      await userEvent.click(page.getByRole("button", { name: /November 12, 2026/ }))
      expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-12", to: null })
    })

    it("the Spanish locale starts the week on Monday and names months in Spanish", async () => {
      await render.calendar({ month: "2026-11", locale: "es-ES" })
      const headers = Array.from(document.querySelectorAll('[role="columnheader"]')).map((th) => th.getAttribute("aria-label"))
      expect(headers[0]?.toLowerCase()).toBe("lunes")
      await expect.poll(() => headingText()?.toLowerCase()).toContain("noviembre")
      await expectNoA11yViolations()
    })
  })

  describe(`DatePicker (${render.name})`, () => {
    it("single: is named by its Field label, shows the formatted value, and passes axe closed and open", async () => {
      await render.datePicker({ value: "2026-11-09" })
      await expect.element(page.getByRole("button", { name: /Due date/ })).toHaveTextContent("Nov 9, 2026")
      await expectNoA11yViolations()
      await userEvent.click(pickerTrigger())
      await expect.poll(pickerOpen).toBe(true)
      await expectNoA11yViolations()
    })

    it("single: opens on click with focus on the selected day", async () => {
      await render.datePicker({ value: "2026-11-09" })
      await userEvent.click(pickerTrigger())
      await expect.poll(() => document.activeElement?.getAttribute("data-iso")).toBe("2026-11-09")
    })

    it("single: Enter selects the focused day, closes the picker and returns focus to the trigger", async () => {
      const onChange = vi.fn()
      await render.datePicker({ value: "2026-11-09", onChange })
      await userEvent.click(pickerTrigger())
      await expect.poll(() => document.activeElement?.getAttribute("data-iso")).toBe("2026-11-09")
      await userEvent.keyboard("{ArrowRight}")
      await expect.poll(() => document.activeElement?.getAttribute("data-iso")).toBe("2026-11-10")
      await userEvent.keyboard("{Enter}")
      expect(onChange).toHaveBeenLastCalledWith("2026-11-10")
      await expect.poll(pickerOpen).toBe(false)
      expect(document.activeElement).toBe(pickerTrigger())
      await expect.poll(() => hidden("due")).toBe("2026-11-10")
    })

    it("single: Escape closes the picker and returns focus to the trigger", async () => {
      await render.datePicker({ value: "2026-11-09" })
      await userEvent.click(pickerTrigger())
      await expect.poll(pickerOpen).toBe(true)
      await userEvent.keyboard("{Escape}")
      await expect.poll(pickerOpen).toBe(false)
      expect(document.activeElement).toBe(pickerTrigger())
    })

    it("single: the clear button empties the value and the hidden input, and is not inside the trigger", async () => {
      const onChange = vi.fn()
      await render.datePicker({ value: "2026-11-09", onChange })
      expect(pickerTrigger().querySelector("button")).toBeNull()
      await userEvent.click(page.getByRole("button", { name: "Clear date" }))
      expect(onChange).toHaveBeenLastCalledWith(null)
      await expect.poll(() => hidden("due")).toBe("")
      expect(document.activeElement).toBe(pickerTrigger())
    })

    it("single: the hidden input holds the ISO date", async () => {
      await render.datePicker({ value: "2026-03-08" })
      expect(hidden("due")).toBe("2026-03-08")
    })

    it("range: shows two months, closes after the second pick, and writes an ISO interval", async () => {
      const onChange = vi.fn()
      await render.datePicker({ mode: "range", onChange })
      await userEvent.click(pickerTrigger())
      await expect.poll(pickerOpen).toBe(true)
      // The range opens on today's month, so move to November 2026 first.
      const target = "2026-11"
      for (let i = 0; i < 36 && !document.querySelector(`[data-iso="${target}-03"]`); i++) {
        const before = document.querySelector('[role="grid"] [data-iso]')!.getAttribute("data-iso")!
        await userEvent.click(page.getByRole("button", { name: before < target ? "Next month" : "Previous month" }))
      }
      expect(document.querySelectorAll('[role="grid"]').length).toBe(2)
      await userEvent.click(page.getByRole("button", { name: /November 3, 2026/ }))
      expect(pickerOpen()).toBe(true)
      await userEvent.click(page.getByRole("button", { name: /November 9, 2026/ }))
      await expect.poll(pickerOpen).toBe(false)
      expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-03", to: "2026-11-09" })
      await expect.poll(() => hidden("stay")).toBe("2026-11-03/2026-11-09")
      expect(pickerTrigger().textContent).toContain("Nov 3 – 9, 2026")
    })

    it("range: the hidden input is empty while the range is incomplete", async () => {
      await render.datePicker({ mode: "range" })
      await userEvent.click(pickerTrigger())
      await expect.poll(pickerOpen).toBe(true)
      const first = document.querySelector<HTMLElement>('[role="grid"] [data-iso][tabindex="0"]')!
      await userEvent.click(first)
      expect(pickerOpen()).toBe(true)
      expect(hidden("stay")).toBe("")
    })

    it("range: a preset selects its range and closes the picker", async () => {
      const onChange = vi.fn()
      await render.datePicker({ mode: "range", onChange, presets: [{ label: "Last 7 days", value: { from: "2026-11-03", to: "2026-11-09" } }] })
      await userEvent.click(pickerTrigger())
      await userEvent.click(page.getByRole("button", { name: "Last 7 days" }))
      expect(onChange).toHaveBeenLastCalledWith({ from: "2026-11-03", to: "2026-11-09" })
      await expect.poll(pickerOpen).toBe(false)
      await expect.poll(() => hidden("stay")).toBe("2026-11-03/2026-11-09")
    })
  })

  describe(`PhoneInput (${render.name})`, () => {
    it("is a tel input with a country code combobox, and passes axe", async () => {
      await render.phoneInput({})
      const input = page.getByRole("textbox", { name: "Phone" }).element() as HTMLInputElement
      expect(input.type).toBe("tel")
      expect(input.placeholder).toBe("555 000 0000")
      expect(countryTrigger().element().textContent).toContain("+1")
      await expectNoA11yViolations()
    })

    it("opens the country list with the keyboard and focuses the search field", async () => {
      await render.phoneInput({})
      countryTrigger().element().focus()
      await userEvent.keyboard("{ArrowDown}")
      await expect.poll(countryListOpen).toBe(true)
      await expect.element(countrySearch()).toHaveFocus()
      await expectNoA11yViolations()
    })

    it("searches countries by name, dial code and ISO code", async () => {
      await render.phoneInput({})
      countryTrigger().element().focus()
      await userEvent.keyboard("{Enter}")
      await expect.element(countrySearch()).toHaveFocus()

      await userEvent.keyboard("fin")
      await expect.poll(countryOptions).toEqual(["🇫🇮Finland+358"])
      expect(activeCountry()).toBe("🇫🇮Finland+358")

      await userEvent.clear(countrySearch())
      await userEvent.keyboard("+44")
      await expect.poll(countryOptions).toEqual(["🇬🇧UnitedKingdom+44"])

      await userEvent.clear(countrySearch())
      await userEvent.keyboard("mx")
      await expect.poll(countryOptions).toEqual(["🇲🇽Mexico+52"])
    })

    it("moves the active country with arrows and selects it with Enter", async () => {
      const onCountryChange = vi.fn()
      await render.phoneInput({ onCountryChange })
      countryTrigger().element().focus()
      await userEvent.keyboard("{Enter}")
      await expect.element(countrySearch()).toHaveFocus()
      await userEvent.keyboard("{ArrowDown}")
      expect(activeCountry()).toBe("🇬🇧UnitedKingdom+44")
      await userEvent.keyboard("{Enter}")
      expect(onCountryChange).toHaveBeenCalledWith("GB")
      await expect.poll(countryListOpen).toBe(false)
      await expect.element(countryTrigger()).toHaveFocus()
      await expect.poll(() => countryTrigger().element().textContent).toContain("+44")
    })

    it("Escape closes the country list without changing the country", async () => {
      const onCountryChange = vi.fn()
      await render.phoneInput({ onCountryChange })
      countryTrigger().element().focus()
      await userEvent.keyboard("{Enter}")
      await expect.element(countrySearch()).toHaveFocus()
      await userEvent.keyboard("gb")
      await userEvent.keyboard("{Escape}")
      await expect.poll(countryListOpen).toBe(false)
      expect(onCountryChange).not.toHaveBeenCalled()
    })

    it("clears the search when the country list reopens", async () => {
      await render.phoneInput({})
      countryTrigger().element().focus()
      await userEvent.keyboard("{Enter}")
      await expect.element(countrySearch()).toHaveFocus()
      await userEvent.keyboard("+44")
      await userEvent.keyboard("{Enter}")
      await expect.poll(countryListOpen).toBe(false)
      await userEvent.keyboard("{Enter}")
      await expect.element(countrySearch()).toHaveFocus()
      expect((countrySearch().element() as HTMLInputElement).value).toBe("")
      expect(countryOptions().length).toBeGreaterThan(50)
    })
  })
}
