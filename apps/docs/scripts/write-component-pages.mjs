// Writes content/docs/components/*.mdx and content/docs/utilities/*.mdx from the data below.
// Every page has the same sections: preview, examples, API (generated from types), accessibility.
// Examples are files in examples/<group>/<name>.tsx; API tables read packages/<pkg>/src.
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "content", "docs")

const components = [
  {
    group: "Forms", slug: "button", title: "Button", pkg: "button", exports: "Button, buttonVariants",
    description: "A button that can render as a link, and shows a loading state without changing its width.",
    main: "button/default",
    examples: [
      { title: "Variants", name: "button/variants", text: "`primary`, `secondary`, `outline` and `ghost`." },
      { title: "Sizes", name: "button/sizes", text: "`sm`, `md` (default) and `lg`." },
      { title: "States", name: "button/states", text: "`disabled` is not focusable. `loading` keeps the label width, sets `aria-busy` and disables the button." },
      { title: "As a link", name: "button/as-child", text: "`asChild` renders the single child (here an `<a>`) with the button styles and props." },
    ],
    api: [{ name: "ButtonProps" }],
    a11y: [
      ["Enter, Space", "Activates the button (native button behaviour)."],
      ["Tab", "Moves focus to the button. Disabled buttons are skipped."],
      ["loading", "Sets `aria-busy=\"true\"` and disables the button, so it cannot be activated twice."],
      ["asChild", "Sets `aria-disabled` instead of `disabled`, because a link has no disabled state."],
    ],
    aria: "A text button needs a visible label, or an `aria-label` when it has only an icon. The spinner shown while `loading` does not change the accessible name.",
  },
  {
    group: "Forms", slug: "input", title: "Input", pkg: "input", exports: "Input, inputVariants",
    description: "A single-line text field with sizes, invalid styling and focus rings.",
    main: "input/default",
    examples: [
      { title: "With a Field", name: "input/with-field", text: "`Field` wires the label, description and error to the input." },
      { title: "Sizes and disabled", name: "input/states", text: "`size` is `sm`, `md` or `lg`. Disabled inputs are skipped by Tab." },
    ],
    api: [{ name: "InputProps" }],
    a11y: [
      ["Tab", "Focuses the input. Disabled inputs are skipped."],
      ["Typing", "Native text editing. The browser handles the caret, selection and autofill."],
    ],
    aria: "The input is a native `<input>`, so it needs a name. Use `Field`, or pass `aria-label`. When `aria-invalid` is set, the error styling and the screen reader state both follow.",
  },
  {
    group: "Forms", slug: "textarea", title: "Textarea", pkg: "textarea", exports: "Textarea, textareaVariants",
    description: "A multi-line text field with the same sizes and states as Input.",
    main: "textarea/default",
    examples: [{ title: "With a Field", name: "textarea/with-field", text: "Description text is linked to the textarea with `aria-describedby`." }],
    api: [{ name: "TextareaProps" }],
    a11y: [
      ["Tab", "Focuses the textarea."],
      ["Enter", "Inserts a line break (native behaviour)."],
    ],
    aria: "A native `<textarea>`. Give it a name with `Field` or `aria-label`.",
  },
  {
    group: "Forms", slug: "label", title: "Label", pkg: "label", exports: "Label, labelVariants",
    description: "A styled `<label>`, with an optional required marker.",
    main: "label/default",
    examples: [],
    api: [{ name: "LabelProps" }],
    a11y: [["Click on the label", "Focuses the control it points to (`htmlFor`)."]],
    aria: "The label's text is the control's accessible name. Set `htmlFor` to the control's `id`. For a Field, use `Field` instead, which sets this up for you.",
  },
  {
    group: "Forms", slug: "field", title: "Field", pkg: "field", exports: "Field",
    description: "Wraps one form control with a label, a description and an error, and wires their ARIA attributes to it.",
    main: "field/default",
    examples: [{ title: "Error", name: "field/error", text: "An `error` marks the control `aria-invalid` and links the message with `aria-describedby`. `required` shows the asterisk and sets `required` on the control." }],
    api: [{ name: "FieldProps" }],
    a11y: [
      ["Label", "The control's accessible name (`aria-labelledby` or `htmlFor`)."],
      ["description", "Read after the name, linked with `aria-describedby`."],
      ["error", "Sets `aria-invalid=\"true\"` and is linked with `aria-describedby`, so it is announced with the control."],
    ],
    aria: "Field passes its ids to the child with `cloneElement`. A child's own `aria-describedby` is kept and extended, not replaced.",
  },
  {
    group: "Forms", slug: "checkbox", title: "Checkbox", pkg: "checkbox", exports: "Checkbox, checkboxVariants",
    description: "A native checkbox with a label, sizes, and an indeterminate state for groups.",
    main: "checkbox/default",
    examples: [
      { title: "Indeterminate", name: "checkbox/indeterminate", text: "`indeterminate` shows a dash. It is a DOM property, not a checked state, and the browser clears it on click." },
      { title: "Disabled", name: "checkbox/disabled", text: "Disabled checkboxes keep their checked state and are skipped by Tab." },
    ],
    api: [{ name: "CheckboxProps" }],
    a11y: [
      ["Space", "Toggles the checkbox (native)."],
      ["Tab", "Focuses it. Disabled checkboxes are skipped."],
    ],
    aria: "The label is the accessible name. With a Field, the Field label and the checkbox label are both read, for example \"Terms I accept the terms\".",
  },
  {
    group: "Forms", slug: "radio-group", title: "Radio group", pkg: "radio-group", exports: "RadioGroup, RadioGroupItem, radioVariants",
    description: "A group of native radios: one tab stop, arrows move and select.",
    main: "radio-group/default",
    examples: [{ title: "Horizontal", name: "radio-group/horizontal", text: "`orientation` sets the arrow keys to use: Left and Right, or Up and Down." }],
    api: [{ name: "RadioGroupProps" }, { name: "RadioGroupItemProps" }],
    a11y: [
      ["Tab", "Enters the group on the checked radio. Only one radio is in the tab order."],
      ["Arrow keys", "Move to the next or previous radio, select it, and wrap around. Disabled radios are skipped."],
      ["Space", "Selects the focused radio."],
    ],
    aria: "The group has `role=\"radiogroup\"` and needs a name: a `Field` label, or `aria-label`.",
  },
  {
    group: "Forms", slug: "switch", title: "Switch", pkg: "switch", exports: "Switch, switchVariants",
    description: "An on/off control with `role=\"switch\"`, controlled or uncontrolled, with an optional form value.",
    main: "switch/default",
    examples: [{ title: "In a form", name: "switch/form", text: "With `name`, a hidden input submits `value` while the switch is on." }],
    api: [{ name: "SwitchProps" }],
    a11y: [
      ["Space, Enter", "Toggles the switch."],
      ["Tab", "Focuses it."],
    ],
    aria: "`role=\"switch\"` with `aria-checked`. Give it a name with `aria-label` or a visible label, for example a Field.",
  },
  {
    group: "Forms", slug: "select", title: "Select", pkg: "select", exports: "Select, selectVariants",
    description: "A single-choice dropdown that follows the WAI-ARIA select-only combobox pattern, with search above eight options.",
    main: "select/default",
    examples: [
      { title: "Search", name: "select/search", text: "More than eight options show a search field at the top of the list." },
      { title: "In a form", name: "select/form", text: "`name` writes a hidden input, so a native form submits the value." },
    ],
    api: [{ name: "SelectProps" }, { name: "SelectOption", label: "Option" }],
    a11y: [
      ["Enter, Space, ArrowDown, ArrowUp", "Opens the list. It opens on the selected option."],
      ["Arrow keys, Home, End", "Move the active option, skipping disabled options. The list scrolls to keep it visible."],
      ["Letters", "Typeahead: jumps to the next option that starts with the typed letters."],
      ["Enter, Space", "Selects the active option and closes the list. Focus stays on the trigger."],
      ["Escape", "Closes without changing the value."],
      ["Tab", "Selects the active option, closes the list and moves focus on."],
      ["Search field (more than 8 options)", "Focus moves into the search. Arrow keys move the active option within the filtered list (`aria-activedescendant`). Enter selects."],
    ],
    aria: "The trigger is `role=\"combobox\"` with `aria-haspopup=\"listbox\"` and `aria-expanded`. The list is `role=\"listbox\"` and each option is `role=\"option\"` with `aria-selected` and `aria-disabled`. Name it with `aria-label` or a Field. The list opens in the top layer, so cards with `overflow: hidden` do not clip it.",
  },
  {
    group: "Forms", slug: "multi-select", title: "Multi-select", pkg: "multi-select", exports: "MultiSelect",
    description: "Pick several options. The selected options show as removable chips.",
    main: "multi-select/default",
    examples: [{ title: "Maximum", name: "multi-select/max", text: "`max` disables the other options once the limit is reached. Removing a chip enables them again." }],
    api: [{ name: "MultiSelectProps" }, { name: "MultiSelectOption", label: "Option" }],
    a11y: [
      ["Enter, Space", "Toggles the active option. The list stays open, so several options can be chosen."],
      ["Arrow keys, Home, End, letters", "As in Select: move the active option, typeahead."],
      ["Escape, Tab", "Close the list."],
      ["Remove chip button", "Removes that option. Each button is named `Remove <label>` and reachable with Tab."],
      ["Backspace in an empty search", "Removes the last chip."],
    ],
    aria: "The list is `role=\"listbox\"` with `aria-multiselectable=\"true\"`. Options show `aria-selected`. Disabled options (including those past `max`) have `aria-disabled`.",
  },
  {
    group: "Forms", slug: "segmented", title: "Segmented control", pkg: "segmented", exports: "Segmented",
    description: "A row of mutually exclusive options that looks like a control group, for example Day, Week, Month.",
    main: "segmented/default",
    examples: [{ title: "Sizes", name: "segmented/sizes", text: "`size` is `sm`, `md` or `lg`." }],
    api: [{ name: "SegmentedProps" }, { name: "SegmentedOption", label: "Option" }],
    a11y: [
      ["Tab", "Enters the group on the checked option. Only one option is in the tab order."],
      ["Arrow keys", "Move to the next or previous option, select it, and wrap. Disabled options are skipped."],
    ],
    aria: "The group is `role=\"radiogroup\"` and each option is `role=\"radio\"` with `aria-checked`. Name it with `aria-label`.",
  },
  {
    group: "Forms", slug: "phone-input", title: "Phone input", pkg: "phone-input", exports: "PhoneInput, phoneInputVariants",
    description: "A telephone field with a country picker. The picker searches by country name, dial code and ISO code.",
    main: "phone-input/default",
    examples: [{ title: "With a Field", name: "phone-input/with-field", text: "`Field` labels the telephone input and shows its error." }],
    api: [{ name: "PhoneInputProps" }],
    a11y: [
      ["Country picker", "A combobox named \"Country code\". Works like Select: Enter or ArrowDown opens it, typing searches by name, dial code or ISO code, Enter selects, Escape closes."],
      ["Telephone input", "A native `type=\"tel\"` input. Name it with `Field` or `aria-label`."],
    ],
    aria: "The country picker is a combobox with a listbox, as in Select. The telephone input is a native input, so the Field label, description and error apply to it.",
  },
  {
    group: "Overlays", slug: "dialog", title: "Dialog", pkg: "dialog", exports: "Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose",
    description: "A modal dialog on the native `<dialog>` element. Focus moves in, Escape closes it, and focus returns to the trigger.",
    main: "dialog/default",
    examples: [
      { title: "Controlled", name: "dialog/controlled", text: "Controlled with `open` and `onOpenChange`. `closeOnOutsideClick={false}` keeps the dialog open on a backdrop click." },
      { title: "Sizes", name: "dialog/sizes", text: "`size` is `sm`, `md` or `lg`." },
    ],
    api: [
      { name: "DialogProps", label: "Dialog" },
      { name: "DialogTriggerProps", label: "DialogTrigger" },
      { name: "DialogContentProps", label: "DialogContent" },
      { name: "DialogCloseProps", label: "DialogClose" },
    ],
    a11y: [
      ["Enter, Space on the trigger", "Opens the dialog. Focus moves to the first focusable element inside."],
      ["Tab, Shift+Tab", "Cycle inside the dialog. Background content is inert."],
      ["Escape", "Closes the dialog and returns focus to the trigger."],
      ["Backdrop click", "Closes the dialog, unless `closeOnOutsideClick` is `false`."],
    ],
    aria: "The dialog is named by `DialogTitle` (`aria-labelledby`) and described by `DialogDescription` (`aria-describedby`). Always include a title.",
  },
  {
    group: "Overlays", slug: "popover", title: "Popover", pkg: "popover", exports: "Popover, PopoverTrigger, PopoverContent",
    description: "Floating content next to a trigger, for example a small form. Non-modal: focus moves in, but nothing is trapped.",
    main: "popover/default",
    examples: [],
    api: [
      { name: "PopoverProps", label: "Popover" },
      { name: "PopoverTriggerProps", label: "PopoverTrigger" },
      { name: "PopoverContentProps", label: "PopoverContent", file: "popover.tsx" },
    ],
    a11y: [
      ["Enter, Space on the trigger", "Opens the popover and moves focus to its first focusable element."],
      ["Click the trigger again", "Closes it. It does not reopen."],
      ["Escape", "Closes it and returns focus to the trigger."],
      ["Click outside", "Closes it (light dismiss)."],
    ],
    aria: "The trigger has `aria-haspopup=\"dialog\"` and `aria-expanded`. The content is `role=\"dialog\"`, named by its trigger unless you pass `aria-label` or `aria-labelledby`.",
  },
  {
    group: "Overlays", slug: "tooltip", title: "Tooltip", pkg: "tooltip", exports: "Tooltip",
    description: "A short description that appears on hover or keyboard focus. It stays open while the pointer is over it.",
    main: "tooltip/default",
    examples: [{ title: "Placement", name: "tooltip/placement", text: "`placement` takes `top`, `bottom`, `left` or `right`, with `-start` and `-end` variants. `arrow` adds a pointer." }],
    api: [{ name: "TooltipProps" }],
    a11y: [
      ["Hover", "Opens after `delayDuration` (500 ms by default). Touch input does not open it."],
      ["Keyboard focus", "Opens at once, on focus-visible only."],
      ["Escape", "Closes it."],
      ["Pointer moves onto the tooltip", "Stays open. It closes `closeDelay` (150 ms) after the pointer leaves both the trigger and the tooltip."],
    ],
    aria: "The trigger gets `aria-describedby` pointing at the tooltip, which has `role=\"tooltip\"`. Put the essential information in the visible text, not only in the tooltip, because touch users may not see it.",
  },
  {
    group: "Overlays", slug: "dropdown-menu", title: "Dropdown menu", pkg: "dropdown-menu", exports: "DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut",
    description: "A menu of actions, checkbox items and radio items, opened from a trigger.",
    main: "dropdown-menu/default",
    examples: [],
    api: [
      { name: "DropdownMenuProps", label: "DropdownMenu" },
      { name: "DropdownMenuTriggerProps", label: "DropdownMenuTrigger" },
      { name: "DropdownMenuContentProps", label: "DropdownMenuContent" },
      { name: "DropdownMenuItemProps", label: "DropdownMenuItem" },
      { name: "DropdownMenuCheckboxItemProps", label: "DropdownMenuCheckboxItem" },
      { name: "DropdownMenuRadioGroupProps", label: "DropdownMenuRadioGroup" },
      { name: "DropdownMenuRadioItemProps", label: "DropdownMenuRadioItem" },
    ],
    a11y: [
      ["Enter, Space, ArrowDown on the trigger", "Opens the menu and focuses the first item. ArrowUp focuses the last item."],
      ["Arrow keys, Home, End", "Move between items, looping at the ends. Disabled items are skipped."],
      ["Letters", "Typeahead."],
      ["Enter, Space on an item", "Runs `onSelect`, then closes. Checkbox and radio items stay open. Call `preventDefault()` in `onSelect` to keep the menu open."],
      ["Escape", "Closes and returns focus to the trigger."],
      ["Tab", "Closes the menu and moves focus on."],
      ["Pointer hover", "Moves focus to the hovered item."],
    ],
    aria: "The trigger has `aria-haspopup=\"menu\"` and `aria-expanded`. The content is `role=\"menu\"`, named by the trigger. Items are `menuitem`, `menuitemcheckbox` (with `aria-checked`) or `menuitemradio`.",
  },
  {
    group: "Feedback", slug: "alert", title: "Alert", pkg: "alert", exports: "Alert, AlertTitle, AlertDescription, AlertIcon, alertVariants",
    description: "A callout for information, success, warning or an error, with an icon.",
    main: "alert/default",
    examples: [{ title: "Variants", name: "alert/variants", text: "`info`, `success`, `warning` and `danger`. Warning and danger are announced at once." }],
    api: [{ name: "AlertProps" }],
    a11y: [
      ["default, info, success", "`role=\"status\"`: announced politely, after the current speech."],
      ["warning, danger", "`role=\"alert\"`: announced at once."],
      ["Icon", "Decorative. It is hidden from assistive technology, so the title carries the meaning."],
    ],
    aria: "Do not rely on colour alone: the icon and the title say what happened.",
  },
  {
    group: "Feedback", slug: "toast", title: "Toast", pkg: "toast", exports: "toast, Toaster",
    description: "Short, timed messages. Call `toast()` from anywhere, and mount `<Toaster />` once.",
    main: "toast/default",
    examples: [{ title: "Action", name: "toast/action", text: "`action` adds a button. A sticky toast (`duration: Infinity`) stays until it is closed." }],
    api: [
      { name: "ToastOptions", label: "toast(options)", file: "store.ts" },
      { name: "ToasterProps", label: "Toaster", file: "toaster.tsx" },
    ],
    a11y: [
      ["Default, success, info", "Announced politely through a live region (`role=\"status\"`)."],
      ["Warning, error", "Announced at once through `role=\"alert\"`."],
      ["Hover or focus inside the list", "Pauses the timer. It resumes when the pointer and focus leave."],
      ["Close button", "Named \"Close notification\". Dismisses the toast."],
      ["Action button", "Runs the action, then dismisses the toast unless `preventDefault()` is called."],
    ],
    aria: "The two live regions are always in the page, so screen readers pick up toasts reliably. A toast over an open dialog is still clickable: the Toaster moves into the dialog while one is open.",
  },
  {
    group: "Feedback", slug: "spinner", title: "Spinner", pkg: "spinner", exports: "Spinner, spinnerVariants",
    description: "A loading indicator with three sizes.",
    main: "spinner/default",
    examples: [],
    api: [{ name: "SpinnerProps" }],
    a11y: [["Screen readers", "`role=\"status\"` with an `aria-label` (default \"Loading\"). Change it to describe what is loading."]],
    aria: "Spinners need a label that says what is loading. Set `aria-label`, for example \"Saving changes\".",
  },
  {
    group: "Display", slug: "avatar", title: "Avatar", pkg: "avatar", exports: "Avatar, AvatarGroup, avatarVariants",
    description: "A user picture with initials as the fallback, and a stacked group with an overflow count.",
    main: "avatar/default",
    examples: [{ title: "Group", name: "avatar/group", text: "`AvatarGroup` stacks avatars and shows the rest as a count, set by `max`." }],
    api: [{ name: "AvatarProps" }, { name: "AvatarGroupProps" }],
    a11y: [
      ["Loaded image", "A real image with `alt` text."],
      ["Loading or failed image", "Shows the fallback (initials from `alt`). The wrapper is `role=\"img\"` named by `alt`."],
      ["Group", "`role=\"group\"`. The overflow count is `role=\"img\"` named \"N more\"."],
    ],
    aria: "Pass `alt` with the person's name, so the fallback is still named. The fallback initials are hidden from assistive technology.",
  },
  {
    group: "Display", slug: "badge", title: "Badge", pkg: "badge", exports: "Badge, badgeVariants",
    description: "A small label for a status or a count.",
    main: "badge/variants",
    examples: [],
    api: [{ name: "BadgeProps" }],
    a11y: [["Text", "Read as plain text. The optional dot is decorative and hidden."]],
    aria: "A badge is text. Add words that explain the status, such as \"3 unread\", not only a colour.",
  },
  {
    group: "Display", slug: "card", title: "Card", pkg: "card", exports: "Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter",
    description: "A surface that groups related content: header, body and footer.",
    main: "card/default",
    examples: [],
    api: [
      { name: "CardProps", label: "Card" },
      { name: "CardTitleProps", label: "CardTitle" },
    ],
    a11y: [["Structure", "No ARIA roles. `CardTitle` renders a heading; set `as` to choose the level (for example `h2`)."]],
    aria: "Use a heading level that fits the page outline. A card is not a landmark. Wrap a clickable card's content in a link rather than making the whole card a button.",
  },
  {
    group: "Display", slug: "skeleton", title: "Skeleton", pkg: "skeleton", exports: "Skeleton",
    description: "A placeholder shape shown while content loads.",
    main: "skeleton/default",
    examples: [],
    api: [{ name: "SkeletonProps" }],
    a11y: [["Screen readers", "`aria-hidden`. The skeleton is not announced."]],
    aria: "A skeleton is invisible to screen readers, so announce the loading state separately, for example with a `Spinner` that has an `aria-label`, or a visually hidden \"Loading\" text.",
  },
  {
    group: "Navigation", slug: "tabs", title: "Tabs", pkg: "tabs", exports: "Tabs, TabsList, TabsTrigger, TabsContent",
    description: "Switch between panels. Underline and pill variants, horizontal or vertical.",
    main: "tabs/default",
    examples: [{ title: "Pill, vertical", name: "tabs/pill-vertical", text: "`variant=\"pill\"` and `orientation=\"vertical\"`. Arrow keys follow the orientation." }],
    api: [
      { name: "TabsProps", label: "Tabs" },
      { name: "TabsListProps", label: "TabsList" },
      { name: "TabsTriggerProps", label: "TabsTrigger" },
      { name: "TabsContentProps", label: "TabsContent" },
    ],
    a11y: [
      ["Tab", "Enters the tab list on the selected tab. Only one tab is in the tab order."],
      ["Arrow keys (Left and Right, or Up and Down when vertical)", "Move to the next or previous tab, and select it. The list loops."],
      ["Home, End", "Move to the first or last enabled tab."],
      ["Disabled tab", "Skipped."],
    ],
    aria: "The list is `role=\"tablist\"` with `aria-orientation`. Each trigger is `role=\"tab\"` with `aria-selected` and `aria-controls`. The panel is `role=\"tabpanel\"`. If `value` matches no tab, the first enabled tab takes the tab stop.",
  },
  {
    group: "Navigation", slug: "accordion", title: "Accordion", pkg: "accordion", exports: "Accordion, AccordionItem, AccordionTrigger, AccordionContent",
    description: "Sections that open and close. Single or multiple open at once, optionally collapsible.",
    main: "accordion/single",
    examples: [{ title: "Multiple", name: "accordion/multiple", text: "`type=\"multiple\"` lets several items stay open." }],
    api: [
      { name: "AccordionProps", label: "Accordion" },
      { name: "AccordionItemProps", label: "AccordionItem" },
      { name: "AccordionTriggerProps", label: "AccordionTrigger" },
      { name: "AccordionContentProps", label: "AccordionContent" },
    ],
    a11y: [
      ["Enter, Space on a header", "Opens or closes the section. With `type=\"single\"` and not `collapsible`, the open section cannot be closed."],
      ["ArrowDown, ArrowUp, Home, End", "Move between headers. The list loops. Disabled headers are skipped."],
      ["Closed content", "Inert and hidden from assistive technology."],
    ],
    aria: "Each header is a button with `aria-expanded` and `aria-controls`. Each panel is `role=\"region\"` labelled by its header. `headingLevel` sets the heading tag around the button.",
  },
]

