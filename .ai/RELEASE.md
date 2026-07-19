# Release mechanics

What ships where, how versions are bumped, and which gates must be green before anything
leaves the repo. Evergreen; the human maintainer executes releases.

## Artifacts

`node scripts/build.mjs --min` produces the complete `dist/` tree (see the build-outputs
table in `.ai/ARCHITECTURE.md`) plus regenerated `assets/css/` full stylesheets. Sanity
checks inside the build fail hard when an artifact is missing or malformed - treat a green
build as part of the release gate. The npm package ships `dist/`, `assets/css/*.css`,
`test/`, `CHANGELOG.md` (see the `files` list in package.json); types resolve through the
exports map (flat `dist/index.d.ts` and `dist/ssr/index.d.ts`, generated from source).

The `jsdelivr` field points at `dist/atcb.js`. The minified twin `dist/atcb.min.js` ships
in the package; whether to switch the CDN default to it is a maintainer decision.

## Version bumps

`node scripts/set-version.mjs [patch|minor|major|prerelease|x.y.z|x.y.z-tag.n]`

- Updates package.json, the `atcbVersion` constant, source and css banners, and the demo
  footer in one go (walks all src subdirectories).
- Prerelease-capable: explicit versions like `3.0.0-next.1` are accepted, `prerelease`
  increments the trailing counter, and `patch` on a prerelease finalizes the base version
  (npm semantics). Run a build afterwards so generated artifacts pick up the new version.

## Gates before publishing

1. `npm run test` - smoke tier (CI default; every run builds first via test-prep).
2. `npm run test:extended` - reduced suite, pre-merge bar.
3. `npm run test:full` - full cartesian suite, REQUIRED for releases, on BOTH browsers
   (chrome-headless-shell and full Chrome via `CHROME_PATH`).
4. `npm run test:package` - packs the tarball, installs it into a throwaway consumer, and
   proves Node CJS/ESM consumption, both TypeScript resolution modes, and a real bundler
   build with size bounds.
5. `npm run test:ssr` - DOM-free shell rendering against the built dist.
6. `npm run eslint` + `npm run prettier` + `npm run typecheck`.

## Pre-release flow (major versions)

Major versions bake in the wild before going official:

1. Set a prerelease version (`3.0.0-next.1`), build, run all gates.
2. Publish under the npm `next` dist-tag: `npm publish --tag next`.
3. Iterate `prerelease` bumps as fixes land; the suite gates stay the safety net.
4. When stable: `set-version.mjs patch` (finalizes the base version), full gates,
   `npm publish` (default `latest` tag), git tag, GitHub release (release notes draft
   lives with the release preparation material), demo/website deploy.

## Demo / website

The `demo/` folder is the source of add-to-calendar-button.com and versions independently
(own package.json). Content updates accompany feature releases; its build
(`npm run generate` inside demo/) must stay green but is not part of the library gates.
