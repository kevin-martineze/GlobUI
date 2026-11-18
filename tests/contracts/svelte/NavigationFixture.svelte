<script lang="ts">
  // One fixture per adapter method of the 10d-3 contracts, chosen by `kind`. `props` is the contract's fixture object.
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../packages/svelte/src/accordion"
  import {
    getPageRange,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "../../../packages/svelte/src/pagination"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../packages/svelte/src/tabs"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { kind, props }: { kind: string; props: any } = $props()

  let current = $state(1)
  function go(next: number) {
    current = next
    props.onPage?.(next)
  }
</script>

{#snippet accordionItems()}
  <AccordionItem value="a">
    <AccordionTrigger>Shipping</AccordionTrigger>
    <AccordionContent>Ships in 2 days.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="b">
    <AccordionTrigger>Returns</AccordionTrigger>
    <AccordionContent>30 days.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="c" disabled>
    <AccordionTrigger>Disabled</AccordionTrigger>
    <AccordionContent>Hidden.</AccordionContent>
  </AccordionItem>
{/snippet}

{#if kind === "tabs"}
  <Tabs value={props.value} defaultValue={props.defaultValue} orientation={props.orientation} onValueChange={props.onValueChange}>
    <TabsList aria-label="Settings">
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password" disabled>Password</TabsTrigger>
      <TabsTrigger value="billing">Billing</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Account panel</TabsContent>
    <TabsContent value="billing">Billing panel</TabsContent>
    <TabsContent value="team">Team panel</TabsContent>
  </Tabs>
{:else if kind === "accordion"}
  {#if props.type === "multiple"}
    <Accordion type="multiple" onValueChange={props.onValueChange}>{@render accordionItems()}</Accordion>
  {:else}
    <Accordion type="single" collapsible={props.collapsible} onValueChange={props.onValueChange}>{@render accordionItems()}</Accordion>
  {/if}
{:else if kind === "paginationLinks"}
  <Pagination>
    <PaginationContent>
      <PaginationItem><PaginationPrevious href="/a" /></PaginationItem>
      <PaginationItem><PaginationLink href="/a" isActive>1</PaginationLink></PaginationItem>
      <PaginationItem><PaginationEllipsis /></PaginationItem>
      <PaginationItem><PaginationNext href="/b" /></PaginationItem>
    </PaginationContent>
  </Pagination>
{:else if kind === "paginationDisabledPrevious"}
  <Pagination>
    <PaginationContent>
      <PaginationItem><PaginationPrevious disabled href="/prev" /></PaginationItem>
    </PaginationContent>
  </Pagination>
{:else if kind === "paginationControlled"}
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious disabled={current === 1}>
          {#snippet child(attributes)}
            <button {...attributes} type="button" disabled={current === 1} onclick={() => go(current - 1)}></button>
          {/snippet}
        </PaginationPrevious>
      </PaginationItem>
      {#each getPageRange({ page: current, pageCount: props.pageCount }) as item, i (item === "ellipsis" ? `e${i}` : item)}
        <PaginationItem>
          {#if item === "ellipsis"}
            <PaginationEllipsis />
          {:else}
            <PaginationLink isActive={item === current}>
              {#snippet child(attributes)}
                <button {...attributes} type="button" onclick={() => go(item)}>{item}</button>
              {/snippet}
            </PaginationLink>
          {/if}
        </PaginationItem>
      {/each}
      <PaginationItem>
        <PaginationNext disabled={current === props.pageCount}>
          {#snippet child(attributes)}
            <button {...attributes} type="button" disabled={current === props.pageCount} onclick={() => go(current + 1)}>Next</button>
          {/snippet}
        </PaginationNext>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
{/if}
