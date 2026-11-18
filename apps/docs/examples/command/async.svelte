<script lang="ts">
  import { onDestroy } from "svelte"
  import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@glob-ui/svelte/command"
  import { Spinner } from "@glob-ui/svelte/spinner"

  const pages = ["Getting started", "Installation", "Button", "Dialog", "Combobox", "Command", "Theming", "Changelog"]

  let search = $state("")
  let results = $state(pages)
  let loading = $state(false)
  let timer: number | undefined

  // filter={false}: the list is whatever the search returns. This stands in for a server call.
  function onSearch(next: string) {
    search = next
    window.clearTimeout(timer)
    loading = true
    timer = window.setTimeout(() => {
      const q = next.trim().toLowerCase()
      results = pages.filter((p) => p.toLowerCase().includes(q))
      loading = false
    }, 400)
  }

  onDestroy(() => window.clearTimeout(timer))
</script>

<Command
  filter={false}
  {search}
  onSearchChange={onSearch}
  class="w-full max-w-sm overflow-hidden rounded-glob-lg border border-glob-border bg-glob-surface shadow-glob-md"
>
  <CommandInput placeholder="Search the docs..." />
  <CommandList>
    {#if loading}
      <div class="flex items-center gap-2 px-2 py-3 text-sm text-glob-text-secondary">
        <Spinner size="sm" aria-hidden="true" />
        <span>Searching...</span>
      </div>
    {:else}
      {#each results as page (page)}<CommandItem value={page}>{page}</CommandItem>{/each}
    {/if}
  </CommandList>
  {#if !loading}<CommandEmpty>No pages match.</CommandEmpty>{/if}
</Command>
