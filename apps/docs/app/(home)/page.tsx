import Link from "next/link"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { registry } from "@/examples/registry"
import { GITHUB_URL } from "@/lib/layout.shared"
import { packageStats } from "@/lib/package-stats"
import { LayoutPreviewFrame } from "@/components/layout-preview-frame"
import { CopyCommand } from "@/components/copy-command"

// The version and the package count are read from packages/ at build time (lib/package-stats.ts).
// Every demo is an existing example from examples/, so the home never shows code that is not tested.

const layers = [
  { title: "Layout", text: "Owns structure and scroll. Renders no content." },
  { title: "Template", text: "Fixes the brand, the navigation and the frame. Takes props for the rest." },
  { title: "Page", text: "Only content. No heights, no overflow, no scroll decisions." },
]

const pageCode = `export default function OrdersPage() {
  return (
    <DashboardTemplate
      title="Orders"
      activeHref="/orders"
      actions={<Button>New order</Button>}
    >
      <OrdersTable />
    </DashboardTemplate>
  )
}`

const tiles = [
  {
    title: "DataTable",
    names: ["data-table/default"],
    href: "/docs/components/data-table",
    note: "Sorting, search, pagination and row selection. The table owns its scroll.",
    wide: true,
  },
  {
    title: "Command palette",
    names: ["command/dialog"],
    href: "/docs/components/command",
    note: "Grouped, filtered and keyboard driven. It opens with ⌘J (Ctrl+J) here, because ⌘K opens search.",
  },
  {
    title: "Date range",
    names: ["date-picker/range"],
    href: "/docs/components/date-picker",
    note: "Presets and a range calendar. Values are ISO dates.",
  },
  {
    title: "Combobox",
    names: ["combobox/default"],
    href: "/docs/components/combobox",
    note: "Search over options, with keyboard and screen reader support.",
  },
  {
    title: "Toast",
    names: ["toast/default"],
    href: "/docs/components/toast",
    note: "Success, warning and error, in live regions that keep focus where it is.",
  },
  {
    title: "Sheet",
    names: ["sheet/default"],
    href: "/docs/components/sheet",
    note: "A panel from any edge. Focus moves in, and Escape returns it.",
  },
  {
    title: "Forms",
    names: ["field/default", "select/default"],
    href: "/docs/components/field",
    note: "Labels, descriptions and errors wired to their controls.",
  },
]

const guarantees = [
  {
    title: "WCAG AA",
    text: "axe runs in every browser test. Each component page has an accessibility table.",
    href: "/docs/components/dialog#accessibility",
    link: "Dialog accessibility",
  },
  {
    title: "RSC-ready",
    text: "Presentational parts are Server Components. Only what has state carries \"use client\".",
    href: "/docs/server-and-client",
    link: "Server and client",
  },
  {
    title: "Per package",
    text: "Install only what you use. Every component is its own package, with its own types.",
    href: "/docs/installation",
    link: "Installation",
  },
  {
    title: "Copy or npm",
    text: "Install from npm, or copy the source into your project with the shadcn CLI.",
    href: "/docs/installation",
    link: "Installation",
  },
]

const primary = "rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:opacity-90"
const outline = "rounded-lg border border-fd-border px-5 py-2.5 text-sm font-medium text-fd-foreground hover:bg-fd-muted"

export default function Home() {
  const { version, count } = packageStats()

  return (
    // HomeLayout already renders the page's <main>; the sections go straight into it.
    <>
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-4 pt-16 pb-14 text-center">
        <p className="rounded-full border border-fd-border bg-fd-card px-3 py-1 text-sm text-fd-muted-foreground">
          v{version} · {count} packages · npm + shadcn registry
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-fd-foreground sm:text-5xl">Pages that never fight the scroll.</h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Accessible React components, plus layouts that own the scroll and templates that fix what repeats. Your page only fills the
          slots.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/docs" className={primary}>
            Get started
          </Link>
          <Link href="/docs/layouts" className={outline}>
            See layouts
          </Link>
        </div>
        <CopyCommand command="pnpm add @glob-ui/all" />
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-semibold text-fd-foreground">A real dashboard, running here</h2>
          <p className="text-fd-muted-foreground">This is the dashboard template from the docs, live in its own preview frame.</p>
        </div>
        <LayoutPreviewFrame slug="templates/dashboard/default" kind="template" controls={[]} minimal autoDevice height={720} />
        <p className="text-center text-sm text-fd-muted-foreground">
          Toggle the anatomy: blue is fixed by the template, amber comes in as props, green is the one region that scrolls.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-semibold text-fd-foreground">Three layers, one rule</h2>
          <p className="text-fd-muted-foreground">A page only fills the slots.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {layers.map((layer) => (
            <div key={layer.title} className="rounded-xl border border-fd-border bg-fd-card p-5">
              <h3 className="font-semibold text-fd-card-foreground">{layer.title}</h3>
              <p className="mt-2 text-sm text-fd-muted-foreground">{layer.text}</p>
            </div>
          ))}
        </div>
        <div className="grid items-start gap-6 md:grid-cols-2">
          {/* The code block is wider than a phone: it scrolls in its own column, not the page. */}
          <div className="min-w-0 overflow-x-auto">
            <DynamicCodeBlock lang="tsx" code={pageCode} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-fd-muted-foreground">
              The page above is the whole page. The template decides the frame, the layout decides the scroll, and the page sets only
              what changes.
            </p>
            <Link href="/docs/layouts" className="w-fit text-sm font-medium text-fd-primary underline-offset-4 hover:underline">
              Read the methodology
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-20">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-semibold text-fd-foreground">Built for real screens</h2>
          <p className="text-fd-muted-foreground">Every tile is a live example from the docs.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiles.map((tile) => (
            <div
              key={tile.title}
              className={`flex min-w-0 flex-col gap-3 rounded-xl border border-fd-border bg-fd-card p-5 ${tile.wide ? "lg:col-span-2" : ""}`}
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-fd-card-foreground">{tile.title}</h3>
                <p className="text-sm text-fd-muted-foreground">{tile.note}</p>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 overflow-x-auto rounded-lg border border-dashed border-fd-border p-4">
                {tile.names.map((name) => {
                  const Demo = registry[name]
                  if (!Demo) throw new Error(`Home: "${name}" is not in examples/registry.ts`)
                  return <Demo key={name} />
                })}
              </div>
              <Link href={tile.href} className="w-fit text-sm font-medium text-fd-primary underline-offset-4 hover:underline">
                {tile.title} docs
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-fd-border">
        <h2 className="sr-only">Guarantees</h2>
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <h3 className="font-semibold text-fd-foreground">{item.title}</h3>
              <p className="text-sm text-fd-muted-foreground">{item.text}</p>
              <Link href={item.href} className="w-fit text-sm font-medium text-fd-primary underline-offset-4 hover:underline">
                {item.link}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-fd-muted-foreground">
        <p>MIT licensed.</p>
        <nav aria-label="Footer">
          <ul className="flex gap-5">
            <li>
              <Link href="/docs" className="hover:text-fd-foreground">
                Docs
              </Link>
            </li>
            <li>
              <a href={GITHUB_URL} rel="noopener noreferrer" className="hover:text-fd-foreground">
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </footer>
    </>
  )
}
