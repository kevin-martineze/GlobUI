# @glob-ui/angular

Angular components for GlobUI: dialog, sheet and the layouts. Same names, data attributes, classes and ARIA as the React packages, with standalone components, signals and no zone.js.

> The package is built with ng-packagr (Angular Package Format). Publish from `dist/`.

## Install

```bash
pnpm add @glob-ui/angular
```

Peer dependencies: `@angular/core` and `@angular/common`, Angular 21 and 22 (`>=21.0.0 <23.0.0`).

## Subpaths

One secondary entry point per component family: `@glob-ui/angular/dialog`, `@glob-ui/angular/sheet`, `@glob-ui/angular/layout`, `@glob-ui/angular/app-shell-layout`, `@glob-ui/angular/page-layout`, `@glob-ui/angular/stacked-layout`. The internal `@glob-ui/angular/shared` holds the state the families share.

## Tailwind

The components ship Tailwind class names in the built `.mjs` files. Tailwind does not scan `node_modules` by default, so add these `@source` lines to your stylesheet, next to the GlobUI theme:

```css
@import "tailwindcss";
@import "@glob-ui/styles";
@source "../node_modules/@glob-ui/angular/dist";
@source "../node_modules/@glob-ui/recipes";
```

## Conventions

- **Components on layout roots and dialog roots** use the `glob-` element selector: `glob-dialog`, `glob-sheet`, `glob-dialog-content`, `glob-sheet-content`, `glob-app-shell-layout`, `glob-page-layout`, `glob-page-header`, `glob-stacked-layout`. Their host has `display: contents`, so no extra box enters the flex or grid chain.
- **Parts on native elements** use attribute selectors, so the element stays the element: `button[globDialogTrigger]`, `button[globDialogClose]`, `h2[globDialogTitle]`, `p[globDialogDescription]`, `div[globDialogHeader]`, `div[globDialogFooter]`, `div[globSheetFooter]`, `[globLayoutSlot]`, `a[globSkipLink]`, `button[globLayoutNavTrigger]`.
- **Slots** are template inputs, named as in React: `[header]`, `[sidebar]`, `[aside]`, `[footer]`, `[mobileNav]`, plus `[breadcrumbs]` and `[actions]` on the page header. Content that is not a slot is the default projection. A template is used as a slot because the sidebar renders in two places (inline, and in the mobile navigation).
- **Open state** is two-way: `[(open)]="isOpen"`. Without a binding, `defaultOpen` sets the start state.
- **Classes** are bound with `[attr.class]`, so the class attribute matches the React output exactly. A class added by hand to a part element replaces the part's classes; put extra classes on a wrapper element instead.

## Usage

```ts
import { Component, signal } from "@angular/core"
import { GlobDialog, GlobDialogContent, GlobDialogTrigger, GlobDialogTitle, GlobDialogClose } from "@glob-ui/angular/dialog"

@Component({
  selector: "app-confirm",
  imports: [GlobDialog, GlobDialogContent, GlobDialogTrigger, GlobDialogTitle, GlobDialogClose],
  template: `<glob-dialog [(open)]="isOpen">
    <button globDialogTrigger>Open dialog</button>
    <glob-dialog-content>
      <h2 globDialogTitle>Confirm</h2>
      <button globDialogClose>Cancel</button>
    </glob-dialog-content>
  </glob-dialog>`,
})
export class ConfirmComponent {
  readonly isOpen = signal(false)
}
```

## License

MIT. See [LICENSE](./LICENSE).
