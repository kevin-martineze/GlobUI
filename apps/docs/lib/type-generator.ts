import path from "node:path"
import { createFileSystemGeneratorCache, createGenerator } from "fumadocs-typescript"

// Resolves prop types from the real package sources (packages/<name>/src), not from copies.
export const generator = createGenerator({
  tsconfigPath: path.resolve(process.cwd(), "tsconfig.json"),
  cache: createFileSystemGeneratorCache(path.resolve(process.cwd(), ".next/fumadocs-typescript")),
})

/** Absolute path of a package source file, for example sourceFile("button") -> .../packages/button/src/button.tsx */
export function sourceFile(pkg: string, file = `${pkg}.tsx`) {
  return path.resolve(process.cwd(), "../../packages", pkg, "src", file)
}
