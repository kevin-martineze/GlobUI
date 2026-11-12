// Contract tests: behaviour and accessibility written once, run through each framework's render adapter.
//
// A contract is `(render: RenderAdapter) => void`. It defines `describe`/`it` blocks that assert on the DOM only:
// roles, keyboard, focus, scroll behaviour and axe. It never imports a framework. The adapter mounts the
// component fixture in its framework and returns once it is in the document. Fixtures are per framework
// (the same markup in that framework's syntax), so a contract never sees framework types.

export interface AppShellFixture {
  /** Adds enough rows to make the main region scroll. */
  tall: boolean
}

export interface DialogFixture {
  /** Accessible name of the Dialog title, so tests can find the dialog. */
  title: string
  /** Text of the button that opens the dialog. */
  triggerLabel: string
}

export interface RenderAdapter {
  /** The framework name, used in test titles (for example "react"). */
  readonly name: string
  /** Mounts the AppShellLayout fixture. Resolves once it is in the document. */
  appShell(fixture: AppShellFixture): Promise<void>
  /** Mounts the Dialog fixture, closed. Resolves once it is in the document. */
  dialog(fixture: DialogFixture): Promise<void>
}
