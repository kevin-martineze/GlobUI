import Link from "next/link"
import { Button } from "@glob-ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild variant="outline">
      <Link href="/docs/installation">Read the installation guide</Link>
    </Button>
  )
}
