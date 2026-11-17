<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import LayoutSlot from "../layout/LayoutSlot.svelte"
  import LayoutNavProvider from "../layout/LayoutNavProvider.svelte"
  import LayoutMobileNav from "../layout/LayoutMobileNav.svelte"
  import SkipLink from "../layout/SkipLink.svelte"
  import { STACKED_CLASSES, STACKED_FOOTER_CLASSES, STACKED_HEADER_CLASSES, STACKED_MAIN_CLASSES } from "@glob-ui/recipes"

  let {
    header,
    children,
    footer,
    mobileNav,
    navLabel = "Navigation",
    class: className,
    ...rest
  }: HTMLAttributes<HTMLDivElement> & {
    /** The top navigation. It stays visible while the document scrolls. */
    header?: Snippet
    /** The page. It is in document flow, so the document scrolls. It has no padding: put a `PageLayout` in it. */
    children?: Snippet
    footer?: Snippet
    /** The navigation for small screens. When set, `LayoutNavTrigger` in the header opens it in a Sheet. */
    mobileNav?: Snippet
    /** The accessible name of the mobile navigation dialog. */
    navLabel?: string
  } = $props()

  const mainId = $props.id()
</script>

<LayoutNavProvider>
  <div
    data-layout="stacked"
    data-scroll-mode="document"
    class={cn(STACKED_CLASSES, className)}
    {...rest}
  >
    <SkipLink targetId={mainId} />
    {#if header}
      <LayoutSlot
        name="header"
        scroll="fixed"
        as="header"
        class={STACKED_HEADER_CLASSES}
      >
        {@render header()}
      </LayoutSlot>
    {/if}
    <main id={mainId} tabindex="-1" data-slot="main" data-scroll="scroll" class={STACKED_MAIN_CLASSES}>
      {@render children?.()}
    </main>
    {#if footer}
      <LayoutSlot name="footer" scroll="fixed" as="footer" class={STACKED_FOOTER_CLASSES}>
        {@render footer()}
      </LayoutSlot>
    {/if}
    {#if mobileNav}<LayoutMobileNav label={navLabel}>{@render mobileNav()}</LayoutMobileNav>{/if}
  </div>
</LayoutNavProvider>
