<script lang="ts">
  import { mount, onMount, unmount } from "svelte"
  import ToasterView from "./ToasterView.svelte"
  import type { ToasterPosition } from "./types"

  let {
    position = "bottom-right",
    max = 3,
    closeLabel = "Close notification",
    label = "Notifications",
    class: className,
  }: {
    position?: ToasterPosition
    /** Toasts on screen at once. The rest wait in a queue. */
    max?: number
    /** Accessible name of each toast's close button. */
    closeLabel?: string
    /** Accessible name of the notification list. */
    label?: string
    class?: string
  } = $props()

  // The view is mounted into a host node of its own, which moves between <body> and the topmost modal dialog
  // (everything outside a modal dialog is inert). Svelte only owns the host's children, as with React's portal.
  // Mounted on the client only: the server renders nothing here.
  // svelte-ignore state_referenced_locally
  const viewProps = $state({ position, max, closeLabel, label, className, host: null as HTMLElement | null })
  $effect.pre(() => {
    viewProps.position = position
    viewProps.max = max
    viewProps.closeLabel = closeLabel
    viewProps.label = label
    viewProps.className = className
  })

  onMount(() => {
    const host = document.createElement("div")
    host.dataset.globToaster = ""
    host.style.display = "contents"
    document.body.appendChild(host)
    viewProps.host = host
    const view = mount(ToasterView, { target: host, props: viewProps })
    return () => {
      void unmount(view)
      host.remove()
    }
  })
</script>
