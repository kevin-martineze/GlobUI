<script lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@glob-ui/svelte/tabs"
</script>

<Tabs defaultValue="general" orientation="vertical" variant="pill" class="flex w-full max-w-md gap-4">
  <TabsList aria-label="Sections">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="general" class="text-sm">General settings.</TabsContent>
  <TabsContent value="security" class="text-sm">Security settings.</TabsContent>
</Tabs>
