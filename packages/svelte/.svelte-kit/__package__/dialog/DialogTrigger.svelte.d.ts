import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
type Props = HTMLButtonAttributes & {
    /** Renders the trigger through this snippet instead of a button. It receives the attributes to apply. */
    child?: Snippet<[Record<string, unknown>]>;
};
declare const DialogTrigger: import("svelte").Component<Props, {}, "">;
type DialogTrigger = ReturnType<typeof DialogTrigger>;
export default DialogTrigger;
