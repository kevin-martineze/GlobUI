# GlobUI

A React component library. Next.js 16 (docs site), React 19, TypeScript, Tailwind CSS 4, pnpm workspaces.

The packages are not published to npm yet. Releasing and publishing: [RELEASING.md](RELEASING.md). Deploying the docs site: [DEPLOY.md](DEPLOY.md).

## Install and develop

```bash
pnpm install
pnpm dev          # builds every package once, then watches the packages and runs the docs site
```

Open http://localhost:3000 for the docs site: the component pages are the reference, with live examples.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Builds packages, then runs `dev:watch` |
| `pnpm dev:watch` | Runs `tsup --watch --no-clean` in every package plus `next dev` in apps/docs |
| `pnpm build:packages` | Builds every `@glob-ui/*` package into its `dist/` |
| `pnpm build` | Builds packages, runs the directive check, then builds the docs site and checks it |
| `pnpm build:docs` | Builds the docs site (MDX, examples, copy-code registry) and runs `check:docs` |
| `pnpm check:docs` | Every public package has a page; no broken internal link in the built site |
| `pnpm check:packages` | publint and attw on every package tarball, plus release metadata |
| `pnpm sync:packages` | Writes each package's LICENSE copy, README and release metadata |
| `pnpm changeset` | Adds a changeset (a note for the next release) |
| `pnpm lint` | ESLint over the whole repo (must print nothing) |
| `pnpm test` | Runs the unit and browser test projects once |
| `pnpm test:unit` | Node tests only (pure logic and SSR smoke) |
| `pnpm test:browser` | Browser tests only (Chromium, headless) |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm check:directives` | Asserts `"use client"` is present in client builds and absent from server builds (runs in `pnpm build`) |

Packages are consumed through `dist/`. The docs site reads `dist/`, so keep `dev:watch` running while you edit a package, or rebuild it.

### Adding a package

1. Copy `packages/button` as the template. Keep its `package.json` fields (`main`, `module`, `types`, `exports`, `files`), its `tsup.config.ts` options, and the `src/index.ts` re-export style.
2. Name it `@glob-ui/<name>` and add `"private": true`.
3. Declare every workspace dependency as `"workspace:*"`. Put React in `peerDependencies`.
4. List every dependency in the tsup `external` array.
5. Register it in `packages/all` (dependency, `external`, re-export in `src/index.ts`), add it to `apps/docs/package.json`, and add its page: an entry in `apps/docs/scripts/docs-data.mjs`, then `node apps/docs/scripts/write-component-pages.mjs` and `pnpm sync:packages`. Examples go in `apps/docs/examples/<component>/`.
6. Run `pnpm install`, then `pnpm build` and `pnpm lint`.

## Architecture

- **One package per component.** Each lives in `packages/<name>` and exports its parts from `src/index.ts`.
- **`@glob-ui/all`** re-exports every public component from one entry point. Import from it when you want everything in one place.
- **Internal packages** (not for app code):
  - `@glob-ui/utils`: `cn()` (clsx + tailwind-merge with the glob radius and shadow scale).
  - `@glob-ui/slot`: `Slot`, `composeRefs`, `mergeProps` for `asChild`.
  - `@glob-ui/hooks`: `useControllableState`, `useFloatingPanel` (popover positioning), `useRovingFocus` (arrow-key focus), `useListbox` (`aria-activedescendant` option state).
  - `@glob-ui/styles`: the design tokens and the Tailwind theme mapping.
- **Client and server.** Components that hold state or handlers start with `"use client"`. esbuild drops module-level directives when it bundles, so each client package's `tsup.config.ts` sets `banner: { js: '"use client"' }`. Without it, Next treats the component as server code and breaks. Server-only packages have no banner.
- **Toast is split.** `toast()` works from server code (it is a no-op there). `Toaster` is a separate client module, built as `dist/toaster.*`.


## Tests

Tests use Vitest 5 with two projects, configured in `vitest.config.mts`:

- **unit** (Node): pure logic (`cn`, `mergeProps`, `composeRefs`, the toast store) and SSR smoke tests (`renderToString` must not throw for server-safe components).
- **browser** (Vitest browser mode, Chromium via `@vitest/browser-playwright`): every interactive component, with real keyboard and focus through `userEvent`, and axe-core checks through `tests/browser/a11y.ts`. Components need a real browser: jsdom has no `<dialog>` modal, popover API or layout.

Tests import package sources (`@glob-ui/<pkg>` resolves to `packages/<pkg>/src/index.ts`), so `pnpm test` does not need a build. Test files sit next to the code:

| File | Project |
| --- | --- |
| `src/<name>.test.ts` | unit |
| `src/<name>.ssr.test.tsx` | unit (SSR) |
| `src/<name>.browser.test.tsx` | browser |

Install the Chromium binary once per machine (CI does this too):

```bash
pnpm exec playwright install chromium
# Linux only, if the browser fails to start for missing system libraries:
pnpm exec playwright install-deps chromium
```

Write tests against roles and accessible names (`getByRole`), not CSS classes, and avoid snapshots and sleeps. For delays use fake timers and drive React with `flush()` (see `packages/tooltip/src/tooltip.browser.test.tsx`).

CI (`.github/workflows/ci.yml`) runs install (frozen lockfile), lint, build (with the directive check), and test on every push and pull request.

## Tokens

All colours come from CSS variables prefixed `--glob-`. Use only the `glob-*` utilities in components (`bg-glob-surface`, `text-glob-muted`, and so on). Do not hard-code colours.

Tokens (light values are the default, dark values are in the next section):

- Surfaces and text: `--glob-surface`, `--glob-surface-secondary`, `--glob-surface-hover`, `--glob-text`, `--glob-text-secondary`, `--glob-muted`
- Borders and focus: `--glob-border`, `--glob-border-light`, `--glob-border-strong`, `--glob-ring`
- Brand: `--glob-primary`, `--glob-primary-hover`, `--glob-primary-light`, `--glob-primary-foreground` (text on primary, dark in light mode)
- Status (each with a `-light` background): `--glob-danger`, `--glob-success`, `--glob-warning`, `--glob-info`
- Overlay: `--glob-overlay` (dialog backdrop)
- Radius: `--glob-radius-sm`, `--glob-radius-md`, `--glob-radius-lg`
- Shadow: `--glob-shadow-sm`, `--glob-shadow-md`

### Light and dark

Dark values are set in two places in `packages/styles/glob-ui.css`:

- `:root[data-theme="dark"]`, for an explicit choice.
- `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { ... } }`, when the user has no explicit choice.

Set `data-theme="light"` or `data-theme="dark"` on `<html>` to force a theme. The docs site does this from a stored choice, with an inline script in `<head>` so there is no flash. Colour values use plain `var()` values instead of `light-dark()` because Safari 17.5 lacks it.

### Tailwind setup for consumers

In your global stylesheet:

```css
@import "tailwindcss";
@import "@glob-ui/styles";

