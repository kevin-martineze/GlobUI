<script lang="ts">
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { buttonVariants } from "@glob-ui/recipes"
  import DialogClose from "../dialog/DialogClose.svelte"

  let {
    class: className,
    variant = "primary",
    children,
    ...rest
  }: HTMLButtonAttributes & {
    /** `danger` for destructive actions (delete, remove, revoke). */
    variant?: "primary" | "danger"
    children?: Snippet
  } = $props()
</script>

<!-- Confirms and closes. Call `event.preventDefault()` in onclick to keep it open, for example while an async action runs. -->
<DialogClose class={cn(buttonVariants({ variant }), className)} {...rest}>{@render children?.()}</DialogClose>
