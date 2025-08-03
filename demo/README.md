# Add to Calendar Button Demo

This sub-repository holds the demo page for the [Add to Calendar Button](https://add-to-calendar-button.com/).

It is built with Nuxt and includes the button script directly from the parent repository via the npm workspaces config.
Therefore, you can not use this sub-repository standalone!
But you also don't need to. You can call the important npm commands directly from the root. Check the package.json scripts from the parent repository!

Contributing to this demo page follows the same rules as with the parent repository ([see rules here](../.github/CONTRIBUTING.md)) and also follows the same license. For a better start, also see the Vue guide below.

<br />

---

<br />

## Working with Nuxt

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3233

```bash
npm run dev
```

## Production

Build the application for production (static):

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
