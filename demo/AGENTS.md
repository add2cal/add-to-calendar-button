# 🛑 CRITICAL: REPOSITORY BOOTSTRAP DIRECTIVE 🛑

As an AI agent operating in this repository, you MUST execute the following state check before analyzing, coding, or responding to any user prompt:

1. **CHECK STATE:** Silently verify if the file [`STARDRIVE_AGENT_MODE.md`](./STARDRIVE_AGENT_MODE.md) exists in the root directory.
2. **IF MISSING (UNINITIALIZED):**
   - Intercept the prompt: Acknowledge to the user that you are running the initial repository setup first.
   - Never (!) proceed without this file being present!
   - Read the file [`SETUP.md`](./.ai/SETUP.md) in the`./.ai/` directory..
   - Execute ALL setup, scaffolding, and configuration instructions defined in `SETUP.md` and related files. Ask the user about clarification where necessary.
   - Create the `STARDRIVE_AGENT_MODE.md` file in the root directory to mark initialization as complete, setting its content to "project" or "boilerplate" - depending on what the user's case is about.
   - Proceed to fulfill the user's original request.
3. **IF PRESENT (INITIALIZED):**
   - Directly proceed to fulfilling the user's prompt.
   - Mind the content of the `STARDRIVE_AGENT_MODE.md` as it defines your general scope as described in the [`AGENTS.md`](./AGENTS.md).

# General information and guidelines for AI agents

## Analyze your high-level use case first

Check for an `STARDRIVE_AGENT_MODE.md` file at the root level. Its content is a single keyword that selects your mode:

- **`boilerplate`** - You are maintaining the boilerplate code itself as a contributor (not building a new website with it). Follow [`BOILERPLATE_MODE.md`](./.ai/BOILERPLATE_MODE.md). Do not execute the other `.ai` guides as setup steps (`SETUP.md`, `CONFIG_GUIDE.md`, `TRIMMING_GUIDE.md`, `FAVICON_GUIDE.md`); they describe the end-user setup flow. You may still read and **update** them when your changes affect that flow - keeping them accurate is part of boilerplate maintenance.
- **`project`** - You are using the boilerplate to build a new project and website. Treat this codebase as an already-started project to adjust and extend to the user's specifications, not as a boilerplate. Open [`PLAN.md`](./.ai/PLAN.md) first to see what is still open. If no `PLAN.md` exists yet, the configuration has not been planned - run [`SETUP.md`](./.ai/SETUP.md) to create it. Ignore [`BOILERPLATE_MODE.md`](./.ai/BOILERPLATE_MODE.md).

## How the `.ai` guidance files relate

The `.ai/` folder drives onboarding. The files depend on each other in a fixed order - follow the links rather than guessing what to do next:

> **Scope:** Files in `./.ai/` document mode-specific repository workflows. Consult only the files selected by `STARDRIVE_AGENT_MODE.md` and the dependency flow below. Reading a guide for reference does not activate its workflow.

```text
AGENTS.md (this file)            ← always read first; selects the mode
└─ STARDRIVE_AGENT_MODE.md                 ← stores the chosen mode ("boilerplate" | "project")
   ├─ boilerplate → BOILERPLATE_MODE.md
   └─ project / no mode yet → SETUP.md
                                 └─ CONFIG_GUIDE.md   ← project setup, builds PLAN.md
                                    ├─ TRIMMING_GUIDE.md  (only for direct clones; self-deletes when done)
                                    └─ FAVICON_GUIDE.md   (invoked at the favicon step)
                                 → PLAN.md            ← living checklist for "project" mode
```

Quick reference:

| File                      | Purpose                                 | Reads / triggers                                                 | Lifecycle                                 |
| ------------------------- | --------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| `AGENTS.md`               | Entry point + global guidelines         | `STARDRIVE_AGENT_MODE.md` → mode guides                          | permanent                                 |
| `STARDRIVE_AGENT_MODE.md` | Stores selected mode                    | -                                                                | created by `SETUP.md`                     |
| `SETUP.md`                | Establishes mode, kicks off setup       | `CONFIG_GUIDE.md` (project), `BOILERPLATE_MODE.md` (boilerplate) | permanent                                 |
| `BOILERPLATE_MODE.md`     | Rules for maintaining the boilerplate   | keeps `README.md` + other `.ai` guides in sync                   | permanent                                 |
| `CONFIG_GUIDE.md`         | Step-by-step project configuration      | `TRIMMING_GUIDE.md`, `FAVICON_GUIDE.md`; builds `PLAN.md`        | permanent (kept as reference)             |
| `TRIMMING_GUIDE.md`       | Removes demo content from direct clones | -                                                                | self-deletes after trimming               |
| `FAVICON_GUIDE.md`        | Favicon/manifest generation             | `theme.config.ts`, `base.astro`                                  | permanent                                 |
| `PLAN.md`                 | Project setup checklist                 | -                                                                | created by `CONFIG_GUIDE.md`; per-project |

## This is an Astro project

