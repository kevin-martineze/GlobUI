import { type Snippet } from "svelte";
type Tag = "div" | "header" | "nav" | "main" | "aside" | "footer" | "section";
type $$ComponentProps = {
    /** The slot name, rendered as `data-slot`. */
    name: string;
    /** `fixed` never scrolls. `scroll` is the one region that scrolls for this part of the screen. */
    scroll: "fixed" | "scroll";
    as?: Tag;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
};
declare const LayoutSlot: import("svelte").Component<$$ComponentProps, {}, "">;
type LayoutSlot = ReturnType<typeof LayoutSlot>;
export default LayoutSlot;
