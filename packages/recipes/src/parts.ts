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

// Phase 10d-2: overlays.

// Floating panels (Popover, DropdownMenu, Select, Combobox, MultiSelect): fade with the popover's open state.
export const FLOATING_TRANSITION_CLASSES =
  "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-150 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"

// Popover. The m-0 resets the UA popover box (inset:0 + margin:auto would center it).
export const POPOVER_CONTENT_CLASSES =
  "m-0 overflow-auto rounded-glob-md border border-glob-border bg-glob-surface p-4 text-sm text-glob-text shadow-glob-md outline-none"

// Tooltip
export const TOOLTIP_CLASSES = "m-0 overflow-visible rounded-glob-sm border-0 bg-glob-text px-2 py-1 text-xs text-glob-surface shadow-glob-md"
export const TOOLTIP_TRANSITION_CLASSES =
  "opacity-0 transition-[opacity,overlay,display] transition-discrete duration-100 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none"
export const TOOLTIP_ARROW_CLASSES = "absolute h-2 w-2 rotate-45 bg-glob-text"

// DropdownMenu
export const MENU_CONTENT_CLASSES =
  "m-0 min-w-[8rem] overflow-auto rounded-glob-md border border-glob-border bg-glob-surface p-1 text-sm text-glob-text shadow-glob-md outline-none"
export const MENU_ITEM_INDICATOR_CLASSES = "absolute left-2 flex h-4 w-4 items-center justify-center"
export const MENU_CHECK_ICON_CLASSES = "h-3.5 w-3.5"
export const MENU_RADIO_DOT_CLASSES = "h-2 w-2 rounded-full bg-current"
export const MENU_LABEL_CLASSES = "px-2 py-1.5 text-xs font-medium text-glob-text-secondary"
export const MENU_LABEL_INSET_CLASSES = "pl-8"
export const MENU_SEPARATOR_CLASSES = "-mx-1 my-1 h-px bg-glob-border"
export const MENU_SHORTCUT_CLASSES = "ml-auto pl-4 text-xs tracking-widest text-glob-text-secondary"

// AlertDialog
export const ALERT_DIALOG_BODY_CLASSES = "relative flex max-h-[calc(100dvh-2rem)] flex-col gap-4 overflow-y-auto p-6"

// Toast. The container ignores the pointer; the list and its toasts do not.
export const TOASTER_CLASSES =
  "pointer-events-none fixed inset-auto m-0 w-full max-w-sm overflow-visible border-0 bg-transparent p-4"
export const TOASTER_TRANSITION_CLASSES = "transition-[display,overlay] transition-discrete duration-200"
export const TOASTER_POSITION_CLASSES = {
  "top-left": "top-0 left-0",
  "top-center": "top-0 left-1/2 -translate-x-1/2",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-0 right-0",
} as const
export const TOAST_LIST_CLASSES = "pointer-events-auto flex flex-col gap-2"
export const TOAST_CLASSES = "items-start pr-10 shadow-glob-md"
export const TOAST_TRANSITION_CLASSES = "transition-[opacity,translate] transition-discrete duration-200 ease-out"
export const TOAST_ENTER_FROM = { top: "starting:-translate-y-2", bottom: "starting:translate-y-2" } as const
export const TOAST_FADE_CLASSES = "starting:opacity-0 data-leaving:opacity-0 motion-reduce:transition-none"
export const TOAST_BODY_CLASSES = "flex min-w-0 flex-1 flex-col gap-1"
export const TOAST_TITLE_CLASSES = "font-medium leading-5"
export const TOAST_DESCRIPTION_CLASSES = "leading-5 text-glob-text-secondary"
export const TOAST_ACTION_CLASSES =
  "mt-1 self-start rounded-glob-sm border border-glob-border bg-glob-surface px-2 py-1 text-xs font-medium text-glob-text hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const TOAST_CLOSE_CLASSES =
  "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-glob-sm text-glob-text-secondary hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const TOAST_CLOSE_ICON_CLASSES = "h-3.5 w-3.5"

// Listboxes (Select, Combobox, MultiSelect)
export const LISTBOX_PANEL_CLASSES =
  "m-0 overflow-visible rounded-glob-md border border-glob-border bg-glob-surface text-sm text-glob-text shadow-glob-md outline-none"
