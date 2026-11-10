"use client"

import type { ReactNode } from "react"
import { AppShellLayout } from "@glob-ui/app-shell-layout"
import { LayoutNavTrigger } from "@glob-ui/layout"
import { PageLayout, PageHeader } from "@glob-ui/page-layout"
import { buttonVariants } from "@glob-ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@glob-ui/dropdown-menu"

// Client: the user menu passes handlers (onSelect), which a Server Component cannot pass to a client component.
// Edit: this is yours. The brand, the navigation and the user menu are fixed for every page of the dashboard.
const BRAND = { name: "Acme", href: "/" }
const NAV_ITEMS = [
  { label: "Overview", href: "/" },
  { label: "Orders", href: "/orders" },
  { label: "Customers", href: "/customers" },
  { label: "Settings", href: "/settings" },
]
const USER = { name: "Ada Lovelace", email: "ada@acme.test", initials: "AL" }

export interface DashboardTemplateProps {
  /** The page title (an h1). */
  title: ReactNode
  description?: ReactNode
  breadcrumbs?: ReactNode
  /** Buttons for the page, next to the title. */
  actions?: ReactNode
  /** The href of the current page. Its link gets `aria-current="page"`. */
  activeHref?: string
  children?: ReactNode
}

/** A dashboard: the app shell with a fixed brand, navigation and user menu, and a page header for each page. */
export function DashboardTemplate({ title, description, breadcrumbs, actions, activeHref, children }: DashboardTemplateProps) {
  return (
    <AppShellLayout
      sidebarLabel="Main navigation"
      header={
        <>
          <LayoutNavTrigger />
          <div data-template-part="fixed" className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <a href={BRAND.href} className="truncate font-semibold text-glob-text no-underline">
              {BRAND.name}
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "sm" })}>
                {USER.initials}
                <span className="sr-only">Account of {USER.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{USER.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => undefined}>Profile</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => undefined}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      }
      sidebar={
        <div data-template-part="fixed" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.href === activeHref ? "page" : undefined}
              className="rounded-glob-md px-3 py-2 text-sm text-glob-text no-underline hover:bg-glob-surface-hover aria-[current=page]:bg-glob-surface-hover aria-[current=page]:font-medium"
            >
              {item.label}
            </a>
          ))}
        </div>
      }
    >
      <PageLayout
        header={
          <div data-template-part="prop">
            <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} actions={actions} />
          </div>
        }
      >
        <div data-template-part="prop" className="flex min-w-0 flex-col gap-6">
          {children}
        </div>
      </PageLayout>
    </AppShellLayout>
  )
}
