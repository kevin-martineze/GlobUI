---
"@glob-ui/alert": minor
"@glob-ui/app-shell-layout": minor
"@glob-ui/avatar": minor
"@glob-ui/badge": minor
"@glob-ui/button": minor
"@glob-ui/calendar": minor
"@glob-ui/checkbox": minor
"@glob-ui/combobox": minor
"@glob-ui/command": minor
"@glob-ui/core": minor
"@glob-ui/data-table": minor
"@glob-ui/dialog": minor
"@glob-ui/dropdown-menu": minor
"@glob-ui/hooks": minor
"@glob-ui/input": minor
"@glob-ui/label": minor
"@glob-ui/layout": minor
"@glob-ui/page-layout": minor
"@glob-ui/phone-input": minor
"@glob-ui/progress": minor
"@glob-ui/radio-group": minor
"@glob-ui/recipes": minor
"@glob-ui/select": minor
"@glob-ui/sheet": minor
"@glob-ui/slider": minor
"@glob-ui/spinner": minor
"@glob-ui/switch": minor
"@glob-ui/tabs": minor
"@glob-ui/textarea": minor
"@glob-ui/toast": minor
"@glob-ui/toggle": minor
"@glob-ui/utils": minor
---

Internal refactor for multi-framework support (phase 10a). The behaviour of the components moved into the new framework-free `@glob-ui/core` package (focus, keyboard, floating positioning, scroll lock, layout scroll, typeahead, calendar and locale helpers, text matching, toast store, country data). The `cva` variants and shared class strings moved into the new `@glob-ui/recipes` package. The React components keep their exports and behaviour: no public API change and no visual change.
