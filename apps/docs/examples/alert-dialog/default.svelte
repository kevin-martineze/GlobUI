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
</script>

<AlertDialog>
  <AlertDialogTrigger>
    {#snippet child(props)}<Button variant="danger" {...props}>Delete account</Button>{/snippet}
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
    <AlertDialogDescription>Your projects and files are removed for good. This cannot be undone.</AlertDialogDescription>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="danger">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
