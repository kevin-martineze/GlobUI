# @glob-ui/vue

Vue 3 components for GlobUI: dialog, sheet and layouts, with the same API and behaviour as the React packages.

## Install

```bash
pnpm add @glob-ui/vue
```

Peer dependency: `vue` (^3.5).

## Subpaths

Each component family is its own subpath: `@glob-ui/vue/dialog`, `@glob-ui/vue/sheet`, `@glob-ui/vue/layout`, `@glob-ui/vue/app-shell-layout`, `@glob-ui/vue/page-layout`, `@glob-ui/vue/stacked-layout`.

## Tailwind

The components ship Tailwind class names. Tailwind does not scan `node_modules` by default, so add these `@source` lines to your stylesheet, next to the GlobUI theme:

```css
@import "tailwindcss";
@import "@glob-ui/styles";
@source "../node_modules/@glob-ui/vue";
@source "../node_modules/@glob-ui/recipes";
```

## Usage

```vue
<script setup lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@glob-ui/vue/dialog"
</script>

<template>
  <Dialog>
    <DialogTrigger>Open</DialogTrigger>
    <DialogContent>
      <DialogTitle>Confirm</DialogTitle>
    </DialogContent>
  </Dialog>
</template>

```

## License

MIT. See [LICENSE](./LICENSE).
