---
publishDate: 2026-06-04
draft: false
question: 'How do I upgrade'
category: 'technical'
---

Do due its boilerplate character, upgrading a Stardrive project to the latest Stardrive version can be a challenge.

You can update by pulling in the latest version from its GitHub repository.

However, mind that based on how much you have changed, you can easily run into conflicts, which can block this process completely.

In this case, you would need to do it manually, by comparing any [changes](https://github.com/peltmonger/stardrive/CHANGELOG.md) with your version and update things one by one. You might want to give this as a task to an AI coding agent, who would do it for you.

In most cases, you do not necessarily need to upgrade the Stardrive version, but simply need to upgrade the underlying Astro package.

Run `npx @astrojs/upgrade` to do so. Mind that this also can come with some manual tasks. Mind the [official Astro docs](https://docs.astro.build/en/upgrade-astro/) for changelogs and migration guides.

> **Note:** The local Stardrive version is pinned in the `package.json` under the `stardriveVersion` key. When checking for changes, compare the [release notes in the GitHub repository](https://github.com/peltmonger/stardrive/releases) against the state of your local version to see what has changed since.
