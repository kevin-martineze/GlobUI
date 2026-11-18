<script lang="ts">
  import { StackedLayout } from "@glob-ui/svelte/stacked-layout"
  import { LayoutNavTrigger } from "@glob-ui/svelte/layout"
  import { PageLayout } from "@glob-ui/svelte/page-layout"

  const SECTIONS = Array.from({ length: 12 }, (_, i) => `Section ${i + 1}`)
</script>

<StackedLayout navLabel="Site">
  {#snippet header()}
    <LayoutNavTrigger />
    <strong>Docs</strong>
    <nav aria-label="Top" class="ml-auto hidden gap-4 text-sm lg:flex">
      <a href="#guides" class="no-underline">Guides</a>
      <a href="#api" class="no-underline">API</a>
    </nav>
  {/snippet}
  {#snippet mobileNav()}
    <a href="#guides" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">Guides</a>
    <a href="#api" class="rounded-md px-3 py-2 text-sm no-underline hover:bg-fd-accent">API</a>
  {/snippet}
  {#snippet footer()}<p class="text-sm text-fd-muted-foreground">Footer</p>{/snippet}
  <PageLayout>
    {#each SECTIONS as section (section)}
      <section class="flex flex-col gap-2">
        <h2 class="text-lg font-semibold">{section}</h2>
        <p>Text of the section. The header stays in view while the document scrolls.</p>
      </section>
    {/each}
  </PageLayout>
</StackedLayout>
