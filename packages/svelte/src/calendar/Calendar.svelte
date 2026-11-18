<script lang="ts">
  import { onMount, tick } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import {
    buildCalendarWeeks,
    calendarKeyTarget,
    compareISODate,
    defaultWeekStart,
    FALLBACK_LOCALE,
    monthKey,
    monthStart,
    parseISODate,
    resolveLocale,
    shiftMonth,
    todayISODate,
    weekdayNames,
    type DateRange,
  } from "@glob-ui/core"
  import {
    CALENDAR_CELL_CLASSES,
    CALENDAR_CLASSES,
    CALENDAR_EMPTY_CELL_CLASSES,
    CALENDAR_GRID_CLASSES,
    CALENDAR_HEADING_CLASSES,
    CALENDAR_MONTH_CLASSES,
    CALENDAR_MONTHS_CLASSES,
    CALENDAR_MONTHS_LAYOUT_CLASSES,
    CALENDAR_NAV_BUTTON_CLASSES,
    CALENDAR_NAV_CLASSES,
    CALENDAR_NAV_ICON_CLASSES,
    CALENDAR_WEEKDAY_CLASSES,
    calendarDayClasses,
  } from "@glob-ui/recipes"

  type Base = Omit<HTMLAttributes<HTMLDivElement>, "onchange"> & {
    /** The first day of the week, 0 (Sunday) to 6. Default: from the locale. */
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
    /**
     * BCP 47 tag, for example "es-ES". Default: the browser's locale. Server-rendered pages show "en-US" until the
     * component mounts, then switch; pass `locale` to avoid the switch.
     */
    locale?: string
    /** Earliest selectable day, "YYYY-MM-DD". Days before it are disabled and navigation stops before its month. */
    min?: string
    /** Latest selectable day, "YYYY-MM-DD". Days after it are disabled and navigation stops after its month. */
    max?: string
    /** Disables more days. Disabled days can still receive focus, but cannot be selected. */
    isDateDisabled?: (iso: string) => boolean
    /** The visible month, "YYYY-MM". Bind it with `bind:month`, or leave it unset and use `defaultMonth`. */
    month?: string
    defaultMonth?: string
    onMonthChange?: (month: string) => void
    /** Shows one month, or two side by side (stacked on small screens). */
    numberOfMonths?: 1 | 2
    /** Muted days from the adjacent months. Not selectable; clicking one moves to its month. Default true. */
    showOutsideDays?: boolean
    /** Called when the user picks an enabled day, even when it is already the selected one. Used by DatePicker to close. */
    onSelectDay?: (iso: string) => void
  }
  type Single = {
    mode?: "single"
    /** "YYYY-MM-DD", or null for none. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string | null
    defaultValue?: string | null
    onChange?: (iso: string | null) => void
    /** Clicking the selected day again clears it. Default false. */
    allowDeselect?: boolean
  }
  type Range = {
    mode: "range"
    value?: DateRange
    defaultValue?: DateRange
    onChange?: (range: DateRange) => void
    allowDeselect?: never
  }
  type Props = Base & (Single | Range)

  /**
   * A month grid for picking one day, or a range of days. Values are "YYYY-MM-DD" strings.
   * Follows the WAI-ARIA date picker grid: one tab stop, arrows move by day and week, PageUp and PageDown by month.
   */
  let {
    mode = "single",
    weekStartsOn,
    locale: localeProp,
    min,
    max,
    isDateDisabled,
    month = $bindable(undefined),
    defaultMonth,
    onMonthChange,
    numberOfMonths = 1,
    showOutsideDays = true,
    onSelectDay,
    onkeydown,
    onpointerleave,
    class: className,
    value = $bindable(undefined),
    defaultValue,
    onChange,
    allowDeselect = false,
    ...rest
  }: Props = $props()

  const isRange = $derived(mode === "range")
  const emit = (next: string | null | DateRange) => (onChange as ((v: string | null | DateRange) => void) | undefined)?.(next)

  // Only the initial defaultValue is wanted.
  // svelte-ignore state_referenced_locally
  let singleInternal = $state<string | null>(mode === "range" ? null : ((defaultValue as string | null | undefined) ?? null))
  // svelte-ignore state_referenced_locally
  let rangeInternal = $state<DateRange>(mode === "range" ? ((defaultValue as DateRange | undefined) ?? { from: null, to: null }) : { from: null, to: null })
  // `null` is a value (no day): the single value is controlled whenever it is defined.
  const singleValue = $derived(!isRange && value !== undefined ? (value as string | null) : singleInternal)
  const rangeValue = $derived(isRange && value !== undefined ? (value as DateRange) : rangeInternal)

  function setSingleValue(next: string | null) {
    if (next === singleValue) return
    if (value === undefined) singleInternal = next
    else value = next
    emit(next)
  }
  function setRangeValue(next: DateRange) {
    if (value === undefined) rangeInternal = next
    else value = next
    emit(next)
  }

  // Locale and today depend on the browser: before mount they match a server render.
  let mounted = $state(false)
  onMount(() => {
    mounted = true
  })
  const locale = $derived(localeProp ?? (mounted ? resolveLocale() : FALLBACK_LOCALE))
  const weekStart = $derived(weekStartsOn ?? defaultWeekStart(locale))
  const today = $derived(mounted ? todayISODate() : null)
  // svelte-ignore state_referenced_locally
  const initialFocus = isRange ? (rangeValue.from ?? todayISODate()) : (singleValue ?? todayISODate())
  const baseId = $props.id()
  let root = $state<HTMLDivElement>()

  // svelte-ignore state_referenced_locally
  let monthInternal = $state(defaultMonth ?? monthKey(initialFocus))
  const visibleKey = $derived(month ?? monthInternal)
  function setVisibleKey(next: string) {
    if (next === visibleKey) return
    if (month === undefined) monthInternal = next
    else month = next
    onMonthChange?.(next)
  }

  let focusISO = $state(initialFocus)
  let hoverISO = $state<string | null>(null)

  const minKey = $derived(min ? monthKey(min) : null)
  const maxKey = $derived(max ? monthKey(max) : null)
  const clampKey = (key: string) => (minKey && key < minKey ? minKey : maxKey && key > maxKey ? maxKey : key)
  const months = $derived(Array.from({ length: numberOfMonths }, (_, i) => shiftMonth(visibleKey, i)))
  const lastVisibleKey = $derived(months[months.length - 1])

  const inBounds = (iso: string) => (!min || iso >= min) && (!max || iso <= max)
  const isDisabledDay = (iso: string) => !inBounds(iso) || (isDateDisabled?.(iso) ?? false)

  // Keeps `iso` on screen by moving the visible month, if it is off screen.
  function showDay(iso: string) {
    const key = monthKey(iso)
    if (key < visibleKey) setVisibleKey(clampKey(key))
    else if (key > lastVisibleKey) setVisibleKey(clampKey(shiftMonth(key, -(numberOfMonths - 1))))
  }

  // After a keyboard move, the new day button takes DOM focus once it is rendered.
  function moveFocus(iso: string) {
    if (!inBounds(iso)) return
    focusISO = iso
    showDay(iso)
    void tick().then(() => root?.querySelector<HTMLElement>(`[data-iso="${iso}"]`)?.focus())
  }

  function pick(iso: string) {
    if (isDisabledDay(iso)) return
    if (!isRange) {
      if (iso === singleValue) {
        if (allowDeselect) setSingleValue(null)
        else onSelectDay?.(iso)
        return
      }
      setSingleValue(iso)
      onSelectDay?.(iso)
      return
    }
    const { from, to } = rangeValue
    if (from === null || to !== null) {
      setRangeValue({ from: iso, to: null })
    } else if (compareISODate(iso, from) < 0) {
      // A second pick before the first one swaps them.
      setRangeValue({ from: iso, to: from })
    } else {
      setRangeValue({ from, to: iso })
    }
    hoverISO = null
  }

  function onGridKeyDown(event: KeyboardEvent & { currentTarget: HTMLDivElement }) {
    onkeydown?.(event)
    if (event.defaultPrevented) return
    const iso = (event.target as HTMLElement).dataset.iso
    if (!iso) return
    const next = calendarKeyTarget(event.key, iso, { shiftKey: event.shiftKey, weekStart })
    if (next === null) return
    event.preventDefault()
    moveFocus(next)
  }

  // The one tab stop: the focus day when it is on screen, else the first day of the first month.
  const tabStop = $derived(months.includes(monthKey(focusISO)) ? focusISO : monthStart(months[0]))

  // Range shading: the picked range, or the preview from the first pick to the hovered day.
  const previewEnd = $derived(isRange && rangeValue.from !== null && rangeValue.to === null ? (hoverISO ?? null) : null)
  const shadeFrom = $derived(isRange ? rangeValue.from : null)
  const shadeTo = $derived(isRange ? (rangeValue.to ?? previewEnd) : null)
  const shadeStart = $derived(shadeFrom && shadeTo ? (compareISODate(shadeFrom, shadeTo) <= 0 ? shadeFrom : shadeTo) : null)
  const shadeEnd = $derived(shadeFrom && shadeTo ? (compareISODate(shadeFrom, shadeTo) <= 0 ? shadeTo : shadeFrom) : null)

  const dayFormat = $derived(new Intl.DateTimeFormat(locale, { dateStyle: "full" }))
  const headingFormat = $derived(new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }))
  const names = $derived(weekdayNames(locale, weekStart))
  const prevDisabled = $derived(minKey !== null && visibleKey <= minKey)
  const nextDisabled = $derived(maxKey !== null && lastVisibleKey >= maxKey)

  function headingOf(key: string) {
    const [year, monthNumber] = key.split("-").map(Number)
    return headingFormat.format(new Date(year, monthNumber - 1, 1))
  }
