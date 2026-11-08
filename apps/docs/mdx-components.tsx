import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { Tabs, Tab } from "fumadocs-ui/components/tabs"
import { Callout } from "fumadocs-ui/components/callout"
import { ComponentPreview } from "@/components/component-preview"
import { PackageInfo } from "@/components/package-info"
import { ApiTable } from "@/components/api-table"
import { TokenTable } from "@/components/token-table"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    Callout,
    ComponentPreview,
    PackageInfo,
    ApiTable,
    TokenTable,
    ...components,
  }
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
