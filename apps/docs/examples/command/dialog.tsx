"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@glob-ui/command"
import { toast } from "@glob-ui/toast"

export default function CommandDialogExample() {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command menu <span className="ml-2 text-xs text-glob-text-secondary">⌘J</span>
      </Button>
      {/* ⌘K is taken by this site's search, so the example uses ⌘J. The default is "mod+k". */}
      <CommandDialog open={open} onOpenChange={setOpen} label="Command menu" shortcut="mod+j">
        <CommandInput placeholder="Search for a page or an action..." />
        <CommandList>
          <CommandGroup heading="Go to">
            <CommandItem value="Dashboard" onSelect={() => toast("Went to Dashboard")}>Dashboard</CommandItem>
            <CommandItem value="Documents" keywords={["files"]} onSelect={() => toast("Went to Documents")}>Documents</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem value="Toggle theme" keywords={["dark", "light"]} onSelect={() => toast.info("Theme toggled")}>
              Toggle theme <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem value="Send feedback" onSelect={() => toast.success("Thanks for the feedback")}>Send feedback</CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandEmpty>No results.</CommandEmpty>
      </CommandDialog>
    </div>
  )
}
