---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: 'Can I build a dynamic app with it'
category: 'technical'
---

**Yes and no - it depends on what you mean by "dynamic".**

Astro is a frontend framework. It runs on the client side and, optionally, with on-demand server-side rendering and middleware on top. That covers a lot of dynamic use cases: forms, search, filtering, interactive UI components, personalized pages, and so on.

You can even include components written in React, Vue, or Svelte with their so called ["Dynamic Islands"](https://docs.astro.build/en/concepts/islands/).

What it is **not** is a backend. Anything that involves sensitive data, authenticated business logic, or a database needs to live in a proper backend service that Stardrive talks to over an API.

**So: dynamic UI, dynamic content, dynamic rendering - yes. Full-stack app with database and auth in the same project - not standalone, and that is by design.**
