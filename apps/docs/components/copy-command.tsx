"use client"

import { useEffect, useState } from "react"

type Status = "idle" | "copied" | "failed"

/**
 * A command with a copy button. The button keeps its accessible name; the result ("Copied", or why it failed) is
 * announced through a polite status region and shown next to the button.
 */
export function CopyCommand({ command }: { command: string }) {
  const [status, setStatus] = useState<Status>("idle")

  useEffect(() => {
    if (status === "idle") return
    const timer = window.setTimeout(() => setStatus("idle"), 2000)
    return () => window.clearTimeout(timer)
  }, [status])

  return (
    <div className="flex max-w-full flex-wrap items-center justify-center gap-3">
      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-fd-border bg-fd-card py-2 pl-4 pr-2 font-mono text-sm text-fd-foreground">
        <code className="min-w-0 break-all">{command}</code>
        <button
          type="button"
          aria-label="Copy install command"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(command)
              setStatus("copied")
            } catch {
              // The clipboard can be blocked (permissions, an unfocused window). The command is selectable text.
              setStatus("failed")
            }
          }}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-sm text-fd-muted-foreground">
        {status === "copied" ? "Copied" : status === "failed" ? "Could not copy. Select the command to copy it." : ""}
      </p>
    </div>
  )
}
