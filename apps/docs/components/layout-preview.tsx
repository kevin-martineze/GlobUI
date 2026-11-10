import { readFileSync } from "node:fs"
import path from "node:path"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { LayoutPreviewFrame, type PreviewControl } from "@/components/layout-preview-frame"

// Each root is a fixed folder, so the build traces only these folders, not the whole project.
function readCodeFile(file: string): string {
  if (file.startsWith("examples/")) return readFileSync(path.join(process.cwd(), "examples", file.slice("examples/".length)), "utf8")
  if (file.startsWith("../../templates/")) {
    return readFileSync(path.join(process.cwd(), "../../templates", file.slice("../../templates/".length)), "utf8")
  }
  throw new Error(`LayoutPreview: code file outside examples/ or templates/: ${file}`)
}

/**
 * A live layout or template demo in an iframe (app/preview/<slug>), with the anatomy view, fill, device sizes,
 * full screen and, for templates, a props panel. `codeFiles` are read at build time, relative to apps/docs,
 * so the code shown is the code that runs.
 */
export function LayoutPreview({
  slug,
  kind = "layout",
  controls,
  codeFiles,
}: {
  slug: string
  kind?: "layout" | "template"
  /** JSON: the props panel controls (see docs-data templates). */
  controls?: string
  /** Comma-separated files, relative to apps/docs. */
  codeFiles?: string
}) {
  const parsed: PreviewControl[] = controls ? JSON.parse(controls) : []
  const files = (codeFiles ?? "")
    .split(",")
    .filter(Boolean)
    .map((file) => ({ file, code: readCodeFile(file) }))

  return (
    <div className="my-6 flex flex-col gap-4">
      <LayoutPreviewFrame slug={slug} kind={kind} controls={parsed} />
      {files.length > 0 ? (
        <Tabs items={files.map((f) => f.file.replace(/^.*\//, ""))} defaultValue={files[0] ? files[0].file.replace(/^.*\//, "") : undefined}>
          {files.map((f) => (
            <Tab key={f.file} value={f.file.replace(/^.*\//, "")}>
              <DynamicCodeBlock lang="tsx" code={f.code} />
            </Tab>
          ))}
        </Tabs>
      ) : null}
    </div>
  )
}
