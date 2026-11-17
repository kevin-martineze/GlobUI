<script lang="ts">
  import { cn } from "@glob-ui/utils"
  import { ALERT_ICON_CLASSES, ALERT_ICON_TONE } from "@glob-ui/recipes"

  /** The variant's icon, coloured. Decorative: hidden from assistive tech. */
  let { variant = "default", class: className }: { variant?: keyof typeof ALERT_ICON_TONE; class?: string } = $props()
</script>

<span aria-hidden="true" class={cn(ALERT_ICON_CLASSES, ALERT_ICON_TONE[variant], className)}>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-4 w-4"
  >
    {#if variant === "success"}
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    {:else if variant === "warning"}
      <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    {:else if variant === "danger"}
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    {:else}
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    {/if}
  </svg>
</span>
