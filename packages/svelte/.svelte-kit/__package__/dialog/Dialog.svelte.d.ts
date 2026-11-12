import { type Snippet } from "svelte";
type $$ComponentProps = {
    /** Controlled open state. Bind it with `bind:open`, or pass it with `onOpenChange`. */
    open?: boolean;
    /** Initial open state when `open` is not set. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnOutsideClick?: boolean;
    children?: Snippet;
};
declare const Dialog: import("svelte").Component<$$ComponentProps, {}, "open">;
type Dialog = ReturnType<typeof Dialog>;
export default Dialog;
