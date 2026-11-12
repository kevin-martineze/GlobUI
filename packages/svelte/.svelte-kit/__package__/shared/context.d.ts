export declare const DIALOG_KEY: unique symbol;
export declare const LAYOUT_SCROLL_KEY: unique symbol;
export declare const LAYOUT_NAV_KEY: unique symbol;
export interface DialogContext {
    readonly open: boolean;
    readonly closeOnOutsideClick: boolean;
    setOpen(open: boolean): void;
    contentId: string;
    titleId: string;
    descriptionId: string;
}
export interface LayoutScrollContext {
    readonly element: HTMLElement | null;
}
export interface LayoutNavContext {
    readonly open: boolean;
    setOpen(open: boolean): void;
    panelId: string;
}
/** The Dialog context, or a clear error when a part is used outside Dialog, Sheet or AlertDialog. */
export declare function getDialogContext(part: string): DialogContext;
