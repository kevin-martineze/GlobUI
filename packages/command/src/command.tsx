"use client"

import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react"
import { cn, matchesSearch } from "@glob-ui/utils"
import { useControllableState, useListbox } from "@glob-ui/hooks"
import { Dialog, DialogContentBase, DialogTitle } from "@glob-ui/dialog"

/** One item as the root knows it. Items register themselves; the root decides what is visible. */
interface Entry {
  id: string
  value: string
  keywords: string[]
  disabled: boolean
  groupId?: string
  getElement: () => HTMLElement | null
  select: () => void
}

type CommandFilter = false | ((query: string, value: string, keywords: string[]) => boolean)

interface CommandContextValue {
  search: string
  setSearch: (next: string) => void
  listbox: ReturnType<typeof useListbox<Entry>>
  /** Visible items, in DOM order. Disabled ones are included here and skipped by the listbox. */
  listItems: Entry[]
  isVisible: (value: string, keywords: string[]) => boolean
  register: (entry: Entry) => () => void
  listId: string
  inputId: string
  label: string
  loop: boolean
  optionId: (id: string) => string
  itemSelect?: () => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

function useCommandContext(part: string) {
  const ctx = useContext(CommandContext)
  if (!ctx) throw new Error(`${part} must be used inside Command`)
  return ctx
}

const GroupContext = createContext<string | undefined>(undefined)

export interface CommandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** Search text. Pass it with onSearchChange to control it. */
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
}

/**
 * A command palette: a search field over a list of items. Items are JSX, so groups, icons and
 * shortcuts are plain children. Items are filtered and ordered as they appear in the list.
 */
