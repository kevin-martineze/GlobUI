import { readFileSync } from "node:fs"
import path from "node:path"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { registry } from "@/examples/registry"

/**
 * Renders a registered example live, and shows its exact source file in a Code tab.
 * The source is read from examples/<name>.tsx at build time, so it cannot drift from the preview.
 */
export function ComponentPreview({ name }: { name: string }) {
  const Example = registry[name]
  if (!Example) {
    throw new Error(`ComponentPreview: "${name}" is not in examples/registry.ts`)
  }
  const code = readFileSync(path.resolve(process.cwd(), "examples", `${name}.tsx`), "utf8")

  return (
    <Tabs items={["Preview", "Code"]} defaultValue="preview" className="my-4">
      <Tab value="Preview">
        <div className="flex min-h-40 flex-wrap items-center justify-center gap-4 overflow-x-auto rounded-xl border border-fd-border bg-fd-background p-6">
          <Example />
        </div>
      </Tab>
      <Tab value="Code">
        <DynamicCodeBlock lang="tsx" code={code} />
      </Tab>
    </Tabs>
  )
}
