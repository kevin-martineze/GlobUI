<script lang="ts">
  import type { Snippet } from "svelte"
  import { PageLayout, PageHeader } from "@glob-ui/svelte/page-layout"
  import { Card, CardContent, CardHeader, CardTitle } from "@glob-ui/svelte/card"

  // Edit: this is yours. The back link text and the aside heading are fixed for every detail page.
  const BACK_LABEL = "Back"
  const ASIDE_TITLE = "Details"

  /** A detail page: a header with breadcrumbs and a back link, the content, and a sticky aside card. */
  let {
    title,
    breadcrumbs,
    backHref,
    actions,
    children,
    aside,
  }: {
    title: string | Snippet
    /** A breadcrumb trail above the title. */
    breadcrumbs?: Snippet
    /** Where the back link goes. Omit it to hide the link. */
    backHref?: string
    actions?: Snippet
    children?: Snippet
    /** Facts about the item, in a card that stays in view from `lg`. */
    aside?: Snippet
  } = $props()
</script>

{#snippet titleSlot()}
  <span data-template-part="prop" data-template-name="title">
    {#if typeof title === "string"}{title}{:else}{@render title()}{/if}
  </span>
{/snippet}

{#snippet crumbs()}
  <div class="flex flex-col gap-1">
    {@render breadcrumbs?.()}
    {#if backHref}
      <a href={backHref} class="w-fit text-glob-text-secondary underline-offset-4 hover:underline">
        ← {BACK_LABEL}
      </a>
    {/if}
  </div>
{/snippet}

{#snippet actionsSlot()}
  <div data-template-part="prop" data-template-name="actions">{@render actions?.()}</div>
{/snippet}

{#snippet asideSlot()}
  <div data-template-part="prop" data-template-name="facts about the item">
    <Card data-template-part="fixed" data-template-name="card frame">
      <CardHeader>
        <CardTitle as="h2">{ASIDE_TITLE}</CardTitle>
      </CardHeader>
      <CardContent>{@render aside?.()}</CardContent>
    </Card>
  </div>
{/snippet}

{#snippet header()}
  <div data-template-part="fixed" data-template-name="breadcrumbs, back link">
    <PageHeader
      title={titleSlot}
      breadcrumbs={backHref || breadcrumbs ? crumbs : undefined}
      actions={actions ? actionsSlot : undefined}
    />
  </div>
{/snippet}

<PageLayout {header} aside={aside ? asideSlot : undefined}>
  <div data-template-part="prop" data-template-name="children" class="flex min-w-0 flex-col gap-6">
    {@render children?.()}
  </div>
</PageLayout>
