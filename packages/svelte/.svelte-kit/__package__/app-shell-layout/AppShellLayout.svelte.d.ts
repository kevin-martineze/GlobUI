import type { Snippet } from "svelte";
import type { HTMLAttributes } from "svelte/elements";
type $$ComponentProps = HTMLAttributes<HTMLDivElement> & {
    /** The fixed header across the top. Put `LayoutNavTrigger` here for small screens. */
    header?: Snippet;
    /** The fixed sidebar navigation. Below `lg` it moves into a Sheet, opened by `LayoutNavTrigger`. */
    sidebar?: Snippet;
    /** The main region. It is the one region that scrolls. It has no padding: put a `PageLayout` in it. */
    children?: Snippet;
    sidebarLabel?: string;
    sidebarSide?: "left" | "right";
    sidebarWidth?: "sm" | "md" | "lg";
};
declare const AppShellLayout: import("svelte").Component<$$ComponentProps, {}, "">;
type AppShellLayout = ReturnType<typeof AppShellLayout>;
export default AppShellLayout;
