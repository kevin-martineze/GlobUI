import { AutoTypeTable } from "fumadocs-typescript/ui"
import { generator, sourceFile } from "@/lib/type-generator"

/**
 * Props table generated from the TypeScript types in packages/<pkg>/src/<file>.
 * `name` is the exported interface or type, for example "ButtonProps".
 */
export async function ApiTable({ pkg, name, file }: { pkg: string; name: string; file?: string }) {
  return <AutoTypeTable generator={generator} path={sourceFile(pkg, file)} name={name} />
}
