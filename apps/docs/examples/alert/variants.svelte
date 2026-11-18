<script lang="ts">
  import { Alert, AlertDescription, AlertTitle } from "@glob-ui/svelte/alert"
</script>

<div class="flex w-full max-w-md flex-col gap-3">
  <Alert variant="info">
    <AlertTitle>Info</AlertTitle>
    <AlertDescription>A new version is available.</AlertDescription>
  </Alert>
  <Alert variant="success">
    <AlertTitle>Saved</AlertTitle>
    <AlertDescription>Your changes are live.</AlertDescription>
  </Alert>
  <Alert variant="warning">
    <AlertTitle>Storage almost full</AlertTitle>
    <AlertDescription>92% of your quota is used.</AlertDescription>
  </Alert>
  <Alert variant="danger">
    <AlertTitle>Upload failed</AlertTitle>
    <AlertDescription>The file is larger than 10 MB.</AlertDescription>
  </Alert>
</div>
