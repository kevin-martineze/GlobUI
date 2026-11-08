# Deploying the docs site (Vercel)

The docs site is `apps/docs`. It reads the compiled packages (`packages/*/dist`), so the build compiles them first. `apps/docs/vercel.json` does that.

## One-time setup in the Vercel dashboard

1. **Add New… → Project**, then import the `kevin-martineze/GlobUI` repository.
2. **Root Directory**: click *Edit* and choose `apps/docs`.
3. **Include source files outside of the Root Directory**: keep it enabled (the default for new projects). The build reads `packages/`, which is outside `apps/docs`.
4. **Framework Preset**: Next.js (from `vercel.json`).
5. **Environment variables** (Production, and Preview if you want previews to show their own address):
   - `NEXT_PUBLIC_SITE_URL` = the public address, for example `https://glob-ui.example.com` (no trailing slash). It is used for the sitemap, robots, metadata, the copy-code commands (`npx shadcn@latest add <site>/r/button.json`), and the registry's dependency URLs. Without it, the build uses `http://localhost:3000`, which is wrong for a deployment.
6. Deploy.

Do not set the install or build commands in the dashboard: they come from `vercel.json` (the dashboard values override the file).

## What the build does

- Install (from the repo root, with the lockfile): `pnpm install --frozen-lockfile`.
- Build: compile every package (`pnpm build:packages`), then in `apps/docs` run `fumadocs-mdx`, write the examples registry, write the copy-code registry (`public/r/*.json`), `next build`, and `check-docs` (every package has a page, no broken internal link).

## Previews

Every pull request gets a preview deployment automatically. Previews build the same way. Their copy-code commands point at `NEXT_PUBLIC_SITE_URL` (the production address), so a preview's install commands still work against production registry items, which is intended.

## Simulating the build locally

From a clean checkout (no `node_modules`, no `dist`):

```bash
# in a fresh clone of the repository (not a working tree with local changes)
pnpm install --frozen-lockfile
pnpm build:packages                                   # from the repo root
cd apps/docs && NEXT_PUBLIC_SITE_URL=https://glob-ui.example.com pnpm build && node scripts/check-docs.mjs
```

The steps are the same as `vercel.json`; the only difference is the environment variable.
