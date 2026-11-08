"use client"

import { createContext, forwardRef, useContext, useId, useLayoutEffect, useMemo, useRef } from "react"
import { cva } from "class-variance-authority"
import { cn } from "@glob-ui/utils"
import { useControllableState, useRovingFocus } from "@glob-ui/hooks"
import { composeRefs } from "@glob-ui/slot"

type Orientation = "horizontal" | "vertical"
type Variant = "underline" | "pill"

interface TabsContextValue {
  value: string | undefined
  setValue: (value: string) => void
  orientation: Orientation
  variant: Variant
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(part: string) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error(`${part} must be used inside Tabs`)
  return ctx
}

const toId = (value: string) => value.replace(/\s+/g, "-")

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: Orientation
  variant?: Variant
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { value, defaultValue, onValueChange, orientation = "horizontal", variant = "underline", className, ...props },
    ref
  ) => {
    const [current, setValue] = useControllableState<string | undefined>(value, defaultValue, onValueChange as
      | ((value: string | undefined) => void)
      | undefined)
    const baseId = useId()

    return (
      <TabsContext.Provider value={{ value: current, setValue, orientation, variant, baseId }}>
        <div
          ref={ref}
          data-orientation={orientation}
          className={cn("flex gap-4", orientation === "horizontal" ? "flex-col" : "flex-row", className)}
          {...props}
        />
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = "Tabs"

const listVariants = cva("flex", {
  variants: {
    variant: {
      underline: "",
      pill: "rounded-glob-md border border-glob-border bg-glob-surface-secondary p-0.5",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  compoundVariants: [
    { variant: "underline", orientation: "horizontal", className: "border-b border-glob-border" },
    { variant: "underline", orientation: "vertical", className: "border-r border-glob-border" },
    { variant: "pill", orientation: "horizontal", className: "inline-flex self-start" },
  ],
})

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>

const TabsList = forwardRef<HTMLDivElement, TabsListProps>(({ className, onKeyDown, ...props }, ref) => {
  const { orientation, variant, value } = useTabsContext("TabsList")
  const listRef = useRef<HTMLDivElement>(null)
  const mergedRef = useMemo(() => composeRefs(ref, listRef), [ref])

  // Roving focus with automatic activation: moving focus selects the tab.
  const roving = useRovingFocus({
    orientation,
    loop: true,
    itemSelector: '[role="tab"]:not([disabled])',
    onNavigate: (tab) => tab.click(),
  })

  // Exactly one tab stop: the selected enabled tab, or the first enabled tab when `value`
  // matches none (or only a disabled one).
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
      (tab) => tab.closest('[role="tablist"]') === list
    )
    const enabled = tabs.filter((tab) => !tab.disabled)
    const stop = enabled.find((tab) => tab.getAttribute("aria-selected") === "true") ?? enabled[0]
    for (const tab of tabs) tab.tabIndex = tab === stop ? 0 : -1
  }, [value])

  return (
    <div
      ref={mergedRef}
      role="tablist"
      aria-orientation={orientation}
      className={cn(listVariants({ variant, orientation }), className)}
      {...roving.rootProps}
      onKeyDown={(e) => {
        onKeyDown?.(e)
        roving.onKeyDown(e)
      }}
      {...props}
    />
  )
})
TabsList.displayName = "TabsList"

const triggerVariants = cva(
  "inline-flex h-9 items-center justify-center whitespace-nowrap px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        underline:
          "border-transparent text-glob-text-secondary hover:text-glob-text data-[state=active]:border-glob-primary data-[state=active]:text-glob-text",
        pill: "rounded-glob-sm text-glob-text-secondary hover:text-glob-text data-[state=active]:bg-glob-primary data-[state=active]:text-glob-primary-foreground data-[state=active]:shadow-glob-sm",
      },
      orientation: {
        horizontal: "",
        vertical: "justify-start",
      },
    },
    compoundVariants: [
      { variant: "underline", orientation: "horizontal", className: "-mb-px border-b-2" },
      { variant: "underline", orientation: "vertical", className: "-mr-px border-r-2" },
    ],
  }
)

export interface TabsTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string
}

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, disabled, onClick, ...props }, ref) => {
    const ctx = useTabsContext("TabsTrigger")
    const selected = ctx.value === value
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${ctx.baseId}-tab-${toId(value)}`}
        aria-controls={`${ctx.baseId}-panel-${toId(value)}`}
        aria-selected={selected}
        data-state={selected ? "active" : "inactive"}
        tabIndex={selected ? 0 : -1}
        disabled={disabled}
        className={cn(triggerVariants({ variant: ctx.variant, orientation: ctx.orientation }), className)}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) ctx.setValue(value)
        }}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(({ value, className, children, ...props }, ref) => {
  const ctx = useTabsContext("TabsContent")
  const selected = ctx.value === value
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${ctx.baseId}-panel-${toId(value)}`}
      aria-labelledby={`${ctx.baseId}-tab-${toId(value)}`}
      hidden={!selected}
      // Lets keyboard users reach panels that have no focusable content.
      tabIndex={0}
      data-state={selected ? "active" : "inactive"}
      className={cn("text-sm text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring rounded-glob-sm", className)}
      {...props}
    >
      {selected && children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
