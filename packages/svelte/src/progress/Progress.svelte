<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { progressVariants, PROGRESS_FILL_CLASSES, PROGRESS_FILL_TONE, PROGRESS_INDETERMINATE_CLASSES } from "@glob-ui/recipes"

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "role"> & {
    /** Current value from 0 to `max`. `null` (or omitted) shows an indeterminate bar. Values outside the range are clamped. */
    value?: number | null
    /** The value that means complete. Default 100. */
    max?: number
    size?: "sm" | "md" | "lg"
    tone?: keyof typeof PROGRESS_FILL_TONE
    /** The text screen readers read instead of the number. Default: the percentage, for example "40%". */
    getValueLabel?: (value: number, max: number) => string
  }
  /** A progress bar. It needs a name: pass `aria-label` or `aria-labelledby`. */
  let { class: className, value = null, max = 100, size, tone = "primary", getValueLabel, ...rest }: Props = $props()

  const indeterminate = $derived(value === null || value === undefined)
  const safeMax = $derived(max > 0 ? max : 100)
  const clamped = $derived(indeterminate ? 0 : Math.min(Math.max(value as number, 0), safeMax))
  const percent = $derived((clamped / safeMax) * 100)
  const valueText = $derived(
    indeterminate ? undefined : getValueLabel ? getValueLabel(clamped, safeMax) : `${Math.round(percent)}%`
  )
</script>

<div
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={safeMax}
  aria-valuenow={indeterminate ? undefined : clamped}
  aria-valuetext={valueText}
  class={cn(progressVariants({ size, className }))}
  {...rest}
>
  {#if indeterminate}
    <!-- Slides across the track; with reduced motion it becomes a static full bar that pulses. -->
    <div class={cn(PROGRESS_INDETERMINATE_CLASSES, PROGRESS_FILL_TONE[tone])}></div>
  {:else}
    <div class={cn(PROGRESS_FILL_CLASSES, PROGRESS_FILL_TONE[tone])} style:transform={`translateX(-${100 - percent}%)`}></div>
  {/if}
</div>
