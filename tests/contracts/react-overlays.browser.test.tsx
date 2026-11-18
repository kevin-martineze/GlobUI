// The React render adapter for the phase 10d-2 contracts: overlays.
import { useState } from "react"
import { render } from "vitest-browser-react"
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
} from "@glob-ui/alert-dialog"
import { Button } from "@glob-ui/button"
import { Combobox } from "@glob-ui/combobox"
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
} from "@glob-ui/command"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@glob-ui/dialog"
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
} from "@glob-ui/dropdown-menu"
import { Field } from "@glob-ui/field"
import { MultiSelect } from "@glob-ui/multi-select"
import { Popover, PopoverContent, PopoverTrigger } from "@glob-ui/popover"
import { Select } from "@glob-ui/select"
import { Toaster, toast } from "@glob-ui/toast"
import { Tooltip } from "@glob-ui/tooltip"
import { overlaysParityContract } from "./overlays-parity.contract"
import { overlaysContract } from "./overlays.contract"
import type { ContractToast, OverlayOption, OverlaysAdapter } from "./types"

const GALLERY_OPTIONS: OverlayOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana", disabled: true },
  { value: "pear", label: "Pear" },
]
const MANY_OPTIONS: OverlayOption[] = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"].map((label) => ({
  value: label.toLowerCase(),
  label,
}))

/** The parity gallery. The Svelte gallery (svelte/OverlaysGallery.svelte) renders the same components and props. */
function OverlaysGallery() {
  return (
    <div data-testid="overlays-gallery">
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <button>Apply</button>
        </PopoverContent>
      </Popover>
      <Popover placement="top">
        <PopoverTrigger asChild>
          <Button variant="outline">Filters</Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">Body</PopoverContent>
      </Popover>
      <Tooltip content="Save file">
        <button>Save</button>
      </Tooltip>
      <Tooltip content="With arrow" arrow>
        <Button size="sm">Arrow</Button>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuLabel inset>Inset</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
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
            <CommandItem value="Home">
              Home <CommandShortcut>⌘H</CommandShortcut>
            </CommandItem>
            <CommandItem value="Settings" disabled>
              Settings
            </CommandItem>
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
  )
}

function ComboboxFixture(f: Parameters<OverlaysAdapter["combobox"]>[0]) {
  const [value, setValue] = useState<string | null>(f.defaultValue ?? null)
  return (
    <Field label="Framework">
      <Combobox
        options={f.options}
        value={value}
        onChange={(v) => {
          setValue(v)
          f.onChange?.(v)
        }}
        allowCustomValue={f.allowCustomValue}
        loading={f.loading}
      />
    </Field>
  )
}

const react: OverlaysAdapter = {
  name: "react",
  toast: toast as unknown as ContractToast,
  async overlaysGallery() {
    await render(<OverlaysGallery />)
  },
  async popover(f) {
    if (f.autofocus) {
      await render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent>
            <button>First</button>
            <button data-autofocus>Chosen</button>
          </PopoverContent>
        </Popover>
      )
      return
    }
    await render(
      <div>
        <Popover onOpenChange={f.onOpenChange}>
          <PopoverTrigger asChild>
            <Button>Filters</Button>
          </PopoverTrigger>
          <PopoverContent>
            <button>Apply</button>
          </PopoverContent>
        </Popover>
        <p>Outside text</p>
      </div>
    )
  },
  async tooltip(f) {
    await render(
      <div>
        <Tooltip content={f.content}>
          <Button>{f.label}</Button>
        </Tooltip>
        <p>Elsewhere</p>
      </div>
    )
  },
  async dropdownMenu(f) {
    await render(
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => f.onSelect?.("Profile")}>
              Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => f.onSelect?.("Billing")}>Billing</DropdownMenuItem>
            <DropdownMenuItem disabled onSelect={() => f.onSelect?.("Disabled")}>
              Disabled item
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                if (f.keepOpen) e.preventDefault()
                f.onSelect?.("Keep")
              }}
            >
              Keep open
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem onCheckedChange={f.onCheckedChange}>Status bar</DropdownMenuCheckboxItem>
            <DropdownMenuRadioGroup defaultValue="system" onValueChange={f.onRadio}>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger" onSelect={() => f.onSelect?.("Delete")}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button>After</button>
      </div>
    )
  },
  async alertDialog(f) {
    await render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="danger">Delete account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger" // The synthetic event: its preventDefault is the one AlertDialogAction checks.
              onClick={(e) => f.onConfirm?.(e as unknown as MouseEvent)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
  async toaster(f) {
    if (f.inDialog) {
      const { onSave } = f.inDialog
      await render(
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Settings</DialogTitle>
              <Button onClick={onSave}>Save draft</Button>
            </DialogContent>
          </Dialog>
          <Toaster />
        </div>
      )
      return
    }
    await render(<Toaster max={f.max} position={f.position} />)
  },
  async select(f) {
    const control = <Select options={f.options} defaultValue={f.defaultValue} onChange={f.onChange} name={f.name} aria-label="Fruit" />
    if (f.inForm) await render(<form onSubmit={(e) => e.preventDefault()}>{control}</form>)
    else if (f.withNext)
      await render(
        <div>
          {control}
          <button>Next</button>
        </div>
      )
    else await render(control)
  },
  async combobox(f) {
    await render(<ComboboxFixture {...f} />)
  },
  async multiSelect(f) {
    const control = (
      <MultiSelect options={f.options} defaultValue={f.defaultValue} onChange={f.onChange} max={f.max} name={f.name} aria-label="Tags" />
    )
    if (f.inForm) await render(<form onSubmit={(e) => e.preventDefault()}>{control}</form>)
    else if (f.withNext)
      await render(
        <div>
          {control}
          <button>Next</button>
        </div>
      )
    else await render(control)
  },
  async command(f) {
    await render(
      <Command label="Command menu" filter={f.filter}>
        <CommandInput placeholder="Type a command" />
        <CommandList>
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="Calendar" keywords={["events", "schedule"]} onSelect={f.onSelect}>
              Calendar <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem value="Canción" onSelect={f.onSelect}>
              Canción
            </CommandItem>
            <CommandItem value="Archive" disabled onSelect={f.onSelect}>
              Archive
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem value="Theme" keywords={["dark mode"]} onSelect={f.onSelect}>
              Theme
            </CommandItem>
            <CommandItem value="Profile" onSelect={f.onSelect}>
              Profile
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )
  },
  async commandDialog(f) {
    await render(
      <>
        {f.withField && <input aria-label="Other field" />}
        <Button variant="outline">Open</Button>
        <CommandDialog shortcut={f.shortcut} closeOnSelect={f.closeOnSelect}>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem value="Open docs" onSelect={f.onSelect}>
              Open docs
            </CommandItem>
            <CommandItem value="Toggle theme" onSelect={f.onSelect}>
              Toggle theme
            </CommandItem>
          </CommandList>
        </CommandDialog>
      </>
    )
  },
}

overlaysParityContract(react)
overlaysContract(react)
