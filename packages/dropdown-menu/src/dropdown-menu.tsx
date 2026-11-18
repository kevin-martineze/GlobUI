"use client"

import { createContext, forwardRef, useCallback, useContext, useId, useMemo, useRef } from "react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { Slot, composeRefs } from "@glob-ui/slot"
import { useControllableState, useFloatingPanel, useRovingFocus, type Placement } from "@glob-ui/hooks"
import { FLOATING_TRANSITION_CLASSES, MENU_CHECK_ICON_CLASSES, MENU_CONTENT_CLASSES, MENU_ITEM_INDICATOR_CLASSES, MENU_LABEL_CLASSES, MENU_LABEL_INSET_CLASSES, MENU_RADIO_DOT_CLASSES, MENU_SEPARATOR_CLASSES, MENU_SHORTCUT_CLASSES, itemVariants } from "@glob-ui/recipes"

const ITEM_SELECTOR = '[data-roving-item]:not([aria-disabled="true"])'

type FocusIntent = "first" | "last" | "content"
type Panel = ReturnType<typeof useFloatingPanel>

interface MenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  /** Open and choose what receives focus once the menu is shown. */
  openWith: (intent: FocusIntent) => void
  triggerId: string
  contentId: string
  panel: Panel
}

const MenuContext = createContext<MenuContextValue | null>(null)

function useMenuContext(part: string) {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error(`${part} must be used inside DropdownMenu`)
  return ctx
}

function getItems(content: HTMLElement) {
  return Array.from(content.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (item) => item.closest("[data-roving-root]") === content
  )
}

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Preferred side. Flips when it does not fit. */
  placement?: Placement
  /** Gap between trigger and menu, in px. */
  offset?: number
  children?: React.ReactNode
}

function DropdownMenu({
  open,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom-start",
  offset = 4,
  children,
}: DropdownMenuProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen, onOpenChange)
  const triggerId = useId()
  const contentId = useId()
  const intent = useRef<FocusIntent>("content")

  const panel = useFloatingPanel({
    open: isOpen,
    onOpenChange: setOpen,
    placement,
    offset,
    onShow: (el) => {
      const items = getItems(el)
      const target = intent.current === "first" ? items[0] : intent.current === "last" ? items[items.length - 1] : undefined
      intent.current = "content"
      ;(target ?? el).focus({ preventScroll: true })
    },
  })

  const openWith = useCallback(
    (next: FocusIntent) => {
      intent.current = next
      setOpen(true)
    },
    [setOpen]
  )

  return (
    <MenuContext.Provider value={{ open: isOpen, setOpen, openWith, triggerId, contentId, panel }}>
      {children}
    </MenuContext.Provider>
  )
}
DropdownMenu.displayName = "DropdownMenu"

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild = false, onClick, onPointerDown, onKeyDown, ...props }, ref) => {
    const { open, openWith, triggerId, contentId, panel } = useMenuContext("DropdownMenuTrigger")
    const { setTrigger, triggerHandlers } = panel
    const mergedRef = useMemo(() => composeRefs<HTMLButtonElement>(ref, setTrigger), [ref, setTrigger])
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={mergedRef}
        id={triggerId}
        type={asChild ? undefined : "button"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={contentId}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
          onPointerDown?.(e)
          triggerHandlers.onPointerDown()
        }}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(e)
          if (e.defaultPrevented) return
          // detail 0: a click from Enter/Space or assistive tech, not a pointer. Open on the first item.
          if (e.detail === 0 && !open) openWith("first")
          else triggerHandlers.onClick()
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(e)
          if (e.defaultPrevented) return
          // A native button turns Enter/Space into a click (handled above). Space cannot be cancelled
          // from keydown, so only other elements (asChild) need them here.
          const isButton = e.currentTarget instanceof HTMLButtonElement
          if (e.key === "ArrowDown" || (!isButton && (e.key === "Enter" || e.key === " "))) {
            e.preventDefault()
            openWith("first")
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            openWith("last")
          }
        }}
        {...props}
      />
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export type DropdownMenuContentProps = React.HTMLAttributes<HTMLDivElement>

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, style, onKeyDown, children, ...props }, ref) => {
    const { setOpen, triggerId, contentId, panel } = useMenuContext("DropdownMenuContent")
    const { setPanel, floatingStyles } = panel
    const mergedRef = useMemo(() => composeRefs<HTMLDivElement>(ref, setPanel), [ref, setPanel])
    const roving = useRovingFocus({ orientation: "vertical", loop: true, typeahead: true, itemSelector: ITEM_SELECTOR })

    return (
      <div
        ref={mergedRef}
        id={contentId}
        popover="auto"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={triggerId}
        tabIndex={-1}
        style={{ ...floatingStyles, ...style }}
        {...roving.rootProps}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          // Tab leaves the menu: close it and let focus move on (no preventDefault).
          if (e.key === "Tab") {
            setOpen(false)
            return
          }
          roving.onKeyDown(e)
        }}
        className={cn(
          // Reset the UA popover box (inset:0 + margin:auto would center it).
          MENU_CONTENT_CLASSES,
          FLOATING_TRANSITION_CLASSES,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

interface BaseItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  disabled?: boolean
  /**
   * Runs when the item is chosen with click, Enter or Space.
   * Call `event.preventDefault()` to keep the menu open.
   */
  onSelect?: (event: Event) => void
  /** Text used by typeahead when the visible text differs (icons, shortcuts). */
  textValue?: string
}

/** Shared behaviour of every item type: focus on hover, select on click/Enter/Space, close. */
function useItemProps(
  {
    disabled = false,
    onSelect,
    textValue,
    onClick,
    onKeyDown,
    onPointerMove,
    onPointerLeave,
    ...rest
  }: BaseItemProps,
  closeOnSelect: boolean,
  onActivate?: () => void
) {
  const { setOpen, panel } = useMenuContext("DropdownMenuItem")
  const { panel: content } = panel

  function select() {
    if (disabled) return
    onActivate?.()
    const event = new Event("glob-ui.menu.select", { cancelable: true })
    onSelect?.(event)
    if (closeOnSelect && !event.defaultPrevented) setOpen(false)
  }

  return {
    tabIndex: -1,
    "data-roving-item": "",
    "data-text-value": textValue,
    "aria-disabled": disabled || undefined,
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e)
      if (!e.defaultPrevented) select()
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      if (e.key === "Enter" || e.key === " ") {
        // Space would scroll the page; Enter would repeat on hold.
        e.preventDefault()
        if (!e.repeat) select()
      }
    },
    // Hover highlights by moving focus, like the keyboard does.
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(e)
      if (e.pointerType === "mouse" && !disabled && document.activeElement !== e.currentTarget) {
        e.currentTarget.focus({ preventScroll: true })
      }
    },
    onPointerLeave: (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(e)
      if (e.pointerType === "mouse" && document.activeElement === e.currentTarget) {
        content?.focus({ preventScroll: true })
      }
    },
    rest,
  }
}

