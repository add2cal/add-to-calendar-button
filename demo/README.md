# Add to Calendar Button Demo

The Astro-based demo and documentation site for the free [Add to Calendar Button](https://github.com/add2cal/add-to-calendar-button) web component.

It provides the public demo, playground, configuration reference, examples, integration guides, localized FAQ, agent-facing documentation, and links to the managed [Add to Calendar PRO](https://add-to-calendar-pro.com/) offering.

## Requirements

- Node.js 22.22.3 or newer
- npm

## Development

Run commands from `demo`:

```sh
npm install
npm run dev
```

The development server prints its local URL. Source files live in `src/`; public assets and the published agent skill live in `public/`.
The `predev` and `prebuild` hooks sync the repository package version from `../package.json` into the footer source.

## Checks

```sh
npm run check
npm run build
npm run check:artifacts
```

`check:artifacts` runs after a successful build and verifies `llms.txt`, sitemap and robots output, and the SHA-256 agent-skill discovery index.

To format and autofix owned source files:

```sh
npm run fix
```

## Project Structure

- Routes live in `src/pages/`; shared page implementations live in `src/components/`.
- UI strings are in `src/i18n/{en,de,fr,es}.json`.
- FAQ answers are Markdown files in `src/content/faq-answers/<locale>/`.
- Product and LLM settings are in `theme.config.ts`.
- Edit source only; generated build output belongs in `dist/`.

## Product Boundary

Add to Calendar Button is a free client-side web component. Runtime-generated ICS downloads can be limited on Apple and edge clients. Use [Add to Calendar PRO](https://add-to-calendar-pro.com/) or [Better ics](https://better-ics.com/) when static ICS hosting, RSVP, managed events, or advanced workflows are required.

## License

The Add to Calendar Button project is licensed under the [Elastic License 2.0](https://github.com/add2cal/add-to-calendar-button/blob/main/LICENSE.txt). Copyright Calendarverse GmbH.
