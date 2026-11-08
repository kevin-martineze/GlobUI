"use client"

import { Button } from "@glob-ui/button"
import { toast } from "@glob-ui/toast"

// The <Toaster /> is mounted once in the site layout. Toasts appear in the bottom-right corner.
export default function ToastDefault() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button variant="outline" onClick={() => toast({ title: "Event created", description: "Friday at 10:00." })}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Changes saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Upload failed", { description: "Try a smaller file." })}>
        Error
      </Button>
    </div>
  )
}
