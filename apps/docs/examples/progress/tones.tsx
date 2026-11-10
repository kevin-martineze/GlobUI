import { Label } from "@glob-ui/label"
import { Progress } from "@glob-ui/progress"

const tones = ["primary", "success", "warning", "danger"] as const

export default function ProgressTones() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {tones.map((tone) => (
        <div key={tone} className="flex flex-col gap-2">
          <Label id={`tone-${tone}`} className="capitalize">
            {tone}
          </Label>
          <Progress aria-labelledby={`tone-${tone}`} value={60} tone={tone} />
        </div>
      ))}
    </div>
  )
}
