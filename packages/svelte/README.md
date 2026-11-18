# @glob-ui/svelte

Svelte 5 components for GlobUI: forms and primitives, overlays, dialog, sheet and layouts, with the same API and behaviour as the React packages.

## Install

```bash
pnpm add @glob-ui/svelte
```

Peer dependency: `svelte` (^5).

## Subpaths

Each component family is its own subpath, for example `@glob-ui/svelte/button`.

- Forms: `button`, `input`, `textarea`, `label`, `field`, `checkbox`, `switch`, `radio-group`, `slider`, `toggle` (Toggle and ToggleGroup), `segmented`.
- Display: `badge`, `card`, `alert`, `avatar` (Avatar and AvatarGroup), `progress`, `separator`, `skeleton`, `spinner`.
- Overlays: `dialog`, `sheet`, `alert-dialog`, `popover`, `tooltip`, `dropdown-menu`, `toast`, `select`, `combobox`, `multi-select`, `command`.
- Layouts: `layout`, `app-shell-layout`, `page-layout`, `stacked-layout`.

Two-way state uses `bind:`, for example `<Checkbox bind:checked />`, `<Slider bind:value />` or `<RadioGroup bind:value>`. Without a binding, Switch, RadioGroup, Slider, Toggle, ToggleGroup and Segmented keep their own state, starting from `defaultChecked`, `defaultValue` or `defaultPressed`. A control inside a `Field` takes its id, label, description and error from the field.

Triggers that render your own element take a `child` snippet that receives the attributes to spread, a ref included: `{#snippet child(props)}<Button {...props}>Filters</Button>{/snippet}`. The Tooltip always takes one. `toast()` works from anywhere once a `<Toaster />` is mounted.

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

```svelte
<script lang="ts">
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"
  import { Button } from "@glob-ui/svelte/button"

  let email = $state("")
</script>

<Field label="Email" description="Work address" error={email.includes("@") ? undefined : "Enter a valid email"}>
  <Input bind:value={email} />
</Field>
<Button>Save</Button>
```

## License

MIT. See [LICENSE](./LICENSE).
