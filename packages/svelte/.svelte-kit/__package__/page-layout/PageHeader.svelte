<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"

  let {
    title,
    description,
    breadcrumbs,
    actions,
    class: className,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    title: Snippet | string
    description?: Snippet | string
    /** A breadcrumb trail, or any navigation above the title. */
    breadcrumbs?: Snippet
    /** Buttons for the page. They wrap onto a new line on narrow screens. */
    actions?: Snippet
  } = $props()
</script>

<div data-slot="page-header" class={cn("flex min-w-0 flex-col gap-2", className)} {...rest}>
  {#if breadcrumbs}
    <div class="text-sm text-glob-text-secondary">{@render breadcrumbs()}</div>
  {/if}
  <div class="flex flex-wrap items-start justify-between gap-4">
    <div class="flex min-w-0 flex-col gap-1">
      <h1 class="break-words text-2xl font-semibold tracking-tight text-glob-text">
        {#if typeof title === "string"}{title}{:else}{@render (title as Snippet)()}{/if}
      </h1>
      {#if description}
        <p class="text-sm text-glob-text-secondary">
          {#if typeof description === "string"}{description}{:else}{@render (description as Snippet)()}{/if}
        </p>
      {/if}
    </div>
    {#if actions}
      <div class="flex flex-wrap items-center gap-2">{@render actions()}</div>
    {/if}
  </div>
</div>