const Command = forwardRef<HTMLDivElement, CommandProps>(
  (
    {
      search: searchProp,
      defaultSearch = "",
      onSearchChange,
      filter,
      loop = false,
      label = "Command menu",
      onItemSelect,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseId = useId()
    const inputId = `${baseId}-input`
    const listId = `${baseId}-list`
    const [search, setSearchState] = useControllableState<string>(searchProp, defaultSearch, onSearchChange)
    const [entries, setEntries] = useState<Entry[]>([])

    const register = useCallback((entry: Entry) => {
      setEntries((prev) => [...prev.filter((e) => e.id !== entry.id), entry])
      return () => setEntries((prev) => prev.filter((e) => e.id !== entry.id))
    }, [])

    const isVisible = useCallback(
      (value: string, keywords: string[]) => {
        if (filter === false) return true
        if (filter) return filter(search, value, keywords)
        return matchesSearch(search, value, ...keywords)
      },
      [filter, search]
    )

    // Visible items in DOM order. Items rendered as null have no element; they keep their place.
    const listItems = useMemo(() => {
      const visible = entries.filter((e) => isVisible(e.value, e.keywords))
      return [...visible].sort((a, b) => {
        const ea = a.getElement()
        const eb = b.getElement()
        if (!ea || !eb || ea === eb) return 0
        return ea.compareDocumentPosition(eb) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      })
    }, [entries, isVisible])

    const listbox = useListbox<Entry>({
      id: baseId,
      items: listItems,
      getKey: (e) => e.id,
      getText: (e) => e.value,
      isDisabled: (e) => e.disabled,
      open: true,
    })

    function setSearch(next: string) {
      setSearchState(next)
      // The first visible enabled item becomes active on every change.
      listbox.setActiveKey(null)
    }

    const ctx: CommandContextValue = {
      search,
      setSearch,
      listbox,
      listItems,
      isVisible,
      register,
      listId,
      inputId,
      label,
      loop,
      optionId: listbox.optionId,
      itemSelect: onItemSelect,
    }

    return (
      <CommandContext.Provider value={ctx}>
        <div ref={ref} className={cn("flex min-h-0 flex-col overflow-hidden text-glob-text", className)} {...props}>
          {children}
        </div>
      </CommandContext.Provider>
    )
  }
)
Command.displayName = "Command"

export type CommandInputProps = React.InputHTMLAttributes<HTMLInputElement>

/** The search field. It drives the list with the arrows, Home, End and Enter. */
const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(({ className, onChange, onKeyDown, ...props }, ref) => {
  const ctx = useCommandContext("CommandInput")
  const { listbox, listItems, loop } = ctx

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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

  return (
    <div className="flex items-center gap-2 border-b border-glob-border px-3">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-glob-text-secondary">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-4-4" />
      </svg>
      <input
        ref={ref}
        id={ctx.inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        spellCheck={false}
        aria-label={ctx.label}
        aria-autocomplete="list"
        aria-expanded="true"
        aria-controls={ctx.listId}
        aria-activedescendant={listbox.activeDescendant}
        {...props}
        value={ctx.search}
        onChange={(e) => {
          onChange?.(e)
          ctx.setSearch(e.target.value)
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (!e.defaultPrevented) handleKeyDown(e)
        }}
        className={cn(
          "h-11 w-full min-w-0 bg-transparent text-sm text-glob-text placeholder:text-glob-text-secondary outline-none",
          className
        )}
      />
    </div>
  )
})
CommandInput.displayName = "CommandInput"

export type CommandListProps = React.HTMLAttributes<HTMLDivElement>

const CommandList = forwardRef<HTMLDivElement, CommandListProps>(({ className, ...props }, ref) => {
  const ctx = useCommandContext("CommandList")
  return (
    <div
      ref={ref}
      id={ctx.listId}
      role="listbox"
      aria-label={ctx.label}
      className={cn("max-h-80 overflow-y-auto overscroll-contain p-1", className)}
      {...props}
    />
  )
})
CommandList.displayName = "CommandList"

export type CommandEmptyProps = React.HTMLAttributes<HTMLDivElement>

/** Shown only when no item is visible. Put it next to CommandList, not inside it. */
const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(({ className, children, ...props }, ref) => {
  const ctx = useCommandContext("CommandEmpty")
  if (ctx.listItems.length > 0) return null
  return (
    <div ref={ref} role="status" className={cn("px-3 py-6 text-center text-sm text-glob-text-secondary", className)} {...props}>
      {children ?? "No results."}
    </div>
  )
})
CommandEmpty.displayName = "CommandEmpty"

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The group's visible name. */
  heading?: React.ReactNode
}

/** A labelled set of items. It is hidden while none of its items are visible. */
const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(({ heading, className, children, ...props }, ref) => {
  const ctx = useCommandContext("CommandGroup")
  const groupId = useId()
  const headingId = `${groupId}-heading`
  const anyVisible = ctx.listItems.some((item) => item.groupId === groupId)
  return (
    <div ref={ref} role="group" aria-labelledby={heading ? headingId : undefined} hidden={!anyVisible} className={cn("py-1", className)} {...props}>
      {heading && (
        <div id={headingId} className="px-2 py-1.5 text-xs font-medium text-glob-text-secondary">
          {heading}
        </div>
      )}
      {/* Children stay mounted while hidden, so they keep registering with the root. */}
      <GroupContext.Provider value={groupId}>{children}</GroupContext.Provider>
    </div>
  )
})
CommandGroup.displayName = "CommandGroup"

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** The text that is matched against the search. Also the value passed to onSelect. */
  value: string
  /** More text the search matches (synonyms, tags). */
  keywords?: string[]
  disabled?: boolean
  onSelect?: (value: string) => void
}

