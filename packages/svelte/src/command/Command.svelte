<script lang="ts">
  import { setContext, untrack, type Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { matchesSearch } from "@glob-ui/core"
  import { COMMAND_CLASSES } from "@glob-ui/recipes"
  import { Listbox } from "../shared/listbox.svelte"
  import { COMMAND_KEY, type CommandContext, type CommandEntry } from "../shared/context"
  import type { CommandFilter } from "./types"

  type Props = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    /** The search text. Bind it with `bind:search`, or leave it unset and use `defaultSearch`. */
    search?: string
    defaultSearch?: string
    onSearchChange?: (search: string) => void
    /** `false`: everything is shown and you filter yourself (async). A function gets the query, value and keywords. Default: every word matches the value or a keyword, ignoring case and accents. */
    filter?: CommandFilter
    /** ArrowDown on the last item goes to the first, and ArrowUp on the first goes to the last. Default false. */
    loop?: boolean
    /** Accessible name of the search field and the list. Default "Command menu". */
    label?: string
    /** Used by CommandDialog to close the dialog after a selection. */
    onItemSelect?: () => void
    children?: Snippet
  }
  let {
    search = $bindable(undefined),
    defaultSearch = "",
    onSearchChange,
    filter,
    loop = false,
    label = "Command menu",
    onItemSelect,
    class: className,
    children,
    ...rest
  }: Props = $props()

  const baseId = $props.id()
  // svelte-ignore state_referenced_locally
  let internalSearch = $state(defaultSearch)
  const currentSearch = $derived(search ?? internalSearch)
  let entries = $state.raw<CommandEntry[]>([])

  function isVisible(value: string, keywords: string[]) {
    if (filter === false) return true
    if (filter) return filter(currentSearch, value, keywords)
    return matchesSearch(currentSearch, value, ...keywords)
  }

  // Visible items in DOM order. Items without an element (hidden) keep their place.
  const listItems = $derived.by(() => {
    const visible = entries.filter((e) => isVisible(e.value, e.keywords))
    return [...visible].sort((a, b) => {
      const ea = a.getElement()
      const eb = b.getElement()
      if (!ea || !eb || ea === eb) return 0
      return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
  })

  const listbox = new Listbox<CommandEntry>(() => ({
    id: baseId,
    items: listItems,
    getKey: (e) => e.id,
    getText: (e) => e.value,
    isDisabled: (e) => e.disabled,
    open: true,
  }))

  function setSearch(next: string) {
    if (search === undefined) internalSearch = next
    else search = next
    onSearchChange?.(next)
    // The first visible enabled item becomes active on every change.
    listbox.setActiveKey(null)
  }

  function onInputKeyDown(e: KeyboardEvent) {
    const enabled = listItems.filter((item) => !item.disabled)
    if (loop && enabled.length > 0 && !e.altKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      const index = listbox.activeItem ? enabled.indexOf(listbox.activeItem) : -1
      if (e.key === "ArrowDown" && index === enabled.length - 1) {
        e.preventDefault()
        listbox.setActiveKey(enabled[0].id)
        return
      }
      if (e.key === "ArrowUp" && index === 0) {
        e.preventDefault()
        listbox.setActiveKey(enabled[enabled.length - 1].id)
        return
      }
    }
    if (listbox.navigate(e)) return
    if (e.key === "Enter" && listbox.activeItem) {
      e.preventDefault()
      listbox.activeItem.select()
    }
  }

  const ctx: CommandContext = {
    get search() {
      return currentSearch
    },
    setSearch,
    get listItems() {
      return listItems
    },
    isVisible,
    // Called from item effects: reading `entries` untracked keeps those effects from depending on the list.
    register(entry) {
      entries = [...untrack(() => entries).filter((e) => e.id !== entry.id), entry]
      return () => {
        entries = untrack(() => entries).filter((e) => e.id !== entry.id)
      }
    },
    get activeKey() {
      return listbox.activeKey
    },
    setActiveKey: (key) => listbox.setActiveKey(key),
    get activeDescendant() {
      return listbox.activeDescendant
    },
    optionId: (id) => listbox.optionId(id),
    onInputKeyDown,
    listId: `${baseId}-list`,
    inputId: `${baseId}-input`,
    get label() {
      return label
    },
    itemSelect: () => onItemSelect?.(),
  }
  setContext(COMMAND_KEY, ctx)
</script>

<div class={cn(COMMAND_CLASSES, className)} {...rest}>
  {@render children?.()}
</div>
