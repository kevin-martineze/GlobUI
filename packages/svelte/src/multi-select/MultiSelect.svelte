<script lang="ts">
  import { cn } from "@glob-ui/utils"
  import { isPrintableKey } from "@glob-ui/core"
  import {
    FLOATING_TRANSITION_CLASSES,
    LISTBOX_CHEVRON_OPEN_CLASSES,
    LISTBOX_CLASSES,
    LISTBOX_EMPTY_CLASSES,
    LISTBOX_OPTION_ACTIVE_CLASSES,
    LISTBOX_OPTION_CLASSES,
    LISTBOX_OPTION_DISABLED_CLASSES,
    LISTBOX_OPTION_ENABLED_CLASSES,
    LISTBOX_PANEL_CLASSES,
    LISTBOX_SEARCH_INPUT_CLASSES,
    LISTBOX_SEARCH_WRAPPER_CLASSES,
    MULTI_SELECT_CHECK_CHECKED_CLASSES,
    MULTI_SELECT_CHECK_CLASSES,
    MULTI_SELECT_CHEVRON_CLASSES,
    MULTI_SELECT_CHIP_CLASSES,
    MULTI_SELECT_CHIP_REMOVE_CLASSES,
    MULTI_SELECT_CHIP_SIZE,
    MULTI_SELECT_COMBO_CLASSES,
    MULTI_SELECT_TRIGGER_CLASSES,
    MULTI_SELECT_TRIGGER_SIZE,
    SELECT_PLACEHOLDER_CLASSES,
    SELECT_RADIO_UNCHECKED_CLASSES,
  } from "@glob-ui/recipes"
  import { FloatingPanel } from "../shared/floating.svelte"
  import { Listbox } from "../shared/listbox.svelte"
  import { fieldAttributes, getFieldContext } from "../shared/context"
  import type { MultiSelectOption } from "./types"

  /** Above this many options a search field is shown in the list. */
  const SEARCH_THRESHOLD = 8

  let {
    options,
    value = $bindable(undefined),
    defaultValue,
    onChange,
    placeholder = "Select options...",
    searchPlaceholder = "Search...",
    size = "md",
    disabled = false,
    name,
    max,
    class: className,
    id,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-label": ariaLabel,
  }: {
    options: MultiSelectOption[]
    /** The selected values. Bind them with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string[]
    defaultValue?: string[]
    onChange?: (value: string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    size?: "sm" | "md" | "lg"
    disabled?: boolean
    /** One hidden input per selected value, for native forms. */
    name?: string
    /** Maximum number of selected options. Further options are disabled until one is removed. */
    max?: number
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
  const comboId = $derived(fromField.id ?? id)
  const labelledBy = $derived(fromField["aria-labelledby"] ?? ariaLabelledBy)
  const listId = `${baseId}-listbox`

  // svelte-ignore state_referenced_locally
  let internal = $state<string[]>(defaultValue ?? [])
  const current = $derived(value ?? internal)
  function setCurrent(next: string[]) {
    if (value === undefined) internal = next
    else value = next
    onChange?.(next)
  }

  let open = $state(false)
  let search = $state("")
  let searchInput = $state<HTMLInputElement | null>(null)
  let combo = $state<HTMLDivElement | null>(null)
  const searchable = $derived(options.length > SEARCH_THRESHOLD)
  const selectedItems = $derived(options.filter((o) => current.includes(o.value)))
  const atMax = $derived(max !== undefined && current.length >= max)

  const filtered = $derived.by(() => {
    if (!search) return options
    const q = search.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  })

  const listbox = new Listbox<MultiSelectOption>(() => ({
    id: baseId,
    items: filtered,
    getKey: (o) => o.value,
    getText: (o) => o.label,
    isDisabled: (o) => Boolean(o.disabled) || (atMax && !current.includes(o.value)),
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
    onShow: () => searchInput?.focus({ preventScroll: true }),
  }))

  /** Closes the list and clears the search, so the next open starts from the full list. */
  function closeList() {
    open = false
    search = ""
  }

  function openList() {
    if (disabled) return
    listbox.setActiveKey(selectedItems[0]?.value ?? null)
    open = true
  }

  function toggle(val: string) {
    if (current.includes(val)) setCurrent(current.filter((v) => v !== val))
    else setCurrent([...current, val])
  }

  function removeChip(val: string) {
    setCurrent(current.filter((v) => v !== val))
    combo?.focus({ preventScroll: true })
  }

  function onComboKeyDown(e: KeyboardEvent) {
    if (disabled) return
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openList()
      }
      return
    }
    if (listbox.navigate(e)) return
    if (e.key === "Enter" || e.key === " ") {
      // Toggles without closing: several options can be picked in one go.
      e.preventDefault()
      if (listbox.activeItem) toggle(listbox.activeItem.value)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      closeList()
    } else if (isPrintableKey(e)) {
      e.preventDefault()
      listbox.typeahead(e.key)
    }
  }

  function onSearchKeyDown(e: KeyboardEvent) {
    if (listbox.navigate(e, { homeEnd: false })) return
    if (e.key === "Enter") {
      e.preventDefault()
      if (listbox.activeItem) toggle(listbox.activeItem.value)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      closeList()
    } else if (e.key === "Backspace" && search === "" && current.length > 0) {
      // Empty search + Backspace removes the last chip.
      e.preventDefault()
      setCurrent(current.slice(0, -1))
    }
  }
