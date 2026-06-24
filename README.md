# GlobUI

A React component library built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the component showcase.

## Scripts

| Command        | Description          |
| -------------- | -------------------- |
| `pnpm dev`     | Start dev server     |
| `pnpm build`   | Build for production |
| `pnpm start`   | Start production     |
| `pnpm lint`    | Run ESLint           |

## Components

### Button

A versatile button component with built-in variants and sizes.

```tsx
import { Button } from "@/components/ui"

<Button variant="primary" size="md">
  Click me
</Button>
```

#### Variants

| Variant    | Usage                        |
| ---------- | ---------------------------- |
| `primary`  | Main call to action          |
| `secondary`| Alternative action           |
| `ghost`    | Subtle, no border/background |
| `outline`  | Bordered, transparent bg     |
| `link`     | Looks like a hyperlink       |

#### Sizes

| Size     | Height | Font      |
| -------- | ------ | --------- |
| `sm`     | 32px   | text-xs   |
| `md`     | 40px   | text-sm   |
| `lg`     | 48px   | text-base |
| `icon`   | 40x40  | —         |

#### Props

Extends native `<button>` HTML attributes plus:

| Prop      | Type                                          | Default     |
| --------- | --------------------------------------------- | ----------- |
| `variant` | `"primary" \| "secondary" \| "ghost" \| "outline" \| "link"` | `"primary"` |
| `size`    | `"sm" \| "md" \| "lg" \| "icon"`              | `"md"`      |
| `asChild` | `boolean`                                     | `false`     |
| `disabled`| `boolean`                                     | —           |

#### Examples

```tsx
// Default
<Button>Primary</Button>

// Variants
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Icon only
<Button size="icon">
  <svg>...</svg>
</Button>

// Disabled
<Button disabled>Disabled</Button>
```

## Project Structure

```
src/
├── app/            # Next.js App Router pages
│   ├── globals.css # Tailwind imports & theme
│   ├── layout.tsx  # Root layout
│   └── page.tsx    # Component showcase
├── components/
│   └── ui/         # UI component primitives
│       ├── button.tsx
│       └── index.ts
└── lib/
    └── utils.ts    # cn() utility (clsx + tailwind-merge)
```

## Tech Stack

- **Framework**: Next.js 16.2.6
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Variants**: class-variance-authority (CVA)
- **Utilities**: clsx, tailwind-merge
- **Linting**: ESLint 9 with `eslint-config-next`
- **Package Manager**: pnpm
