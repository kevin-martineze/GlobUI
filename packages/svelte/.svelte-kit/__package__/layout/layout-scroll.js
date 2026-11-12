// useLayoutScroll for Svelte: a getter, read it inside an effect or an event handler. It returns the
// nearest scroll region of the layout, or the document scrolling element outside one. Null on the server.
import { getContext } from "svelte";
import { getLayoutScroll } from "@glob-ui/core";
import { LAYOUT_SCROLL_KEY } from "../shared/context";
export function useLayoutScroll() {
    const ctx = getContext(LAYOUT_SCROLL_KEY);
    return () => {
        if (ctx?.element)
            return ctx.element;
        if (typeof document === "undefined")
            return null;
        return getLayoutScroll(null);
    };
}
