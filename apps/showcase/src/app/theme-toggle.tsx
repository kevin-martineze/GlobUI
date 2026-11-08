"use client"

import { useSyncExternalStore } from "react"
import { Segmented } from "@glob-ui/segmented"

// Keep in sync with the inline script in layout.tsx.
const THEME_KEY = "glob-theme"
type Theme = "light" | "system" | "dark"

const listeners = new Set<() => void>()

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    return stored === "light" || stored === "dark" ? stored : "system"
  } catch {
    return "system"
  }
}

function writeTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Storage blocked (private mode, disabled cookies): the choice lasts for this page only.
  }
  if (theme === "system") delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // Other tabs changing the theme.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== THEME_KEY) return
    const next = readTheme()
    if (next === "system") delete document.documentElement.dataset.theme
    else document.documentElement.dataset.theme = next
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function ThemeToggle() {
  // Server snapshot is "system"; the real value is read on the client after hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme)

  return (
    <Segmented
      size="sm"
      value={theme}
      onChange={(v) => writeTheme(v as Theme)}
      options={[
        { value: "light", label: "Light" },
        { value: "system", label: "System" },
        { value: "dark", label: "Dark" },
      ]}
    />
  )
}
