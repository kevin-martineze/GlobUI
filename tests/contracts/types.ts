// Contract tests: behaviour and accessibility written once, run through each framework's render adapter.
//
// A contract is `(render: XAdapter) => void`. It defines `describe`/`it` blocks that assert on the DOM only:
// roles, keyboard, focus, scroll behaviour and axe. It never imports a framework. Each adapter mounts the
// fixture for its component in its own framework and resolves once it is in the document.
//
// The adapter type is split per component, so a framework implements only what it ports. A contract asks
// for exactly the adapter it needs; the mobile navigation contract reuses the AppShell adapter.

export interface AppShellFixture {
  /** Adds enough rows to make the main region scroll. */
  tall: boolean
}

export interface DialogFixture {
  /** Accessible name of the Dialog title. */
  title: string
  /** Text of the button that opens the dialog. */
  triggerLabel: string
  /** Extra classes for DialogTitle (class / className). Unset in every other test. */
  titleClass?: string
  /** Extra classes for DialogContent, which go on the dialog element. */
  contentClass?: string
}

export interface SheetFixture {
  title: string
  triggerLabel: string
}

export interface AppShellAdapter {
  /** The framework name, used in test titles (for example "react"). */
  readonly name: string
  /** AppShellLayout with a header trigger, a sidebar of two links and a main region. */
  appShell(fixture: AppShellFixture): Promise<void>
}

export interface LayoutScrollAdapter {
  readonly name: string
  /** AppShellLayout with a probe in its main region. The probe's text is the tagName of useLayoutScroll(). */
  appShellProbe(): Promise<void>
  /** StackedLayout with a probe. The probe's text is the tagName of useLayoutScroll(). */
  stackedProbe(): Promise<void>
}

export interface DialogAdapter {
  readonly name: string
  /** Dialog with a trigger, a title, a description and a Cancel close button. Closed. */
  dialog(fixture: DialogFixture): Promise<void>
}

export interface SheetAdapter {
  readonly name: string
  /** Sheet (a right-side dialog) with a trigger, a title and a Close control. Closed. */
  sheet(fixture: SheetFixture): Promise<void>
}

export interface PageLayoutAdapter {
  readonly name: string
  /** PageLayout with a PageHeader (breadcrumbs, title, description, actions), content and an aside. */
  pageLayout(): Promise<void>
}

export interface StackedLayoutAdapter {
  readonly name: string
  /** StackedLayout with a header, a page of content, a footer and a mobile navigation. */
  stackedLayout(): Promise<void>
}

// Phase 10d-1: forms and primitives. One adapter for the whole batch; each method mounts one fixture.

export interface SegmentedFixtureOption {
  value: string
  label: string
  disabled?: boolean
}

