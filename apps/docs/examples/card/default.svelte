<script lang="ts">
  import { Button } from "@glob-ui/svelte/button"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@glob-ui/svelte/card"
</script>

<Card class="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy your app in one click.</CardDescription>
  </CardHeader>
  <CardContent>Choose a region and a plan. You can change both later.</CardContent>
  <CardFooter class="justify-end gap-2">
    <Button variant="ghost">Cancel</Button>
    <Button>Create</Button>
  </CardFooter>
</Card>
