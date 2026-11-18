<script lang="ts">
  import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    getPageRange,
  } from "@glob-ui/svelte/pagination"

  const pageCount = 12
  let current = $state(1)
</script>

<div class="flex w-full flex-col items-center gap-3">
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious disabled={current === 1}>
          {#snippet child(props)}
            <button type="button" {...props} disabled={current === 1} onclick={() => current--}>Previous</button>
          {/snippet}
        </PaginationPrevious>
      </PaginationItem>
      {#each getPageRange({ page: current, pageCount }) as item, index (item === "ellipsis" ? `ellipsis-${index}` : item)}
        <PaginationItem>
          {#if item === "ellipsis"}
            <PaginationEllipsis />
          {:else}
            <PaginationLink isActive={item === current}>
              {#snippet child(props)}
                <button type="button" {...props} onclick={() => (current = item)}>{item}</button>
              {/snippet}
            </PaginationLink>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext disabled={current === pageCount}>
          {#snippet child(props)}
            <button type="button" {...props} disabled={current === pageCount} onclick={() => current++}>Next</button>
          {/snippet}
        </PaginationNext>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
  <p class="text-sm text-glob-text-secondary">Page {current} of {pageCount}</p>
</div>