</script>

<div
  bind:this={root}
  role="group"
  class={cn(CALENDAR_CLASSES, className)}
  onkeydown={onGridKeyDown}
  {...rest}
  onpointerleave={(event) => {
    onpointerleave?.(event)
    hoverISO = null
  }}
>
  <div class={CALENDAR_NAV_CLASSES}>
    <button
      type="button"
      aria-label="Previous month"
      disabled={prevDisabled}
      onclick={() => setVisibleKey(clampKey(shiftMonth(visibleKey, -1)))}
      class={CALENDAR_NAV_BUTTON_CLASSES}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={CALENDAR_NAV_ICON_CLASSES}>
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
    <button
      type="button"
      aria-label="Next month"
      disabled={nextDisabled}
      onclick={() => setVisibleKey(clampKey(shiftMonth(visibleKey, 1)))}
      class={CALENDAR_NAV_BUTTON_CLASSES}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class={CALENDAR_NAV_ICON_CLASSES}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  </div>

  <div class={cn(CALENDAR_MONTHS_CLASSES, CALENDAR_MONTHS_LAYOUT_CLASSES[numberOfMonths])}>
    {#each months as key (key)}
      {@const headingId = `${baseId}-${key}`}
      <div class={CALENDAR_MONTH_CLASSES}>
        <div id={headingId} aria-live="polite" class={CALENDAR_HEADING_CLASSES}>{headingOf(key)}</div>
        <table role="grid" aria-labelledby={headingId} class={CALENDAR_GRID_CLASSES}>
          <thead>
            <!-- The explicit row roles match the React grid. -->
            <!-- svelte-ignore a11y_no_redundant_roles -->
            <tr role="row">
              {#each names as name (name.long)}
                <th role="columnheader" scope="col" aria-label={name.long} class={CALENDAR_WEEKDAY_CLASSES}>{name.short}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each buildCalendarWeeks(key, weekStart) as week (week[0].iso)}
              <!-- svelte-ignore a11y_no_redundant_roles -->
              <tr role="row">
                {#each week as { iso, inMonth } (iso)}
                  {#if !inMonth && !showOutsideDays}
                    <td role="gridcell" class={CALENDAR_EMPTY_CELL_CLASSES}></td>
                  {:else}
                    {@const disabled = isDisabledDay(iso)}
                    {@const selected = isRange ? iso === rangeValue.from || iso === rangeValue.to : iso === singleValue}
                    {@const inShade = shadeStart !== null && shadeEnd !== null && iso >= shadeStart && iso <= shadeEnd}
                    {@const rangeEdge = iso === shadeStart || iso === shadeEnd}
                    {@const isStop = inMonth && iso === tabStop}
                    <td role="gridcell" aria-selected={selected} class={CALENDAR_CELL_CLASSES}>
                      <!-- The tab stop is also what a DatePicker focuses when it opens. -->
                      <button
                        type="button"
                        data-iso={iso}
                        data-autofocus={isStop ? "" : undefined}
                        tabindex={isStop ? 0 : -1}
                        aria-label={dayFormat.format(parseISODate(iso))}
                        aria-current={iso === today ? "date" : undefined}
                        aria-disabled={disabled || undefined}
                        onclick={() => {
                          focusISO = iso
                          if (!inMonth) {
                            setVisibleKey(clampKey(monthKey(iso)))
                            return
                          }
                          pick(iso)
                        }}
                        onfocus={() => {
                          focusISO = iso
                          if (isRange) hoverISO = iso
                        }}
                        onpointerenter={() => {
                          if (isRange && rangeValue.from !== null && rangeValue.to === null) hoverISO = iso
                        }}
                        class={cn(
                          ...calendarDayClasses({ selected, inRange: inShade, rangeEdge, today: iso === today, disabled, outside: !inMonth })
                        )}
                      >
                        {Number(iso.slice(8))}
                      </button>
                    </td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/each}
  </div>
</div>
