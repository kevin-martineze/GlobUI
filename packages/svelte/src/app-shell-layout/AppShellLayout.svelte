<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { sidebarVariants } from "@glob-ui/recipes"
  import LayoutSlot from "../layout/LayoutSlot.svelte"
  import LayoutNavProvider from "../layout/LayoutNavProvider.svelte"
  import LayoutMobileNav from "../layout/LayoutMobileNav.svelte"
  import SkipLink from "../layout/SkipLink.svelte"
  import { APP_SHELL_CLASSES, APP_SHELL_HEADER_CLASSES, APP_SHELL_MAIN_CLASSES, APP_SHELL_SIDEBAR_LIST_CLASSES } from "@glob-ui/recipes"

  let {
    header,
    sidebar,
    children,
    sidebarLabel = "Main navigation",
    sidebarSide = "left",
    sidebarWidth = "md",
    class: className,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    /** The fixed header across the top. Put `LayoutNavTrigger` here for small screens. */
    header?: Snippet
    /** The fixed sidebar navigation. Below `lg` it moves into a Sheet, opened by `LayoutNavTrigger`. */
    sidebar?: Snippet
    /** The main region. It is the one region that scrolls. It has no padding: put a `PageLayout` in it. */
    children?: Snippet
    sidebarLabel?: string
    sidebarSide?: "left" | "right"
    sidebarWidth?: "sm" | "md" | "lg"
  } = $props()

  const mainId = $props.id()
</script>

<LayoutNavProvider>
  <div
    data-layout="app-shell"
    data-scroll-mode="app"
    class={cn(
      APP_SHELL_CLASSES,
      className
    )}
    {...rest}
  >
    <SkipLink targetId={mainId} />
    {#if header}
      <LayoutSlot
        name="header"
        scroll="fixed"
        as="header"
        class={APP_SHELL_HEADER_CLASSES}
      >
        {@render header()}
      </LayoutSlot>
    {/if}
    <div class="flex min-h-0 flex-1">
      {#if sidebar}
        <LayoutSlot
          name="sidebar"
          scroll="fixed"
          as="nav"
          aria-label={sidebarLabel}
          class={cn(sidebarVariants({ side: sidebarSide, width: sidebarWidth }), sidebarSide === "right" && "order-last")}
        >
          <LayoutSlot name="sidebar-list" scroll="scroll" class={APP_SHELL_SIDEBAR_LIST_CLASSES}>
            {@render sidebar()}
          </LayoutSlot>
        </LayoutSlot>
      {/if}
      <LayoutSlot
        name="main"
        scroll="scroll"
        as="main"
        id={mainId}
        class={cn(APP_SHELL_MAIN_CLASSES, sidebarSide === "right" && "order-first")}
      >
        {@render children?.()}
      </LayoutSlot>
    </div>
    {#if sidebar}<LayoutMobileNav label={sidebarLabel}>{@render sidebar()}</LayoutMobileNav>{/if}
  </div>
</LayoutNavProvider>
