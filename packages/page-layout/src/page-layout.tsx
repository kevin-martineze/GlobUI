import { forwardRef } from "react"
import { cva } from "class-variance-authority"
import { cn } from "@glob-ui/utils"

// Server-safe: no hooks and no client code. It lives inside a scroll region (an app shell's main, or a stacked layout).

const contentVariants = cva("flex min-w-0 flex-1 flex-col gap-6", {
  variants: {
    width: {
      default: "max-w-5xl",
      wide: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "default" },
})

const asideVariants = cva("flex min-w-0 shrink-0 flex-col gap-4 lg:sticky lg:top-0 lg:self-start", {
  variants: {
    asideWidth: {
      sm: "lg:w-64",
      md: "lg:w-80",
    },
  },
  defaultVariants: { asideWidth: "sm" },
})

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
 * A page inside a layout. It is not a scroll owner: it sets no height and no overflow. The header
 * is sticky, and the aside is sticky from `lg`.
 */
export const PageLayout = forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ header, children, aside, asideWidth, width, className, ...props }, ref) => (
    <div
      ref={ref}
      data-layout="page"
      className={cn("mx-auto flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8", className)}
      {...props}
    >
      <div data-slot="content" data-scroll="scroll" className={contentVariants({ width })}>
        {header ? (
          <div data-slot="header" data-scroll="fixed" className="sticky top-0 z-10 -mx-4 bg-glob-surface px-4 py-3 md:-mx-6 md:px-6">
            {header}
          </div>
        ) : null}
        {children}
      </div>
      {aside ? (
        <aside data-slot="aside" data-scroll="fixed" className={asideVariants({ asideWidth })}>
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
    <div ref={ref} data-slot="page-header" className={cn("flex min-w-0 flex-col gap-2", className)} {...props}>
      {breadcrumbs ? <div className="text-sm text-glob-text-secondary">{breadcrumbs}</div> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="break-words text-2xl font-semibold tracking-tight text-glob-text">{title}</h1>
          {description ? <p className="text-sm text-glob-text-secondary">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  )
)
PageHeader.displayName = "PageHeader"
