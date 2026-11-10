import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"

type Density = "compact" | "default" | "comfortable"

// Padding is set on the table with descendant selectors, so the cells need no context: this module stays server-safe.
const densityClasses: Record<Density, string> = {
  compact: "[&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1",
  default: "[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2",
  comfortable: "[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3",
}

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Cell padding. Default "default". */
  density?: Density
  /** Alternating row background. */
  striped?: boolean
  /**
   * Keeps the header row in view while the body scrolls. The scroll container is the table's own wrapper, so give
   * the wrapper a height (for example `containerClassName="max-h-96"`).
   */
  stickyHeader?: boolean
  /**
   * Makes the wrapper a named, focusable scroll region. Use it when the table can be wider than the screen, so keyboard
   * users can scroll it with the arrow keys. Without it, the wrapper is not focusable.
   */
  scrollLabel?: string
  /** Classes for the wrapper div (the element that scrolls). */
  containerClassName?: string
}

/** A styled table. The table owns its horizontal scroll: the page itself never scrolls sideways. */
const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, density = "default", striped = false, stickyHeader = false, scrollLabel, ...props }, ref) => {
    const focusable = scrollLabel !== undefined
    return (
      <div
          role={focusable ? "region" : undefined}
          aria-label={scrollLabel}
          tabIndex={focusable ? 0 : undefined}
          className={cn(
            "relative w-full overflow-x-auto rounded-glob-md border border-glob-border",
            focusable && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring",
            containerClassName
          )}
        >
          <table
            ref={ref}
            className={cn(
              "w-full caption-bottom border-collapse text-sm text-glob-text",
              densityClasses[density],
              striped && "[&_tbody>tr:nth-child(even)]:bg-glob-surface-secondary",
              // Sticky header: the wrapper is the scroll container, so the header sticks inside it.
              stickyHeader && "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-glob-surface",
              className
            )}
            {...props}
          />
        </div>
    )
  }
)
Table.displayName = "Table"

const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("border-b border-glob-border", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("border-t border-glob-border bg-glob-surface-secondary font-medium", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>

/** A row. `data-state="selected"` shades it; hovering shades any row. */
const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-glob-border transition-colors hover:bg-glob-surface-hover data-[state=selected]:bg-glob-primary-light",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Text alignment. Numbers read best right-aligned. */
  align?: "left" | "center" | "right"
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, align = "left", ...props }, ref) => (
  <th
    ref={ref}
    className={cn("px-3 py-2 font-medium text-glob-text-secondary [&:has([role=checkbox])]:pr-0", alignClass[align], className)}
    {...props}
  />
))
TableHead.displayName = "TableHead"

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right"
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(({ className, align = "left", ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-3 py-2 align-middle [&:has([role=checkbox])]:pr-0", alignClass[align], className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-glob-text-secondary", className)} {...props} />
))
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption }
