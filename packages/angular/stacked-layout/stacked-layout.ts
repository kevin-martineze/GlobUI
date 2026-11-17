import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from "@angular/core"
import { cn } from "@glob-ui/utils"
import { NgTemplateOutlet } from "@angular/common"
import { STACKED_CLASSES, STACKED_FOOTER_CLASSES, STACKED_HEADER_CLASSES, STACKED_MAIN_CLASSES } from "@glob-ui/recipes"
import { GlobLayoutMobileNav, GlobLayoutSlot, GlobSkipLink } from "@glob-ui/angular/layout"
import { LayoutNavState, nextId } from "@glob-ui/angular/shared"

/**
 * A document layout: the page scrolls as a document and the header stays on top. There is no scroll region of its own,
 * so `injectLayoutScroll()` returns `document.scrollingElement` inside it.
 */
@Component({
  selector: "glob-stacked-layout",
  imports: [NgTemplateOutlet, GlobLayoutSlot, GlobSkipLink, GlobLayoutMobileNav],
  template: `<div data-layout="stacked" data-scroll-mode="document" [attr.class]="rootClass()">
    <a globSkipLink [targetId]="mainId">Skip to content</a>
    @if (header(); as headerTpl) {
      <header globLayoutSlot name="header" scroll="fixed" [attr.class]="STACKED_HEADER_CLASSES">
        <ng-container [ngTemplateOutlet]="headerTpl" />
      </header>
    }
    <main [id]="mainId" tabindex="-1" data-slot="main" data-scroll="scroll" [attr.class]="STACKED_MAIN_CLASSES"><ng-content /></main>
    @if (footer(); as footerTpl) {
      <footer globLayoutSlot name="footer" scroll="fixed" [attr.class]="STACKED_FOOTER_CLASSES">
        <ng-container [ngTemplateOutlet]="footerTpl" />
      </footer>
    }
    @if (mobileNav(); as navTpl) {
      <glob-layout-mobile-nav [label]="navLabel()"><ng-container [ngTemplateOutlet]="navTpl" /></glob-layout-mobile-nav>
    }
  </div>`,
  providers: [LayoutNavState],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: "display: contents" },
})
export class GlobStackedLayout {
  readonly header = input<TemplateRef<unknown> | null>(null)
  readonly footer = input<TemplateRef<unknown> | null>(null)
  /** The navigation for small screens. When set, `globLayoutNavTrigger` in the header opens it in a sheet. */
  readonly mobileNav = input<TemplateRef<unknown> | null>(null)
  /** The accessible name of the mobile navigation dialog. */
  readonly navLabel = input("Navigation")
  readonly mainId = nextId("glob-stacked-main")
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly rootClass = computed(() => cn(STACKED_CLASSES, this.userClass()))
  readonly STACKED_HEADER_CLASSES = STACKED_HEADER_CLASSES
  readonly STACKED_MAIN_CLASSES = STACKED_MAIN_CLASSES
  readonly STACKED_FOOTER_CLASSES = STACKED_FOOTER_CLASSES
}
