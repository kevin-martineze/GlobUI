import { Separator } from "@glob-ui/separator"

export default function SeparatorDefault() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <p className="text-glob-text">Sections of a page are divided by a horizontal line.</p>
      <Separator />
      <p className="text-glob-text-secondary">Inline items use a vertical one.</p>
      <div className="flex h-5 items-center gap-3">
        <a href="#docs" className="text-glob-primary-text hover:underline">Docs</a>
        <Separator orientation="vertical" />
        <a href="#source" className="text-glob-primary-text hover:underline">Source</a>
        <Separator orientation="vertical" />
        <a href="#changelog" className="text-glob-primary-text hover:underline">Changelog</a>
      </div>
    </div>
  )
}
