import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core"
import { DialogRoot } from "@glob-ui/angular/dialog"
import { DIALOG_CONTEXT } from "@glob-ui/angular/shared"

/** Sheet root: `<glob-sheet [(open)]="isOpen">`. The same behaviour as Dialog, with a sheet surface. */
@Component({
  selector: "glob-sheet",
  template: "<ng-content />",
  host: { style: "display: contents" },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DIALOG_CONTEXT, useExisting: forwardRef(() => GlobSheet) }],
})
export class GlobSheet extends DialogRoot {}
