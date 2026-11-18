<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { ACCORDION_CHEVRON_CLASSES, ACCORDION_HEADING_CLASSES, ACCORDION_TRIGGER_CLASSES } from "@glob-ui/recipes"
  import { getAccordionContext, getAccordionItemContext } from "../shared/context"

  type Props = HTMLButtonAttributes & {
    /** Heading that wraps the button. Defaults to h3. */
    headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6"
  }
  let { headingLevel = "h3", class: className, onclick, children, ...rest }: Props = $props()
  const accordion = getAccordionContext("AccordionTrigger")
  const item = getAccordionItemContext("AccordionTrigger")
</script>

<svelte:element this={headingLevel} class={ACCORDION_HEADING_CLASSES}>
  <button
    type="button"
    id={item.triggerId}
    aria-expanded={item.open}
    aria-controls={item.contentId}
    disabled={item.disabled}
    data-accordion-trigger=""
    data-state={item.open ? "open" : "closed"}
    class={cn(ACCORDION_TRIGGER_CLASSES, className)}
    onclick={(event) => {
      onclick?.(event)
      if (!event.defaultPrevented) accordion.toggle(item.value)
    }}
    {...rest}
  >
    {@render children?.()}
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={ACCORDION_CHEVRON_CLASSES}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  </button>
</svelte:element>
