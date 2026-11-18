/** The id of a tab or its panel. Whitespace in the value becomes "-", as in the React package. */
export const tabsId = (baseId: string, part: "tab" | "panel", value: string) => `${baseId}-${part}-${value.replace(/\s+/g, "-")}`