export const LISTBOX_SEARCH_WRAPPER_CLASSES = "border-b border-glob-border p-2"
export const LISTBOX_SEARCH_INPUT_CLASSES =
  "w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-text-secondary outline-none focus:ring-1 focus:ring-glob-ring"
export const LISTBOX_CLASSES = "relative max-h-60 overflow-y-auto p-1"
export const LISTBOX_EMPTY_CLASSES = "px-3 py-4 text-center text-sm text-glob-text-secondary"
export const LISTBOX_OPTION_CLASSES = "flex w-full items-center gap-2 rounded-glob-sm px-2 py-2 text-left text-sm select-none"
export const LISTBOX_OPTION_ENABLED_CLASSES = "cursor-pointer"
export const LISTBOX_OPTION_DISABLED_CLASSES = "cursor-not-allowed opacity-50"
export const LISTBOX_OPTION_ACTIVE_CLASSES = "bg-glob-surface-hover"
export const LISTBOX_OPTION_SELECTED_CLASSES = "font-medium"
export const LISTBOX_CHEVRON_CLASSES = "h-4 w-4 shrink-0 text-glob-text-secondary transition-transform"
export const LISTBOX_CHEVRON_OPEN_CLASSES = "rotate-180"

// Select
export const SELECT_PLACEHOLDER_CLASSES = "text-glob-text-secondary"
export const SELECT_VALUE_CLASSES = "truncate"
export const SELECT_RADIO_CLASSES = "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors"
export const SELECT_RADIO_CHECKED_CLASSES = "border-glob-primary bg-glob-primary"
export const SELECT_RADIO_UNCHECKED_CLASSES = "border-glob-border"
export const SELECT_RADIO_DOT_CLASSES = "h-1.5 w-1.5 rounded-full bg-glob-primary-foreground"

// Combobox
export const COMBOBOX_INPUT_CLASSES = "pr-16"
export const COMBOBOX_CLEAR_CLASSES =
  "absolute right-8 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-glob-sm text-glob-text-secondary hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const COMBOBOX_TOGGLE_CLASSES =
  "absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-glob-text-secondary disabled:opacity-50"
export const COMBOBOX_TOGGLE_ICON_CLASSES = "h-4 w-4 transition-transform"
export const COMBOBOX_LISTBOX_CLASSES = "max-h-60 overflow-y-auto p-1"
export const COMBOBOX_OPTION_CLASSES =
  "flex w-full cursor-pointer items-center gap-2 rounded-glob-sm px-2 py-2 text-left text-sm select-none"
export const COMBOBOX_MARK_CLASSES = "bg-transparent font-semibold text-glob-text"
export const COMBOBOX_DESCRIPTION_CLASSES = "block truncate text-xs text-glob-text-secondary"
export const COMBOBOX_STATUS_CLASSES = "empty:hidden"
export const COMBOBOX_LOADING_CLASSES = "flex items-center gap-2 px-3 py-3 text-sm text-glob-text-secondary"
export const COMBOBOX_EMPTY_CLASSES = "px-3 py-3 text-sm text-glob-text-secondary"

// MultiSelect
export const MULTI_SELECT_TRIGGER_CLASSES =
  "flex w-full flex-wrap items-center gap-1.5 rounded-glob-md border border-glob-border bg-glob-surface px-3 py-1.5 text-sm transition-colors focus-within:ring-2 focus-within:ring-glob-ring has-[[aria-invalid=true]]:border-glob-danger has-[[aria-invalid=true]]:focus-within:ring-glob-danger"
export const MULTI_SELECT_TRIGGER_SIZE = { sm: "min-h-8 text-xs", md: "min-h-10 text-sm", lg: "min-h-12 text-base" } as const
export const MULTI_SELECT_CHIP_CLASSES = "inline-flex items-center gap-1 rounded-glob-sm bg-glob-primary-light px-2 text-glob-primary-text"
export const MULTI_SELECT_CHIP_SIZE = { sm: "h-6 text-xs", md: "h-7 text-sm", lg: "h-8 text-sm" } as const
export const MULTI_SELECT_CHIP_REMOVE_CLASSES =
  "inline-flex rounded-glob-sm hover:text-glob-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed"
