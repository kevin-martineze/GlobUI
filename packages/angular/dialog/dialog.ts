import { afterNextRender, ChangeDetectionStrategy, Component, computed, DestroyRef, Directive, effect, ElementRef, forwardRef, inject, Injector, input, model, OnInit, signal, untracked, viewChild } from "@angular/core"
import { cn } from "@glob-ui/utils"
import { createModal, type ModalController, type ModalOptions } from "@glob-ui/core"
import {
  dialogVariants,
  sheetVariants,
  DIALOG_BODY_CLASSES,
  DIALOG_CLOSE_ICON_CLASSES,
  DIALOG_DESCRIPTION_CLASSES,
  DIALOG_FOOTER_CLASSES,
  DIALOG_HEADER_CLASSES,
  DIALOG_TITLE_CLASSES,
  SHEET_BODY_CLASSES,
  SHEET_FOOTER_CLASSES,
} from "@glob-ui/recipes"
import { DIALOG_CONTEXT, nextId, type DialogContext } from "@glob-ui/angular/shared"

/** The state shared by Dialog and Sheet: open (two-way via `[(open)]`), the part ids, and the context. */
@Directive()
export abstract class DialogRoot implements DialogContext, OnInit {
  /** Controlled open state. Use `[(open)]`, or leave it unset and use `defaultOpen`. */
  readonly open = model<boolean | undefined>(undefined)
  /** Initial open state when `open` is not bound. */
  readonly defaultOpen = input(false)
  /** Close when the backdrop is clicked. */
  readonly closeOnOutsideClick = input(true)

  private readonly internal = signal(false)
  readonly isOpen = computed(() => this.open() ?? this.internal())
  private readonly baseId = nextId("glob-dialog")
  readonly contentId = `${this.baseId}-content`
  readonly titleId = `${this.baseId}-title`
  readonly descriptionId = `${this.baseId}-description`

  ngOnInit(): void {
    this.internal.set(this.defaultOpen())
  }

  setOpen(next: boolean): void {
    if (next === this.isOpen()) return
    // Uncontrolled: keep the state here. Controlled: the bound value follows the change.
    if (this.open() === undefined) this.internal.set(next)
    // The model emits `openChange` (for `(openChange)`), so binding the state is the only notification.
    this.open.set(next)
  }
}

/**
 * The modal behaviour of a dialog surface: the native `<dialog>` through core `createModal` (showModal, scroll lock,
 * Escape, backdrop click, focus return, the title and description references). The controller is created after the
 * first render and updated when the state changes. Dialog and Sheet surfaces extend it.
 */
@Directive()
export abstract class DialogSurface {
  protected readonly ctx = inject<DialogContext>(DIALOG_CONTEXT)
  protected readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog")
  private modal: ModalController | undefined
  private readonly injector = inject(Injector)

  protected readonly options = computed<ModalOptions>(() => ({
    open: this.ctx.isOpen(),
    onOpenChange: (next: boolean) => this.ctx.setOpen(next),
    closeOnOutsideClick: this.ctx.closeOnOutsideClick(),
    labelledBy: this.ctx.titleId,
    describedBy: this.ctx.descriptionId,
  }))

  constructor() {
    afterNextRender(() => (this.modal = createModal(this.dialog().nativeElement, this.options())), { injector: this.injector })
    effect(() => {
      const next = this.options()
      untracked(() => this.modal?.update(next))
    })
    inject(DestroyRef).onDestroy(() => this.modal?.destroy())
  }

  /** Closes the surface (the X button, or a consumer's close action). */
  close(): void {
    this.ctx.setOpen(false)
  }
}

/** Dialog root: `<glob-dialog [(open)]="isOpen">`. Its parts are attribute directives on native elements. */
@Component({
  selector: "glob-dialog",
  template: "<ng-content />",
  host: { style: "display: contents" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DIALOG_CONTEXT, useExisting: forwardRef(() => GlobDialog) }],
})
export class GlobDialog extends DialogRoot {}

