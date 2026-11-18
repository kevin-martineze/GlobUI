<script lang="ts">
  import { setContext } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { ACCORDION_ITEM_CLASSES } from "@glob-ui/recipes"
  import { ACCORDION_ITEM_KEY, getAccordionContext, type AccordionItemContext } from "../shared/context"

  type Props = HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
  let { value, disabled = false, class: className, children, ...rest }: Props = $props()
  const accordion = getAccordionContext("AccordionItem")
  const id = $props.id()
  const open = $derived(accordion.isOpen(value))

  const ctx: AccordionItemContext = {
    get value() {
      return value
    },
    get open() {
      return open
    },
    get disabled() {
      return disabled
    },
    triggerId: `${id}-trigger`,
    contentId: `${id}-content`,
  }
  setContext(ACCORDION_ITEM_KEY, ctx)
</script>

<div data-state={open ? "open" : "closed"} class={cn(ACCORDION_ITEM_CLASSES, className)} {...rest}>
  {@render children?.()}
</div>
