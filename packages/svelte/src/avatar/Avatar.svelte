<script lang="ts">
  import { onDestroy, type Snippet } from "svelte"
  import type { HTMLAttributes } from "svelte/elements"
  import { cn } from "@glob-ui/utils"
  import { avatarVariants, AVATAR_FALLBACK_CLASSES, AVATAR_GROUP_RING_CLASSES, AVATAR_IMAGE_CLASSES } from "@glob-ui/recipes"
  import { getAvatarGroupContext, type AvatarShape, type AvatarSize } from "../shared/context"

  type Props = HTMLAttributes<HTMLSpanElement> & {
    src?: string
    alt?: string
    /** Shown while the image loads or after it fails. Defaults to initials from `alt`. */
    fallback?: string | Snippet
    size?: AvatarSize
    shape?: AvatarShape
  }
  let { src, alt, fallback, size, shape, class: className, ...rest }: Props = $props()

  function getInitials(name?: string) {
    const words = name?.trim().split(/\s+/).filter(Boolean) ?? []
    if (words.length === 0) return null
    const first = words[0][0]
    const last = words.length > 1 ? words[words.length - 1][0] : ""
    return (first + last).toUpperCase()
  }

  // The load result is kept per src, so a new src starts over without an effect. Each event records the src of
  // the image that fired it: a late error from the previous image must not mark the new src as failed.
  let loadedSrc = $state<string | undefined>(undefined)
  let failedSrc = $state<string | undefined>(undefined)
  const status = $derived(!src || failedSrc === src ? "error" : loadedSrc === src ? "loaded" : "loading")
  const loaded = $derived(status === "loaded")
  const initials = $derived(getInitials(alt))

  /** The image can finish before the load listener is attached (a cached image, hydration): check it on mount. */
  function checkComplete(img: HTMLImageElement) {
    const current = img.getAttribute("src") ?? undefined
    if (img.complete && current) {
      if (img.naturalWidth > 0) loadedSrc = current
      else failedSrc = current
    }
  }

  // Inside an AvatarGroup: take its size, shape and ring, and hide past `max`.
  const group = getAvatarGroupContext()
  const id = $props.id()
  if (group) {
    group.register(id)
    onDestroy(() => group.unregister(id))
  }
  const visible = $derived(!group || group.isVisible(id))
  const classes = $derived(
    cn(
      avatarVariants({
        size: size ?? group?.size,
        shape: shape ?? group?.shape,
        className: group ? cn(AVATAR_GROUP_RING_CLASSES, className) : className,
      })
    )
  )
</script>

{#if visible}
  <!-- While the fallback shows, the wrapper carries the name; the img is hidden from AT. -->
  <span role={!loaded && alt ? "img" : undefined} aria-label={!loaded && alt ? alt : undefined} class={classes} {...rest}>
    {#if src && status !== "error"}
      {#key src}
        <img
          {src}
          alt={loaded ? (alt ?? "") : ""}
          aria-hidden={loaded ? undefined : true}
          use:checkComplete
          onload={(event) => (loadedSrc = event.currentTarget.getAttribute("src") ?? undefined)}
          onerror={(event) => (failedSrc = event.currentTarget.getAttribute("src") ?? undefined)}
          class={cn(AVATAR_IMAGE_CLASSES, !loaded && "opacity-0")}
        />
      {/key}
    {/if}
    {#if !loaded}
      <span aria-hidden="true" class={AVATAR_FALLBACK_CLASSES}>
        {#if typeof fallback === "function"}
          {@render fallback()}
        {:else if fallback}
          {fallback}
        {:else if initials}
          {initials}
        {:else}
          <svg viewBox="0 0 24 24" fill="currentColor" class="h-3/5 w-3/5">
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
          </svg>
        {/if}
      </span>
    {/if}
  </span>
{/if}
