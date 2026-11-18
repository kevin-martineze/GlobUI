<script lang="ts">
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@glob-ui/svelte/command"
</script>

{#snippet icon()}
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 shrink-0 text-glob-text-secondary">
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
{/snippet}

<Command class="w-full max-w-sm overflow-hidden rounded-glob-lg border border-glob-border bg-glob-surface shadow-glob-md">
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem value="Create new file">{@render icon()}Create new file<CommandShortcut>⌘N</CommandShortcut></CommandItem>
      <CommandItem value="Open calendar" keywords={["events", "schedule"]}>{@render icon()}Open calendar</CommandItem>
      <CommandItem value="Archive project" disabled>{@render icon()}Archive project</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem value="Profile" keywords={["account"]}>{@render icon()}Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>
      <CommandItem value="Dark mode" keywords={["theme", "appearance"]}>{@render icon()}Dark mode<CommandShortcut>⌘D</CommandShortcut></CommandItem>
    </CommandGroup>
  </CommandList>
  <CommandEmpty>No commands match.</CommandEmpty>
</Command>