export interface FormsAdapter {
  readonly name: string
  /** The class-parity gallery (see forms-parity.contract.ts). */
  formsGallery(): Promise<void>
  /** A Button with this text. */
  button(fixture: { label: string; loading?: boolean; disabled?: boolean; onClick?: () => void }): Promise<void>
  /** A Button rendered as a link: asChild in React, the `child` snippet in Svelte. */
  buttonLink(fixture: { label: string; href: string }): Promise<void>
  /** Field around an Input. */
  fieldWithInput(fixture: { label: string; description?: string; error?: string }): Promise<void>
  /** Field around a RadioGroup with Free (checked) and Pro. */
  fieldWithRadioGroup(fixture: { label: string }): Promise<void>
  /** Field around a Checkbox that has its own label. */
  fieldWithCheckbox(fixture: { label: string; checkboxLabel: string }): Promise<void>
  /** Field around a Slider. */
  fieldWithSlider(fixture: { label: string; description?: string }): Promise<void>
  checkbox(fixture: { label: string; indeterminate?: boolean }): Promise<void>
  /** A Switch named by aria-label. */
  switch(fixture: {
    label: string
    name?: string
    value?: string
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void>
  /** A RadioGroup named "Plan" with Free, Pro and Team. */
  radioGroup(fixture: { defaultValue?: string; name?: string; inForm?: boolean; onValueChange?: (value: string) => void }): Promise<void>
  /** A non-decorative Separator between two paragraphs. */
  separator(): Promise<void>
  /** An Avatar. `setSrc` re-renders it with a new src (same alt). */
  avatar(fixture: { src?: string; alt: string }): Promise<{ setSrc(src?: string): Promise<void> }>
  /** A Progress named by a visible label through aria-labelledby. */
  progress(fixture: { label: string; value: number | null }): Promise<void>
  slider(fixture: { label: string; defaultValue?: number; min?: number; max?: number; onValueChange?: (value: number) => void }): Promise<void>
  /** A Toggle named by aria-label, showing the label's first letter. */
  toggle(fixture: { label: string; onPressedChange?: (pressed: boolean) => void }): Promise<void>
  /** A ToggleGroup named by `label`. Items show their label and are named by it. */
  toggleGroup(fixture: {
    type: "single" | "multiple"
    label: string
    items: { value: string; label: string; disabled?: boolean }[]
    /** Wraps the group between a "Before" and an "After" button. */
    withOutsideButtons?: boolean
    onValueChange?: (value: string | string[]) => void
  }): Promise<void>
  /** A Segmented named "Range". */
  segmented(fixture: {
    options: SegmentedFixtureOption[]
    defaultValue?: string
    name?: string
    inForm?: boolean
    onChange?: (value: string) => void
  }): Promise<void>
}

// Phase 10d-2: overlays. One adapter for the whole batch; each method mounts one fixture.

export interface OverlayOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

export type ContractToastVariant = "default" | "success" | "warning" | "danger" | "info"

export interface ContractToastOptions {
  id?: string
  title?: string
  description?: string
  variant?: ContractToastVariant
  duration?: number
  action?: { label: string; onClick: (event: MouseEvent) => void }
}

/** The framework's `toast` function: same overloads and shortcuts in every framework. */
export interface ContractToast {
  (options: ContractToastOptions): string
  (title: string, options?: Omit<ContractToastOptions, "title">): string
  success(title: string): string
  info(title: string): string
  warning(title: string): string
  error(title: string): string
  dismiss(id?: string): void
}

export type ContractToasterPosition = "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"

export interface OverlaysAdapter {
  readonly name: string
  /** The class-parity gallery (see overlays-parity.contract.ts). */
  overlaysGallery(): Promise<void>
  /** The framework's toast function. Its store is module state, shared by every test. */
  readonly toast: ContractToast
  /**
   * A Popover: trigger "Filters" (a Button), content with an "Apply" button, then an "Outside text" paragraph.
   * With `autofocus`: open from the start, content "First" and "Chosen" (data-autofocus).
   */
  popover(fixture: { onOpenChange?: (open: boolean) => void; autofocus?: boolean }): Promise<void>
  /** A Tooltip with `content` over a Button labelled `label`, then an "Elsewhere" paragraph. */
  tooltip(fixture: { content: string; label: string }): Promise<void>
  /**
   * A DropdownMenu: trigger "Actions" (a Button); content with the label "My account", Profile (shortcut ⇧⌘P),
   * Billing, "Disabled item" (disabled), "Keep open" (prevents closing when `keepOpen`), a separator, the checkbox
   * item "Status bar", the radio group Light / Dark / System (System checked), a separator and Delete (danger).
   * An "After" button follows the menu.
   */
  dropdownMenu(fixture: {
    onSelect?: (label: string) => void
    onRadio?: (value: string) => void
    keepOpen?: boolean
    onCheckedChange?: (checked: boolean) => void
  }): Promise<void>
  /**
   * An AlertDialog: trigger "Delete account", title "Delete your account?", description "This cannot be undone.",
   * Cancel, and the danger action "Delete" with `onConfirm` as its click handler.
   */
  alertDialog(fixture: { onConfirm?: (event: MouseEvent) => void }): Promise<void>
  /** A Toaster. With `inDialog`: a Dialog "Settings" (trigger "Open dialog") whose "Save draft" button runs `onSave`. */
  toaster(fixture: { max?: number; position?: ContractToasterPosition; inDialog?: { onSave: () => void } }): Promise<void>
  /** A Select named "Fruit". */
  select(fixture: {
    options: OverlayOption[]
    defaultValue?: string
    onChange?: (value: string) => void
    name?: string
    inForm?: boolean
    /** A "Next" button after the select. */
    withNext?: boolean
  }): Promise<void>
  /** A Combobox inside a Field labelled "Framework", with a value the fixture keeps in sync with onChange. */
  combobox(fixture: {
    options: OverlayOption[]
    defaultValue?: string
    onChange?: (value: string | null) => void
    allowCustomValue?: boolean
    loading?: boolean
  }): Promise<void>
  /** A MultiSelect named "Tags". */
  multiSelect(fixture: {
    options: OverlayOption[]
    defaultValue?: string[]
    onChange?: (value: string[]) => void
    max?: number
    name?: string
    inForm?: boolean
    withNext?: boolean
  }): Promise<void>
  /**
   * A Command labelled "Command menu": input "Type a command", the empty text "Nothing found.", a group "Suggestions"
   * (Calendar with keywords events/schedule and shortcut ⌘C, Canción, Archive disabled), a separator and a group
   * "Settings" (Theme with keyword "dark mode", Profile).
   */
  command(fixture: { onSelect?: (value: string) => void; filter?: false }): Promise<void>
  /**
   * An "Open" button and a CommandDialog with the items "Open docs" and "Toggle theme".
   * With `withField`: an "Other field" text input before them.
   */
  commandDialog(fixture: {
    shortcut?: string | false
    closeOnSelect?: boolean
    onSelect?: (value: string) => void
    withField?: boolean
  }): Promise<void>
}

// Phase 10d-3: navigation (Tabs, Accordion, Pagination).

export interface NavigationAdapter {
  readonly name: string
  /** The class-parity gallery (see navigation-parity.contract.ts). */
  navigationGallery(): Promise<void>
  /**
   * Tabs with a list labelled "Settings": Account, Password (disabled), Billing and Team, and a panel for each enabled
   * tab ("Account panel", "Billing panel", "Team panel").
   */
  tabs(fixture: {
    value?: string
    defaultValue?: string
    orientation?: "horizontal" | "vertical"
    onValueChange?: (value: string) => void
  }): Promise<void>
  /**
   * An Accordion with the items Shipping ("Ships in 2 days."), Returns ("30 days.") and Disabled ("Hidden.", disabled),
   * with the values a, b and c.
   */
  accordion(fixture: {
    type: "single" | "multiple"
    collapsible?: boolean
    onValueChange?: (value: string | string[]) => void
  }): Promise<void>
  /** Pagination links: Previous (href "/a"), page 1 (href "/a", current), an ellipsis, and Next (href "/b"). */
  paginationLinks(): Promise<void>
  /** Pagination with a disabled Previous link whose href would be "/prev". */
  paginationDisabledPrevious(): Promise<void>
  /**
   * Pagination built from buttons (the `asChild` / `child` form) over `pageCount` pages, starting on page 1, with the
   * page numbers from getPageRange. Previous and Next are disabled at the ends.
   */
  paginationControlled(fixture: { pageCount: number; onPage?: (page: number) => void }): Promise<void>
}

// Phase 10d-4: data and dates (Table, DataTable, Calendar, DatePicker, PhoneInput).

export type ContractUser = { id: string; name: string; city: string; role: string }
export type ContractDateRange = { from: string | null; to: string | null }

export interface DataAdapter {
  readonly name: string
  /** The class-parity gallery (see data-parity.contract.ts). */
  dataGallery(): Promise<void>
  /**
   * The invoices Table: caption "Invoices, November", the heads Invoice and Amount (right-aligned), the rows INV-001
   * $120 and INV-002 $80, a footer Total $200, and `containerClassName="max-h-48"`.
   */
  table(fixture: { scrollLabel?: string; striped?: boolean; stickyHeader?: boolean }): Promise<void>
  /** A DataTable labelled "Users" over `data`, with the accessor columns name ("Name"), city ("City") and role ("Role"). */
  dataTable(fixture: {
    data: ContractUser[]
    sorting?: boolean
    globalFilter?: boolean
    pagination?: boolean
    pageSize?: number
    pageSizeOptions?: number[]
    rowSelection?: boolean
    columnVisibility?: boolean
    emptyState?: string
    manual?: boolean
    state?: { sorting?: { id: string; desc: boolean }[] }
    onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void
    loading?: boolean
  }): Promise<void>
  /** A Calendar with these props. `value` is passed as is (controlled when defined), never updated by the fixture. */
  calendar(fixture: {
    mode?: "single" | "range"
    month?: string
    defaultMonth?: string
    value?: string | null | ContractDateRange
    defaultValue?: string | null | ContractDateRange
    onChange?: (value: string | null | ContractDateRange) => void
    min?: string
    max?: string
    isDateDisabled?: (iso: string) => boolean
    locale?: string
  }): Promise<void>
  /**
   * A DatePicker with locale "en-US" inside a Field labelled "Due date". The fixture holds the value and passes it back
   * (controlled), and calls `onChange` too. Single mode is named "due" and starts from `value`; range mode is named
   * "stay", starts empty and takes `presets`.
   */
  datePicker(fixture: {
    mode?: "single" | "range"
    value?: string | null
    onChange?: (value: string | null | ContractDateRange) => void
    presets?: { label: string; value: string | ContractDateRange }[]
  }): Promise<void>
  /** A PhoneInput labelled "Phone" (aria-label on the number input), country "US" unless given. */
  phoneInput(fixture: { country?: string; onCountryChange?: (iso: string) => void }): Promise<void>
}

// Phase 10g-1: the templates (Dashboard, List page, Detail page).

export type ContractInvoice = { id: string; client: string; amount: number }

export interface TemplatesAdapter {
  readonly name: string
  /**
   * DashboardTemplate with these props. `rows` adds that many paragraphs "Row 0", "Row 1", ... as children, after an
   * optional paragraph with `content`. `actions` adds a button "New".
   */
  dashboard(fixture: { title: string; description?: string; activeHref?: string; content?: string; rows?: number; actions?: boolean }): Promise<void>
  /**
   * ListPageTemplate labelled "Invoices table" over `data`, with the accessor columns id ("Invoice") and client
   * ("Client"). `actions` adds a button "New".
   */
  listPage(fixture: { title: string; description?: string; data: ContractInvoice[]; loading?: boolean; actions?: boolean }): Promise<void>
  /** DetailPageTemplate with these props. `aside` and `content` are paragraphs with that text. `actions` adds a button "Edit". */
  detailPage(fixture: { title: string; backHref?: string; aside?: string; content?: string; actions?: boolean }): Promise<void>
}