export const MULTI_SELECT_COMBO_CLASSES = "flex min-h-6 min-w-16 flex-1 cursor-pointer items-center justify-between gap-2 outline-none"
export const MULTI_SELECT_CHEVRON_CLASSES = "ml-auto h-4 w-4 shrink-0 text-glob-text-secondary transition-transform"
export const MULTI_SELECT_CHECK_CLASSES = "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors"
export const MULTI_SELECT_CHECK_CHECKED_CLASSES = "border-glob-primary bg-glob-primary text-glob-primary-foreground"

// Command
export const COMMAND_CLASSES = "flex min-h-0 flex-col overflow-hidden text-glob-text"
export const COMMAND_INPUT_WRAPPER_CLASSES = "flex items-center gap-2 border-b border-glob-border px-3"
export const COMMAND_SEARCH_ICON_CLASSES = "h-4 w-4 shrink-0 text-glob-text-secondary"
export const COMMAND_INPUT_CLASSES =
  "h-11 w-full min-w-0 bg-transparent text-sm text-glob-text placeholder:text-glob-text-secondary outline-none"
export const COMMAND_LIST_CLASSES = "max-h-80 overflow-y-auto overscroll-contain p-1"
export const COMMAND_EMPTY_CLASSES = "px-3 py-6 text-center text-sm text-glob-text-secondary"
export const COMMAND_GROUP_CLASSES = "py-1"
export const COMMAND_GROUP_HEADING_CLASSES = "px-2 py-1.5 text-xs font-medium text-glob-text-secondary"
export const COMMAND_ITEM_CLASSES = "flex cursor-pointer select-none items-center gap-2 rounded-glob-sm px-2 py-2 text-sm text-glob-text"
export const COMMAND_SEPARATOR_CLASSES = "my-1 h-px bg-glob-border"
export const COMMAND_SHORTCUT_CLASSES = "ml-auto text-xs tracking-widest text-glob-text-secondary"
// open:flex, not flex: a closed dialog must keep the browser default (display: none), or it renders as a stray line.
export const COMMAND_DIALOG_CLASSES =
  "m-auto open:flex max-h-[min(70dvh,32rem)] w-[calc(100%-2rem)] max-w-lg flex-col overflow-hidden rounded-glob-lg border border-glob-border bg-glob-surface p-0 text-glob-text shadow-glob-md backdrop:bg-glob-overlay"

// Tabs. The list and trigger variants are in tabs.ts.
export const TABS_CLASSES = "flex gap-4"
/** A horizontal list sits above the panels; a vertical one beside them. */
export const TABS_ORIENTATION_CLASSES = { horizontal: "flex-col", vertical: "flex-row" } as const
export const TABS_CONTENT_CLASSES =
  "text-sm text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring rounded-glob-sm"

// Accordion
export const ACCORDION_CLASSES = "flex flex-col"
export const ACCORDION_ITEM_CLASSES = "border-b border-glob-border"
export const ACCORDION_HEADING_CLASSES = "flex"
export const ACCORDION_TRIGGER_CLASSES =
  "group flex flex-1 items-center justify-between gap-4 py-4 text-left text-sm font-medium text-glob-text transition-colors hover:text-glob-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50"
export const ACCORDION_CHEVRON_CLASSES =
  "h-4 w-4 shrink-0 text-glob-text-secondary transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
/** The content animates its height through grid rows: 0fr closed, 1fr open. */
export const ACCORDION_CONTENT_CLASSES = "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
export const ACCORDION_CONTENT_OPEN_CLASSES = "grid-rows-[1fr]"
export const ACCORDION_CONTENT_CLOSED_CLASSES = "grid-rows-[0fr]"
export const ACCORDION_CONTENT_CLIP_CLASSES = "overflow-hidden"
export const ACCORDION_CONTENT_BODY_CLASSES = "pb-4 text-sm text-glob-text-secondary"

