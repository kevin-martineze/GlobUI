"use client"

import { forwardRef, useId } from "react"
import { cn } from "@glob-ui/utils"
import { LayoutSlot, LayoutNavProvider, LayoutMobileNav, SkipLink } from "@glob-ui/layout"
import { sidebarVariants } from "@glob-ui/recipes"

export interface AppShellLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The fixed header across the top. Put `LayoutNavTrigger` here for small screens. */
  header?: React.ReactNode
  /** The fixed sidebar navigation. Below `lg` it moves into a Sheet, opened by `LayoutNavTrigger`. */
  sidebar?: React.ReactNode
  /** The main region. It is the one region that scrolls. It has no padding: put a `PageLayout` in it. */
  children?: React.ReactNode
  /** The accessible name of the navigation landmark. */
  sidebarLabel?: string
  sidebarSide?: "left" | "right"
  sidebarWidth?: "sm" | "md" | "lg"
}

/**
 * An app shell. The viewport never scrolls: the header and the sidebar stay in place, and only the
 * main region scrolls. Use it for dashboards and admin apps. The sidebar's own list scrolls if it is long.
 */
export const AppShellLayout = forwardRef<HTMLDivElement, AppShellLayoutProps>(
  (
    { header, sidebar, children, sidebarLabel = "Main navigation", sidebarSide = "left", sidebarWidth = "md", className, ...props },
    ref
  ) => {
    const mainId = useId()
    const sidebarNode = sidebar ? (
      <LayoutSlot
        name="sidebar"
        scroll="fixed"
        as="nav"
        aria-label={sidebarLabel}
        className={cn(sidebarVariants({ side: sidebarSide, width: sidebarWidth }), sidebarSide === "right" && "order-last")}
      >
        {/* The list region is the only scroller inside the sidebar, so a long menu never scrolls the page. */}
        <LayoutSlot name="sidebar-list" scroll="scroll" className="flex min-h-0 flex-1 flex-col gap-1 p-3">
          {sidebar}
        </LayoutSlot>
      </LayoutSlot>
    ) : null

    return (
      <LayoutNavProvider>
        <div
          ref={ref}
          data-layout="app-shell"
          data-scroll-mode="app"
          className={cn(
            // h-screen is the fallback; dvh follows the mobile browser toolbar where supported.
            "flex h-screen supports-[height:100dvh]:h-dvh min-h-0 flex-col overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-glob-text",
            className
          )}
          {...props}
        >
          <SkipLink targetId={mainId} />
          {header ? (
            <LayoutSlot
              name="header"
              scroll="fixed"
              as="header"
              className="flex shrink-0 items-center gap-2 border-b border-glob-border bg-glob-surface px-4 pt-[env(safe-area-inset-top)] md:px-6"
            >
              {header}
            </LayoutSlot>
          ) : null}
          <div className="flex min-h-0 flex-1">
            {sidebarNode}
            <LayoutSlot
              name="main"
              scroll="scroll"
              as="main"
              id={mainId}
              className={cn("min-w-0 flex-1 focus:outline-none", sidebarSide === "right" && "order-first")}
            >
              {children}
            </LayoutSlot>
          </div>
          {sidebar ? <LayoutMobileNav label={sidebarLabel}>{sidebar}</LayoutMobileNav> : null}
        </div>
      </LayoutNavProvider>
    )
  }
)
AppShellLayout.displayName = "AppShellLayout"
