<script lang="ts">
  import { cn } from "@glob-ui/utils"
  import { isPrintableKey } from "@glob-ui/core"
  import {
    FLOATING_TRANSITION_CLASSES,
    LISTBOX_CHEVRON_CLASSES,
    LISTBOX_CHEVRON_OPEN_CLASSES,
    LISTBOX_CLASSES,
    LISTBOX_EMPTY_CLASSES,
    LISTBOX_OPTION_ACTIVE_CLASSES,
    LISTBOX_OPTION_CLASSES,
    LISTBOX_OPTION_DISABLED_CLASSES,
    LISTBOX_OPTION_ENABLED_CLASSES,
    LISTBOX_OPTION_SELECTED_CLASSES,
    LISTBOX_PANEL_CLASSES,
    LISTBOX_SEARCH_INPUT_CLASSES,
    LISTBOX_SEARCH_WRAPPER_CLASSES,
    SELECT_PLACEHOLDER_CLASSES,
    SELECT_RADIO_CHECKED_CLASSES,
    SELECT_RADIO_CLASSES,
    SELECT_RADIO_DOT_CLASSES,
    SELECT_RADIO_UNCHECKED_CLASSES,
    SELECT_VALUE_CLASSES,
    selectVariants,
  } from "@glob-ui/recipes"
  import { FloatingPanel } from "../shared/floating.svelte"
  import { Listbox } from "../shared/listbox.svelte"
  import { fieldAttributes, getFieldContext } from "../shared/context"
  import type { SelectOption } from "./types"

  /** Above this many options a search field is shown in the list. */
  const SEARCH_THRESHOLD = 8

  let {
    options,
    value = $bindable(undefined),
    defaultValue,
    onChange,
    placeholder = "Select...",
    variant,
    size = "md",
    disabled = false,
    name,
    class: className,
    id,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-label": ariaLabel,
  }: {
    options: SelectOption[]
    /** The selected value. Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string
    defaultValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    variant?: "default" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    /** Submitted with native forms through a hidden input. */
    name?: string
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
  const triggerId = $derived(fromField.id ?? id ?? `${baseId}-trigger`)
  const labelledBy = $derived(fromField["aria-labelledby"] ?? ariaLabelledBy)
  const listId = `${baseId}-listbox`

  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue)
  const current = $derived(value ?? internal)
  function setCurrent(next: string) {
    if (next === current) return
    if (value === undefined) internal = next
    else value = next
    onChange?.(next)
  }

  let open = $state(false)
  let search = $state("")
  let searchInput = $state<HTMLInputElement | null>(null)
  const searchable = $derived(options.length > SEARCH_THRESHOLD)
  const selected = $derived(options.find((o) => o.value === current))

  const filtered = $derived.by(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
  })

  const listbox = new Listbox<SelectOption>(() => ({
    id: baseId,
    items: filtered,
    getKey: (o) => o.value,
    getText: (o) => o.label,
    isDisabled: (o) => Boolean(o.disabled),
    open,
  }))

  const panel = new FloatingPanel(() => ({
    open,
    onOpenChange: (next) => {
      open = next
      if (!next) search = ""
    },
    placement: "bottom-start",
    offset: 4,
    matchTriggerWidth: true,
    // Focus the search field when there is one; otherwise focus stays on the trigger.
    onShow: () => searchInput?.focus({ preventScroll: true }),
  }))

  /** Closes the list and clears the search, so the next open starts from the full list. */
  function closeList() {
    open = false
    search = ""
  }

  function openList() {
    if (disabled) return
    // Start on the selected option, or the first enabled one.
    listbox.setActiveKey(current ?? null)
    open = true
  }

  function commit(next: string) {
    setCurrent(next)
    closeList()
  }

  function onTriggerKeyDown(e: KeyboardEvent) {
    if (disabled) return
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openList()
      } else if (isPrintableKey(e)) {
        e.preventDefault()
        openList()
        listbox.typeahead(e.key)
      }
      return
    }
    if (listbox.navigate(e)) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (listbox.activeItem) commit(listbox.activeItem.value)
      else closeList()
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      // APG: Tab selects the active option and moves focus on (no preventDefault).
      if (listbox.activeItem) setCurrent(listbox.activeItem.value)
      closeList()
    } else if (isPrintableKey(e)) {
      e.preventDefault()
      listbox.typeahead(e.key)
    }
  }

  function onSearchKeyDown(e: KeyboardEvent) {
    // Home/End stay with the caret in the text field.
    if (listbox.navigate(e, { homeEnd: false })) return
    if (e.key === "Enter") {
      e.preventDefault()
      if (listbox.activeItem) commit(listbox.activeItem.value)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      if (listbox.activeItem) setCurrent(listbox.activeItem.value)
      closeList()
    }
  }
