import { Slot } from "@glob-ui/slot"

// Slot passes its props, className and handlers to the single child element.
export default function SlotDefault() {
  return (
    <Slot className="rounded-md bg-fd-muted px-3 py-2 text-sm" data-kind="from-slot">
      <span>Rendered by the child element</span>
    </Slot>
  )
}
