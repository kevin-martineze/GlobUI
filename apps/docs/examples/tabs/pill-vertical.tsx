import { Tabs, TabsContent, TabsList, TabsTrigger } from "@glob-ui/tabs"

export default function TabsPillVertical() {
  return (
    <Tabs defaultValue="general" orientation="vertical" variant="pill" className="flex w-full max-w-md gap-4">
      <TabsList aria-label="Sections">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="text-sm">
        General settings.
      </TabsContent>
      <TabsContent value="security" className="text-sm">
        Security settings.
      </TabsContent>
    </Tabs>
  )
}
