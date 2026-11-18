<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
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
  } from "@glob-ui/svelte/dropdown-menu"

  let statusBar = $state(true)
  let theme = $state("system")
  let last = $state("none")
</script>

<div class="flex flex-col items-center gap-3">
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child(props)}<Button variant="outline" {...props}>Actions</Button>{/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>My account</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => (last = "profile")}>
        Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => (last = "billing")}>Billing</DropdownMenuItem>
      <DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem bind:checked={statusBar}>Status bar</DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup bind:value={theme}>
        <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="danger" onSelect={() => (last = "delete")}>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <p class="text-sm text-fd-muted-foreground">
    Last action: {last} · Theme: {theme}
  </p>
</div>
