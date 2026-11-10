"use client"

import { useEffect, useState } from "react"
import { Label } from "@glob-ui/label"
import { Progress } from "@glob-ui/progress"

export default function ProgressDefault() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 10)), 600)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label id="upload-label">Uploading report.pdf</Label>
      <Progress aria-labelledby="upload-label" value={value} />
    </div>
  )
}
