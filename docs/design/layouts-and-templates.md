# Layouts and templates

Status: accepted design, to be built after phase 8d (Table). This is GlobUI's main differentiator.

## The problem

Most app bugs with scroll come from pages that decide their own heights and overflow. Two `overflow-auto` regions are nested,
a flex child is missing `min-h-0`, `100vh` is wrong on mobile, a sticky header stops sticking, the body scrolls behind a panel,
or a sidebar scrolls the whole page. Every page solves this again, and each solution is slightly different.

## The methodology

### 1. A layout is the structure of a site or a section of a site, and it owns the scroll

- A layout has named **slots** (for example `header`, `sidebar`, `main`, `aside`, `footer`). It renders **no content** of its own.
- Every slot declares its scroll behaviour: **fixed** (never scrolls, stays in place) or **scroll** (the one region that scrolls
  for that part of the screen). The layout guarantees it. A page never sets heights, `overflow`, `position: sticky` or `100vh`.
- A layout has one of two scroll modes:
  - **app**: the viewport never scrolls (`h-dvh`). Only the slots declared as scroll do. Used by app shells, split views, chat and editors.
  - **document**: the page scrolls as a document (marketing, docs, auth). Fixed slots are sticky inside it.
- The layout solves the details once: `h-dvh` with a fallback, `min-h-0` along the flex/grid chain, `overscroll-contain` on inner scroll
  regions, `scrollbar-gutter: stable`, safe-area insets, a sticky header inside a scroll region, and the mobile navigation as a `Sheet`.
- Accessibility comes with the structure: landmarks (`header`, `nav`, `main`, `aside`, `footer`), one `main`, a "Skip to content" link,
  and focus management for the mobile navigation.

### 2. A template uses a layout and fixes part of it

- A template renders a layout and **passes fixed content to some of its slots** (the brand, the navigation, a footer, a side panel).
- It **exposes props for the rest**: what changes from page to page (the title, the actions, the content).
- If a template fixes nothing, it is not a template; use the layout directly.

```tsx
// A template: AppShellLayout with the header and sidebar fixed.
export function AppTemplate({ title, actions, children }: AppTemplateProps) {
  return (
    <AppShellLayout header={<AppHeader />} sidebar={<AppNav />}>
      <PageHeader title={title} actions={actions} />
      {children}
    </AppShellLayout>
  )
}

// A page: only what varies. No heights, no overflow, no scroll decisions.
export default function OrdersPage() {
  return (
    <AppTemplate title="Orders" actions={<Button>New order</Button>}>
      <OrdersTable />
    </AppTemplate>
  )
}
```

### 3. Three layers

| Layer | Owns | Never does |
| --- | --- | --- |
| Layout | Structure, slots, scroll, responsive behaviour, landmarks | Render content |
| Template | Which slots are fixed, and with what; the props for the rest | Set heights or overflow |
| Page | The variable content | Decide structure or scroll |

## Technical design

- **Slot props.** A layout takes its slots as props (`header`, `sidebar`, `aside`, and so on) plus `children` for its main slot.
  The slot props are typed `ReactNode`. Structural options are props too (`sidebarCollapsible`, `sidebarSide`, `asideWidth`, `mode`).
- **Visible contract.** Each slot renders `data-slot="<name>"` and `data-scroll="fixed|scroll"`. The docs anatomy view and the tests read them.
- **Scroll access.** `useLayoutScroll()` returns the scroll element of the nearest scroll slot, for scroll-to-top on navigation,
  infinite lists, virtualization and "scroll to" links. Pages never search the DOM for it.
- **Dialogs.** The scroll lock of Dialog and Sheet stays on `<html>`, so it works in both scroll modes.
- **Server components.** Layouts are server-safe where they can be. The interactive parts (mobile navigation, collapsible sidebar) are small client parts.

## Catalog

### Layouts

