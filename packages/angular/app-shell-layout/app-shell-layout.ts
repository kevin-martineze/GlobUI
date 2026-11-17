import { afterNextRender, ChangeDetectionStrategy, Component, computed, ElementRef, inject, Injector, input, TemplateRef, viewChild } from "@angular/core"
import { NgTemplateOutlet } from "@angular/common"
import { cn } from "@glob-ui/utils"
import { SCROLL_CLASSES, sidebarVariants, APP_SHELL_CLASSES, APP_SHELL_HEADER_CLASSES, APP_SHELL_MAIN_CLASSES, APP_SHELL_SIDEBAR_LIST_CLASSES } from "@glob-ui/recipes"
import { GlobLayoutMobileNav, GlobLayoutSlot, GlobSkipLink } from "@glob-ui/angular/layout"
import { LayoutNavState, LayoutScrollRegion, nextId } from "@glob-ui/angular/shared"

/**
 * An app shell: the viewport never scrolls, only the main region does. Slots are template inputs: `[header]`, and
 * `[sidebar]` (inline below `lg`, and in the mobile navigation below it). The default content is the main region.
 */
@Component({
  selector: "glob-app-shell-layout",
  imports: [NgTemplateOutlet, GlobLayoutSlot, GlobSkipLink, GlobLayoutMobileNav],
  template: `<div data-layout="app-shell" data-scroll-mode="app" [attr.class]="rootClass()">
    <a globSkipLink [targetId]="mainId">Skip to content</a>
    @if (header(); as headerTpl) {
      <header globLayoutSlot name="header" scroll="fixed" [attr.class]="APP_SHELL_HEADER_CLASSES">
        <ng-container [ngTemplateOutlet]="headerTpl" />
      </header>
    }
    <div class="flex min-h-0 flex-1">
      @if (sidebar(); as sidebarTpl) {
        <nav globLayoutSlot name="sidebar" scroll="fixed" [attr.aria-label]="sidebarLabel()" [attr.class]="sidebarClass()">
          <div globLayoutSlot name="sidebar-list" scroll="scroll" [attr.class]="sidebarListClass">
            <ng-container [ngTemplateOutlet]="sidebarTpl" />
          </div>
        </nav>
      }
      <main #main globLayoutSlot name="main" scroll="scroll" [id]="mainId" [attr.class]="mainClass()"><ng-content /></main>
    </div>
    @if (sidebar(); as sidebarTpl) {
      <glob-layout-mobile-nav [label]="sidebarLabel()"><ng-container [ngTemplateOutlet]="sidebarTpl" /></glob-layout-mobile-nav>
    }
  </div>`,
  providers: [LayoutScrollRegion, LayoutNavState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: "display: contents" },
})
export class GlobAppShellLayout {
  readonly header = input<TemplateRef<unknown> | null>(null)
  readonly sidebar = input<TemplateRef<unknown> | null>(null)
  /** The accessible name of the navigation landmark and the mobile navigation dialog. */
  readonly sidebarLabel = input("Main navigation")
  readonly sidebarSide = input<"left" | "right">("left")
  readonly sidebarWidth = input<"sm" | "md" | "lg">("md")

  readonly mainId = nextId("glob-app-shell-main")
  private readonly main = viewChild<ElementRef<HTMLElement>>("main")
  private readonly region = inject(LayoutScrollRegion)

  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly rootClass = computed(() => cn(APP_SHELL_CLASSES, this.userClass()))
  readonly APP_SHELL_HEADER_CLASSES = APP_SHELL_HEADER_CLASSES
  readonly APP_SHELL_SIDEBAR_LIST_CLASSES = APP_SHELL_SIDEBAR_LIST_CLASSES
  readonly sidebarClass = computed(() =>
    cn(sidebarVariants({ side: this.sidebarSide(), width: this.sidebarWidth() }), this.sidebarSide() === "right" && "order-last")
  )
  readonly mainClass = computed(() => cn(SCROLL_CLASSES, cn(APP_SHELL_MAIN_CLASSES, this.sidebarSide() === "right" && "order-first")))
  readonly sidebarListClass = cn(SCROLL_CLASSES, APP_SHELL_SIDEBAR_LIST_CLASSES)

  constructor() {
    // The main region exists after the first render: from then on it is the layout's scroll element.
    afterNextRender(() => this.region.element.set(this.main()?.nativeElement ?? null), { injector: inject(Injector) })
  }
}
