"use client"

import { forwardRef, useId } from "react"
import { cn } from "@glob-ui/utils"
import { STACKED_CLASSES, STACKED_FOOTER_CLASSES, STACKED_HEADER_CLASSES, STACKED_MAIN_CLASSES } from "@glob-ui/recipes"
import { LayoutSlot, LayoutNavProvider, LayoutMobileNav, SkipLink } from "@glob-ui/layout"

export interface StackedLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The top navigation. It stays visible while the document scrolls. */
  header?: React.ReactNode
  /** The page. It is in document flow, so the document scrolls. It has no padding: put a `PageLayout` in it. */
  children?: React.ReactNode
  footer?: React.ReactNode
  /** The navigation for small screens. When set, `LayoutNavTrigger` in the header opens it in a Sheet. */
  mobileNav?: React.ReactNode
  /** The accessible name of the mobile navigation dialog. */
  navLabel?: string
}

/**
 * A document layout: the page scrolls as a document and the header stays visible. There is no
 * scroll region of its own, so `useLayoutScroll()` returns `document.scrollingElement`.
 */
export const StackedLayout = forwardRef<HTMLDivElement, StackedLayoutProps>(
  ({ header, children, footer, mobileNav, navLabel = "Navigation", className, ...props }, ref) => {
    const mainId = useId()
    return (
      <LayoutNavProvider>
        <div
          ref={ref}
          data-layout="stacked"
          data-scroll-mode="document"
          className={cn(STACKED_CLASSES, className)}
          {...props}
        >
          <SkipLink targetId={mainId} />
          {header ? (
            <LayoutSlot
              name="header"
              scroll="fixed"
              as="header"
              className={STACKED_HEADER_CLASSES}
            >
              {header}
            </LayoutSlot>
          ) : null}
          {/* The document is the scroller here, so main sets no overflow: it is a plain flow element. */}
          <main id={mainId} tabIndex={-1} data-slot="main" data-scroll="scroll" className={STACKED_MAIN_CLASSES}>
            {children}
          </main>
          {footer ? (
            <LayoutSlot name="footer" scroll="fixed" as="footer" className={STACKED_FOOTER_CLASSES}>
              {footer}
            </LayoutSlot>
          ) : null}
          {mobileNav ? <LayoutMobileNav label={navLabel}>{mobileNav}</LayoutMobileNav> : null}
        </div>
      </LayoutNavProvider>
    )
  }
)
StackedLayout.displayName = "StackedLayout"
