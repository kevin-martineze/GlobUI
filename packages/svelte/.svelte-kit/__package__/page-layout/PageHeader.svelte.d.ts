import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = HTMLAttributes<HTMLDivElement> & {
    title: Snippet | string;
    description?: Snippet | string;
    /** A breadcrumb trail, or any navigation above the title. */
    breadcrumbs?: Snippet;
    /** Buttons for the page. They wrap onto a new line on narrow screens. */
    actions?: Snippet;
};
declare const PageHeader: import("svelte").Component<$$ComponentProps, {}, "">;
type PageHeader = ReturnType<typeof PageHeader>;
export default PageHeader;
