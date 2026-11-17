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
