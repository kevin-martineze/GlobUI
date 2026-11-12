import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = HTMLAttributes<HTMLDivElement> & {
    /** The top navigation. It stays visible while the document scrolls. */
    header?: Snippet;
    /** The page. It is in document flow, so the document scrolls. It has no padding: put a `PageLayout` in it. */
    children?: Snippet;
    footer?: Snippet;
    /** The navigation for small screens. When set, `LayoutNavTrigger` in the header opens it in a Sheet. */
    mobileNav?: Snippet;
    /** The accessible name of the mobile navigation dialog. */
    navLabel?: string;
};
declare const StackedLayout: import("svelte").Component<$$ComponentProps, {}, "">;
type StackedLayout = ReturnType<typeof StackedLayout>;
export default StackedLayout;