// Pagination
export const PAGINATION_CLASSES = "mx-auto flex w-full justify-center"
export const PAGINATION_CONTENT_CLASSES = "flex flex-row flex-wrap items-center gap-1"
export const PAGINATION_ITEM_CLASSES = "list-none"
export const PAGINATION_LINK_CLASSES =
  "inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-glob-md px-3 text-sm text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring aria-disabled:pointer-events-none aria-disabled:opacity-50"
export const PAGINATION_LINK_ACTIVE_CLASSES = "border border-glob-border bg-glob-surface font-medium"
export const PAGINATION_PREVIOUS_CLASSES = "gap-1 pl-2.5"
export const PAGINATION_NEXT_CLASSES = "gap-1 pr-2.5"
export const PAGINATION_ICON_CLASSES = "h-4 w-4"
export const PAGINATION_ELLIPSIS_CLASSES = "flex h-9 w-9 items-center justify-center text-glob-text-secondary"

// Table. Padding is set on the table with descendant selectors, so the cells need no context.
export const TABLE_CONTAINER_CLASSES = "relative w-full overflow-x-auto rounded-glob-md border border-glob-border"
export const TABLE_CONTAINER_FOCUSABLE_CLASSES = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const TABLE_CLASSES = "w-full caption-bottom border-collapse text-sm text-glob-text"
export const TABLE_DENSITY_CLASSES = {
  compact: "[&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1",
  default: "[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-2",
  comfortable: "[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3",
} as const
export const TABLE_STRIPED_CLASSES = "[&_tbody>tr:nth-child(even)]:bg-glob-surface-secondary"
/** The wrapper is the scroll container, so the header sticks inside it. */
export const TABLE_STICKY_HEADER_CLASSES = "[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10 [&_thead]:bg-glob-surface"
export const TABLE_HEADER_CLASSES = "border-b border-glob-border"
export const TABLE_BODY_CLASSES = "[&_tr:last-child]:border-0"
export const TABLE_FOOTER_CLASSES = "border-t border-glob-border bg-glob-surface-secondary font-medium"
export const TABLE_ROW_CLASSES =
  "border-b border-glob-border transition-colors hover:bg-glob-surface-hover data-[state=selected]:bg-glob-primary-light"
export const TABLE_HEAD_CLASSES = "px-3 py-2 font-medium text-glob-text-secondary [&:has([role=checkbox])]:pr-0"
export const TABLE_CELL_CLASSES = "px-3 py-2 align-middle [&:has([role=checkbox])]:pr-0"
export const TABLE_ALIGN_CLASSES = { left: "text-left", center: "text-center", right: "text-right" } as const
export const TABLE_CAPTION_CLASSES = "mt-4 text-sm text-glob-text-secondary"

// DataTable
export const DATA_TABLE_CLASSES = "flex flex-col gap-3"
export const DATA_TABLE_TOOLBAR_CLASSES = "flex flex-wrap items-center justify-between gap-2"
export const DATA_TABLE_TOOLBAR_START_CLASSES = "flex min-w-0 flex-1 flex-wrap items-center gap-2"
export const DATA_TABLE_SEARCH_CLASSES = "w-full sm:w-64"
export const DATA_TABLE_SORT_BUTTON_CLASSES =
  "inline-flex items-center gap-1 rounded-glob-sm font-medium hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const DATA_TABLE_SORT_ICON_CLASSES = "h-3.5 w-3.5 shrink-0"
export const DATA_TABLE_SORT_ICON_IDLE_CLASSES = "opacity-40"
export const DATA_TABLE_SKELETON_CLASSES = "h-4 w-full"
export const DATA_TABLE_EMPTY_CLASSES = "py-8 text-center text-glob-text-secondary"
export const DATA_TABLE_ROW_CLICKABLE_CLASSES = "cursor-pointer"
export const DATA_TABLE_FOOTER_CLASSES = "flex flex-wrap items-center justify-between gap-3 text-sm text-glob-text-secondary"
export const DATA_TABLE_PAGINATION_CLASSES = "flex flex-wrap items-center gap-3"
export const DATA_TABLE_PAGE_SIZE_CLASSES = "flex items-center gap-2"
export const DATA_TABLE_PAGE_SIZE_LABEL_CLASSES = "whitespace-nowrap"
export const DATA_TABLE_PAGE_BUTTONS_CLASSES = "flex items-center gap-1"

