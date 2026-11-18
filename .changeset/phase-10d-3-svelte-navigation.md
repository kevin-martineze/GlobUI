---
"@glob-ui/svelte": minor
"@glob-ui/recipes": minor
"@glob-ui/core": minor
"@glob-ui/tabs": patch
"@glob-ui/accordion": patch
"@glob-ui/pagination": patch
---

Adds the navigation components to `@glob-ui/svelte`: Tabs, Accordion and Pagination, at `@glob-ui/svelte/tabs`, `@glob-ui/svelte/accordion` and `@glob-ui/svelte/pagination`. `getPageRange` moved into `@glob-ui/core`, so every framework computes the same pages; `@glob-ui/pagination` still exports it. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