</script>

<div class={cn("relative", className)}>
  <div class={cn(MULTI_SELECT_TRIGGER_CLASSES, disabled && LISTBOX_OPTION_DISABLED_CLASSES, MULTI_SELECT_TRIGGER_SIZE[size])}>
    {#each selectedItems as item (item.value)}
      <span class={cn(MULTI_SELECT_CHIP_CLASSES, MULTI_SELECT_CHIP_SIZE[size])}>
        {item.label}
        <button
          type="button"
          aria-label={`Remove ${item.label}`}
          {disabled}
          onclick={() => removeChip(item.value)}
          class={MULTI_SELECT_CHIP_REMOVE_CLASSES}
        >
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </span>
    {/each}

    <div
      bind:this={combo}
      {...panel.triggerAttachment}
      id={comboId}
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
        if (!open) listbox.setActiveKey(selectedItems[0]?.value ?? null)
        panel.onTriggerClick()
      }}
      onkeydown={onComboKeyDown}
      class={MULTI_SELECT_COMBO_CLASSES}
    >
      {#if selectedItems.length === 0}
        <span class={SELECT_PLACEHOLDER_CLASSES}>{placeholder}</span>
      {:else}
        <span class="sr-only">{selectedItems.length} selected</span>
      {/if}
      <svg
        class={cn(MULTI_SELECT_CHEVRON_CLASSES, open && LISTBOX_CHEVRON_OPEN_CLASSES)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>

  {#if name !== undefined}
    {#each current as v (v)}<input type="hidden" {name} value={v} />{/each}
  {/if}

  <div bind:this={panel.panel} popover="auto" style={panel.style} class={cn(LISTBOX_PANEL_CLASSES, FLOATING_TRANSITION_CLASSES)}>
    {#if searchable}
      <div class={LISTBOX_SEARCH_WRAPPER_CLASSES}>
        <input
          bind:this={searchInput}
          type="text"
          bind:value={search}
          onkeydown={onSearchKeyDown}
          placeholder={searchPlaceholder}
          aria-label="Search options"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={listbox.activeDescendant}
          autocomplete="off"
          class={LISTBOX_SEARCH_INPUT_CLASSES}
        />
      </div>
    {/if}
    <div id={listId} role="listbox" aria-multiselectable="true" aria-labelledby={labelledBy ?? comboId} class={LISTBOX_CLASSES}>
      {#each filtered as option (option.value)}
        {@const isSelected = current.includes(option.value)}
        {@const isDisabled = Boolean(option.disabled) || (atMax && !isSelected)}
        {@const isActive = listbox.activeKey === option.value}
        <!-- Keyboard handling lives on the combobox or search field (aria-activedescendant). -->
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
        <div
          id={listbox.optionId(option.value)}
          role="option"
          aria-selected={isSelected}
          aria-disabled={isDisabled || undefined}
          onmousedown={(e) => e.preventDefault()}
          onpointermove={() => {
            if (!isDisabled) listbox.setActiveKey(option.value)
          }}
          onclick={() => {
            if (!isDisabled) toggle(option.value)
          }}
          class={cn(
            LISTBOX_OPTION_CLASSES,
            isDisabled ? LISTBOX_OPTION_DISABLED_CLASSES : LISTBOX_OPTION_ENABLED_CLASSES,
            isActive && !isDisabled && LISTBOX_OPTION_ACTIVE_CLASSES
          )}
        >
          <span
            aria-hidden="true"
            class={cn(MULTI_SELECT_CHECK_CLASSES, isSelected ? MULTI_SELECT_CHECK_CHECKED_CLASSES : SELECT_RADIO_UNCHECKED_CLASSES)}
          >
            {#if isSelected}
              <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            {/if}
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
