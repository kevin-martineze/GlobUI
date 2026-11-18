// Context keys and types shared by the Svelte components. A context value is an object whose fields are
// getters, so readers see the current state without re-providing it.

import { getContext } from "svelte"

export const DIALOG_KEY = Symbol("glob-ui-dialog")
export const LAYOUT_SCROLL_KEY = Symbol("glob-ui-layout-scroll")
export const LAYOUT_NAV_KEY = Symbol("glob-ui-layout-nav")

export interface DialogContext {
  readonly open: boolean
  readonly closeOnOutsideClick: boolean
  setOpen(open: boolean): void
  contentId: string
  titleId: string
  descriptionId: string
}

export interface LayoutScrollContext {
  readonly element: HTMLElement | null
}

export interface LayoutNavContext {
  readonly open: boolean
  setOpen(open: boolean): void
  panelId: string
}

/** The Dialog context, or a clear error when a part is used outside Dialog, Sheet or AlertDialog. */
export function getDialogContext(part: string): DialogContext {
  const ctx = getContext<DialogContext | undefined>(DIALOG_KEY)
  if (!ctx) throw new Error(`${part} must be used inside Dialog, Sheet or AlertDialog`)
  return ctx
}

// Phase 10d-1: forms and primitives.
export const FIELD_KEY = Symbol("glob-ui-field")
export const RADIO_GROUP_KEY = Symbol("glob-ui-radio-group")
export const TOGGLE_GROUP_KEY = Symbol("glob-ui-toggle-group")
export const AVATAR_GROUP_KEY = Symbol("glob-ui-avatar-group")

/** What a Field gives the one control inside it: the ids that name and describe it, and its invalid state. */
export interface FieldContext {
  readonly controlId: string
  /** The control's own id replaces the generated one, so the label still points at it. */
  setControlId(id: string): void
  readonly labelId: string | undefined
  readonly descriptionId: string | undefined
  readonly errorId: string | undefined
  readonly invalid: boolean
}

/** The enclosing Field, if any. Controls work the same without one. */
export function getFieldContext(): FieldContext | undefined {
  return getContext<FieldContext | undefined>(FIELD_KEY)
}

export interface FieldOwnAttributes {
  id?: string | null
  "aria-describedby"?: string | null
  "aria-labelledby"?: string | null
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | null
}

const join = (...values: (string | null | undefined)[]) => values.filter(Boolean).join(" ") || undefined

/**
 * The attributes a control takes from its Field, merged with its own: its own id wins, the aria lists are joined,
 * and an error marks it invalid. The same rules as React's Field, which clones these props into its child.
 * Returns an empty object outside a Field, so it can always be spread last.
 */
export function fieldAttributes(field: FieldContext | undefined, own: FieldOwnAttributes): FieldOwnAttributes {
  if (!field) return {}
  return {
    id: own.id ?? field.controlId,
    "aria-describedby": join(own["aria-describedby"], field.descriptionId, field.errorId),
    "aria-labelledby": join(own["aria-labelledby"], field.labelId),
    "aria-invalid": field.invalid ? true : own["aria-invalid"],
  }
}

export type ChoiceSize = "sm" | "md" | "lg"

export interface RadioGroupContext {
  readonly name: string
  readonly value: string | undefined
  select(value: string): void
  readonly disabled: boolean
  readonly required: boolean
  readonly invalid: boolean
  readonly size: ChoiceSize
}

export function getRadioGroupContext(): RadioGroupContext {
  const ctx = getContext<RadioGroupContext | undefined>(RADIO_GROUP_KEY)
  if (!ctx) throw new Error("RadioGroupItem must be used inside RadioGroup")
  return ctx
}

export interface ToggleGroupContext {
  readonly pressed: string[]
  select(value: string): void
  readonly variant: "default" | "outline" | undefined
  readonly size: "sm" | "md" | "lg" | undefined
  readonly disabled: boolean
}

