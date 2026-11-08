import { Button } from "@glob-ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild variant="outline">
      <a href="/docs/installation">Read the installation guide</a>
    </Button>
  )
}
