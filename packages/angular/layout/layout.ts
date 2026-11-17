import { ChangeDetectionStrategy, Component, computed, Directive, inject, input } from "@angular/core"
import { cn } from "@glob-ui/utils"
import { LAYOUT_MOBILE_NAV_LIST_CLASSES, LAYOUT_NAV_TRIGGER_CLASSES, SKIP_LINK_CLASSES } from "@glob-ui/recipes"
import { GlobDialog, GlobSheetContent } from "@glob-ui/angular/dialog"
import { LayoutNavState } from "@glob-ui/angular/shared"

/**
 * A named region of a layout: `<header globLayoutSlot name="header" scroll="fixed">`. `scroll="scroll"` is the one
 * region that scrolls for this part of the screen. AppShellLayout registers its main region as the scroll element.
 */
@Directive({
  selector: "[globLayoutSlot]",
  host: {
    "[attr.data-slot]": "name()",
    "[attr.data-scroll]": "scroll()",
    "[attr.tabindex]": "scroll() === 'scroll' ? 0 : null",
  },
})
export class GlobLayoutSlot {
  readonly name = input.required<string>()
  readonly scroll = input<"fixed" | "scroll">("fixed")
}

/** Skips the navigation: `<a globSkipLink [targetId]="mainId">`. Focus moves to the element with that id. */
@Directive({
  selector: "a[globSkipLink]",
  host: {
    "[attr.class]": "classes()",
    "[attr.href]": "'#' + targetId()",
    "(click)": "onClick($event)",
  },
})
export class GlobSkipLink {
  readonly targetId = input.required<string>()
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly classes = computed(() => cn(SKIP_LINK_CLASSES, this.userClass()))
  onClick(event: Event): void {
    if (event.defaultPrevented) return
    event.preventDefault()
    document.getElementById(this.targetId())?.focus()
  }
}

/** Opens the mobile navigation: `<button globLayoutNavTrigger>`. It hides itself at `lg` and up. */
@Directive({
  selector: "button[globLayoutNavTrigger]",
  host: {
    type: "button",
    "aria-label": "Open navigation",
    "[attr.aria-expanded]": "nav.open()",
    "[attr.aria-controls]": "nav.panelId",
    "[attr.class]": "classes()",
    "(click)": "onClick($event)",
  },
})
export class GlobLayoutNavTrigger {
  readonly nav = inject(LayoutNavState)
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly classes = computed(() => cn(LAYOUT_NAV_TRIGGER_CLASSES, this.userClass()))
  onClick(event: Event): void {
    if (!event.defaultPrevented) this.nav.setOpen(true)
  }
}

/**
 * The mobile navigation: a sheet from the left edge, opened by `globLayoutNavTrigger`. A link inside it closes the sheet.
 * AppShellLayout and StackedLayout render it when they get a sidebar or mobile navigation template.
 */
@Component({
  selector: "glob-layout-mobile-nav",
  imports: [GlobDialog, GlobSheetContent],
  template: `<glob-dialog [open]="nav.open()" (openChange)="nav.setOpen($event ?? false)">
    <glob-sheet-content side="left" size="sm" [showCloseButton]="true" [dialogId]="nav.panelId" [label]="label()" (click)="onClick($event)">
      <nav [attr.aria-label]="label()" [attr.class]="LAYOUT_MOBILE_NAV_LIST_CLASSES"><ng-content /></nav>
    </glob-sheet-content>
  </glob-dialog>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: "display: contents" },
})
export class GlobLayoutMobileNav {
  readonly nav = inject(LayoutNavState)
  readonly label = input.required<string>()
  readonly LAYOUT_MOBILE_NAV_LIST_CLASSES = LAYOUT_MOBILE_NAV_LIST_CLASSES
  onClick(event: Event): void {
    // Following a link in the navigation ends the interaction: close the sheet.
    if ((event.target as HTMLElement).closest("a[href]")) this.nav.setOpen(false)
  }
}
