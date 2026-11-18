import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { FrameworkCode } from "@/components/code-tabs"
import { registry } from "@/examples/registry"

/**
 * Renders a registered example live, and shows its exact source file in a Code tab.
 * The source is read from examples/<name>.tsx at build time, so it cannot drift from the preview. When
 * examples/<name>.svelte exists, the Code tab also has the Svelte version (see tests/docs-examples).
 */
export function ComponentPreview({ name }: { name: string }) {
  const Example = registry[name]
  if (!Example) {
    throw new Error(`ComponentPreview: "${name}" is not in examples/registry.ts`)
  }
  const code = readFileSync(path.resolve(process.cwd(), "examples", `${name}.tsx`), "utf8")
  const svelteFile = path.resolve(process.cwd(), "examples", `${name}.svelte`)
  const svelteCode = existsSync(svelteFile) ? readFileSync(svelteFile, "utf8") : null

  return (
    <Tabs items={["Preview", "Code"]} defaultValue="preview" className="my-4">
      <Tab value="Preview">
        <div className="not-prose flex min-h-40 flex-wrap items-center justify-center gap-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-background p-6">
          <Example />
        </div>
      </Tab>
      <Tab value="Code">
        <FrameworkCode react={code} svelte={svelteCode} />
      </Tab>
    </Tabs>
  )
}
