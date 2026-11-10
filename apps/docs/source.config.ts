import { defineConfig, defineDocs } from "fumadocs-mdx/config"

// Every .mdx file under content/docs is a page. meta.json files set the sidebar order and groups.
export const docs = defineDocs({
  dir: "content/docs",
})

export default defineConfig()
