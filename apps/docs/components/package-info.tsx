import { readdirSync, readFileSync } from "node:fs"
import { sourceFile } from "@/lib/type-generator"
import path from "node:path"

/** A file is a client module when its first statement is "use client". Read from the source, so the badge cannot drift. */
function isClientPackage(pkg: string) {
  const dir = path.dirname(sourceFile(pkg))
  return readdirSync(dir)
    .filter((f) => /\.tsx?$/.test(f) && !f.includes(".test."))
    .some((f) => /^\s*["']use client["']/.test(readFileSync(path.join(dir, f), "utf8")))
}

/**
 * Server/client badge and the import line for a component page.
 * `exports` is the comma-separated list of names to show in the import.
 */
export function PackageInfo({ pkg, exports }: { pkg: string; exports: string }) {
  const client = isClientPackage(pkg)
  return (
    <div className="not-prose my-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span
          className={
            client
              ? "rounded-full border border-fd-primary/40 bg-fd-primary/10 px-2.5 py-0.5 font-medium text-fd-foreground"
              : "rounded-full border border-fd-border bg-fd-muted px-2.5 py-0.5 font-medium text-fd-foreground"
          }
        >
          {client ? "Client component" : "Server component"}
        </span>
        <span className="text-fd-muted-foreground">
          {client ? "Uses state or handlers, so it starts with \"use client\"." : "No state or handlers. Safe to render in a Server Component."}
        </span>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-fd-border bg-fd-card p-4 text-sm">
        <code>{`import { ${exports} } from "@glob-ui/${pkg}"`}</code>
      </pre>
    </div>
  )
}