| Layout | Scroll mode | Slots and scroll | Typical use |
| --- | --- | --- | --- |
| `AppShellLayout` | app | header fixed, sidebar fixed (its own scroll if long), main scroll | Dashboards, admin apps |
| `StackedLayout` | document | top nav sticky, main in page flow, footer | Simple apps, portals |
| `PageLayout` | inside a parent | page header sticky, content, aside sticky | Content inside an app shell |
| `SplitViewLayout` | app | list scroll, detail scroll (independent), list becomes a screen on mobile | Inbox, master-detail, file browsers |
| `SettingsLayout` | inside a parent | secondary nav fixed, content scroll | Settings and profile sections |
| `ChatLayout` | app | header fixed, messages scroll (anchored to the bottom), composer fixed | Chat, comments, AI assistants |
| `CanvasLayout` | app | toolbar fixed, side panels with their own scroll, canvas fills the rest | Editors, maps, builders |
| `AuthLayout` | document | centered card, or split with a side panel | Sign in, sign up, errors |
| `MarketingLayout` | document | navbar sticky, sections, footer | Landing and pricing pages |

### Templates

| Template | Uses | Fixed | Props |
| --- | --- | --- | --- |
| `DashboardTemplate` | AppShellLayout + PageLayout | brand, navigation, user menu | title, actions, children |
| `ListPageTemplate` | PageLayout + Table | toolbar layout, empty and loading states | title, filters, columns, data |
| `DetailPageTemplate` | PageLayout | header layout, sticky aside | title, breadcrumbs, children, aside |
| `InboxTemplate` | SplitViewLayout | list header with search | items, renderItem, selected, detail |
| `SettingsTemplate` | SettingsLayout | settings navigation | section title, children |
| `ChatTemplate` | ChatLayout | composer, empty state | messages, onSend |
| `EditorTemplate` | CanvasLayout | toolbar frame, panels | tools, canvas, inspector |
| `SignInTemplate`, `SignUpTemplate`, `ForgotPasswordTemplate` | AuthLayout | brand panel, legal links | providers, onSubmit, error |
| `ErrorTemplate` (404, 500) | AuthLayout centered | layout and illustration slot | code, title, actions |
| `LandingTemplate`, `PricingTemplate` | MarketingLayout | navbar, footer | hero, sections, plans |

## Distribution

- **Layouts**: npm packages, like the components (`@glob-ui/app-shell-layout` and so on), and registry items.
- **Templates**: registry items (copy-code) and full source in the docs. The fixed part of a template is yours (your brand,
  your navigation), so you own the file and edit it. Each template is built only from GlobUI layouts and components, and its props stay typed.

## How the docs show it

- A **Methodology** page: the problem, the three layers, the scroll rules, and an interactive diagram.
- Each **layout page**:
  - an **anatomy view** on the live preview: a toggle colours each slot (fixed and scroll), using `data-slot` and `data-scroll`;
  - a "Fill with content" button that proves which region scrolls;
  - a device toggle (mobile, tablet, desktop);
  - the slot table and the code.
- Each **template page**:
  - the same anatomy view, with three colours: **fixed by the template**, **variable (props)**, **scroll region**;
  - a props panel to change the variable props live while the fixed parts stay;
  - a full-screen preview;
  - the code in two files: the template and a page that uses it.

## Tests

- Scroll ownership: in app mode the document does not scroll (`scrollHeight === innerHeight`), and only the slots marked scroll
  scroll when content overflows. In document mode the sticky slots stay visible.
- At 375 px there is no horizontal overflow, and the mobile navigation opens as a Sheet with focus management.
- Landmarks and the skip link, plus axe in light and dark.
- `useLayoutScroll()` returns the scroll element.

## Phases

- **9a**: the methodology page, the docs infrastructure (anatomy view, device toggle, full-screen preview), `AppShellLayout`,
  `PageLayout`, `StackedLayout`, and the `DashboardTemplate`, `ListPageTemplate` and `DetailPageTemplate` templates.
- **9b**: `SplitViewLayout`, `SettingsLayout`, `ChatLayout`, and the `InboxTemplate`, `SettingsTemplate` and `ChatTemplate` templates.
- **9c**: `AuthLayout`, `MarketingLayout`, `CanvasLayout`, and the Auth, Error, Landing, Pricing and Editor templates.