// Calendar
export const CALENDAR_CLASSES = "flex flex-col gap-3 text-sm text-glob-text"
export const CALENDAR_NAV_CLASSES = "flex items-center justify-between"
export const CALENDAR_NAV_BUTTON_CLASSES =
  "inline-flex size-8 items-center justify-center rounded-glob-sm text-glob-text-secondary transition-colors hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:pointer-events-none disabled:opacity-40"
export const CALENDAR_NAV_ICON_CLASSES = "h-4 w-4"
export const CALENDAR_MONTHS_CLASSES = "flex gap-4"
/** Two months sit side by side from `sm` up, and stack on small screens. */
export const CALENDAR_MONTHS_LAYOUT_CLASSES = { 1: "flex-col", 2: "flex-col sm:flex-row" } as const
export const CALENDAR_MONTH_CLASSES = "flex flex-col gap-2"
export const CALENDAR_HEADING_CLASSES = "text-center text-sm font-semibold"
export const CALENDAR_GRID_CLASSES = "border-separate border-spacing-0.5"
export const CALENDAR_WEEKDAY_CLASSES = "size-9 p-0 text-center text-xs font-medium text-glob-text-secondary"
export const CALENDAR_EMPTY_CELL_CLASSES = "size-9 p-0"
export const CALENDAR_CELL_CLASSES = "p-0"
export const CALENDAR_DAY_CLASSES =
  "inline-flex size-9 items-center justify-center rounded-glob-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring motion-reduce:transition-none"
export const CALENDAR_DAY_SELECTED_CLASSES = "bg-glob-primary font-medium text-glob-primary-foreground hover:opacity-90"
export const CALENDAR_DAY_IN_RANGE_CLASSES = "bg-glob-primary-light text-glob-text"
export const CALENDAR_DAY_RANGE_MIDDLE_CLASSES = "rounded-none"
export const CALENDAR_DAY_DEFAULT_CLASSES = "text-glob-text hover:bg-glob-surface-hover"
export const CALENDAR_DAY_TODAY_CLASSES = "font-semibold ring-1 ring-inset ring-glob-border"
/** Muted, not faded: the text stays above 4.5:1. */
export const CALENDAR_DAY_OUTSIDE_CLASSES = "text-glob-text-secondary"
/** Disabled days are struck through. */
export const CALENDAR_DAY_DISABLED_CLASSES = "cursor-not-allowed text-glob-text-secondary line-through hover:bg-transparent"

export interface CalendarDayState {
  selected: boolean
  inRange: boolean
  rangeEdge: boolean
  today: boolean
  disabled: boolean
  outside: boolean
}

/** The classes of one day button, in order. Pass them to cn(), which resolves the conflicts. */
export function calendarDayClasses({ selected, inRange, rangeEdge, today, disabled, outside }: CalendarDayState) {
  return [
    CALENDAR_DAY_CLASSES,
    selected ? CALENDAR_DAY_SELECTED_CLASSES : inRange ? CALENDAR_DAY_IN_RANGE_CLASSES : CALENDAR_DAY_DEFAULT_CLASSES,
    !selected && inRange && !rangeEdge && CALENDAR_DAY_RANGE_MIDDLE_CLASSES,
    today && !selected && CALENDAR_DAY_TODAY_CLASSES,
    outside && CALENDAR_DAY_OUTSIDE_CLASSES,
    disabled && CALENDAR_DAY_DISABLED_CLASSES,
  ]
}

// DatePicker
export const DATE_PICKER_CLASSES = "relative w-full"
export const DATE_PICKER_TRIGGER_CLASSES =
  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-glob-md border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring disabled:cursor-not-allowed disabled:opacity-50 data-[invalid=true]:border-glob-danger"
