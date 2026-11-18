import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import type { ReactNode } from "react"

/**
 * React and Svelte versions side by side. Every framework switcher on the site shares the "framework" group and is
 * persisted, so picking Svelte once switches every code block, install command and import line, on every page.
 * Without a Svelte version, only the React content is shown.
 */
export function FrameworkTabs({ react, svelte, className }: { react: ReactNode; svelte?: ReactNode; className?: string }) {
  if (!svelte) return <>{react}</>
  return (
    <Tabs items={["React", "Svelte"]} groupId="framework" persist className={className}>
      <Tab value="React">{react}</Tab>
      <Tab value="Svelte">{svelte}</Tab>
    </Tabs>
  )
}

/** The code of an example in each framework. */
export function FrameworkCode({ react, svelte }: { react: string; svelte?: string | null }) {
  return (
    <FrameworkTabs
      react={<DynamicCodeBlock lang="tsx" code={react} />}
      svelte={
        svelte ? (
          <>
            <DynamicCodeBlock lang="svelte" code={svelte} />
            <p className="mt-2 text-sm text-fd-muted-foreground">
              The preview renders the React version. This Svelte code renders the same elements and classes: a test
              compares the two on every change.
            </p>
          </>
        ) : undefined
      }
    />
  )
}
