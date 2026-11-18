<script lang="ts">
  import type { Snippet } from "svelte"
  import { cn } from "@glob-ui/utils"
  import { isPrintableKey, matchesSearch, normalizeText } from "@glob-ui/core"
  import {
    COMBOBOX_CLEAR_CLASSES,
    COMBOBOX_DESCRIPTION_CLASSES,
    COMBOBOX_EMPTY_CLASSES,
    COMBOBOX_INPUT_CLASSES,
    COMBOBOX_LISTBOX_CLASSES,
    COMBOBOX_LOADING_CLASSES,
    COMBOBOX_MARK_CLASSES,
    COMBOBOX_OPTION_CLASSES,
    COMBOBOX_STATUS_CLASSES,
    COMBOBOX_TOGGLE_CLASSES,
    COMBOBOX_TOGGLE_ICON_CLASSES,
    FLOATING_TRANSITION_CLASSES,
    inputVariants,
    LISTBOX_CHEVRON_OPEN_CLASSES,
    LISTBOX_OPTION_ACTIVE_CLASSES,
    LISTBOX_OPTION_DISABLED_CLASSES,
    LISTBOX_OPTION_SELECTED_CLASSES,
    LISTBOX_PANEL_CLASSES,
  } from "@glob-ui/recipes"
  import Spinner from "../spinner/Spinner.svelte"
  import { FloatingPanel } from "../shared/floating.svelte"
  import { Listbox } from "../shared/listbox.svelte"
  import { fieldAttributes, getFieldContext } from "../shared/context"
  import type { ComboboxOption } from "./types"

  const CUSTOM_KEY = "\u0000custom"
  type Row = { key: string; label: string; disabled?: boolean; option?: ComboboxOption }

  let {
    options,
    value = $bindable(undefined),
    defaultValue = null,
    onChange,
    inputValue = $bindable(undefined),
    onInputChange,
    allowCustomValue = false,
    filter,
    loading = false,
    emptyMessage = "No results.",
    placeholder,
    disabled = false,
    name,
    clearable = true,
    size,
    class: className,
    id,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-label": ariaLabel,
  }: {
    options: ComboboxOption[]
    /** The selected option value, or `null` for none. Bind it with `bind:value`, or use `defaultValue`. */
    value?: string | null
    defaultValue?: string | null
    /** Called with the selected value, or `null` when cleared. */
    onChange?: (value: string | null) => void
    /** The text in the field. Bind it (or pass it with onInputChange) to search on a server. */
    inputValue?: string
    onInputChange?: (text: string) => void
    /** Commit the typed text as the value when no option is active (Enter), or on blur. */
    allowCustomValue?: boolean
    /** `false`: you filter `options` yourself. A function: `(option, query) => boolean`. Default: accent-insensitive word match on label, value and description. */
    filter?: false | ((option: ComboboxOption, query: string) => boolean)
    /** Shows a "Loading…" row with a spinner under the options, announced to screen readers. */
    loading?: boolean
    /** Shown when nothing matches. Default "No results.". */
    emptyMessage?: string | Snippet
    placeholder?: string
    disabled?: boolean
    /** Submitted with native forms through a hidden input. */
    name?: string
    /** Shows an X button while there is text. Default true. */
    clearable?: boolean
    size?: "sm" | "md" | "lg"
    class?: string
    id?: string
    "aria-invalid"?: boolean | "true" | "false"
    "aria-describedby"?: string
    "aria-labelledby"?: string
    "aria-label"?: string
  } = $props()

  const baseId = $props.id()
  const field = getFieldContext()
  // svelte-ignore state_referenced_locally
  if (field && id) field.setControlId(id)
  const fromField = $derived(
    fieldAttributes(field, { id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy, "aria-labelledby": ariaLabelledBy })
  )
  const inputId = $derived(fromField.id ?? id ?? `${baseId}-input`)
  const labelledBy = $derived(fromField["aria-labelledby"] ?? ariaLabelledBy)
  const listId = `${baseId}-listbox`

  let inputEl = $state<HTMLInputElement | null>(null)
  // svelte-ignore state_referenced_locally
  let internalSelected = $state<string | null>(defaultValue)
  const selected = $derived(value === undefined ? internalSelected : value)
  function setSelected(next: string | null) {
    if (next === selected) return
    if (value === undefined) internalSelected = next
    else value = next
    onChange?.(next)
  }

  let open = $state(false)
  // null: not editing, so the field shows the selected label. A string: what the user typed.
  let typed = $state<string | null>(null)
  const controlledText = $derived(inputValue !== undefined)

  const selectedOption = $derived(options.find((o) => o.value === selected))
  const selectedLabel = $derived(selectedOption?.label ?? selected ?? "")
  const text = $derived(inputValue !== undefined ? inputValue : (typed ?? selectedLabel))
  const query = $derived(inputValue !== undefined ? inputValue : (typed ?? ""))

  function setText(next: string) {
    if (inputValue !== undefined) inputValue = next
    else typed = next
    onInputChange?.(next)
  }

  const visible = $derived.by(() => {
    if (filter === false) return options
    const match = filter ?? ((o: ComboboxOption, q: string) => matchesSearch(q, o.label, o.value, o.description ?? ""))
    return options.filter((o) => match(o, query))
  })

  const trimmed = $derived(text.trim())
  const hasExact = $derived(options.some((o) => normalizeText(o.label) === normalizeText(trimmed)))
  // The "Use ..." row goes last, so with matches the first match stays the active option.
  const rows: Row[] = $derived([
    ...visible.map((option) => ({ key: option.value, label: option.label, disabled: option.disabled, option })),
    ...(allowCustomValue && trimmed !== "" && !hasExact ? [{ key: CUSTOM_KEY, label: trimmed }] : []),
  ])

  const listbox = new Listbox<Row>(() => ({
    id: baseId,
    items: rows,
    getKey: (row) => row.key,
    getText: (row) => row.label,
    isDisabled: (row) => Boolean(row.disabled),
    open,
  }))

  const panel = new FloatingPanel(() => ({
    open,
    onOpenChange: (next) => (open = next),
    placement: "bottom-start",
    offset: 4,
    matchTriggerWidth: true,
    // Focus stays in the input, so the browser must not return focus on close.
    restoreFocus: false,
  }))

  function openList(active: string | null) {
    if (disabled) return
    listbox.setActiveKey(active)
    open = true
  }

  function commitValue(next: string | null, label: string) {
    setSelected(next)
    typed = null
    open = false
    if (controlledText) setText(label)
  }

  function commitRow(row: Row) {
    if (row.key === CUSTOM_KEY) commitValue(row.label, row.label)
    else if (row.option) commitValue(row.option.value, row.option.label)
  }

  function clear() {
    setSelected(null)
    setText("")
    open = false
    inputEl?.focus()
  }

  function onBlur() {
    open = false
    if (allowCustomValue) {
      // The typed text is the value: never leave text that looks selected but is not.
      if (trimmed === "") {
        if (selected !== null) commitValue(null, "")
        else setText("")
      } else if (trimmed !== selected) {
        commitValue(trimmed, trimmed)
      } else {
        typed = null
      }
      return
    }
    // Not committed: show the selected label again (or nothing).
    typed = null
    if (controlledText && text !== selectedLabel) setText(selectedLabel)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (disabled) return
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        openList(selected)
        return
      }
    } else if (listbox.navigate(e, { homeEnd: false })) {
      return
    }

    if (e.key === "Enter" && open) {
      e.preventDefault()
      if (listbox.activeItem) commitRow(listbox.activeItem)
      else if (allowCustomValue && trimmed !== "") commitValue(trimmed, trimmed)
      else open = false
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault()
        open = false
      } else if (text !== "" || selected !== null) {
        e.preventDefault()
        clear()
      }
    } else if (isPrintableKey(e) && !open) {
      // Typing opens the list (the input handler filters it).
      open = true
    }
  }

  /** The label split around the first occurrence of the query, for the <mark>. Cosmetic: the name stays the label. */
  function highlight(label: string, q: string) {
    const needle = q.trim()
    if (!needle) return null
    const index = label.toLowerCase().indexOf(needle.toLowerCase())
    if (index < 0) return null
    return [label.slice(0, index), label.slice(index, index + needle.length), label.slice(index + needle.length)] as const
  }
