"use client"

import { createContext, forwardRef, useContext, useLayoutEffect, useRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { useControllableState, useRovingFocus } from "@glob-ui/hooks"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-glob-md font-medium text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 motion-reduce:transition-none data-[state=on]:bg-glob-primary-light data-[state=on]:text-glob-text",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-glob-border bg-transparent data-[state=on]:border-glob-primary",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value">,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

/** A button with an on and off state (`aria-pressed`). Give it an accessible name when it has only an icon. */
const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, pressed, defaultPressed = false, onPressedChange, onClick, disabled, ...props }, ref) => {
    const [isPressed, setPressed] = useControllableState(pressed, defaultPressed, onPressedChange)
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        data-state={isPressed ? "on" : "off"}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) setPressed(!isPressed)
        }}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Toggle.displayName = "Toggle"

interface ToggleGroupContextValue {
  pressed: string[]
  select: (value: string) => void
  variant: VariantProps<typeof toggleVariants>["variant"]
  size: VariantProps<typeof toggleVariants>["size"]
  disabled: boolean
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

type CommonGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> &
  VariantProps<typeof toggleVariants> & {
    orientation?: "horizontal" | "vertical"
    disabled?: boolean
  }

export type ToggleGroupSingleProps = CommonGroupProps & {
  type: "single"
  /** The pressed item's value, or "" when none is pressed. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export type ToggleGroupMultipleProps = CommonGroupProps & {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

/**
 * A row of toggles. `single` lets one item be pressed (pressing it again clears the choice);
 * `multiple` lets several be pressed. Items are `aria-pressed` buttons in one tab stop: arrows move focus.
 */
const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>((props, ref) => {
  const {
    type,
    variant,
    size,
    orientation = "horizontal",
    disabled = false,
    className,
    children,
    value: rawValue,
    defaultValue: rawDefault,
    onValueChange: rawOnValueChange,
    onFocus,
    onKeyDown,
    ...rest
  } = props
  const onValueChange = rawOnValueChange as ((v: string | string[]) => void) | undefined

  // Internally a list of values; single mode maps "" to [] and back.
  const controlled = rawValue === undefined ? undefined : type === "single" ? (rawValue ? [rawValue as string] : []) : (rawValue as string[])
  const initial = rawDefault === undefined ? [] : type === "single" ? (rawDefault ? [rawDefault as string] : []) : (rawDefault as string[])
  const [pressed, setPressed] = useControllableState<string[]>(controlled, initial, (next) =>
    onValueChange?.(type === "single" ? (next[0] ?? "") : next)
  )

  function select(item: string) {
    if (type === "single") setPressed(pressed.includes(item) ? [] : [item])
    else setPressed(pressed.includes(item) ? pressed.filter((v) => v !== item) : [...pressed, item])
  }

  const rootRef = useRef<HTMLDivElement | null>(null)
  const stopRef = useRef<HTMLElement | null>(null)
  const roving = useRovingFocus({ orientation, loop: true })

  // One tab stop: the last focused item, else the first pressed one, else the first enabled one.
  function syncTabStop() {
    const root = rootRef.current
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-roving-item]"))
    const enabled = items.filter((el) => !(el as HTMLButtonElement).disabled)
    const stop =
      (stopRef.current && enabled.includes(stopRef.current) ? stopRef.current : undefined) ??
      enabled.find((el) => el.getAttribute("aria-pressed") === "true") ??
      enabled[0]
    for (const el of items) el.tabIndex = el === stop ? 0 : -1
    stopRef.current = stop ?? null
  }
  useLayoutEffect(syncTabStop)

  return (
    <ToggleGroupContext.Provider value={{ pressed, select, variant, size, disabled }}>
      <div
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        role="group"
        aria-disabled={disabled || undefined}
        {...rest}
        data-roving-root=""
        onKeyDown={(e) => {
          onKeyDown?.(e)
          roving.onKeyDown(e)
        }}
        onFocus={(e) => {
          onFocus?.(e)
          stopRef.current = e.target as HTMLElement
          syncTabStop()
        }}
        className={cn("inline-flex items-center gap-1", orientation === "vertical" && "flex-col", className)}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = "ToggleGroup"

export interface ToggleGroupItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** The value this item stands for in the group's `value`. */
  value: string
}

const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, onClick, disabled, children, ...props }, ref) => {
    const ctx = useContext(ToggleGroupContext)
    if (!ctx) throw new Error("ToggleGroupItem must be used inside ToggleGroup")
    const on = ctx.pressed.includes(value)
    const isDisabled = disabled || ctx.disabled
    return (
      <button
        ref={ref}
        type="button"
        data-roving-item=""
        aria-pressed={on}
        data-state={on ? "on" : "off"}
        disabled={isDisabled}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) ctx.select(value)
        }}
        className={cn(toggleVariants({ variant: ctx.variant, size: ctx.size, className }))}
        {...props}
      >
        {children}
      </button>
    )
  }
)
ToggleGroupItem.displayName = "ToggleGroupItem"

export { Toggle, ToggleGroup, ToggleGroupItem, toggleVariants }
