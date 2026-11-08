import { Button } from "@glob-ui/button"

export default function ButtonStates() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
    </div>
  )
}
