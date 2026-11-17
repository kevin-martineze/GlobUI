// Angular fixtures for the contracts: the same markup as the React and Svelte/Vue fixtures, written with the
// Angular API (standalone components, signal inputs, attribute directives, template inputs for slots).
import { Component, computed, input } from "@angular/core"
import { injectLayoutScroll } from "@glob-ui/angular/shared"
import { GlobAppShellLayout, } from "@glob-ui/angular/app-shell-layout"
import { GlobLayoutNavTrigger } from "@glob-ui/angular/layout"
import { GlobDialog, GlobDialogClose, GlobDialogContent, GlobDialogDescription, GlobDialogTitle, GlobDialogTrigger } from "@glob-ui/angular/dialog"
import { GlobSheet, GlobSheetContent, GlobSheetFooter } from "@glob-ui/angular/sheet"
import { GlobPageHeader, GlobPageLayout } from "@glob-ui/angular/page-layout"
import { GlobStackedLayout } from "@glob-ui/angular/stacked-layout"

/** Reports the tagName that injectLayoutScroll() returns. Rendered as the probe text. */
@Component({
  selector: "fixture-probe",
  template: `<span data-testid="probe">{{ tag() }}</span>`,
})
export class ProbeFixture {
  private readonly scroll = injectLayoutScroll()
  readonly tag = computed(() => this.scroll()?.tagName ?? "none")
}

@Component({
  selector: "fixture-app-shell",
  imports: [GlobAppShellLayout, GlobLayoutNavTrigger],
  template: `<glob-app-shell-layout [header]="hdr" [sidebar]="side">
    <ng-template #hdr>
      <button globLayoutNavTrigger></button>
      <strong>Acme</strong>
    </ng-template>
    <ng-template #side>
      <a href="#orders" aria-current="page">Orders</a>
      <a href="#customers">Customers</a>
    </ng-template>
    <h2>Orders</h2>
    @if (tall()) {
      @for (row of rows; track row) {
        <p>Row {{ row }}</p>
      }
    }
  </glob-app-shell-layout>`,
})
export class AppShellFixture {
  readonly tall = input(true)
  readonly rows = Array.from({ length: 60 }, (_, i) => i)
}

@Component({
  selector: "fixture-app-shell-probe",
  imports: [GlobAppShellLayout, ProbeFixture],
  template: `<glob-app-shell-layout><fixture-probe /></glob-app-shell-layout>`,
})
export class AppShellProbeFixture {}

@Component({
  selector: "fixture-stacked-probe",
  imports: [GlobStackedLayout, ProbeFixture],
  template: `<glob-stacked-layout><fixture-probe /></glob-stacked-layout>`,
})
export class StackedProbeFixture {}

@Component({
  selector: "fixture-dialog",
  imports: [GlobDialog, GlobDialogTrigger, GlobDialogContent, GlobDialogTitle, GlobDialogDescription, GlobDialogClose],
  template: `<glob-dialog>
    <button globDialogTrigger>{{ triggerLabel() }}</button>
    <glob-dialog-content [class]="contentClass()">
      <h2 globDialogTitle [class]="titleClass()">{{ title() }}</h2>
      <p globDialogDescription>Are you sure?</p>
      <button globDialogClose>Cancel</button>
    </glob-dialog-content>
  </glob-dialog>`,
})
export class DialogFixture {
  readonly title = input.required<string>()
  readonly triggerLabel = input.required<string>()
  readonly titleClass = input("")
  readonly contentClass = input("")
}

@Component({
  selector: "fixture-sheet",
  imports: [GlobSheet, GlobDialogTrigger, GlobSheetContent, GlobDialogTitle, GlobDialogClose, GlobSheetFooter],
  template: `<glob-sheet>
    <button globDialogTrigger>{{ triggerLabel() }}</button>
    <glob-sheet-content side="right">
      <h2 globDialogTitle>{{ title() }}</h2>
      <div globSheetFooter><button globDialogClose>Close</button></div>
    </glob-sheet-content>
  </glob-sheet>`,
})
export class SheetFixture {
  readonly title = input.required<string>()
  readonly triggerLabel = input.required<string>()
}

@Component({
  selector: "fixture-page",
  imports: [GlobPageLayout, GlobPageHeader],
  template: `<glob-page-layout [header]="hdr" [aside]="aside">
    <ng-template #hdr>
      <glob-page-header title="Invoices" description="Last 30 days" [breadcrumbs]="crumbs" [actions]="acts" />
    </ng-template>
    <ng-template #crumbs><a href="#home">Home</a></ng-template>
    <ng-template #acts><button type="button">New invoice</button></ng-template>
    <ng-template #aside><p>Filters</p></ng-template>
    <p>Content</p>
  </glob-page-layout>`,
})
export class PageFixture {}

@Component({
  selector: "fixture-stacked",
  imports: [GlobStackedLayout, GlobLayoutNavTrigger],
  template: `<glob-stacked-layout [header]="hdr" [footer]="ftr" [mobileNav]="nav">
    <ng-template #hdr>
      <button globLayoutNavTrigger></button>
      <strong>Acme</strong>
    </ng-template>
    <ng-template #ftr><p>Footer</p></ng-template>
    <ng-template #nav><a href="#orders">Orders</a></ng-template>
    <h2>Page</h2>
  </glob-stacked-layout>`,
})
export class StackedFixture {}