export interface DropdownMenuItemProps extends BaseItemProps, VariantProps<typeof itemVariants> {}

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, variant, inset, ...props }, ref) => {
    const { rest, ...itemProps } = useItemProps(props, true)
    return (
      <div ref={ref} role="menuitem" className={cn(itemVariants({ variant, inset }), className)} {...itemProps} {...rest} />
    )
  }
)
DropdownMenuItem.displayName = "DropdownMenuItem"

function ItemIndicator({ children }: { children: React.ReactNode }) {
  return (
    <span aria-hidden="true" className={MENU_ITEM_INDICATOR_CLASSES}>
      {children}
    </span>
  )
}

export interface DropdownMenuCheckboxItemProps extends BaseItemProps {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  /** Close the menu after toggling. Off by default so several options can be changed. */
  closeOnSelect?: boolean
}

const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ className, checked, defaultChecked = false, onCheckedChange, closeOnSelect = false, children, ...props }, ref) => {
    const [isChecked, setChecked] = useControllableState(checked, defaultChecked, onCheckedChange)
    const { rest, ...itemProps } = useItemProps(props, closeOnSelect, () => setChecked(!isChecked))

    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={isChecked}
        className={cn(itemVariants({ inset: true }), className)}
        {...itemProps}
        {...rest}
      >
        {isChecked && (
          <ItemIndicator>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={MENU_CHECK_ICON_CLASSES}>
              <path d="M5 12l5 5L20 7" />
            </svg>
          </ItemIndicator>
        )}
        {children}
      </div>
    )
  }
)
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

interface RadioGroupContextValue {
  value: string | undefined
  setValue: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface DropdownMenuRadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const DropdownMenuRadioGroup = forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  ({ value, defaultValue, onValueChange, ...props }, ref) => {
    const [current, setValue] = useControllableState<string | undefined>(value, defaultValue, onValueChange as (v: string | undefined) => void)
    return (
      <RadioGroupContext.Provider value={{ value: current, setValue }}>
        <div ref={ref} role="group" {...props} />
      </RadioGroupContext.Provider>
    )
  }
)
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"

export interface DropdownMenuRadioItemProps extends BaseItemProps {
  value: string
  /** Close the menu after choosing. Off by default. */
  closeOnSelect?: boolean
}

const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ className, value, closeOnSelect = false, children, ...props }, ref) => {
    const group = useContext(RadioGroupContext)
    if (!group) throw new Error("DropdownMenuRadioItem must be used inside DropdownMenuRadioGroup")
    const checked = group.value === value
    const { rest, ...itemProps } = useItemProps(props, closeOnSelect, () => group.setValue(value))

    return (
      <div
        ref={ref}
        role="menuitemradio"
        aria-checked={checked}
        className={cn(itemVariants({ inset: true }), className)}
        {...itemProps}
        {...rest}
      >
        {checked && (
          <ItemIndicator>
            <span className={MENU_RADIO_DOT_CLASSES} />
          </ItemIndicator>
        )}
        {children}
      </div>
    )
  }
)
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const DropdownMenuLabel = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(MENU_LABEL_CLASSES, inset && MENU_LABEL_INSET_CLASSES, className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>

const DropdownMenuSeparator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(({ className, ...props }, ref) => (
  <div ref={ref} role="separator" className={cn(MENU_SEPARATOR_CLASSES, className)} {...props} />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>

const DropdownMenuShortcut = forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn(MENU_SHORTCUT_CLASSES, className)} {...props} />
))
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
}
