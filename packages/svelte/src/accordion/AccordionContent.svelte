<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import {
    ACCORDION_CONTENT_BODY_CLASSES,
    ACCORDION_CONTENT_CLASSES,
    ACCORDION_CONTENT_CLIP_CLASSES,
    ACCORDION_CONTENT_CLOSED_CLASSES,
    ACCORDION_CONTENT_OPEN_CLASSES,
  } from "@glob-ui/recipes"
  import { getAccordionItemContext } from "../shared/context"

  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
  const item = getAccordionItemContext("AccordionContent")
</script>

<!-- Closed content stays mounted for the animation; inert keeps it out of focus and the a11y tree. -->
<div
  id={item.contentId}
  role="region"
  aria-labelledby={item.triggerId}
  data-state={item.open ? "open" : "closed"}
  inert={!item.open}
  class={cn(ACCORDION_CONTENT_CLASSES, item.open ? ACCORDION_CONTENT_OPEN_CLASSES : ACCORDION_CONTENT_CLOSED_CLASSES)}
  {...rest}
>
  <div class={ACCORDION_CONTENT_CLIP_CLASSES}>
    <div class={cn(ACCORDION_CONTENT_BODY_CLASSES, className)}>{@render children?.()}</div>
  </div>
</div>
