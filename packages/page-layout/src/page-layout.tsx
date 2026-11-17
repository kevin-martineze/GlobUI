import { forwardRef } from "react"
import { cn } from "@glob-ui/utils"
import { PAGE_ASIDE_HEADER_OFFSET_CLASSES, PAGE_HEADER_ACTIONS_CLASSES, PAGE_HEADER_CLASSES, PAGE_HEADER_CONTENT_CLASSES, PAGE_HEADER_ROW_CLASSES, PAGE_HEADER_SECONDARY_TEXT_CLASSES, PAGE_HEADER_TITLE_BLOCK_CLASSES, PAGE_HEADER_TITLE_CLASSES, PAGE_LAYOUT_CLASSES, PAGE_LAYOUT_PADDED_CLASSES } from "@glob-ui/recipes"
import { contentVariants, asideVariants } from "@glob-ui/recipes"

// Server-safe: no hooks and no client code. It lives inside a scroll region (an app shell's main, or a stacked layout).
// It owns the page padding: the shells' main regions have none, so a page never adds a wrapper with spacing.

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The page header. It sticks to the top of the nearest scroll region while the content scrolls. */
  header?: React.ReactNode
  /** The page content. It moves with the scroll region. */
  children?: React.ReactNode
  /** A side column. Sticky from `lg`; below `lg` it stacks under the content. */
  aside?: React.ReactNode
  asideWidth?: "sm" | "md"
  /** The maximum width of the content column. */
  width?: "default" | "wide" | "full"
}

/**
 * A page inside a layout. It is not a scroll owner: it sets no height and no overflow. It owns the
 * page padding. The header is sticky, and the aside is sticky from `lg`.
 */
export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ header, children, aside, asideWidth, width, className, ...props }, ref) => (
    <div
      ref={ref}
      data-layout="page"
      className={cn(PAGE_LAYOUT_CLASSES, !header && PAGE_LAYOUT_PADDED_CLASSES, className)}
      {...props}
    >
      <div data-slot="content" data-scroll="scroll" className={contentVariants({ width })}>
        {header ? (
          <div data-slot="header" data-scroll="fixed" className={PAGE_HEADER_CONTENT_CLASSES}>
            {header}
          </div>
        ) : null}
        {children}
      </div>
      {aside ? (
        // With a header, the aside starts level with the header text (the header has top padding).
        <aside data-slot="aside" data-scroll="fixed" className={cn(asideVariants({ asideWidth }), header && PAGE_ASIDE_HEADER_OFFSET_CLASSES)}>
          {aside}
        </aside>
      ) : null}
    </div>
  )
)
PageLayout.displayName = "PageLayout"

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode
  description?: React.ReactNode
  /** A breadcrumb trail, or any navigation above the title. */
  breadcrumbs?: React.ReactNode
  /** Buttons for the page. They wrap onto a new line on narrow screens. */
  actions?: React.ReactNode
}

/** The title block of a page: breadcrumbs, the `h1`, a description, and actions. */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ title, description, breadcrumbs, actions, className, ...props }, ref) => (
    <div ref={ref} data-slot="page-header" className={cn(PAGE_HEADER_CLASSES, className)} {...props}>
      {breadcrumbs ? <div className={PAGE_HEADER_SECONDARY_TEXT_CLASSES}>{breadcrumbs}</div> : null}
      <div className={PAGE_HEADER_ROW_CLASSES}>
        <div className={PAGE_HEADER_TITLE_BLOCK_CLASSES}>
          <h1 className={PAGE_HEADER_TITLE_CLASSES}>{title}</h1>
          {description ? <p className={PAGE_HEADER_SECONDARY_TEXT_CLASSES}>{description}</p> : null}
        </div>
        {actions ? <div className={PAGE_HEADER_ACTIONS_CLASSES}>{actions}</div> : null}
      </div>
    </div>
  )
)
PageHeader.displayName = "PageHeader"
