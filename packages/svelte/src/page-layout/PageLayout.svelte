<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { contentVariants, asideVariants } from "@glob-ui/recipes"

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
    "mx-auto flex w-full min-w-0 flex-col gap-6 px-4 pb-6 md:px-6 md:pb-8 lg:flex-row lg:items-start lg:gap-8",
    !header && "pt-4 md:pt-6",
    className
  )}
  {...rest}
>
  <div data-slot="content" data-scroll="scroll" class={contentVariants({ width })}>
    {#if header}
      <div data-slot="header" data-scroll="fixed" class="sticky top-0 z-10 bg-glob-surface pb-3 pt-4 md:pt-6">
        {@render header()}
      </div>
    {/if}
    {@render children?.()}
  </div>
  {#if aside}
    <aside data-slot="aside" data-scroll="fixed" class={cn(asideVariants({ asideWidth }), header && "lg:mt-6")}>
      {@render aside()}
    </aside>
  {/if}
</div>