/* Scan the package sources so the classes used inside components are generated. */
@source "../node_modules/@glob-ui/*/dist/**/*.{js,mjs}";
```

Adjust the `@source` path to your layout. Tailwind skips `node_modules` by default, so the `@source` line is required.

## Components

| Component | Import | Client or server | Minimal example |
| --- | --- | --- | --- |
| Accordion | `@glob-ui/accordion` | client | `<Accordion type="single" collapsible><AccordionItem value="a"><AccordionTrigger>Q</AccordionTrigger><AccordionContent>A</AccordionContent></AccordionItem></Accordion>` |
| Alert | `@glob-ui/alert` | server | `<Alert variant="warning"><AlertTitle>Heads up</AlertTitle></Alert>` |
| Avatar | `@glob-ui/avatar` | client | `<Avatar src="/a.png" alt="Ana" />` |
| Badge | `@glob-ui/badge` | server | `<Badge variant="success">Live</Badge>` |
| Button | `@glob-ui/button` | server | `<Button variant="outline">Save</Button>` |
| Card | `@glob-ui/card` | server | `<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader><CardContent>Body</CardContent></Card>` |
| Checkbox | `@glob-ui/checkbox` | client | `<Checkbox label="I agree" />` |
| Dialog | `@glob-ui/dialog` | client | `<Dialog><DialogTrigger asChild><Button>Open</Button></DialogTrigger><DialogContent><DialogTitle>Title</DialogTitle></DialogContent></Dialog>` |
| Dropdown menu | `@glob-ui/dropdown-menu` | client | `<DropdownMenu><DropdownMenuTrigger asChild><Button>Menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={...}>Edit</DropdownMenuItem></DropdownMenuContent></DropdownMenu>` |
| Field | `@glob-ui/field` | server | `<Field label="Name" description="Shown to others"><Input /></Field>` |
| Input | `@glob-ui/input` | server | `<Input placeholder="you@example.com" />` |
| Label | `@glob-ui/label` | server | `<Label htmlFor="x">Name</Label>` |
| MultiSelect | `@glob-ui/multi-select` | client | `<MultiSelect options={opts} value={v} onChange={setV} />` |
| PhoneInput | `@glob-ui/phone-input` | client | `<PhoneInput country="MX" />` |
| Popover | `@glob-ui/popover` | client | `<Popover><PopoverTrigger asChild><Button>Info</Button></PopoverTrigger><PopoverContent>Text</PopoverContent></Popover>` |
| RadioGroup | `@glob-ui/radio-group` | client | `<RadioGroup defaultValue="free"><RadioGroupItem value="free" label="Free" /></RadioGroup>` |
| Segmented | `@glob-ui/segmented` | client | `<Segmented options={[{ value: "d", label: "Day" }]} value={v} onChange={setV} />` |
| Select | `@glob-ui/select` | client | `<Select options={[{ value: "a", label: "Alpha" }]} defaultValue="a" name="letter" />` |
| Skeleton | `@glob-ui/skeleton` | server | `<Skeleton className="h-4 w-40" />` |
| Spinner | `@glob-ui/spinner` | server | `<Spinner />` |
| Switch | `@glob-ui/switch` | client | `<Switch checked={on} onCheckedChange={setOn} />` |
| Tabs | `@glob-ui/tabs` | client | `<Tabs defaultValue="a"><TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList><TabsContent value="a">A</TabsContent></Tabs>` |
| Textarea | `@glob-ui/textarea` | server | `<Textarea placeholder="Notes" />` |
| Toast | `@glob-ui/toast` | `toast()` server-safe; `Toaster` client | `<Toaster />` once in your layout, then `toast.success("Saved")` |
| Tooltip | `@glob-ui/tooltip` | client | `<Tooltip content="Help"><Button>?</Button></Tooltip>` |

"Client" means the built file starts with `"use client"`. Put client components inside a server component freely, but do not import a client component's module into a server-only path that expects no client boundary.

Every package exports its props types too (for example `SelectProps`, `ToastOptions`).

### Toast

```tsx
import { Toaster, toast } from "@glob-ui/toast"