export const DATE_PICKER_SIZE = { sm: "h-8 text-xs", md: "h-10 text-sm", lg: "h-12 text-base" } as const
export const DATE_PICKER_VARIANT = {
  default: "border-glob-border bg-glob-surface",
  ghost: "border-transparent bg-transparent hover:bg-glob-surface-hover",
  outline: "border-glob-border bg-transparent hover:bg-glob-surface-hover",
} as const
/** Room for the clear button, which sits beside the trigger (never inside it). */
export const DATE_PICKER_TRIGGER_CLEARABLE_CLASSES = "pr-16"
export const DATE_PICKER_VALUE_CLASSES = "truncate"
export const DATE_PICKER_PLACEHOLDER_CLASSES = "text-glob-text-secondary"
export const DATE_PICKER_ICON_CLASSES = "h-4 w-4 shrink-0 text-glob-text-secondary"
export const DATE_PICKER_CLEAR_CLASSES =
  "absolute right-9 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-glob-sm text-glob-text-secondary hover:bg-glob-surface-hover hover:text-glob-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"
export const DATE_PICKER_CLEAR_ICON_CLASSES = "h-3.5 w-3.5"
export const DATE_PICKER_CONTENT_CLASSES = "w-fit p-3"
export const DATE_PICKER_BODY_CLASSES = "flex flex-col gap-3 sm:flex-row"
export const DATE_PICKER_PRESETS_CLASSES = "flex flex-wrap gap-1 sm:w-36 sm:flex-col"
export const DATE_PICKER_PRESET_CLASSES =
  "rounded-glob-sm px-2 py-1.5 text-left text-sm text-glob-text transition-colors hover:bg-glob-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glob-ring"

// PhoneInput and its country list. The wrapper variants are in phone-input.ts.
export const PHONE_INPUT_DIVIDER_CLASSES = "h-5 w-px bg-glob-border"
export const PHONE_INPUT_FIELD_WRAPPER_CLASSES = "flex flex-1 items-center pl-2"
export const PHONE_INPUT_FIELD_CLASSES = "h-full flex-1 bg-transparent text-glob-text outline-none placeholder:text-glob-text-secondary"
export const PHONE_INPUT_TEXT_SIZE = { sm: "text-xs", md: "text-sm", lg: "text-base" } as const
export const COUNTRY_SELECT_CLASSES = "relative"
export const COUNTRY_TRIGGER_CLASSES =
  "flex cursor-pointer items-center gap-1 rounded-l-glob-md border border-r-0 border-glob-border bg-glob-surface px-2 text-glob-text transition-colors hover:bg-glob-surface-hover outline-none focus-visible:ring-2 focus-visible:ring-glob-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
export const COUNTRY_TRIGGER_SIZE = { sm: "h-8 text-xs", md: "h-10 text-sm", lg: "h-12 text-base" } as const
export const COUNTRY_FLAG_CLASSES = "text-base leading-none"
export const COUNTRY_TRIGGER_CODE_CLASSES = "text-glob-text-secondary"
export const COUNTRY_CHEVRON_CLASSES = "h-3 w-3 text-glob-text-secondary transition-transform"
export const COUNTRY_PANEL_CLASSES =
  "m-0 w-72 overflow-visible rounded-glob-md border border-glob-border bg-glob-surface text-sm text-glob-text shadow-glob-md outline-none"
export const COUNTRY_SEARCH_WRAPPER_CLASSES = "border-b border-glob-border p-2"
export const COUNTRY_SEARCH_INPUT_CLASSES =
  "w-full rounded-glob-sm border border-glob-border bg-glob-surface-secondary px-2 py-1.5 text-sm text-glob-text placeholder:text-glob-text-secondary outline-none focus:ring-1 focus:ring-glob-ring"
export const COUNTRY_LIST_CLASSES = "relative max-h-60 overflow-y-auto p-1"
export const COUNTRY_OPTION_CLASSES = "flex w-full cursor-pointer items-center gap-3 rounded-glob-sm px-2 py-2 text-left text-sm select-none"
export const COUNTRY_OPTION_ACTIVE_CLASSES = "bg-glob-surface-hover"
/** The selected row is marked by font weight; the fill colour as text fails contrast on white. */
export const COUNTRY_OPTION_SELECTED_CLASSES = "font-medium"
export const COUNTRY_NAME_CLASSES = "flex-1"
export const COUNTRY_DIAL_CLASSES = "text-glob-text"
export const COUNTRY_EMPTY_CLASSES = "px-3 py-4 text-center text-sm text-glob-text-secondary"
