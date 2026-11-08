"use client"

import { createContext, forwardRef, useContext, useId, useState } from "react"
import { cn } from "@glob-ui/utils"
import { useRovingFocus } from "@glob-ui/hooks"

interface AccordionContextValue {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

interface ItemContextValue {
  value: string
  open: boolean
  disabled: boolean
  triggerId: string
  contentId: string
}

const ItemContext = createContext<ItemContextValue | null>(null)

function useRequired<T>(ctx: T | null, part: string, parent: string): T {
  if (!ctx) throw new Error(`${part} must be used inside ${parent}`)
  return ctx
}

type BaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">

interface AccordionSingleProps extends BaseProps {
  type?: "single"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Allow closing the open item, leaving none open. */
  collapsible?: boolean
}

interface AccordionMultipleProps extends BaseProps {
  type: "multiple"
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  collapsible?: never
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps

const toArray = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : v ? [v] : [])

const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const { type = "single", value, defaultValue, onValueChange, collapsible = false, className, onKeyDown, ...rest } =
    props as BaseProps & {
      type?: "single" | "multiple"
      value?: string | string[]
      defaultValue?: string | string[]
      onValueChange?: (value: never) => void
      collapsible?: boolean
    }

  const [internal, setInternal] = useState<string[]>(() => toArray(defaultValue))
  const isControlled = value !== undefined
  const openValues = isControlled ? toArray(value) : internal

  function toggle(item: string) {
    const isOpen = openValues.includes(item)
    let next: string[]
    if (type === "multiple") next = isOpen ? openValues.filter((v) => v !== item) : [...openValues, item]
    else if (isOpen) {
      if (!collapsible) return
      next = []
    } else next = [item]

    if (!isControlled) setInternal(next)
    const emit = onValueChange as ((v: string | string[]) => void) | undefined
    emit?.(type === "multiple" ? next : (next[0] ?? ""))
  }

  // Optional APG keys: move between headers with arrows / Home / End.
  const roving = useRovingFocus({ orientation: "vertical", loop: true, itemSelector: "[data-accordion-trigger]:not([disabled])" })

  return (
    <AccordionContext.Provider value={{ isOpen: (v) => openValues.includes(v), toggle }}>
      <div
        ref={ref}
        className={cn("flex flex-col", className)}
        {...roving.rootProps}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          roving.onKeyDown(e)
        }}
        {...rest}
      />
    </AccordionContext.Provider>
  )
})
Accordion.displayName = "Accordion"

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled = false, className, ...props }, ref) => {
    const ctx = useRequired(useContext(AccordionContext), "AccordionItem", "Accordion")
    const baseId = useId()
    const open = ctx.isOpen(value)
    return (
      <ItemContext.Provider
        value={{ value, open, disabled, triggerId: `${baseId}-trigger`, contentId: `${baseId}-content` }}
      >
        <div
          ref={ref}
          data-state={open ? "open" : "closed"}
          className={cn("border-b border-glob-border", className)}
          {...props}
        />
      </ItemContext.Provider>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6"

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Heading that wraps the button. Defaults to h3. */
  headingLevel?: HeadingTag
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ headingLevel: Heading = "h3", className, children, onClick, ...props }, ref) => {
    const ctx = useRequired(useContext(AccordionContext), "AccordionTrigger", "Accordion")
    const item = useRequired(useContext(ItemContext), "AccordionTrigger", "AccordionItem")
    return (
      <Heading className="flex">
        <button
          ref={ref}
          type="button"
          id={item.triggerId}
          aria-expanded={item.open}
          aria-controls={item.contentId}
          disabled={item.disabled}
          data-accordion-trigger=""
          data-state={item.open ? "open" : "closed"}
          className={cn(
            "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium text-glob-text transition-colors hover:text-glob-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          onClick={(e) => {
            onClick?.(e)
            if (!e.defaultPrevented) ctx.toggle(item.value)
          }}
          {...props}
        >
          {children}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4 shrink-0 text-glob-muted transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </Heading>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const item = useRequired(useContext(ItemContext), "AccordionContent", "AccordionItem")
    return (
      <div
        ref={ref}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        data-state={item.open ? "open" : "closed"}
        // Closed content stays mounted for the animation; inert keeps it out of focus and the a11y tree.
        inert={!item.open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          item.open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        {...props}
      >
        <div className="overflow-hidden">
          <div className={cn("pb-4 text-sm text-glob-text-secondary", className)}>{children}</div>
        </div>
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
