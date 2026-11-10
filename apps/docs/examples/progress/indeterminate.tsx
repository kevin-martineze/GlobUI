import { Label } from "@glob-ui/label"
import { Progress } from "@glob-ui/progress"

export default function ProgressIndeterminate() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <Label id="sync-label">Syncing your workspace</Label>
      <Progress aria-labelledby="sync-label" value={null} size="lg" />
    </div>
  )
}
