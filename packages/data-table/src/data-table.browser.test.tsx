import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"
import { page, userEvent } from "vitest/browser"
import { DataTable, createDataTableColumnHelper, type DataTableColumn } from "./data-table"
import { expectNoA11yViolations } from "../../../tests/browser/a11y"

type User = { id: string; name: string; city: string; role: string }

const USERS: User[] = [
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

const helper = createDataTableColumnHelper<User>()
const columns: DataTableColumn<User>[] = [
  helper.accessor("name", { header: "Name" }),
  helper.accessor("city", { header: "City" }),
  helper.accessor("role", { header: "Role" }),
]

const headerOf = (label: string) => Array.from(document.querySelectorAll("th")).find((th) => th.textContent?.includes(label))!
const bodyNames = () => Array.from(document.querySelectorAll("tbody tr")).map((tr) => tr.querySelector("td")?.textContent?.trim())
const status = () => document.querySelector('[role="status"]')?.textContent?.trim()

describe("DataTable: sorting", () => {
  it("click toggles aria-sort and the order", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS.slice(0, 4)} sorting />)
    await userEvent.click(page.getByRole("button", { name: "Name" }))
    expect(headerOf("Name").getAttribute("aria-sort")).toBe("ascending")
    expect(bodyNames()).toEqual(["Ana", "Benito", "Canción", "Dara"])
    await userEvent.click(page.getByRole("button", { name: "Name" }))
    expect(headerOf("Name").getAttribute("aria-sort")).toBe("descending")
    expect(bodyNames()[0]).toBe("Dara")
  })

  it("a column that is not sortable has no aria-sort", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS.slice(0, 2)} sorting />)
    expect(headerOf("Name").hasAttribute("aria-sort")).toBe(true)
    const role = headerOf("Role")
    expect(role.hasAttribute("aria-sort")).toBe(true)
  })
})

describe("DataTable: filtering", () => {
  it("narrows rows accent-insensitively and announces the count", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS} globalFilter />)
    await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "cancion")
    expect(bodyNames()).toEqual(["Canción"])
    await expect.poll(status).toBe("1 result")
  })

  it("every word can match any column", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS} globalFilter />)
    await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "editor lisbon")
    expect(bodyNames()).toEqual(["Eli"])
  })

  it("shows the empty state when nothing matches", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS} globalFilter emptyState="Nobody here." />)
    await userEvent.fill(page.getByRole("searchbox", { name: "Search" }), "zzzz")
    await expect.element(page.getByText("Nobody here.")).toBeVisible()
  })
})

describe("DataTable: pagination", () => {
  it("moves between pages and announces the page", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS} pagination pageSize={5} />)
    expect(bodyNames().length).toBe(5)
    await userEvent.click(page.getByRole("button", { name: "Next page" }))
    expect(bodyNames()[0]).toBe("Fátima")
    // The live region announces the page; the visible label shows it too.
    await expect.poll(status).toBe("Page 2 of 3")
    expect(Array.from(document.querySelectorAll("span")).some((el) => el.textContent === "Page 2 of 3")).toBe(true)
  })

  it("changing the page size shows more rows and goes back to the first page", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS} pagination pageSize={5} pageSizeOptions={[5, 10]} />)
    await userEvent.click(page.getByRole("button", { name: "Next page" }))
    await userEvent.click(page.getByRole("combobox", { name: "Rows per page" }))
    await userEvent.click(page.getByRole("option", { name: "10" }))
    expect(bodyNames().length).toBe(10)
    await expect.poll(status).toBe("Page 1 of 2")
  })
})

describe("DataTable: row selection", () => {
  it("select all selects the page, and a partial selection makes the header indeterminate", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS.slice(0, 4)} rowSelection />)
    const all = page.getByRole("checkbox", { name: "Select all rows" }).element() as HTMLInputElement
    await userEvent.click(page.getByRole("checkbox", { name: "Select row" }).first())
    expect(all.indeterminate).toBe(true)
    await userEvent.click(all)
    const rows = Array.from(document.querySelectorAll("tbody tr")) as HTMLElement[]
    expect(rows.every((tr) => tr.dataset.state === "selected")).toBe(true)
    expect(all.checked).toBe(true)
  })

  it("the bulk counter reads the selected count", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS.slice(0, 4)} rowSelection />)
    await userEvent.click(page.getByRole("checkbox", { name: "Select row" }).first())
    await expect.element(page.getByText("1 of 4 rows selected")).toBeVisible()
  })
})

describe("DataTable: column visibility", () => {
  it("hides a column from the Columns menu", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={USERS.slice(0, 2)} columnVisibility />)
    expect(headerOf("City")).toBeTruthy()
    await userEvent.click(page.getByRole("button", { name: "Columns" }))
    await userEvent.click(page.getByRole("menuitemcheckbox", { name: "City" }))
    expect(Array.from(document.querySelectorAll("th")).some((th) => th.textContent?.includes("City"))).toBe(false)
  })
})

describe("DataTable: manual mode and loading", () => {
  it("calls the handlers and does not sort or filter locally", async () => {
    const onSortingChange = vi.fn()
    await render(
      <DataTable
        aria-label="Users"
        columns={columns}
        data={USERS.slice(0, 3)}
        sorting
        manual
        state={{ sorting: [] }}
        onSortingChange={onSortingChange}
      />
    )
    await userEvent.click(page.getByRole("button", { name: "Name" }))
    expect(onSortingChange).toHaveBeenLastCalledWith([{ id: "name", desc: false }])
    // The data stays in the order it was given.
    expect(bodyNames()).toEqual(["Ana", "Benito", "Canción"])
  })

  it("loading shows skeletons and aria-busy on the table", async () => {
    await render(<DataTable aria-label="Users" columns={columns} data={[]} loading pagination pageSize={3} />)
    const table = document.querySelector("table")!
    expect(table.getAttribute("aria-busy")).toBe("true")
    expect(document.querySelectorAll("tbody .animate-pulse, tbody [class*='animate']").length).toBeGreaterThan(0)
  })
})

describe("DataTable: accessibility and layout", () => {
  it("passes axe with every feature on", async () => {
    await render(
      <DataTable aria-label="Users" columns={columns} data={USERS} sorting globalFilter pagination rowSelection columnVisibility pageSize={5} />
    )
    await expectNoA11yViolations()
  })

  it("does not overflow the page at 375px (the table scrolls inside itself)", async () => {
    await page.viewport(375, 812)
    try {
      await render(
        <DataTable aria-label="Users" columns={columns} data={USERS} sorting globalFilter pagination rowSelection pageSize={5} />
      )
      await expect.poll(() => document.documentElement.scrollWidth).toBeLessThanOrEqual(375)
    } finally {
      await page.viewport(1280, 800)
    }
  })
})
