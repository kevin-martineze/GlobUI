<script lang="ts">
  // One fixture per adapter method of the 10g-1 contracts, chosen by `kind`. `props` is the contract's fixture object.
  import DashboardTemplate from "../../../templates/svelte/dashboard/DashboardTemplate.svelte"
  import ListPageTemplate from "../../../templates/svelte/list-page/ListPageTemplate.svelte"
  import DetailPageTemplate from "../../../templates/svelte/detail-page/DetailPageTemplate.svelte"
  import { createDataTableColumnHelper } from "../../../packages/svelte/src/data-table"
  import type { ContractInvoice } from "../types"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { kind, props }: { kind: string; props: any } = $props()

  const helper = createDataTableColumnHelper<ContractInvoice>()
  const columns = [helper.accessor("id", { header: "Invoice" }), helper.accessor("client", { header: "Client" })]
</script>

{#snippet newButton()}<button type="button">New</button>{/snippet}
{#snippet editButton()}<button type="button">Edit</button>{/snippet}
{#snippet asideText()}<p>{props.aside}</p>{/snippet}

<div data-testid="template">
  {#if kind === "dashboard"}
    <DashboardTemplate
      title={props.title}
      description={props.description}
      activeHref={props.activeHref}
      actions={props.actions ? newButton : undefined}
    >
      {#if props.content}<p>{props.content}</p>{/if}
      {#each Array.from({ length: props.rows ?? 0 }, (_, i) => i) as i (i)}
        <p>Row {i}</p>
      {/each}
    </DashboardTemplate>
  {:else if kind === "listPage"}
    <ListPageTemplate
      title={props.title}
      description={props.description}
      data={props.data}
      loading={props.loading}
      {columns}
      aria-label="Invoices table"
      actions={props.actions ? newButton : undefined}
    />
  {:else if kind === "detailPage"}
    <DetailPageTemplate
      title={props.title}
      backHref={props.backHref}
      aside={props.aside ? asideText : undefined}
      actions={props.actions ? editButton : undefined}
    >
      {#if props.content}<p>{props.content}</p>{/if}
    </DetailPageTemplate>
  {/if}
</div>
