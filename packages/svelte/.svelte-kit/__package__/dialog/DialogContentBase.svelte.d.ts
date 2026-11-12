import { type Snippet } from "svelte";
import type { HTMLDialogAttributes } from "svelte/elements";
type Props = HTMLDialogAttributes & {
    children?: Snippet;
};
declare const DialogContentBase: import("svelte").Component<Props, {}, "">;
type DialogContentBase = ReturnType<typeof DialogContentBase>;
export default DialogContentBase;
