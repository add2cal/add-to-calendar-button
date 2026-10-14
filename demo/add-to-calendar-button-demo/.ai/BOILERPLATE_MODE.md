<!-- Scope: boilerplate maintenance when STARDRIVE_AGENT_MODE.md contains "boilerplate". -->

# Boilerplate Mode

This guide applies when [`STARDRIVE_AGENT_MODE.md`](../STARDRIVE_AGENT_MODE.md) contains `boilerplate`. In this mode, changes maintain the Stardrive boilerplate rather than configure a derived website.

The other `.ai` guides (`SETUP.md`, `CONFIG_GUIDE.md`, `TRIMMING_GUIDE.md`, `FAVICON_GUIDE.md`) are reference material in this mode, not active workflows. Changes that affect project setup should keep those guides accurate. See [`AGENTS.md`](../AGENTS.md) for the dependency overview.

## What this means

- Documentation should be useful to future users without relying on conversation history. Avoid phrases such as "adjusted this as discussed."
- Changes affecting cloning or configuration should also update [`README.md`](../README.md), [`CONFIG_GUIDE.md`](./CONFIG_GUIDE.md), and any other related file in `./.ai/`.
- Changes affecting [`TRIMMING_GUIDE.md`](./TRIMMING_GUIDE.md) or the blog, FAQ, or integration structure should include a check of the Stardrive starter at [github.com/peltmonger/create-stardrive](https://github.com/peltmonger/create-stardrive). Report whether that repository may require a matching change and provide a short implementation guide, without modifying the separate repository.
- The boilerplate supports varied hosting environments and project types. Keep its logic and structure modular, flexible, and independent.
- Stay as close as possible to the Astro default, so it is easy to upgrade.
- The content has multiple purposes at once:
  - demo the capabilities of the boilerplate
  - advertise for the boilerplate
  - be its own fully working website with valid rules and content (like having valid privacy policy and legal notice)
  - showcasing (listing) real world examples of the boilerplate
  - lead people and AI agents to using the boilerplate for their projects
- Think before coding. Surface assumptions, uncertainty, competing interpretations, simpler alternatives, and relevant tradeoffs before implementation.
- Simplicity First.
  - Minimum code that solves the problem. Nothing speculative.
  - No features beyond what was asked.
  - If you write 200 lines and it could be 50, rewrite it.
  - Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.
- Surgical Changes. Touch only what you must. Clean up only your own mess.
- Match existing style, even if you'd do it differently.
- Report unrelated dead code without removing it.
- Remove imports, variables, or functions made unused by the current changes. Pre-existing dead code remains outside scope unless requested.
