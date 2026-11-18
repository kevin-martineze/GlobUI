import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { FrameworkTabs } from "@/components/code-tabs"
import { hasSvelte } from "@/lib/svelte"

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

const MANAGERS = [
  { name: "pnpm", add: "pnpm add" },
  { name: "npm", add: "npm install" },
  { name: "yarn", add: "yarn add" },
  { name: "bun", add: "bun add" },
]

/** One install command per package manager, in the persisted "package-manager" group. */
function PackageManagerTabs({ pkg }: { pkg: string }) {
  return (
    <Tabs items={MANAGERS.map((m) => m.name)} defaultValue="pnpm" groupId="package-manager" persist>
      {MANAGERS.map((m) => (
        <Tab key={m.name} value={m.name}>
          <DynamicCodeBlock lang="bash" code={`${m.add} ${pkg}`} />
        </Tab>
      ))}
    </Tabs>
  )
}

/** npm and copy-code installation for one component page, for React and, when the Svelte package has it, Svelte. */
export function InstallTabs({ pkg }: { pkg: string }) {
  const react = (
    <Tabs items={["Packages", "Copy code"]} defaultValue="Packages">
      <Tab value="Packages">
        <PackageManagerTabs pkg={`@glob-ui/${pkg}`} />
      </Tab>
      <Tab value="Copy code">
        <RegistryCommand name={registryName(pkg)} />
        <p className="mt-2 text-sm text-fd-muted-foreground">
          Copies the source into your project (shadcn-compatible). The GlobUI theme and dependencies come with it.
        </p>
      </Tab>
    </Tabs>
  )
  const svelte = hasSvelte(pkg) ? (
    <>
      <PackageManagerTabs pkg="@glob-ui/svelte" />
      <p className="mt-2 text-sm text-fd-muted-foreground">
        One package for every Svelte component. Import this one from <code>@glob-ui/svelte/{pkg}</code>.
      </p>
    </>
  ) : undefined
  return <FrameworkTabs react={react} svelte={svelte} className="my-4" />
}
