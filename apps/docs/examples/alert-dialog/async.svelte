<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@glob-ui/svelte/alert-dialog"

  let open = $state(false)
  let busy = $state(false)
</script>

<AlertDialog
  {open}
  onOpenChange={(next) => {
    if (!busy) open = next
  }}
>
  <AlertDialogTrigger>
    {#snippet child(props)}<Button variant="outline" {...props}>Publish page</Button>{/snippet}
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Publish this page?</AlertDialogTitle>
    <AlertDialogDescription>It goes live for everyone with the link.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        disabled={busy}
        onclick={(e) => {
          // Keep the dialog open while the work runs, then close it.
          e.preventDefault()
          busy = true
          window.setTimeout(() => {
            busy = false
            open = false
          }, 1000)
        }}
      >
        {busy ? "Publishing..." : "Publish"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