/** The dialog surface: a native `<dialog>` with the X button. The content goes into the body. */
@Component({
  selector: "glob-dialog-content",
  template: `<dialog #dialog [id]="dialogId() ?? ctx.contentId" [attr.class]="surfaceClass()" [attr.aria-label]="label()">
    <div [attr.class]="DIALOG_BODY_CLASSES">
      <ng-content />
      @if (showCloseButton()) {
        <button type="button" aria-label="Close" [attr.class]="DIALOG_CLOSE_ICON_CLASSES" (click)="close()">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  </dialog>`,
  host: { style: "display: contents" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobDialogContent extends DialogSurface {
  /** Overrides the id of the dialog element (the mobile navigation uses it for its `aria-controls`). */
  readonly dialogId = input<string | null>(null)
  readonly size = input<"sm" | "md" | "lg">("md")
  readonly showCloseButton = input(true)
  readonly label = input<string | null>(null)
  readonly userClass = input<string>("", { alias: "class" })
  readonly surfaceClass = computed(() => cn(dialogVariants({ size: this.size(), className: this.userClass() })))
  readonly DIALOG_BODY_CLASSES = DIALOG_BODY_CLASSES
  readonly DIALOG_CLOSE_ICON_CLASSES = DIALOG_CLOSE_ICON_CLASSES
}

/** The sheet surface, pinned to an edge. Same modal behaviour as the dialog surface. */
@Component({
  selector: "glob-sheet-content",
  template: `<dialog #dialog [id]="dialogId() ?? ctx.contentId" [attr.class]="surfaceClass()" [attr.aria-label]="label()">
    <div [attr.class]="SHEET_BODY_CLASSES">
      <ng-content />
      @if (showCloseButton()) {
        <button type="button" aria-label="Close" [attr.class]="DIALOG_CLOSE_ICON_CLASSES" (click)="close()">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      }
    </div>
  </dialog>`,
  host: { style: "display: contents" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobSheetContent extends DialogSurface {
  readonly dialogId = input<string | null>(null)
  readonly side = input<"left" | "right" | "top" | "bottom">("right")
  readonly size = input<"sm" | "md" | "lg">("md")
  readonly showCloseButton = input(true)
  readonly label = input<string | null>(null)
  readonly userClass = input<string>("", { alias: "class" })
  readonly surfaceClass = computed(() => cn(sheetVariants({ side: this.side(), size: this.size(), className: this.userClass() })))
  readonly SHEET_BODY_CLASSES = SHEET_BODY_CLASSES
  readonly DIALOG_CLOSE_ICON_CLASSES = DIALOG_CLOSE_ICON_CLASSES
}

/** Opens the dialog it is on. Works on any button: `<button globDialogTrigger>Open</button>`. */
@Directive({
  selector: "button[globDialogTrigger]",
  host: {
    type: "button",
    "aria-haspopup": "dialog",
    "[attr.aria-expanded]": "ctx.isOpen()",
    "[attr.aria-controls]": "ctx.isOpen() ? ctx.contentId : null",
    "(click)": "onClick($event)",
  },
})
export class GlobDialogTrigger {
  readonly ctx = inject<DialogContext>(DIALOG_CONTEXT)
  onClick(event: Event): void {
    if (!event.defaultPrevented) this.ctx.setOpen(true)
  }
}

/** Closes the dialog it is on: `<button globDialogClose>Cancel</button>`. */
@Directive({ selector: "button[globDialogClose]", host: { type: "button", "(click)": "onClick($event)" } })
export class GlobDialogClose {
  private readonly ctx = inject<DialogContext>(DIALOG_CONTEXT)
  onClick(event: Event): void {
    if (!event.defaultPrevented) this.ctx.setOpen(false)
  }
}

/** Header block of a dialog or sheet. */
@Directive({ selector: "div[globDialogHeader]", host: { "[attr.class]": "classes()" } })
export class GlobDialogHeader {
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly classes = computed(() => cn(DIALOG_HEADER_CLASSES, this.userClass()))
}

/** Title of a dialog or sheet. Names it through the `aria-labelledby` reference. */
@Directive({ selector: "h2[globDialogTitle]", host: { "[attr.class]": "classes()", "[id]": "ctx.titleId" } })
export class GlobDialogTitle {
  readonly ctx = inject<DialogContext>(DIALOG_CONTEXT)
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly classes = computed(() => cn(DIALOG_TITLE_CLASSES, this.userClass()))
}

/** Description of a dialog or sheet. Referenced by `aria-describedby`. */
@Directive({ selector: "p[globDialogDescription]", host: { "[attr.class]": "classes()", "[id]": "ctx.descriptionId" } })
export class GlobDialogDescription {
  readonly ctx = inject<DialogContext>(DIALOG_CONTEXT)
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly classes = computed(() => cn(DIALOG_DESCRIPTION_CLASSES, this.userClass()))
}

/** Footer of a dialog: the actions, stacked on small screens. */
@Directive({ selector: "div[globDialogFooter]", host: { "[attr.class]": "classes()" } })
export class GlobDialogFooter {
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  readonly classes = computed(() => cn(DIALOG_FOOTER_CLASSES, this.userClass()))
}

/** Footer of a sheet: pushed to the bottom of the sheet. */
@Directive({ selector: "div[globSheetFooter]", host: { "[attr.class]": "classes()" } })
export class GlobSheetFooter {
  /** Extra classes, merged after the base classes (a conflicting utility wins, as with `className` in React). */
  readonly userClass = input<string>("", { alias: "class" })
  // Same merge as React: SheetFooter renders DialogFooter with cn(SHEET_FOOTER_CLASSES, className).
  readonly classes = computed(() => cn(DIALOG_FOOTER_CLASSES, SHEET_FOOTER_CLASSES, this.userClass()))
}
