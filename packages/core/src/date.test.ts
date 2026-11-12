import { describe, expect, it } from "vitest"
import { addDays, addMonths, compareISODate, daysInMonth, isSameDay, parseISODate, toISODate } from "./date"
import { defaultWeekStart, weekdayNames } from "./locale"

describe("ISO date helpers", () => {
  it("round-trips a date through local midnight", () => {
    expect(toISODate(parseISODate("2026-11-09"))).toBe("2026-11-09")
    const d = parseISODate("2026-03-08")
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 2, 8, 0])
  })

  it("keeps years below 100 and pads the fields", () => {
    expect(toISODate(parseISODate("0099-01-05"))).toBe("0099-01-05")
  })

  it("adds days across month, year and daylight saving boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01")
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01")
    // US daylight saving starts 2026-03-08 and ends 2026-11-01: local fields, so no hour is lost.
    expect(addDays("2026-03-07", 1)).toBe("2026-03-08")
    expect(addDays("2026-03-08", 1)).toBe("2026-03-09")
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01")
    expect(addDays("2026-11-01", -1)).toBe("2026-10-31")
    expect(addDays("2026-11-09", -7)).toBe("2026-11-02")
  })

  it("clamps the day when adding months to a shorter month", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28")
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29")
    expect(addMonths("2026-03-31", -1)).toBe("2026-02-28")
    expect(addMonths("2026-11-09", 12)).toBe("2027-11-09")
    expect(addMonths("2026-11-09", -13)).toBe("2025-10-09")
  })

  it("knows leap years for month length", () => {
    expect(daysInMonth("2024-02")).toBe(29)
    expect(daysInMonth("2026-02")).toBe(28)
    expect(daysInMonth("2000-02")).toBe(29)
    expect(daysInMonth("1900-02")).toBe(28)
    expect(daysInMonth("2026-04")).toBe(30)
  })

  it("compares and matches days", () => {
    expect(compareISODate("2026-01-02", "2026-01-10")).toBe(-1)
    expect(compareISODate("2026-01-10", "2026-01-02")).toBe(1)
    expect(compareISODate("2026-01-10", "2026-01-10")).toBe(0)
    expect(isSameDay("2026-01-10", "2026-01-10")).toBe(true)
    expect(isSameDay("2026-01-10", "2026-01-11")).toBe(false)
  })
})

describe("locale helpers", () => {
  it("starts the week on Monday for es-ES and on Sunday for en-US", () => {
    expect(defaultWeekStart("es-ES")).toBe(1)
    expect(defaultWeekStart("en-US")).toBe(0)
  })

  it("names weekdays in the locale, starting at weekStart", () => {
    const names = weekdayNames("es-ES", 1).map((n) => n.long.toLowerCase())
    expect(names[0]).toBe("lunes")
    expect(names[6]).toBe("domingo")
  })
})
