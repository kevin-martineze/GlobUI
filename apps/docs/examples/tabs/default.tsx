import { Tabs, TabsContent, TabsList, TabsTrigger } from "@glob-ui/tabs"

export default function TabsDefault() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 text-sm">
        Change your name and email.
      </TabsContent>
      <TabsContent value="password" className="p-4 text-sm">
        Choose a new password.
      </TabsContent>
    </Tabs>
  )
}
