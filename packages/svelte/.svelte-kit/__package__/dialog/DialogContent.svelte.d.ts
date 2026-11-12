import type { Snippet } from "svelte";
import type { HTMLDialogAttributes } from "svelte/elements";
type Size = "sm" | "md" | "lg";
type $$ComponentProps = HTMLDialogAttributes & {
    size?: Size;
    showCloseButton?: boolean;
    children?: Snippet;
};
declare const DialogContent: import("svelte").Component<$$ComponentProps, {}, "">;
type DialogContent = ReturnType<typeof DialogContent>;
export default DialogContent;