// Once, in your root layout:
<Toaster position="bottom-right" max={3} />

// Anywhere, including server code (no-op on the server):
toast("Saved")
toast.success("Saved", { description: "Your changes are live." })
toast({ title: "Upload failed", variant: "danger", action: { label: "Retry", onClick: retry } })
toast.dismiss()
```

## Conventions

- **Template.** Start from `packages/button`: the `cva` variants, sizes `sm`/`md`/`lg`, `forwardRef`, `displayName`, and `cn()` for class merging.
- **Tokens only.** Use `glob-*` colours, radii and shadows. Focus rings are `focus-visible:ring-2 ring-glob-ring`. Disabled state is `disabled:opacity-50` (or `aria-disabled:` for non-button elements).
- **Accessibility rules.**
  - Use native elements first. Use ARIA roles only where the APG pattern needs them (combobox and listbox for Select, radiogroup for Segmented, menu for DropdownMenu).
  - Composite widgets use one tab stop and roving or `aria-activedescendant` focus, via the `@glob-ui/hooks` helpers.
  - Overlays use the native `<dialog>` or `popover` attribute, so they sit in the top layer and are not clipped by `overflow: hidden`.
  - Every form control accepts `id`, `aria-labelledby`, `aria-describedby` and `aria-invalid`, so `Field` can wire labels and errors.
- **Client boundary.** Add `"use client"` to a component only when it uses state, effects or handlers. Keep the banner in `tsup.config.ts` for every client package.
- **Verification before you send a change.**
  1. `pnpm build` and `pnpm lint` both pass with no output from lint.
  2. In the docs site, check the component with the keyboard alone: Tab in, arrows, Enter/Space, Escape, Tab out.
  3. Check it in both themes.
  4. For form controls, submit a native form and confirm `FormData` contains the named values.
