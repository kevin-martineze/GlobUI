import { describe, expect, it } from "vitest"
import { buildCalendarWeeks, calendarKeyTarget, formatDateValue, monthKey, shiftMonth, startOfWeek } from "./calendar"

describe("calendar helpers", () => {
  it("builds full weeks around a month, marking the adjacent days", () => {
    // November 2026 starts on a Sunday and has 30 days: five weeks from Sunday.
    const weeks = buildCalendarWeeks("2026-11", 0)
    expect(weeks).toHaveLength(5)
    expect(weeks[0][0]).toEqual({ iso: "2026-11-01", inMonth: true })
    expect(weeks[4][6]).toEqual({ iso: "2026-12-05", inMonth: false })
    // From Monday, the first week starts in October.
    expect(buildCalendarWeeks("2026-11", 1)[0][0]).toEqual({ iso: "2026-10-26", inMonth: false })
  })

  it("moves months and finds the start of the week", () => {
    expect(monthKey("2026-11-09")).toBe("2026-11")
    expect(shiftMonth("2026-11", 2)).toBe("2027-01")
    expect(shiftMonth("2026-01", -1)).toBe("2025-12")
    expect(startOfWeek("2026-11-18", 0)).toBe("2026-11-15")
    expect(startOfWeek("2026-11-18", 1)).toBe("2026-11-16")
  })

  it("maps the grid keys to the day they move to", () => {
    expect(calendarKeyTarget("ArrowRight", "2026-11-30")).toBe("2026-12-01")
    expect(calendarKeyTarget("ArrowUp", "2026-11-09")).toBe("2026-11-02")
    expect(calendarKeyTarget("End", "2026-11-18")).toBe("2026-11-21")
    expect(calendarKeyTarget("PageUp", "2026-03-31")).toBe("2026-02-28")
    expect(calendarKeyTarget("PageDown", "2026-11-09", { shiftKey: true })).toBe("2027-11-09")
    expect(calendarKeyTarget("Enter", "2026-11-09")).toBeNull()
  })

  it("formats a day and a range", () => {
    expect(formatDateValue("2026-11-09", false, "en-US")).toBe("Nov 9, 2026")
    // Intl puts thin spaces around the range dash.
    expect(formatDateValue({ from: "2026-11-03", to: "2026-11-09" }, true, "en-US")).toMatch(/^Nov 3\s–\s9, 2026$/)
    expect(formatDateValue({ from: "2026-11-03", to: null }, true, "en-US")).toBe("Nov 3, 2026 – …")
    expect(formatDateValue(null, false, "en-US")).toBeNull()
  })
})