</script>

<div class={cn("relative", className)}>
  <div
    {...panel.triggerAttachment}
    id={triggerId}
    role="combobox"
    tabindex={disabled ? -1 : 0}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listId}
    aria-activedescendant={open && !searchable ? listbox.activeDescendant : undefined}
    aria-disabled={disabled || undefined}
    aria-invalid={fromField["aria-invalid"] ?? ariaInvalid}
    aria-describedby={fromField["aria-describedby"] ?? ariaDescribedBy}
    aria-labelledby={labelledBy}
    aria-label={ariaLabel}
    onpointerdown={() => {
      if (!disabled) panel.onTriggerPointerDown()
    }}
    onclick={() => {
      if (disabled) return
      if (!open) listbox.setActiveKey(current ?? null)
      panel.onTriggerClick()
    }}
    onkeydown={onTriggerKeyDown}
    class={cn(selectVariants({ variant, size }), !selected && SELECT_PLACEHOLDER_CLASSES)}
  >
    <span class={SELECT_VALUE_CLASSES}>{selected ? selected.label : placeholder}</span>
    <svg
      class={cn(LISTBOX_CHEVRON_CLASSES, open && LISTBOX_CHEVRON_OPEN_CLASSES)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>

  {#if name !== undefined}<input type="hidden" {name} value={current ?? ""} />{/if}

  <div bind:this={panel.panel} popover="auto" style={panel.style} class={cn(LISTBOX_PANEL_CLASSES, FLOATING_TRANSITION_CLASSES)}>
    {#if searchable}
      <div class={LISTBOX_SEARCH_WRAPPER_CLASSES}>
        <input
          bind:this={searchInput}
          type="text"
          bind:value={search}
          onkeydown={onSearchKeyDown}
          placeholder="Search..."
          aria-label="Search options"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={listbox.activeDescendant}
          autocomplete="off"
          class={LISTBOX_SEARCH_INPUT_CLASSES}
        />
      </div>
    {/if}
    <div id={listId} role="listbox" aria-labelledby={labelledBy ?? triggerId} class={LISTBOX_CLASSES}>
      {#each filtered as option (option.value)}
        {@const isSelected = option.value === current}
        {@const isActive = listbox.activeKey === option.value}
        <!-- Keyboard handling lives on the trigger or search field (aria-activedescendant). -->
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
        <div
          id={listbox.optionId(option.value)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={option.disabled || undefined}
          onmousedown={(e) => e.preventDefault()}
          onpointermove={() => {
            if (!option.disabled) listbox.setActiveKey(option.value)
          }}
          onclick={() => {
            if (!option.disabled) commit(option.value)
          }}
          class={cn(
            LISTBOX_OPTION_CLASSES,
            option.disabled ? LISTBOX_OPTION_DISABLED_CLASSES : LISTBOX_OPTION_ENABLED_CLASSES,
            isActive && !option.disabled && LISTBOX_OPTION_ACTIVE_CLASSES,
            // The filled indicator shows the selection; the fill colour as text fails contrast on white.
            isSelected && LISTBOX_OPTION_SELECTED_CLASSES
          )}
        >
          <span aria-hidden="true" class={cn(SELECT_RADIO_CLASSES, isSelected ? SELECT_RADIO_CHECKED_CLASSES : SELECT_RADIO_UNCHECKED_CLASSES)}>
            {#if isSelected}<span class={SELECT_RADIO_DOT_CLASSES}></span>{/if}
          </span>
          <span>{option.label}</span>
        </div>
      {/each}
    </div>
    {#if filtered.length === 0}
      <div role="status" class={LISTBOX_EMPTY_CLASSES}>No results found</div>
    {/if}
  </div>
</div>
