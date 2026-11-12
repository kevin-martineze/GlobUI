import type { Snippet } from "svelte";
import type { HTMLDialogAttributes } from "svelte/elements";
type Side = "left" | "right" | "top" | "bottom";
type Size = "sm" | "md" | "lg";
type $$ComponentProps = HTMLDialogAttributes & {
    side?: Side;
    size?: Size;
    showCloseButton?: boolean;
    children?: Snippet;
};
declare const SheetContent: import("svelte").Component<$$ComponentProps, {}, "">;
type SheetContent = ReturnType<typeof SheetContent>;
export default SheetContent;
