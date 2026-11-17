<script lang="ts">
  import { setContext } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { avatarVariants, AVATAR_GROUP_CLASSES, AVATAR_GROUP_OVERLAP, AVATAR_GROUP_RING_CLASSES } from "@glob-ui/recipes"
  import { AVATAR_GROUP_KEY, type AvatarGroupContext, type AvatarShape, type AvatarSize } from "../shared/context"

  type Props = HTMLAttributes<HTMLDivElement> & {
    /** Avatars shown before collapsing the rest into "+N". */
    max?: number
    size?: AvatarSize
    shape?: AvatarShape
  }
  let { max, size, shape, class: className, children, ...rest }: Props = $props()

  // The avatars register in document order, so their index decides which ones show.
  let ids = $state<string[]>([])
  const limit = $derived(max === undefined ? Infinity : Math.max(0, max))
  const extra = $derived(Math.max(0, ids.length - limit))

  setContext<AvatarGroupContext>(AVATAR_GROUP_KEY, {
    get size() {
      return size
    },
    get shape() {
      return shape
    },
    register(id: string) {
      ids.push(id)
    },
    unregister(id: string) {
      ids = ids.filter((other) => other !== id)
    },
    isVisible(id: string) {
      return ids.indexOf(id) < limit
    },
  })
</script>

<div role="group" class={cn(AVATAR_GROUP_CLASSES, AVATAR_GROUP_OVERLAP[size ?? "md"], className)} {...rest}>
  {@render children?.()}
  {#if extra > 0}
    <span role="img" aria-label={`${extra} more`} class={cn(avatarVariants({ size, shape }), AVATAR_GROUP_RING_CLASSES)}>
      <span aria-hidden="true">+{extra}</span>
    </span>
  {/if}
</div>
