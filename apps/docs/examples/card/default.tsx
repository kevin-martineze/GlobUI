import { Button } from "@glob-ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@glob-ui/card"

export default function CardDefault() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your app in one click.</CardDescription>
      </CardHeader>
      <CardContent>Choose a region and a plan. You can change both later.</CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  )
}
