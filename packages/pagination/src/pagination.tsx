import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"
import { Slot } from "@glob-ui/slot"
import {
  PAGINATION_CLASSES,
  PAGINATION_CONTENT_CLASSES,
  PAGINATION_ELLIPSIS_CLASSES,
  PAGINATION_ICON_CLASSES,
  PAGINATION_ITEM_CLASSES,
  PAGINATION_LINK_ACTIVE_CLASSES,
  PAGINATION_LINK_CLASSES,
  PAGINATION_NEXT_CLASSES,
  PAGINATION_PREVIOUS_CLASSES,
} from "@glob-ui/recipes"

/** The page navigation landmark. */
const Pagination = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <nav ref={ref} aria-label="Pagination" className={cn(PAGINATION_CLASSES, className)} {...props} />
))
Pagination.displayName = "Pagination"

const PaginationContent = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn(PAGINATION_CONTENT_CLASSES, className)} {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn(PAGINATION_ITEM_CLASSES, className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The current page: sets `aria-current="page"` and a bordered look. */
  isActive?: boolean
  /** Render the child (for example a router link) with these styles and props. */
  asChild?: boolean
}

/** A page link. Use `asChild` for router links, so the router renders the anchor. */
const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a"
    return (
      <Comp
        ref={ref}
        aria-current={isActive ? "page" : undefined}
        className={cn(PAGINATION_LINK_CLASSES, isActive && PAGINATION_LINK_ACTIVE_CLASSES, className)}
        {...props}
      />
    )
  }
)
PaginationLink.displayName = "PaginationLink"

// Forwards `asChild` to PaginationLink through a spread, not a JSX attribute: the shadcn copy transform rewrites
// `asChild` attributes in JSX to `render`, which the copied components do not accept.
const asChildProp = (asChild: boolean) => ({ asChild })

export type PaginationPreviousProps = PaginationLinkProps & { disabled?: boolean }

/**
 * The previous-page link. When `disabled`, it has `aria-disabled` and no `href`, so it cannot be followed, and it keeps
 * the link role. With `asChild`, the child supplies the content (for example a button with its own text).
 */
const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ disabled = false, href, className, asChild = false, children, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to previous page"
      aria-disabled={disabled || undefined}
      href={disabled ? undefined : href}
      role={asChild ? undefined : disabled ? "link" : undefined}
      tabIndex={disabled ? -1 : undefined}
      {...asChildProp(asChild)}
      className={cn(PAGINATION_PREVIOUS_CLASSES, className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={PAGINATION_ICON_CLASSES}>
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {children ?? <span>Previous</span>}
        </>
      )}
    </PaginationLink>
  )
)
PaginationPrevious.displayName = "PaginationPrevious"

/** The next-page link. See PaginationPrevious for `disabled` and `asChild`. */
const PaginationNext = forwardRef<HTMLAnchorElement, PaginationPreviousProps>(
  ({ disabled = false, href, className, asChild = false, children, ...props }, ref) => (
    <PaginationLink
      ref={ref}
      aria-label="Go to next page"
      aria-disabled={disabled || undefined}
      href={disabled ? undefined : href}
      role={asChild ? undefined : disabled ? "link" : undefined}
      tabIndex={disabled ? -1 : undefined}
      {...asChildProp(asChild)}
      className={cn(PAGINATION_NEXT_CLASSES, className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {children ?? <span>Next</span>}
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={PAGINATION_ICON_CLASSES}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </>
      )}
    </PaginationLink>
  )
)
PaginationNext.displayName = "PaginationNext"

export type PaginationEllipsisProps = React.HTMLAttributes<HTMLSpanElement>

/** Stands for hidden pages. Its dots are decorative; a screen reader hears "More pages". */
const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn(PAGINATION_ELLIPSIS_CLASSES, className)} {...props}>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className={PAGINATION_ICON_CLASSES}>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
    <span className="sr-only">More pages</span>
  </span>
))
PaginationEllipsis.displayName = "PaginationEllipsis"

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis }
