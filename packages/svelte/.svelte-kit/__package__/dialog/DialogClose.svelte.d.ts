import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
type Props = HTMLButtonAttributes & {
    child?: Snippet<[Record<string, unknown>]>;
};
declare const DialogClose: import("svelte").Component<Props, {}, "">;
type DialogClose = ReturnType<typeof DialogClose>;
export default DialogClose;