const utilities = [
  {
    slug: "slot", title: "Slot", pkg: "slot", exports: "Slot, composeRefs, mergeProps",
    description: "Renders its single child with the props, className, handlers and ref merged in. It is how `asChild` works.",
    main: "slot/default", examples: [],
    api: [{ name: "SlotProps" }],
    a11y: [["Handlers", "The child's handler runs first. The slot's handler runs unless the child calls `preventDefault()`."]],
    aria: "Slot adds no ARIA of its own. Attributes pass through, so the child's roles and labels are the ones that count.",
    extra: `## Merge rules

- **Handlers** (\`onClick\` and other \`on*\`): the child runs first, then the slot. If the child calls \`event.preventDefault()\`, the slot's handler does not run.
- **className**: \`cn(slot, child)\`, so the child's classes win on conflicts.
- **style**: shallow merge, the child wins.
- **Other props**: the child's defined values win. An \`undefined\` child prop does not erase a slot prop.
- **ref**: both refs are set, with \`composeRefs\`.
`,
  },
  {
    slug: "cn", title: "cn()", pkg: "utils", exports: "cn", file: "index.ts",
    description: "Joins class names and merges Tailwind classes, so the last conflicting class wins. It knows the GlobUI radius and shadow scales.",
    main: "cn/default", examples: [], api: [],
    a11y: [],
    aria: "",
    extra: `## Usage

\`\`\`ts
import { cn } from "@glob-ui/utils"

cn("rounded-glob-md p-2", isActive && "bg-glob-surface-hover", className)
\`\`\`

Falsy values are ignored. Without the GlobUI scales, \`rounded-glob-md\` and \`rounded-full\` would both survive; with them, the later one wins.
`,
  },
]

