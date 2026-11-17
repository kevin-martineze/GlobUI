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

// Forms and primitives (phase 10d-1). Text sizes shared by the labels of Field, Checkbox and RadioGroup.
export const CONTROL_TEXT_SIZE = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const

// Badge, Label
export const BADGE_DOT_CLASSES = "h-1.5 w-1.5 shrink-0 rounded-full bg-current"
export const LABEL_REQUIRED_CLASSES = "text-glob-primary-text"

// Field
export const FIELD_CLASSES = "flex flex-col gap-1.5"
export const FIELD_DESCRIPTION_CLASSES = "text-glob-text-secondary"
export const FIELD_ERROR_CLASSES = "text-glob-danger"

// Checkbox and RadioGroup: the control box, the row with its label, and the label.
export const CHOICE_CONTROL_CLASSES = "relative inline-flex shrink-0"
export const CHOICE_ROW_CLASSES = "inline-flex items-center gap-2"
export const CHOICE_LABEL_CLASSES = "cursor-pointer text-glob-text"
export const CHOICE_LABEL_DISABLED_CLASSES = "cursor-not-allowed opacity-50"
export const CHECKBOX_CHECK_ICON_CLASSES =
  "pointer-events-none absolute inset-0 m-auto hidden h-3/4 w-3/4 text-glob-primary-foreground peer-[:checked:not(:indeterminate)]:block"
export const CHECKBOX_DASH_ICON_CLASSES =
  "pointer-events-none absolute inset-0 m-auto hidden h-3/4 w-3/4 text-glob-primary-foreground peer-indeterminate:block"

// RadioGroup
export const RADIO_GROUP_CLASSES = "flex"
export const RADIO_GROUP_ORIENTATION_CLASSES = { horizontal: "flex-row flex-wrap gap-4", vertical: "flex-col gap-2" } as const
export const RADIO_INVALID_CLASSES = "border-glob-danger"
export const RADIO_DOT_CLASSES =
  "pointer-events-none absolute inset-0 m-auto hidden rounded-full bg-glob-primary-foreground peer-checked:block"
export const RADIO_DOT_SIZE = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" } as const

// Separator, Skeleton
export const SEPARATOR_CLASSES = "shrink-0 bg-glob-border"
export const SEPARATOR_ORIENTATION_CLASSES = { horizontal: "h-px w-full", vertical: "w-px self-stretch" } as const
export const SKELETON_CLASSES = "animate-pulse rounded-glob-md bg-glob-surface-hover motion-reduce:animate-none"

// Card
export const CARD_CLASSES = "rounded-glob-lg border border-glob-border bg-glob-surface text-glob-text shadow-glob-sm"
export const CARD_HEADER_CLASSES = "flex flex-col gap-1.5 p-6"
export const CARD_TITLE_CLASSES = "text-lg font-semibold leading-none tracking-tight"
export const CARD_DESCRIPTION_CLASSES = "text-sm text-glob-text-secondary"
export const CARD_CONTENT_CLASSES = "p-6 pt-0"
export const CARD_FOOTER_CLASSES = "flex items-center gap-2 p-6 pt-0"

// Alert
export const ALERT_ICON_CLASSES = "mt-0.5 flex shrink-0"
export const ALERT_ICON_TONE = {
  default: "text-glob-text-secondary",
  info: "text-glob-info",
  success: "text-glob-success",
  warning: "text-glob-warning",
  danger: "text-glob-danger",
} as const
export const ALERT_BODY_CLASSES = "flex min-w-0 flex-1 flex-col gap-1"
export const ALERT_TITLE_CLASSES = "font-medium leading-5"
export const ALERT_DESCRIPTION_CLASSES = "leading-5 text-glob-text-secondary"

// Avatar
export const AVATAR_IMAGE_CLASSES = "absolute inset-0 h-full w-full object-cover"
export const AVATAR_FALLBACK_CLASSES = "flex h-full w-full items-center justify-center"
export const AVATAR_GROUP_CLASSES = "flex items-center"
export const AVATAR_GROUP_OVERLAP = { sm: "-space-x-2", md: "-space-x-2", lg: "-space-x-3", xl: "-space-x-4" } as const
export const AVATAR_GROUP_RING_CLASSES = "ring-2 ring-glob-surface"

// Progress
export const PROGRESS_FILL_TONE = {
  primary: "bg-glob-primary",
  success: "bg-glob-success",
  warning: "bg-glob-warning",
  danger: "bg-glob-danger",
} as const
export const PROGRESS_INDETERMINATE_CLASSES =
  "h-full w-2/5 animate-glob-indeterminate rounded-glob-sm motion-reduce:w-full motion-reduce:animate-pulse"
export const PROGRESS_FILL_CLASSES =
  "h-full w-full rounded-glob-sm transition-transform duration-300 ease-out motion-reduce:transition-none"

// ToggleGroup
export const TOGGLE_GROUP_CLASSES = "inline-flex items-center gap-1"

// Segmented
export const SEGMENTED_CLASSES = "inline-flex rounded-glob-md border border-glob-border bg-glob-surface-secondary p-0.5"
export const SEGMENTED_DISABLED_CLASSES = "opacity-50 cursor-not-allowed"
export const SEGMENTED_ITEM_CLASSES =
  "rounded-glob-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50"
export const SEGMENTED_ITEM_SIZE = { sm: "h-8 text-xs px-3", md: "h-10 text-sm px-4", lg: "h-12 text-base px-5" } as const
export const SEGMENTED_ITEM_CHECKED_CLASSES = "bg-glob-primary text-glob-primary-foreground shadow-sm"
export const SEGMENTED_ITEM_UNCHECKED_CLASSES = "text-glob-text-secondary hover:text-glob-text"
