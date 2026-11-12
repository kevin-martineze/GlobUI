<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import DialogFooter from "../dialog/DialogFooter.svelte"
  let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props()
</script>

<DialogFooter class={cn("mt-auto", className)} {...rest}>{@render children?.()}</DialogFooter>