const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(
  ({ value, keywords = [], disabled = false, onSelect, className, children, onClick, onPointerMove, onMouseDown, ...props }, ref) => {
    const ctx = useCommandContext("CommandItem")
    const { register, itemSelect } = ctx
    const groupId = useContext(GroupContext)
    const id = useId()
    const elementRef = useRef<HTMLDivElement | null>(null)
    const keywordsKey = keywords.join("\u0000")
    // The latest props, read when the item is selected. Written after commit, never during render.
    const latest = useRef({ value, onSelect, itemSelect })
    useLayoutEffect(() => {
      latest.current = { value, onSelect, itemSelect }
    })

    function select() {
      latest.current.onSelect?.(latest.current.value)
      latest.current.itemSelect?.()
    }

    // Registration runs even while the item is hidden (it renders null), so the root can still see it.
    useLayoutEffect(() => {
      return register({
        id,
        value,
        keywords: keywordsKey ? keywordsKey.split("\u0000") : [],
        disabled,
        groupId,
        getElement: () => elementRef.current,
        select,
      })
      // `select` reads only the ref, so it is not a dependency.
    }, [register, id, value, keywordsKey, disabled, groupId])

    if (!ctx.isVisible(value, keywords)) return null
    const isActive = ctx.listbox.activeKey === id

    return (
      <div
        ref={(node) => {
          elementRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        id={ctx.optionId(id)}
        role="option"
        aria-selected={isActive}
        aria-disabled={disabled || undefined}
        data-command-item=""
        // Keep focus in the search field while the pointer is on an item.
        onMouseDown={(e) => {
          onMouseDown?.(e)
          e.preventDefault()
        }}
        onPointerMove={(e) => {
          onPointerMove?.(e)
          if (!disabled) ctx.listbox.setActiveKey(id)
        }}
        onClick={(e) => {
          onClick?.(e)
          if (!disabled && !e.defaultPrevented) select()
        }}
        className={cn(
          "flex cursor-pointer select-none items-center gap-2 rounded-glob-sm px-2 py-2 text-sm text-glob-text",
          isActive && !disabled && "bg-glob-surface-hover",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CommandItem.displayName = "CommandItem"

export type CommandSeparatorProps = React.HTMLAttributes<HTMLDivElement>

/** A rule between groups. Hidden while the user is searching. */
const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(({ className, ...props }, ref) => {
  const ctx = useCommandContext("CommandSeparator")
  return <div ref={ref} role="none" hidden={ctx.search !== ""} className={cn("my-1 h-px bg-glob-border", className)} {...props} />
})
CommandSeparator.displayName = "CommandSeparator"

export type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>

/** A keyboard hint on the right of an item. Hidden from assistive technology: put the shortcut in the item's text if it matters. */
const CommandShortcut = forwardRef<HTMLSpanElement, CommandShortcutProps>(({ className, ...props }, ref) => (
  <span ref={ref} aria-hidden="true" className={cn("ml-auto text-xs tracking-widest text-glob-text-secondary", className)} {...props} />
))
CommandShortcut.displayName = "CommandShortcut"

export interface CommandDialogProps extends Omit<CommandProps, "search" | "defaultSearch" | "onSearchChange" | "onItemSelect"> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Keyboard shortcut that toggles the dialog, as modifiers and a key joined by "+" (for example "mod+k", "ctrl+shift+p", "/").
   * Modifiers: `mod` (Meta on macOS, Ctrl elsewhere), `meta`, `ctrl`, `shift`, `alt`; they must match exactly.
   * A shortcut without Ctrl or Meta is ignored while typing in a field. `false` disables it. Default "mod+k".
   */
  shortcut?: string | false
  /** Close the dialog after an item is selected. Default true. */
  closeOnSelect?: boolean
}

/** A Command in a modal Dialog, with a keyboard shortcut. The search resets each time it opens. */
function CommandDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  shortcut = "mod+k",
  closeOnSelect = true,
  label = "Command menu",
  children,
  ...commandProps
}: CommandDialogProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)

  useEffect(() => {
    if (shortcut === false) return
    const parts = shortcut.toLowerCase().split("+").map((p) => p.trim())
    const key = parts[parts.length - 1]
    const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
    // Every modifier must match exactly: "mod+k" does not fire on Ctrl+Shift+K, and "k" alone does not fire with Ctrl.
    const want = {
      meta: parts.includes("meta") || (parts.includes("mod") && isMac),
      ctrl: parts.includes("ctrl") || (parts.includes("mod") && !isMac),
      shift: parts.includes("shift"),
      alt: parts.includes("alt"),
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey !== want.meta || e.ctrlKey !== want.ctrl || e.shiftKey !== want.shift || e.altKey !== want.alt) return
      if (e.key.toLowerCase() !== key) return
      // A shortcut without Ctrl or Meta must not fire while the user types in a field.
      const target = e.target as HTMLElement | null
      if (!want.meta && !want.ctrl && target?.closest("input, textarea, select, [contenteditable='true']")) return
      e.preventDefault()
      setOpen(!isOpen)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [shortcut, isOpen, setOpen])

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContentBase className="m-auto flex max-h-[min(70dvh,32rem)] w-[calc(100%-2rem)] max-w-lg flex-col overflow-hidden rounded-glob-lg border border-glob-border bg-glob-surface p-0 text-glob-text shadow-glob-md backdrop:bg-glob-overlay">
        <DialogTitle className="sr-only">{label}</DialogTitle>
        {/* Mounted only while open, so every opening starts with an empty search. */}
        {isOpen && (
          <Command {...commandProps} label={label} onItemSelect={closeOnSelect ? () => setOpen(false) : undefined}>
            {children}
          </Command>
        )}
      </DialogContentBase>
    </Dialog>
  )
}
CommandDialog.displayName = "CommandDialog"

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut, CommandDialog }
