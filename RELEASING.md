# Releasing @glob-ui to npm

Every `@glob-ui/*` package is published at **one shared version** (the `fixed` group in `.changeset/config.json`). Changesets bumps them together, and CI publishes them with npm **trusted publishing** (OIDC): there is no `NPM_TOKEN` secret, and each release carries provenance.

Nothing is published yet. The `@glob-ui` npm organisation does not exist. The release workflow does nothing until you turn it on (step 5 below).

## One-time setup (you do these steps)

### 1. Create the npm organisation

1. Sign in at npmjs.com and check that `@glob-ui` is free. The name is the scope of every package.
2. **Add Organization** → name `glob-ui` → plan **Free** (public packages only).

### 2. First publication, by hand

Trusted publishing is configured per package in npm's settings, and that needs the package to exist first. So the first version (`0.1.0`, already in every `package.json`) is published from your machine, once.

```bash
npm login                                   # your account, with 2FA
pnpm install --frozen-lockfile
pnpm build:packages && pnpm check:packages
npm_config_provenance=false pnpm release    # changeset publish: publishes every version not yet on npm
```

- `npm_config_provenance=false` is needed locally. `publishConfig.provenance` is `true` in every package, and npm refuses provenance outside CI.
- `pnpm release` publishes the 30 packages in one run. If one fails, fix it and run it again: packages already on npm are skipped.
- Check the result: `npm view @glob-ui/button version` must print `0.1.0`.

### 3. Trusted publisher, for each package

For each of the 30 packages (`@glob-ui/accordion` … `@glob-ui/utils`, and `@glob-ui/styles`; a package can have up to 10 trusted publishers):

1. npmjs.com → the package → **Settings** → **Trusted Publisher** → **GitHub Actions**.
2. Fill in:
   - Organization or user: `kevin-martineze`
   - Repository: `GlobUI`
   - Workflow filename: `release.yml`
   - Environment name: leave empty.
3. Save.

Notes from npm's docs:
- The configuration is checked only when the workflow publishes, so a typo shows up as a failed publish, not as an error here.
- npm expects the first publish through trusted publishing within 2 days of configuring it. The first release through CI is the next one, so keep the configuration in place.

### 4. Repository settings

- **Settings → Actions → General → Workflow permissions**: enable *Allow GitHub Actions to create and approve pull requests* (the Version PR needs it).
- **Settings → Secrets and variables → Actions → Variables**: create `NPM_PUBLISH_ENABLED` = `true`.

### 5. Turn it on

With the variable set, `.github/workflows/release.yml` runs on every push to `main`:

- If there are changesets, it opens (or updates) the **Version Packages** PR.
- When that PR is merged, it publishes the new versions with `pnpm release` (provenance and OIDC, no token).

Optional, once the first publish works: on each package's npm settings choose **Require two-factor authentication and disallow tokens**. Trusted publishing is not affected by it.

## Day to day

1. In a feature PR, run `pnpm changeset`: pick the packages, the bump (patch, minor, major) and write a line for the changelog. Commit the file in `.changeset/`.
2. Merge to `main`. The release workflow updates the **Version Packages** PR.
3. Merge that PR. The workflow publishes to npm.

Checks run in the workflow before anything is published: lint, build, `check:packages` (publint and attw on each package), and the tests. The copy-code registry and the docs are built by the docs deploy (see DEPLOY.md), not by the release.

## Things to know

- The `workflow` file name must stay `release.yml`: the trusted publisher configuration names it.
- `docs` and the root are private and never published (`private: true`).
- `publishConfig.access` is `public`, so scoped packages are public.
- The workflow uses `changesets/action@v1` with the inputs `version` and `publish`. Before the first real release, check that tag and those input names against the action's README on GitHub: they could not be confirmed from the documentation available when this was written.
