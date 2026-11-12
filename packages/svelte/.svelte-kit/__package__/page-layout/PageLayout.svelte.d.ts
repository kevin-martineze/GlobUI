import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = HTMLAttributes<HTMLDivElement> & {
    /** The page header. It sticks to the top of the nearest scroll region while the content scrolls. */
    header?: Snippet;
    children?: Snippet;
    /** A side column. Sticky from `lg`; below `lg` it stacks under the content. */
    aside?: Snippet;
    asideWidth?: "sm" | "md";
    /** The maximum width of the content column. */
    width?: "default" | "wide" | "full";
};
declare const PageLayout: import("svelte").Component<$$ComponentProps, {}, "">;
type PageLayout = ReturnType<typeof PageLayout>;
export default PageLayout;
