---
"@glob-ui/svelte": minor
"@glob-ui/recipes": minor
"@glob-ui/core": minor
"@glob-ui/table": patch
"@glob-ui/data-table": patch
"@glob-ui/calendar": patch
"@glob-ui/date-picker": patch
"@glob-ui/phone-input": patch
---

Adds the data and date components to `@glob-ui/svelte`: Table, DataTable (on `@tanstack/svelte-table`), Calendar, DatePicker and PhoneInput, each at its own subpath. The calendar grid helpers (`buildCalendarWeeks`, `calendarKeyTarget`, `monthKey`, `shiftMonth`, `startOfWeek`) and `formatDateValue` moved into `@glob-ui/core`, so every framework builds the same months. The class strings these components share moved into `@glob-ui/recipes`. The rendered classes are unchanged in React.
