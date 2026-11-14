import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from "@angular/core"
import { NgTemplateOutlet } from "@angular/common"
import { cn } from "@glob-ui/utils"
import {
  asideVariants,
  contentVariants,
  PAGE_ASIDE_HEADER_OFFSET_CLASSES,
  PAGE_HEADER_ACTIONS_CLASSES,
  PAGE_HEADER_CLASSES,
  PAGE_HEADER_CONTENT_CLASSES,
  PAGE_HEADER_ROW_CLASSES,
  PAGE_HEADER_SECONDARY_TEXT_CLASSES,
  PAGE_HEADER_TITLE_BLOCK_CLASSES,
  PAGE_HEADER_TITLE_CLASSES,
  PAGE_LAYOUT_CLASSES,
  PAGE_LAYOUT_PADDED_CLASSES,
} from "@glob-ui/recipes"

/** A page inside a layout: a sticky `[header]`, the content, and an optional `[aside]` that sticks from `lg`. */
@Component({
  selector: "glob-page-layout",
  imports: [NgTemplateOutlet],
  template: `<div data-layout="page" [attr.class]="rootClass()">
    <div data-slot="content" data-scroll="scroll" [attr.class]="contentClass()">
      @if (header(); as headerTpl) {
        <div data-slot="header" data-scroll="fixed" [attr.class]="PAGE_HEADER_CONTENT_CLASSES">
          <ng-container [ngTemplateOutlet]="headerTpl" />
        </div>
      }
      <ng-content />
    </div>
    @if (aside(); as asideTpl) {
      <aside data-slot="aside" data-scroll="fixed" [attr.class]="asideClass()"><ng-container [ngTemplateOutlet]="asideTpl" /></aside>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: "display: contents" },
})
export class GlobPageLayout {
  readonly header = input<TemplateRef<unknown> | null>(null)
  readonly aside = input<TemplateRef<unknown> | null>(null)
  readonly asideWidth = input<"sm" | "md">("sm")
  /** The maximum width of the content column. */
  readonly width = input<"default" | "wide" | "full">("default")

  readonly PAGE_HEADER_CONTENT_CLASSES = PAGE_HEADER_CONTENT_CLASSES
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly rootClass = computed(() => cn(PAGE_LAYOUT_CLASSES, !this.header() && PAGE_LAYOUT_PADDED_CLASSES, this.userClass()))
  readonly contentClass = computed(() => contentVariants({ width: this.width() }))
  readonly asideClass = computed(() => cn(asideVariants({ asideWidth: this.asideWidth() }), this.header() && PAGE_ASIDE_HEADER_OFFSET_CLASSES))
}

/** The title block of a page: breadcrumbs, the `h1`, a description, and actions. */
@Component({
  selector: "glob-page-header",
  imports: [NgTemplateOutlet],
  template: `<div data-slot="page-header" [attr.class]="rootClass()">
    @if (breadcrumbs(); as crumbs) {
      <div [attr.class]="PAGE_HEADER_SECONDARY_TEXT_CLASSES"><ng-container [ngTemplateOutlet]="crumbs" /></div>
    }
    <div [attr.class]="PAGE_HEADER_ROW_CLASSES">
      <div [attr.class]="PAGE_HEADER_TITLE_BLOCK_CLASSES">
        <h1 [attr.class]="PAGE_HEADER_TITLE_CLASSES">{{ title() }}</h1>
        @if (description()) {
          <p [attr.class]="PAGE_HEADER_SECONDARY_TEXT_CLASSES">{{ description() }}</p>
        }
      </div>
      @if (actions(); as actionsTpl) {
        <div [attr.class]="PAGE_HEADER_ACTIONS_CLASSES"><ng-container [ngTemplateOutlet]="actionsTpl" /></div>
      }
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: "display: contents" },
})
export class GlobPageHeader {
  readonly title = input.required<string>()
  readonly description = input<string | null>(null)
  /** A breadcrumb trail, or any navigation above the title. */
  readonly breadcrumbs = input<TemplateRef<unknown> | null>(null)
  /** Buttons for the page. They wrap onto a new line on narrow screens. */
  readonly actions = input<TemplateRef<unknown> | null>(null)
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly rootClass = computed(() => cn(PAGE_HEADER_CLASSES, this.userClass()))
  readonly PAGE_HEADER_SECONDARY_TEXT_CLASSES = PAGE_HEADER_SECONDARY_TEXT_CLASSES
  readonly PAGE_HEADER_ROW_CLASSES = PAGE_HEADER_ROW_CLASSES
  readonly PAGE_HEADER_TITLE_BLOCK_CLASSES = PAGE_HEADER_TITLE_BLOCK_CLASSES
  readonly PAGE_HEADER_TITLE_CLASSES = PAGE_HEADER_TITLE_CLASSES
  readonly PAGE_HEADER_ACTIONS_CLASSES = PAGE_HEADER_ACTIONS_CLASSES
}
