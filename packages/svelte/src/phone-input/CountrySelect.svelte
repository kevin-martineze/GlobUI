<script lang="ts">
  import { cn } from "@glob-ui/utils"
  import { countries } from "@glob-ui/core"
  import {
    COUNTRY_CHEVRON_CLASSES,
    COUNTRY_DIAL_CLASSES,
    COUNTRY_EMPTY_CLASSES,
    COUNTRY_FLAG_CLASSES,
    COUNTRY_LIST_CLASSES,
    COUNTRY_NAME_CLASSES,
    COUNTRY_OPTION_ACTIVE_CLASSES,
    COUNTRY_OPTION_CLASSES,
    COUNTRY_OPTION_SELECTED_CLASSES,
    COUNTRY_PANEL_CLASSES,
    COUNTRY_SEARCH_INPUT_CLASSES,
    COUNTRY_SEARCH_WRAPPER_CLASSES,
    COUNTRY_SELECT_CLASSES,
    COUNTRY_TRIGGER_CLASSES,
    COUNTRY_TRIGGER_CODE_CLASSES,
    COUNTRY_TRIGGER_SIZE,
    FLOATING_TRANSITION_CLASSES,
    LISTBOX_CHEVRON_OPEN_CLASSES,
  } from "@glob-ui/recipes"
  import { FloatingPanel } from "../shared/floating.svelte"
  import { Listbox } from "../shared/listbox.svelte"

  type Country = (typeof countries)[number]

  let {
    value,
    onChange,
    size = "md",
    disabled = false,
  }: { value: string; onChange: (iso: string) => void; size?: "sm" | "md" | "lg"; disabled?: boolean } = $props()

  const baseId = $props.id()
  const listId = `${baseId}-listbox`
  let open = $state(false)
  let search = $state("")
  let searchInput = $state<HTMLInputElement | null>(null)

  const selected = $derived(countries.find((c) => c.iso === value) ?? countries[0])

  // Matches name, dial code and ISO code.
  const filtered = $derived.by(() => {
    if (!search) return countries
    const q = search.toLowerCase()
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q))
  })

  const listbox = new Listbox<Country>(() => ({
    id: baseId,
    items: filtered,
    getKey: (c) => c.iso,
    getText: (c) => c.name,
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
    onShow: () => searchInput?.focus({ preventScroll: true }),
  }))

  /** Closes the list and clears the search, so the next open starts from the full list. */
  function closeList() {
    open = false
    search = ""
  }

  function openList() {
    if (disabled) return
    listbox.setActiveKey(value)
    open = true
  }

  function commit(iso: string) {
    onChange(iso)
    closeList()
  }

  function onTriggerKeyDown(e: KeyboardEvent) {
    if (disabled || open) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openList()
    }
  }

  function onSearchKeyDown(e: KeyboardEvent) {
    if (listbox.navigate(e, { homeEnd: false })) return
    if (e.key === "Enter") {
      e.preventDefault()
      if (listbox.activeItem) commit(listbox.activeItem.iso)
    } else if (e.key === "Escape") {
      e.preventDefault()
      closeList()
    } else if (e.key === "Tab") {
      if (listbox.activeItem) onChange(listbox.activeItem.iso)
      closeList()
    }
  }
</script>

<div class={COUNTRY_SELECT_CLASSES}>
  <div
    {...panel.triggerAttachment}
    role="combobox"
    aria-label="Country code"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={listId}
    tabindex={disabled ? -1 : 0}
    aria-disabled={disabled || undefined}
    onpointerdown={() => {
      if (!disabled) panel.onTriggerPointerDown()
    }}
    onclick={() => {
      if (disabled) return
      if (!open) listbox.setActiveKey(value)
      panel.onTriggerClick()
    }}
    onkeydown={onTriggerKeyDown}
    class={cn(COUNTRY_TRIGGER_CLASSES, COUNTRY_TRIGGER_SIZE[size])}
  >
    <span class={COUNTRY_FLAG_CLASSES} aria-hidden="true">{selected.flag}</span>
    <span class={COUNTRY_TRIGGER_CODE_CLASSES}>{selected.code}</span>
    <svg
      class={cn(COUNTRY_CHEVRON_CLASSES, open && LISTBOX_CHEVRON_OPEN_CLASSES)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  </div>

  <div bind:this={panel.panel} popover="auto" style={panel.style} class={cn(COUNTRY_PANEL_CLASSES, FLOATING_TRANSITION_CLASSES)}>
    <div class={COUNTRY_SEARCH_WRAPPER_CLASSES}>
      <input
        bind:this={searchInput}
        type="text"
        bind:value={search}
        onkeydown={onSearchKeyDown}
        placeholder="Search country..."
        aria-label="Search countries"
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={listbox.activeDescendant}
        autocomplete="off"
        class={COUNTRY_SEARCH_INPUT_CLASSES}
      />
    </div>
    <div id={listId} role="listbox" aria-label="Countries" class={COUNTRY_LIST_CLASSES}>
      {#each filtered as country (country.iso)}
        {@const isSelected = country.iso === selected.iso}
        {@const isActive = listbox.activeKey === country.iso}
        <!-- Keyboard handling lives on the search field (aria-activedescendant). -->
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_interactive_supports_focus -->
        <div
          id={listbox.optionId(country.iso)}
          role="option"
          aria-selected={isSelected}
          onmousedown={(e) => e.preventDefault()}
          onpointermove={() => listbox.setActiveKey(country.iso)}
          onclick={() => commit(country.iso)}
          class={cn(COUNTRY_OPTION_CLASSES, isActive && COUNTRY_OPTION_ACTIVE_CLASSES, isSelected && COUNTRY_OPTION_SELECTED_CLASSES)}
        >
          <span class={COUNTRY_FLAG_CLASSES} aria-hidden="true">{country.flag}</span>
          <span class={COUNTRY_NAME_CLASSES}>{country.name}</span>
          <span class={COUNTRY_DIAL_CLASSES}>{country.code}</span>
        </div>
      {/each}
    </div>
    {#if filtered.length === 0}
      <div role="status" class={COUNTRY_EMPTY_CLASSES}>No countries found</div>
    {/if}
  </div>
</div>
