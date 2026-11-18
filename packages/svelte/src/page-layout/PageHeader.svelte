<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { PAGE_HEADER_ACTIONS_CLASSES, PAGE_HEADER_CLASSES, PAGE_HEADER_ROW_CLASSES, PAGE_HEADER_SECONDARY_TEXT_CLASSES, PAGE_HEADER_TITLE_BLOCK_CLASSES, PAGE_HEADER_TITLE_CLASSES } from "@glob-ui/recipes"

  let {
    title,
    description,
    breadcrumbs,
    actions,
    class: className,
    ...rest
  }: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
    /** The page title (an h1). It replaces the `title` attribute of the element. */
    title: Snippet | string
    description?: Snippet | string
    /** A breadcrumb trail, or any navigation above the title. */
    breadcrumbs?: Snippet
    /** Buttons for the page. They wrap onto a new line on narrow screens. */
    actions?: Snippet
  } = $props()
</script>

<div data-slot="page-header" class={cn(PAGE_HEADER_CLASSES, className)} {...rest}>
  {#if breadcrumbs}
    <div class={PAGE_HEADER_SECONDARY_TEXT_CLASSES}>{@render breadcrumbs()}</div>
  {/if}
  <div class={PAGE_HEADER_ROW_CLASSES}>
    <div class={PAGE_HEADER_TITLE_BLOCK_CLASSES}>
      <h1 class={PAGE_HEADER_TITLE_CLASSES}>
        {#if typeof title === "string"}{title}{:else}{@render (title as Snippet)()}{/if}
      </h1>
      {#if description}
        <p class={PAGE_HEADER_SECONDARY_TEXT_CLASSES}>
          {#if typeof description === "string"}{description}{:else}{@render (description as Snippet)()}{/if}
        </p>
      {/if}
    </div>
    {#if actions}
      <div class={PAGE_HEADER_ACTIONS_CLASSES}>{@render actions()}</div>
    {/if}
  </div>
</div>