export function getToggleGroupContext(): ToggleGroupContext {
  const ctx = getContext<ToggleGroupContext | undefined>(TOGGLE_GROUP_KEY)
  if (!ctx) throw new Error("ToggleGroupItem must be used inside ToggleGroup")
  return ctx
}

export type AvatarSize = "sm" | "md" | "lg" | "xl"
export type AvatarShape = "circle" | "square"

export interface AvatarGroupContext {
  readonly size: AvatarSize | undefined
  readonly shape: AvatarShape | undefined
  /** Adds an avatar in document order. Returns nothing; read `isVisible` for the result. */
  register(id: string): void
  unregister(id: string): void
  /** False for the avatars past `max`: they render nothing and count in "+N". */
  isVisible(id: string): boolean
}

export function getAvatarGroupContext(): AvatarGroupContext | undefined {
  return getContext<AvatarGroupContext | undefined>(AVATAR_GROUP_KEY)
}

// Phase 10d-2: overlays.
export const POPOVER_KEY = Symbol("glob-ui-popover")
export const MENU_KEY = Symbol("glob-ui-dropdown-menu")
export const MENU_RADIO_GROUP_KEY = Symbol("glob-ui-dropdown-menu-radio-group")
export const COMMAND_KEY = Symbol("glob-ui-command")
export const COMMAND_GROUP_KEY = Symbol("glob-ui-command-group")

/** Shared by Popover and DropdownMenu: the panel, its ids, and the open state. */
export interface FloatingContext {
  readonly open: boolean
  setOpen(open: boolean): void
  readonly triggerId: string
  readonly contentId: string
  readonly panel: import("./floating.svelte").FloatingPanel
}

export function getPopoverContext(part: string): FloatingContext {
  const ctx = getContext<FloatingContext | undefined>(POPOVER_KEY)
  if (!ctx) throw new Error(`${part} must be used inside Popover`)
  return ctx
}

export type MenuFocusIntent = "first" | "last" | "content"

export interface MenuContext extends FloatingContext {
  /** Opens the menu and chooses what receives focus once it is shown. */
  openWith(intent: MenuFocusIntent): void
}

export function getMenuContext(part: string): MenuContext {
  const ctx = getContext<MenuContext | undefined>(MENU_KEY)
  if (!ctx) throw new Error(`${part} must be used inside DropdownMenu`)
  return ctx
}

export interface MenuRadioGroupContext {
  readonly value: string | undefined
  setValue(value: string): void
}

export function getMenuRadioGroupContext(): MenuRadioGroupContext {
  const ctx = getContext<MenuRadioGroupContext | undefined>(MENU_RADIO_GROUP_KEY)
  if (!ctx) throw new Error("DropdownMenuRadioItem must be used inside DropdownMenuRadioGroup")
  return ctx
}

/** One Command item as the root knows it. Items register themselves; the root decides what is visible. */
export interface CommandEntry {
  id: string
  value: string
  keywords: string[]
  disabled: boolean
  groupId?: string
  getElement(): HTMLElement | null
  select(): void
}

export interface CommandContext {
  readonly search: string
  setSearch(next: string): void
  /** Visible items in DOM order. Disabled ones are included and skipped by the keyboard. */
  readonly listItems: CommandEntry[]
  isVisible(value: string, keywords: string[]): boolean
  register(entry: CommandEntry): () => void
  readonly activeKey: string | null
  setActiveKey(key: string | null): void
  readonly activeDescendant: string | undefined
  optionId(id: string): string
  /** Keyboard handling for the search field: arrows, Home, End, Enter. */
  onInputKeyDown(e: KeyboardEvent): void
  readonly listId: string
  readonly inputId: string
  readonly label: string
  /** Runs after an item's onSelect: CommandDialog closes itself here. */
  itemSelect(): void
}

export function getCommandContext(part: string): CommandContext {
  const ctx = getContext<CommandContext | undefined>(COMMAND_KEY)
  if (!ctx) throw new Error(`${part} must be used inside Command`)
  return ctx
}

export function getCommandGroupId(): string | undefined {
  return getContext<string | undefined>(COMMAND_GROUP_KEY)
}
