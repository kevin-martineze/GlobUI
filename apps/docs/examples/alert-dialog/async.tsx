"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@glob-ui/alert-dialog"

export default function AlertDialogAsync() {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!busy) setOpen(next)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="outline">Publish page</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Publish this page?</AlertDialogTitle>
        <AlertDialogDescription>It goes live for everyone with the link.</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(e) => {
              // Keep the dialog open while the work runs, then close it.
              e.preventDefault()
              setBusy(true)
              window.setTimeout(() => {
                setBusy(false)
                setOpen(false)
              }, 1000)
            }}
          >
            {busy ? "Publishing..." : "Publish"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
