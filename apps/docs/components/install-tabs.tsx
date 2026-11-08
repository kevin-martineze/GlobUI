import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"

/** The site URL the copy-code commands point at. Set NEXT_PUBLIC_SITE_URL to the deployed address. */
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

/** Registry item name for a package: utils is published as glob-ui-utils. */
export function registryName(pkg: string) {
  return pkg === "utils" ? "glob-ui-utils" : pkg
}

/** The copy-code command for one registry item, for example `npx shadcn@latest add .../r/button.json`. */
export function RegistryCommand({ name }: { name: string }) {
  return <DynamicCodeBlock lang="bash" code={`npx shadcn@latest add ${siteUrl()}/r/${name}.json`} />
}

/** npm and copy-code installation for one component page. */
export function InstallTabs({ pkg }: { pkg: string }) {
  return (
    <Tabs items={["npm", "Copy code"]} defaultValue="npm" className="my-4">
      <Tab value="npm">
        <DynamicCodeBlock lang="bash" code={`pnpm add @glob-ui/${pkg}`} />
        <p className="mt-2 text-sm text-fd-muted-foreground">Not on npm yet: see the installation guide. Once published, this is the command.</p>
      </Tab>
      <Tab value="Copy code">
        <RegistryCommand name={registryName(pkg)} />
        <p className="mt-2 text-sm text-fd-muted-foreground">
          Copies the source into your project (shadcn-compatible). The GlobUI theme and dependencies come with it.
        </p>
      </Tab>
    </Tabs>
  )
}
