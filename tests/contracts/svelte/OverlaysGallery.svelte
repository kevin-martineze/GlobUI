<script lang="ts">
  // The Svelte parity gallery: the same components and props as the React gallery in react-overlays.browser.test.tsx.
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../../../packages/svelte/src/alert-dialog"
  import { Button } from "../../../packages/svelte/src/button"
  import { Combobox } from "../../../packages/svelte/src/combobox"
  import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "../../../packages/svelte/src/command"
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "../../../packages/svelte/src/dropdown-menu"
  import { MultiSelect } from "../../../packages/svelte/src/multi-select"
  import { Popover, PopoverContent, PopoverTrigger } from "../../../packages/svelte/src/popover"
  import { Select } from "../../../packages/svelte/src/select"
  import { Tooltip } from "../../../packages/svelte/src/tooltip"

  const GALLERY_OPTIONS = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana", disabled: true },
    { value: "pear", label: "Pear" },
  ]
  const MANY_OPTIONS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"].map((label) => ({
    value: label.toLowerCase(),
    label,
  }))
</script>

<div data-testid="overlays-gallery">
  <Popover>
    <PopoverTrigger>Open</PopoverTrigger>
    <PopoverContent><button>Apply</button></PopoverContent>
  </Popover>
  <Popover placement="top">
    <PopoverTrigger>
      {#snippet child(props)}<Button variant="outline" {...props}>Filters</Button>{/snippet}
    </PopoverTrigger>
    <PopoverContent class="w-64">Body</PopoverContent>
  </Popover>
  <Tooltip content="Save file">
    {#snippet child(props)}<button {...props}>Save</button>{/snippet}
  </Tooltip>
  <Tooltip content="With arrow" arrow>
    {#snippet child(props)}<Button size="sm" {...props}>Arrow</Button>{/snippet}
  </Tooltip>
  <DropdownMenu>
    <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuLabel inset>Inset</DropdownMenuLabel>
      <DropdownMenuItem>Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
      <DropdownMenuItem inset>Billing</DropdownMenuItem>
      <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
      <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem defaultChecked>Status bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem>Panel</DropdownMenuCheckboxItem>
      <DropdownMenuRadioGroup defaultValue="a">
        <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  <AlertDialog>
    <AlertDialogTrigger>Delete</AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Sure?</AlertDialogTitle>
        <AlertDialogDescription>Cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="danger">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <Select aria-label="Fruit" options={GALLERY_OPTIONS} defaultValue="apple" />
  <Select aria-label="Size" options={GALLERY_OPTIONS} size="sm" variant="ghost" />
  <Select aria-label="Many" options={MANY_OPTIONS} name="many" />
  <Combobox aria-label="City" options={[...GALLERY_OPTIONS, { value: "fig", label: "Fig", description: "Sweet" }]} defaultValue="pear" name="city" />
  <Combobox aria-label="Town" options={GALLERY_OPTIONS} size="sm" disabled />
  <MultiSelect aria-label="Tags" options={GALLERY_OPTIONS} defaultValue={["apple", "pear"]} size="sm" name="tags" />
  <MultiSelect aria-label="Many tags" options={MANY_OPTIONS} max={2} />
  <Command label="Commands">
    <CommandInput placeholder="Search" />
    <CommandList>
      <CommandGroup heading="Pages">
        <CommandItem value="Home">Home <CommandShortcut>⌘H</CommandShortcut></CommandItem>
        <CommandItem value="Settings" disabled>Settings</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup>
        <CommandItem value="New file">New file</CommandItem>
      </CommandGroup>
    </CommandList>
    <CommandEmpty />
  </Command>
  <CommandDialog shortcut={false}>
    <CommandInput />
    <CommandList>
      <CommandItem value="Docs">Docs</CommandItem>
    </CommandList>
  </CommandDialog>
</div>
