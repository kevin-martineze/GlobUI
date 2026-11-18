<script lang="ts">
  // One fixture per adapter method of the 10d-2 contracts, chosen by `kind`. `props` is the contract's fixture object.
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
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
  import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../../packages/svelte/src/dialog"
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
  import { Field } from "../../../packages/svelte/src/field"
  import { MultiSelect } from "../../../packages/svelte/src/multi-select"
  import { Popover, PopoverContent, PopoverTrigger } from "../../../packages/svelte/src/popover"
  import { Select } from "../../../packages/svelte/src/select"
  import { Toaster } from "../../../packages/svelte/src/toast"
  import { Tooltip } from "../../../packages/svelte/src/tooltip"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let { kind, props }: { kind: string; props: any } = $props()

  // The combobox keeps its value here, as the React fixture does with useState.
  // svelte-ignore state_referenced_locally
  let comboValue = $state<string | null>(props?.defaultValue ?? null)
</script>

{#if kind === "popover"}
  {#if props.autofocus}
    <Popover defaultOpen>
      <PopoverTrigger>
        {#snippet child(attrs)}<Button {...attrs}>Open</Button>{/snippet}
      </PopoverTrigger>
      <PopoverContent>
        <button>First</button>
        <button data-autofocus>Chosen</button>
      </PopoverContent>
    </Popover>
  {:else}
    <div>
      <Popover onOpenChange={props.onOpenChange}>
        <PopoverTrigger>
          {#snippet child(attrs)}<Button {...attrs}>Filters</Button>{/snippet}
        </PopoverTrigger>
        <PopoverContent><button>Apply</button></PopoverContent>
      </Popover>
      <p>Outside text</p>
    </div>
  {/if}
{:else if kind === "tooltip"}
  <div>
    <Tooltip content={props.content}>
      {#snippet child(attrs)}<Button {...attrs}>{props.label}</Button>{/snippet}
    </Tooltip>
    <p>Elsewhere</p>
  </div>
{:else if kind === "dropdownMenu"}
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet child(attrs)}<Button {...attrs}>Actions</Button>{/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => props.onSelect?.("Profile")}>
          Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => props.onSelect?.("Billing")}>Billing</DropdownMenuItem>
        <DropdownMenuItem disabled onSelect={() => props.onSelect?.("Disabled")}>Disabled item</DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => {
            if (props.keepOpen) e.preventDefault()
            props.onSelect?.("Keep")
          }}
        >
          Keep open
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem onCheckedChange={props.onCheckedChange}>Status bar</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup defaultValue="system" onValueChange={props.onRadio}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger" onSelect={() => props.onSelect?.("Delete")}>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <button>After</button>
  </div>
{:else if kind === "alertDialog"}
  <AlertDialog>
    <AlertDialogTrigger>
      {#snippet child(attrs)}<Button variant="danger" {...attrs}>Delete account</Button>{/snippet}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction variant="danger" onclick={(e) => props.onConfirm?.(e)}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
{:else if kind === "toaster"}
  {#if props.inDialog}
    <div>
      <Dialog>
        <DialogTrigger>
          {#snippet child(attrs)}<Button {...attrs}>Open dialog</Button>{/snippet}
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <Button onclick={props.inDialog.onSave}>Save draft</Button>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  {:else}
    <Toaster max={props.max} position={props.position} />
  {/if}
{:else if kind === "select"}
  {#snippet select()}
    <Select options={props.options} defaultValue={props.defaultValue} onChange={props.onChange} name={props.name} aria-label="Fruit" />
  {/snippet}
  {#if props.inForm}
    <form onsubmit={(e) => e.preventDefault()}>{@render select()}</form>
  {:else if props.withNext}
    <div>{@render select()}<button>Next</button></div>
  {:else}
    {@render select()}
  {/if}
{:else if kind === "combobox"}
  <Field label="Framework">
    <Combobox
      options={props.options}
      bind:value={comboValue}
      onChange={props.onChange}
      allowCustomValue={props.allowCustomValue}
      loading={props.loading}
    />
  </Field>
{:else if kind === "multiSelect"}
  {#snippet multi()}
    <MultiSelect
      options={props.options}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
      max={props.max}
      name={props.name}
      aria-label="Tags"
    />
  {/snippet}
  {#if props.inForm}
    <form onsubmit={(e) => e.preventDefault()}>{@render multi()}</form>
  {:else if props.withNext}
    <div>{@render multi()}<button>Next</button></div>
  {:else}
    {@render multi()}
  {/if}
{:else if kind === "command"}
  <Command label="Command menu" filter={props.filter}>
    <CommandInput placeholder="Type a command" />
    <CommandList>
      <CommandEmpty>Nothing found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem value="Calendar" keywords={["events", "schedule"]} onSelect={props.onSelect}>
          Calendar <CommandShortcut>⌘C</CommandShortcut>
        </CommandItem>
        <CommandItem value="Canción" onSelect={props.onSelect}>Canción</CommandItem>
        <CommandItem value="Archive" disabled onSelect={props.onSelect}>Archive</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem value="Theme" keywords={["dark mode"]} onSelect={props.onSelect}>Theme</CommandItem>
        <CommandItem value="Profile" onSelect={props.onSelect}>Profile</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
{:else if kind === "commandDialog"}
  {#if props.withField}<input aria-label="Other field" />{/if}
  <Button variant="outline">Open</Button>
  <CommandDialog shortcut={props.shortcut} closeOnSelect={props.closeOnSelect}>
    <CommandInput placeholder="Search" />
    <CommandList>
      <CommandItem value="Open docs" onSelect={props.onSelect}>Open docs</CommandItem>
      <CommandItem value="Toggle theme" onSelect={props.onSelect}>Toggle theme</CommandItem>
    </CommandList>
  </CommandDialog>
{/if}
