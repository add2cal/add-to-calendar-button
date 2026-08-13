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

Edit only the root `package.json`. It is the single source of truth for the package version.

- The library build injects that version into runtime/ICS output and all generated banners.
- The demo's `prebuild` and `pregenerate` hooks sync its displayed version from the parent
  package before Nuxt runs.
- Prerelease versions such as `3.0.0-next.1` are supported. Release tags use the matching
  `v3.0.0-next.1` form and the publish workflow selects npm's `next` tag from the package
  version itself.

## Gates before publishing

1. `npm run test` - smoke tier (CI default; every run builds first via test-prep).
2. `npm run test:extended` - reduced suite, pre-merge bar.
3. `npm run test:full` - full cartesian suite, REQUIRED for releases, on BOTH browsers
   (chrome-headless-shell and full Chrome via `CHROME_PATH`).
4. `npm run test:package` - packs the tarball, installs it into a throwaway consumer, and
   proves Node CJS/ESM consumption, both TypeScript resolution modes, and a real bundler
   build with size bounds.
5. `npm run test:ssr` - DOM-free shell rendering against the built dist.
6. `npm run check` - eslint, prettier, typecheck.

## Pre-release flow (major versions)

Major versions bake in the wild before going official:

1. Set a prerelease version (`3.0.0-next.1`) in package.json, build, run all gates.
2. Publish under the npm `next` dist-tag: `npm publish --tag next`.
3. Increment the version in package.json as fixes land; the suite gates stay the safety net.
4. When stable: remove the prerelease suffix in package.json, run the full gates,
   `npm publish` (default `latest` tag), git tag, GitHub release (release notes draft
   lives with the release preparation material), demo/website deploy.

## Demo / website

The `demo/` folder is the source of add-to-calendar-button.com and versions independently
(own package.json). Content updates accompany feature releases; its build
(`npm run generate` inside demo/) must stay green but is not part of the library gates.
