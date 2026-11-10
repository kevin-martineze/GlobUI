import { Button } from "@glob-ui/button"
import { Tooltip } from "@glob-ui/tooltip"

export default function TooltipDefault() {
  return (
    <Tooltip content="Copies the link to your clipboard">
      <Button variant="outline">Share</Button>
    </Tooltip>
  )
}
