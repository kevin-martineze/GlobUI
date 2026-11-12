<script lang="ts">
  import { PageLayout, PageHeader } from "../../../packages/svelte/src/page-layout"
</script>

<PageLayout>
  {#snippet header()}
    <PageHeader title="Invoices" description="Last 30 days">
      {#snippet breadcrumbs()}<a href="#home">Home</a>{/snippet}
      {#snippet actions()}<button type="button">New invoice</button>{/snippet}
    </PageHeader>
  {/snippet}
  {#snippet aside()}<p>Filters</p>{/snippet}
  <p>Content</p>
</PageLayout>
