import { describe, expect, it } from "vitest"
import { renderToString } from "react-dom/server"
import { Alert, AlertTitle, AlertDescription } from "@glob-ui/alert"
import { Badge } from "@glob-ui/badge"
import { Button } from "@glob-ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@glob-ui/card"
import { Field } from "@glob-ui/field"
import { Input } from "@glob-ui/input"
import { Label } from "@glob-ui/label"
import { Skeleton } from "@glob-ui/skeleton"
import { Spinner } from "@glob-ui/spinner"
import { toast } from "@glob-ui/toast"

// Server-safe components must render with renderToString (no window, no document).
describe("SSR smoke", () => {
  it("renders Badge, Spinner and Skeleton", () => {
    expect(() => renderToString(<Badge variant="success">Live</Badge>)).not.toThrow()
    expect(renderToString(<Spinner />)).toContain("svg")
    expect(renderToString(<Skeleton className="h-4 w-20" />)).toBeTruthy()
  })

  it("renders Alert and Card", () => {
    const html = renderToString(
      <Alert variant="warning">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Body</AlertDescription>
      </Alert>
    )
    expect(html).toContain("Heads up")
    expect(
      renderToString(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Body</CardContent>
        </Card>
      )
    ).toContain("Title")
  })

  it("renders Slot with Button asChild as the child element", () => {
    const html = renderToString(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    )
    expect(html).toMatch(/^<a[^>]*href="\/docs"/)
    expect(html).not.toContain("<button")
  })

  it("renders Field with Input and Label", () => {
    const html = renderToString(
      <Field label="Email" description="Work address">
        <Input type="email" />
      </Field>
    )
    expect(html).toContain("Email")
    expect(html).toContain('type="email"')
    expect(renderToString(<Label htmlFor="x">Name</Label>)).toContain("Name")
  })

  it("calls toast() without throwing on the server", () => {
    expect(typeof toast("from SSR")).toBe("string")
    expect(() => toast.success("ok")).not.toThrow()
  })
})
