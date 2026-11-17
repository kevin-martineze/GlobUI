// Class strings of the layout and dialog parts, shared by every framework adapter (React, Svelte, Vue, Angular).
// Each adapter applies these exact strings, so the rendered class attribute is the same in every framework.
// Conditional classes (for example "pt-4 md:pt-6" only without a header) stay in the adapter.

// AppShellLayout
export const APP_SHELL_CLASSES =
  "flex h-screen supports-[height:100dvh]:h-dvh min-h-0 flex-col overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-glob-text"
export const APP_SHELL_HEADER_CLASSES =
  "flex shrink-0 items-center gap-2 border-b border-glob-border bg-glob-surface px-4 pt-[env(safe-area-inset-top)] md:px-6"
export const APP_SHELL_SIDEBAR_LIST_CLASSES = "flex min-h-0 flex-1 flex-col gap-1 p-3"
export const APP_SHELL_MAIN_CLASSES = "min-w-0 flex-1 focus:outline-none"

// StackedLayout
export const STACKED_CLASSES =
  "flex min-h-screen flex-col pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] text-glob-text"
export const STACKED_HEADER_CLASSES =
  "sticky top-0 z-40 flex items-center gap-2 border-b border-glob-border bg-glob-surface px-4 pt-[env(safe-area-inset-top)] md:px-6"
export const STACKED_MAIN_CLASSES = "flex-1 focus:outline-none"
export const STACKED_FOOTER_CLASSES = "border-t border-glob-border p-4 md:px-6"

// Layout primitives
export const SKIP_LINK_CLASSES =
  "sr-only z-50 rounded-glob-md bg-glob-surface px-3 py-2 text-sm font-medium text-glob-text shadow-glob-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const LAYOUT_NAV_TRIGGER_CLASSES =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-glob-md text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring lg:hidden"
export const LAYOUT_MOBILE_NAV_LIST_CLASSES = "flex flex-col gap-1"

// PageLayout and PageHeader
export const PAGE_LAYOUT_CLASSES =
  "mx-auto flex w-full min-w-0 flex-col gap-6 px-4 pb-6 md:px-6 md:pb-8 lg:flex-row lg:items-start lg:gap-8"
export const PAGE_LAYOUT_PADDED_CLASSES = "pt-4 md:pt-6"
export const PAGE_HEADER_CONTENT_CLASSES = "sticky top-0 z-10 bg-glob-surface pb-3 pt-4 md:pt-6"
export const PAGE_ASIDE_HEADER_OFFSET_CLASSES = "lg:mt-6"
export const PAGE_HEADER_CLASSES = "flex min-w-0 flex-col gap-2"
export const PAGE_HEADER_ROW_CLASSES = "flex flex-wrap items-start justify-between gap-4"
export const PAGE_HEADER_TITLE_BLOCK_CLASSES = "flex min-w-0 flex-col gap-1"
export const PAGE_HEADER_TITLE_CLASSES = "break-words text-2xl font-semibold tracking-tight text-glob-text"
export const PAGE_HEADER_SECONDARY_TEXT_CLASSES = "text-sm text-glob-text-secondary"
export const PAGE_HEADER_ACTIONS_CLASSES = "flex flex-wrap items-center gap-2"

// Dialog and Sheet
export const DIALOG_CLOSE_ICON_CLASSES =
  "absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-glob-sm text-glob-text-secondary transition-colors hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const DIALOG_BODY_CLASSES = "relative flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-6"
export const DIALOG_HEADER_CLASSES = "flex flex-col gap-1.5 pr-8"
export const DIALOG_TITLE_CLASSES = "text-lg font-semibold leading-none tracking-tight"
export const DIALOG_DESCRIPTION_CLASSES = "text-sm text-glob-text-secondary"
export const DIALOG_FOOTER_CLASSES = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
export const SHEET_BODY_CLASSES = "relative flex h-full flex-col gap-4 overflow-y-auto p-6"
export const SHEET_FOOTER_CLASSES = "mt-auto"
