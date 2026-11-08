"use client"

import { useState } from "react"
import { Button } from "@glob-ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@glob-ui/dialog"

// Controlled, and a backdrop click does not close it: the user must choose.
export default function DialogControlled() {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState("none yet")
  return (
    <div className="flex flex-col items-center gap-3">
      <Dialog open={open} onOpenChange={setOpen} closeOnOutsideClick={false}>
        <DialogTrigger asChild>
          <Button variant="outline">Delete project</Button>
        </DialogTrigger>
        <DialogContent size="sm" showCloseButton={false}>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setResult("cancelled")
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setResult("deleted")
                setOpen(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="text-sm text-fd-muted-foreground">Last choice: {result}</p>
    </div>
  )
}