Validate whether you are connected to the Astro Docs MCP server (https://mcp.docs.astro.build/mcp).
If not, connect to it, or ask the user to add the config, if you are not allowed to do it directly.

This project is either the Astro Stardrive boilerplate or based on it. If you are in "project" mode, you can find up-to-date information about the foundational boilerplate at its [official repo](https://github.com/peltmonger/stardrive).

For Astro specific docs, find the full documentation at https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind (Tailwind is preferred)](https://docs.astro.build/en/guides/styling/)

## Further tech stack

- Astro
- Vite
- TypeScript
- JavaScript
- TailwindCSS
- ESLint
- Prettier
- Cloudflare Workers with Wrangler (prepared - might have been already dropped when you process this information here)
- Additional things that got added after the initial setup of this project

## General guidelines

The following guidelines are specific to this setup and always need to be respected.
They extend any existing general Agent guidelines, profiles, or skills.

- The [`package.json`](./package.json) holds all information about available scripts and dependencies.
- Astro is a **frontend** framework (static + optional on-demand SSR). Never store secrets or backend logic here. Sensitive work belongs in a real backend service.
- Use svg files alwas as components and never via Astro's <Image> component. The latter one would break in some cases - especially with Cloudflare.
- Always mind accessibility (create proper aria-labels, use semantic tags, consider keyboard + mouse + touch navigation, consider contrast colors when working with text).
- Always try to use what is native to Astro and can be found in its documentation, before creating own logic.
- Astro comes with an [Island Architecture](https://docs.astro.build/en/concepts/islands/), which means that you can also create dynamic components with React, Vue, Svelte, or SolidJS. However, they add a lot of complexity, so try to avoid it. Decision tree (use what fits first):
  1. Can the functionality by achieved with Astro defaults or existing HTML?
  2. Would it be <50 lines with VanillaJS?
  3. Ask the user whether React, Vue, Svelte, or SolidJS is prefered for more complex things.
- Some core features might have been dropped (either via the starter tool, manually, or by an AI agent). Those changes might have been noted down in the [`theme.config.ts`](./theme.config.ts) file. If you plan to build such features, look at the official repository first to revert to the default functionality first by copying the dropped files from there. To identify the removed files, check the `TRIMMING_GUIDE.md` in the `./.a/` directory at the remote repository (it most probably already got deleted in this local clone). Ask the user whether this is something he would prefer instead of building from scratch.
- In case you want to upgrade the Astro Stardrive boilerplate, you can manually check the changes at the [official repository's releases](https://github.com/peltmonger/stardrive/releases) and compare it to the local version. The local Stardrive version is pinned in the package.json under the key `stardriveVersion`. Update this number after your manual upgrade as well.
- Before implementing:
  - State your assumptions explicitly. If uncertain, ask.
  - If multiple interpretations exist, present them - don't pick silently.
  - If a simpler approach exists, say so. Push back when warranted.
  - If something is unclear, stop. Name what's confusing. Ask.
- Simplicity First. Minimum code that solves the problem. Nothing speculative. When working on a new project, try to stay as close as possible to what the boilerplate ships with - this also applies to structure.
- Styling: follow the same conventions and patterns that you detect in the surrounding code. Run `npm run check` to check and lint everything or pick a more specific linter. Run `npm run fix` to fix everything (astro, eslint, prettier) or pick a more specific script.

## Deciding: component vs. inline in the page

Keep markup inline in the page by default. Extract a component into `./src/components/` only when at least one of these is true:

- **Reuse:** the same block is needed on more than one page (e.g. content shared between the default-locale route and its `[lang]` counterpart - extract it so both stay in sync from a single source).
- **Size/complexity:** the block is a large, self-contained design element with its own logic or state, and lifting it out makes the page readable.
- **Clear responsibility:** the block is a reusable design primitive (callout, step, accordion, tabbed code, …) that other pages will plausibly want.

Do not create a component for a one-off snippet, and do not over-split into tiny atoms - this repo intentionally keeps components coarse (see the structure notes in the `README.md`). Group related docs/feature components in a topical subfolder (e.g. `./src/components/docs/`).

When a component only styles slot-provided prose (links, inline code, lists), prefer a shared CSS file in `./src/styles/` (imported via the `@styles/...` alias in the component frontmatter) over repeating the same scoped `<style>` block in every component.

Note on scoped `<style>` + Tailwind: inside an Astro `<style>` block, the Tailwind `@reference` directive must use a **relative** path (e.g. `@reference "../../styles/tailwind.config.css";`), not the `@styles/...` alias. The alias only resolves in JS/TS `import` statements, not in the CSS `@reference` context.

## Deciding: `[lang]` vs. dedicated language subfolders

Both live under `./src/pages/`. Choose based on how the content differs per language:

- **Use `./src/pages/[lang]/`** when the page structure is identical across languages and only the text differs. Put the strings in the `./src/i18n/*.json` files and read them with `useTranslations`. This keeps a single template for all locales. Prefer this for most pages, including short "note"-style pages.
- **Use a dedicated language subfolder** (`./src/pages/de/`, `./src/pages/es/`, `./src/pages/fr/`, with the default locale living directly under `./src/pages/`) when a page carries large, text-heavy blocks or content that genuinely differs per language. Hard-code those big text blocks directly in each language's file instead of bloating the i18n JSON files. The docs pages (`./src/pages/*/docs/`) are the reference example.

Rule of thumb: a few translated labels → `[lang]` + i18n JSON. Long prose or per-language content → dedicated subfolder with hard-coded text. Even then, extract shared design elements into components (see above) so only the copy differs between languages.

> [!TIP]
> When hard-coding large code samples in a page's frontmatter that themselves contain a line that is literally `---` (e.g. YAML frontmatter examples in a template literal), build that fence from a constant (`const fence = "---"; ... \`${fence}\n...\n${fence}\``). A bare `---` line inside the script block is otherwise mistaken for the closing fence of the Astro component's own frontmatter and breaks parsing.
