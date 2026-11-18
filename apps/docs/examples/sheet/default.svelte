<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Field } from "@glob-ui/svelte/field"
  import { Input } from "@glob-ui/svelte/input"
  import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@glob-ui/svelte/sheet"

  let name = $state("Ana")
</script>

<Sheet>
  <SheetTrigger>
    {#snippet child(props)}<Button variant="outline" {...props}>Settings</Button>{/snippet}
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Changes apply to your account.</SheetDescription>
    </SheetHeader>
    <Field label="Display name">
      <Input bind:value={name} />
    </Field>
    <SheetFooter>
      <SheetClose>
        {#snippet child(props)}<Button variant="ghost" {...props}>Cancel</Button>{/snippet}
      </SheetClose>
      <SheetClose>
        {#snippet child(props)}<Button {...props}>Save</Button>{/snippet}
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
