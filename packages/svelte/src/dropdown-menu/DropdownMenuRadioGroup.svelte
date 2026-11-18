<script lang="ts">
  import { setContext } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { MENU_RADIO_GROUP_KEY, type MenuRadioGroupContext } from "../shared/context"

  type Props = HTMLAttributes<HTMLDivElement> & {
    /** Bind it with `bind:value`, or leave it unset and use `defaultValue`. */
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
  }
  let { value = $bindable(undefined), defaultValue, onValueChange, children, ...rest }: Props = $props()

  // svelte-ignore state_referenced_locally
  let internal = $state(defaultValue)
  const current = $derived(value ?? internal)

  const ctx: MenuRadioGroupContext = {
    get value() {
      return current
    },
    setValue(next) {
      if (next === current) return
      if (value === undefined) internal = next
      else value = next
      onValueChange?.(next)
    },
  }
  setContext(MENU_RADIO_GROUP_KEY, ctx)
</script>

<div role="group" {...rest}>{@render children?.()}</div>
