# @glob-ui/svelte

Svelte 5 components for GlobUI: dialog, sheet and layouts, with the same API and behaviour as the React packages.

## Install

```bash
pnpm add @glob-ui/svelte
```

Peer dependency: `svelte` (^5).

## Subpaths

Each component family is its own subpath: `@glob-ui/svelte/dialog`, `@glob-ui/svelte/sheet`, `@glob-ui/svelte/layout`, `@glob-ui/svelte/app-shell-layout`, `@glob-ui/svelte/page-layout`, `@glob-ui/svelte/stacked-layout`.

## Tailwind

The components ship Tailwind class names. Tailwind does not scan `node_modules` by default, so add these `@source` lines to your stylesheet, next to the GlobUI theme:

```css
@import "tailwindcss";
@import "@glob-ui/styles";
@source "../node_modules/@glob-ui/svelte";
@source "../node_modules/@glob-ui/recipes";
```

## Usage

```svelte
<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@glob-ui/svelte/dialog"
</script>

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogTitle>Confirm</DialogTitle>
  </DialogContent>
</Dialog>

```

## License

MIT. See [LICENSE](./LICENSE).
