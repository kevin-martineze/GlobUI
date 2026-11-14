<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { contentVariants, asideVariants } from "@glob-ui/recipes"
  import { PAGE_ASIDE_HEADER_OFFSET_CLASSES, PAGE_HEADER_CONTENT_CLASSES, PAGE_LAYOUT_CLASSES, PAGE_LAYOUT_PADDED_CLASSES } from "@glob-ui/recipes"

  let {
    header,
    children,
    aside,
    asideWidth,
    width,
    class: className,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    /** The page header. It sticks to the top of the nearest scroll region while the content scrolls. */
    header?: Snippet
    children?: Snippet
    /** A side column. Sticky from `lg`; below `lg` it stacks under the content. */
    aside?: Snippet
    asideWidth?: "sm" | "md"
    /** The maximum width of the content column. */
    width?: "default" | "wide" | "full"
  } = $props()
</script>

<div
  data-layout="page"
  class={cn(
    PAGE_LAYOUT_CLASSES,
    !header && PAGE_LAYOUT_PADDED_CLASSES,
    className
  )}
  {...rest}
>
  <div data-slot="content" data-scroll="scroll" class={contentVariants({ width })}>
    {#if header}
      <div data-slot="header" data-scroll="fixed" class={PAGE_HEADER_CONTENT_CLASSES}>
        {@render header()}
      </div>
    {/if}
    {@render children?.()}
  </div>
  {#if aside}
    <aside data-slot="aside" data-scroll="fixed" class={cn(asideVariants({ asideWidth }), header && PAGE_ASIDE_HEADER_OFFSET_CLASSES)}>
      {@render aside()}
    </aside>
  {/if}
</div>