const pageMdx = (p) => {
  const lines = []
  lines.push("---", `title: ${JSON.stringify(p.title)}`, `description: ${JSON.stringify(p.description)}`, "---", "")
  lines.push(`<PackageInfo pkg="${p.pkg}" exports="${p.exports}" />`, "")
  lines.push("## Preview", "", `<ComponentPreview name="${p.main}" />`, "")
  if (p.examples && p.examples.length) {
    lines.push("## Examples", "")
    for (const ex of p.examples) {
      lines.push(`### ${ex.title}`, "", ex.text, "", `<ComponentPreview name="${ex.name}" />`, "")
    }
  }
  if (p.extra) lines.push(p.extra)
  if (p.api && p.api.length) {
    lines.push("## API", "")
    lines.push("Props are generated from the TypeScript types in the package source.", "")
    for (const part of p.api) {
      const label = part.label ?? part.name
      lines.push(`### ${label}`, "")
      lines.push(`<ApiTable pkg="${p.pkg}"${part.file ? ` file="${part.file}"` : ""} name="${part.name}" />`, "")
    }
  }
  if (p.a11y && p.a11y.length) {
    lines.push("## Accessibility", "", "| Key or action | Behaviour |", "| --- | --- |")
    for (const [key, action] of p.a11y) lines.push(`| ${key} | ${action} |`)
    lines.push("")
    if (p.aria) lines.push(`**ARIA.** ${p.aria}`, "")
  }
  return lines.join("\n")
}

mkdirSync(path.join(root, "components"), { recursive: true })
mkdirSync(path.join(root, "utilities"), { recursive: true })

for (const c of components) {
  writeFileSync(path.join(root, "components", `${c.slug}.mdx`), pageMdx(c))
}
for (const u of utilities) {
  writeFileSync(path.join(root, "utilities", `${u.slug}.mdx`), pageMdx(u))
}

// Sidebar: groups in the order the docs use. Separators come from the group names.
const groups = ["Forms", "Overlays", "Feedback", "Display", "Navigation"]
const pages = groups.flatMap((g) => [`---${g}---`, ...components.filter((c) => c.group === g).map((c) => c.slug)])
writeFileSync(path.join(root, "components", "meta.json"), JSON.stringify({ title: "Components", pages }, null, 2) + "\n")
writeFileSync(
  path.join(root, "utilities", "meta.json"),
  JSON.stringify({ title: "Utilities", pages: utilities.map((u) => u.slug) }, null, 2) + "\n"
)
console.log(`wrote ${components.length} component pages and ${utilities.length} utility pages`)
