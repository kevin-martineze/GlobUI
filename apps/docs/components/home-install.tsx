"use client"

import { useSyncExternalStore } from "react"
import { CopyCommand } from "@/components/copy-command"

const frameworks = [
  { value: "react", label: "React", command: "pnpm add @glob-ui/all" },
  { value: "svelte", label: "Svelte", command: "pnpm add @glob-ui/svelte" },
] as const

type Framework = (typeof frameworks)[number]["value"]

// The docs code tabs use groupId "framework" with persist: fumadocs keeps the choice under this key in session and
// local storage. Reading and writing the same key carries the choice between the home page and the docs.
const STORAGE_KEY = "framework"

function read(): Framework | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY)
    return value === "react" || value === "svelte" ? value : null
  } catch {
    return null
  }
}

// Subscribers to this tab's choice. The storage event covers other tabs.
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function select(value: Framework) {
  try {
    sessionStorage.setItem(STORAGE_KEY, value)
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage can be blocked; the switch then stays on React.
  }
  for (const listener of listeners) listener()
}

/** The install command on the home page, with a React | Svelte switch. */
export function HomeInstall() {
  // The server renders React; the stored choice applies after hydration.
  const framework = useSyncExternalStore(subscribe, () => read() ?? "react", () => "react" as Framework)

  const current = frameworks.find((f) => f.value === framework) ?? frameworks[0]

  return (
    <div className="flex flex-col items-center gap-3">
      <div role="group" aria-label="Framework" className="inline-flex rounded-lg border border-fd-border bg-fd-card p-1">
        {frameworks.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={framework === f.value}
            onClick={() => select(f.value)}
            className={
              "rounded-md px-3 py-1 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring " +
              (framework === f.value
                ? "bg-fd-primary text-fd-primary-foreground"
                : "text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground")
            }
          >
            {f.label}
          </button>
        ))}
      </div>
      <CopyCommand command={current.command} />
    </div>
  )
}
