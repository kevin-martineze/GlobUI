<script lang="ts">
  import { StackedLayout } from "../../../packages/svelte/src/stacked-layout"
  import { LayoutNavTrigger } from "../../../packages/svelte/src/layout"
</script>

<StackedLayout>
  {#snippet header()}
    <LayoutNavTrigger />
    <strong>Acme</strong>
  {/snippet}
  {#snippet footer()}<p>Footer</p>{/snippet}
  {#snippet mobileNav()}<a href="#orders">Orders</a>{/snippet}
  <h2>Page</h2>
</StackedLayout>
