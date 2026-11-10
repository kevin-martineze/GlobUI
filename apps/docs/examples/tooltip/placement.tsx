import { Button } from "@glob-ui/button"
import { Tooltip } from "@glob-ui/tooltip"

export default function TooltipPlacement() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tooltip content="Top" placement="top" arrow>
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Right" placement="right" arrow>
        <Button variant="outline">Right</Button>
      </Tooltip>
      <Tooltip content="Bottom" placement="bottom" arrow>
        <Button variant="outline">Bottom</Button>
      </Tooltip>
    </div>
  )
}
