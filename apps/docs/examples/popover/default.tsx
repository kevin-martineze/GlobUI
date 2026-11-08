import { Button } from "@glob-ui/button"
import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@glob-ui/popover"

export default function PopoverDefault() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set dimensions</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Dimensions" className="w-64">
        <div className="flex flex-col gap-3">
          <Field label="Width">
            <Input defaultValue="320" />
          </Field>
          <Field label="Height">
            <Input defaultValue="240" />
          </Field>
        </div>
      </PopoverContent>
    </Popover>
  )
}
