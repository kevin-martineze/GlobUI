import Link from "next/link"
import { registry } from "@/examples/registry"
import { GITHUB_URL } from "@/lib/layout.shared"
import { GlobUILogo } from "@/components/logo-mark"

// Every demo is an example file from examples/, so the landing page never shows code that is not tested.
const demos = [
  { title: "Buttons", name: "button/variants", note: "Four variants, three sizes." },
  { title: "Field with an error", name: "input/with-field", note: "Label, description and error are wired to the input." },
  { title: "Select", name: "select/default", note: "APG combobox: arrows, typeahead, Enter, Esc." },
  { title: "Switch", name: "switch/default", note: "A real switch role, controlled." },
  { title: "Tabs", name: "tabs/default", note: "Roving focus, disabled tabs skipped." },
  { title: "Dialog", name: "dialog/default", note: "Modal, focus moves in, Esc returns focus." },
  { title: "Toast", name: "toast/default", note: "Live regions, pause on hover." },
  { title: "Dropdown menu", name: "dropdown-menu/default", note: "Menu roles, checkbox and radio items." },
]

const features = [
  {
    title: "Accessible by default",
    text: "WAI-ARIA patterns for every composite widget: menus, comboboxes, tabs, dialogs. Keyboard and focus are tested in a real browser.",
  },
  {
    title: "Server-component friendly",
    text: "Presentational components are server-safe. Only components with state or handlers carry \"use client\", and the docs say which.",
  },
  {
    title: "Design tokens and dark mode",
    text: "Every colour is a --glob-* token. Light and dark switch with one data-theme attribute, with no flash on load.",
  },
  {
    title: "One package per component",
    text: "Install @glob-ui/button alone, or everything from @glob-ui/all. Each package is a small ESM and CJS build with its own types.",
  },
]

export default function Home() {
  return (
    <main className="flex flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 pt-20 pb-12 text-center">
        <h1>
          <GlobUILogo title="GlobUI" className="h-16 w-auto text-fd-foreground sm:h-20" />
        </h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          An accessible React component library. Each component is its own package, styled with design tokens, and works
          in dark mode.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/docs"
            className="rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90"
          >
            Get started
          </Link>
          <a
            href={GITHUB_URL}
            className="rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground hover:bg-fd-muted"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16">
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-fd-muted-foreground">
          Live demos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {demos.map((demo) => {
            const Demo = registry[demo.name]
            return (
              <div key={demo.name} className="flex min-w-0 flex-col gap-3 rounded-xl border border-fd-border bg-fd-card p-5">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-fd-card-foreground">{demo.title}</h3>
                  <p className="text-sm text-fd-muted-foreground">{demo.note}</p>
                </div>
                <div className="flex min-h-32 flex-1 flex-wrap items-center justify-center gap-3 overflow-x-auto rounded-lg border border-dashed border-fd-border p-4">
                  <Demo />
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-24 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-fd-border p-5">
            <h3 className="font-semibold text-fd-foreground">{feature.title}</h3>
            <p className="mt-2 text-sm text-fd-muted-foreground">{feature.text}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
