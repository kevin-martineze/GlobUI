"use client"

import { Button } from "@glob-ui/button"
import { toast } from "@glob-ui/toast"

export default function ToastAction() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast({
          title: "Message archived",
          duration: Infinity,
          action: { label: "Undo", onClick: () => toast.success("Message restored") },
        })
      }
    >
      Archive message
    </Button>
  )
}
