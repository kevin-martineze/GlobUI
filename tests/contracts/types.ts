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
