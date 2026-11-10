import { Input } from "@glob-ui/input"
import { Label } from "@glob-ui/label"

export default function LabelDefault() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="name">Full name</Label>
      <Input id="name" placeholder="Ana Torres" />
    </div>
  )
}
