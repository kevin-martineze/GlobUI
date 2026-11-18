import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { LayoutPreviewFrame, type PreviewControl } from "@/components/layout-preview-frame"
import { FrameworkTabs } from "@/components/code-tabs"

// Each root is a fixed folder, so the build traces only these folders, not the whole project.
function codePath(file: string): string {
  if (file.startsWith("examples/")) return path.join(process.cwd(), "examples", file.slice("examples/".length))
  if (file.startsWith("../../templates/")) return path.join(process.cwd(), "../../templates", file.slice("../../templates/".length))
  throw new Error(`LayoutPreview: code file outside examples/ or templates/: ${file}`)
}

function readCodeFile(file: string): string {
  return readFileSync(codePath(file), "utf8")
}

/**
 * The Svelte counterpart of a React code file, by convention: examples/<x>.tsx -> examples/<x>.svelte, and
 * templates/<name>/<name>-template.tsx -> templates/svelte/<name>/<Name>Template.svelte.
 */
function svelteFileFor(file: string): string | null {
  let candidate: string
  const template = file.match(/^\.\.\/\.\.\/templates\/([\w-]+)\/([\w-]+)-template\.tsx$/)
  if (template) {
    const pascal = template[2].split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join("")
    candidate = `../../templates/svelte/${template[1]}/${pascal}Template.svelte`
  } else {
    candidate = file.replace(/\.tsx$/, ".svelte")
  }
  return existsSync(codePath(candidate)) ? candidate : null
}

const fileName = (file: string) => file.replace(/^.*\//, "")

function FileTabs({ files, lang }: { files: { file: string; code: string }[]; lang: string }) {
  return (
    <Tabs items={files.map((f) => fileName(f.file))}>
      {files.map((f) => (
        <Tab key={f.file} value={fileName(f.file)}>
          <DynamicCodeBlock lang={lang} code={f.code} />
        </Tab>
      ))}
    </Tabs>
  )
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
  const reactFiles = (codeFiles ?? "").split(",").filter(Boolean)
  const files = reactFiles.map((file) => ({ file, code: readCodeFile(file) }))
  const svelteNames = reactFiles.map(svelteFileFor)
  // The Svelte tab appears only when every file has its Svelte version.
  const svelteFiles = svelteNames.every(Boolean) ? svelteNames.map((file) => ({ file: file!, code: readCodeFile(file!) })) : []

  return (
    <div className="my-6 flex flex-col gap-4">
      <LayoutPreviewFrame slug={slug} kind={kind} controls={parsed} />
      {files.length > 0 ? (
        <FrameworkTabs
          react={<FileTabs files={files} lang="tsx" />}
          svelte={svelteFiles.length > 0 ? <FileTabs files={svelteFiles} lang="svelte" /> : undefined}
        />
      ) : null}
    </div>
  )
}