</script>

<div class={cn("relative w-full", className)}>
  <div {...panel.triggerAttachment} class="relative w-full">
    <input
      bind:this={inputEl}
      id={inputId}
      type="text"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={listId}
      aria-activedescendant={open ? listbox.activeDescendant : undefined}
      aria-invalid={fromField["aria-invalid"] ?? ariaInvalid}
      aria-describedby={fromField["aria-describedby"] ?? ariaDescribedBy}
      aria-labelledby={labelledBy}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      {disabled}
      {placeholder}
      value={text}
      oninput={(e) => {
        setText(e.currentTarget.value)
        open = true
        listbox.setActiveKey(null)
      }}
      onclick={() => {
        if (!open) openList(selected)
      }}
      onkeydown={onKeyDown}
      onblur={onBlur}
      class={cn(inputVariants({ size }), COMBOBOX_INPUT_CLASSES)}
    />
    {#if clearable && text !== "" && !disabled}
      <!-- onmousedown keeps focus in the input while clicking. -->
      <button type="button" aria-label="Clear" onmousedown={(e) => e.preventDefault()} onclick={clear} class={COMBOBOX_CLEAR_CLASSES}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-3.5 w-3.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    {/if}
    <button
      type="button"
      aria-label="Show options"
      tabindex={-1}
      {disabled}
      onmousedown={(e) => e.preventDefault()}
      onclick={() => {
        if (open) open = false
        else openList(selected)
        inputEl?.focus()
      }}
      class={COMBOBOX_TOGGLE_CLASSES}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class={cn(COMBOBOX_TOGGLE_ICON_CLASSES, open && LISTBOX_CHEVRON_OPEN_CLASSES)}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
  </div>

  {#if name !== undefined}<input type="hidden" {name} value={selected ?? ""} />{/if}

  <div bind:this={panel.panel} popover="manual" style={panel.style} class={cn(LISTBOX_PANEL_CLASSES, FLOATING_TRANSITION_CLASSES)}>
    <div id={listId} role="listbox" aria-labelledby={labelledBy ?? inputId} class={COMBOBOX_LISTBOX_CLASSES}>
      {#each rows as row (row.key)}
        {@const isSelected = row.key !== CUSTOM_KEY && row.key === selected}
        {@const isActive = listbox.activeKey === row.key}
        {@const parts = row.key === CUSTOM_KEY ? null : highlight(row.label, query)}
        <!-- Keyboard handling lives on the input (aria-activedescendant). -->
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
        <div
          id={listbox.optionId(row.key)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={row.disabled || undefined}
          onmousedown={(e) => e.preventDefault()}
          onpointermove={() => {
            if (!row.disabled) listbox.setActiveKey(row.key)
          }}
          onclick={() => {
            if (!row.disabled) commitRow(row)
          }}
          class={cn(
            COMBOBOX_OPTION_CLASSES,
            row.disabled && LISTBOX_OPTION_DISABLED_CLASSES,
            isActive && !row.disabled && LISTBOX_OPTION_ACTIVE_CLASSES,
            isSelected && LISTBOX_OPTION_SELECTED_CLASSES
          )}
        >
          <span class="min-w-0 flex-1">
            <span class="block truncate"
              >{#if row.key === CUSTOM_KEY}Use "{row.label}"{:else if parts}{parts[0]}<mark class={COMBOBOX_MARK_CLASSES}>{parts[1]}</mark
                >{parts[2]}{:else}{row.label}{/if}</span
            >
            {#if row.option?.description}
              <span class={COMBOBOX_DESCRIPTION_CLASSES}>{row.option.description}</span>
            {/if}
          </span>
        </div>
      {/each}
    </div>
    <!-- Always mounted, so screen readers hear loading and empty states as they appear. -->
    <div role="status" aria-live="polite" class={COMBOBOX_STATUS_CLASSES}>
      {#if loading}
        <div class={COMBOBOX_LOADING_CLASSES}>
          <Spinner size="sm" aria-hidden="true" />
          <span>Loading…</span>
        </div>
      {:else if rows.length === 0}
        <div class={COMBOBOX_EMPTY_CLASSES}>
          {#if typeof emptyMessage === "function"}{@render emptyMessage()}{:else}{emptyMessage}{/if}
        </div>
      {/if}
    </div>
  </div>
</div>
