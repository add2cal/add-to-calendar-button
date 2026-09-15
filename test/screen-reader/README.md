# Real screen-reader tests

Nine scenarios run with Guidepup against the built component: the default trigger,
dropdown and modal lists with force-overlay off/on, multi-date Google selection,
the CTA form, modal RSVP, and inline RSVP. Each test uses real keyboard/screen-reader
input and checks speech as well as browser state. PRO configuration and seat counts
are mocked; calendar navigation is captured. No live RSVP/CTA submissions are made.

## Running

These tests belong only to `npm run test:full` (and therefore `test:release`). Smoke
and extended runs do not start a screen reader. Full runs require a supported OS:

- macOS: VoiceOver and headed Playwright WebKit.
- Windows: NVDA and headed Playwright Chromium.

After `npm ci`, prepare the machine once:

```sh
npx guidepup setup
npx guidepup install
npx playwright install webkit chromium
npm run test:full
```

On a personal Mac, prefer the [manual VoiceOver setup](https://www.guidepup.dev/docs/guides/manual-voiceover-setup)
for Accessibility/Automation permissions and AppleScript control. Do not disable
System Integrity Protection. `npx guidepup setup --macos-ignore-tcc-db` configures
preferences without editing the permission databases; manual permissions are still
required. Tests take over the active desktop, so do not use it during a run.

If Guidepup cannot link its preferences under `~/Library/Group Containers/` with an
`EPERM` error, check Full Disk Access for the terminal/IDE launching Node and restart
that application after changing permissions. A setup failure is a failed run, never
treated as passing accessibility coverage.

Run setup before tests on disposable CI machines, using `npx guidepup setup --ci`.
Re-run `npx guidepup install` after upgrading Guidepup so its assets match the pinned
package manifest. Keep the OS/screen-reader language in English.

## Full-tier portions

`ATCB_TEST_FULL_PART` can select `browser` or `screen-reader`; its default is `all`.
The selection is printed, and an unsupported reader OS fails instead of skipping.
A portion alone is **not** a complete release gate.

```sh
# macOS/Linux shell; on PowerShell set $env:ATCB_TEST_FULL_PART first.
ATCB_TEST_FULL_PART=screen-reader npm run test:full
ATCB_TEST_FULL_PART=browser npm run test:full
```

The PR/publish workflow distributes the release gate across both Chrome binaries on
Linux and both screen-reader platforms. PRs targeting `dev` run only smoke tests;
PRs targeting `main` run all release jobs; publishing depends on all of them passing.

For development, after building, list all nine cases with:

```sh
npx playwright test --config playwright.screen-reader.config.ts --list
```

For a focused diagnostic run, use `--grep SR-03 --reporter=list`; the normal reporter
deliberately rejects partial runs, skips, and missing cases. Never override it in CI.

## Assertions and diagnostics

- One worker, no retries, bounded navigation, and an overall timeout.
- Expected count: **9 per platform**, **18 across both CI reader jobs**.
- Speech checkpoints isolate each assertion without erasing earlier diagnostics.
- Tests use Tab/Shift+Tab, activation, Escape, and the screen-reader reading cursor.
- Do not replace navigation with `locator.focus()`, scripted clicks, or DOM-only
  assertions: those can bypass the accessibility failure under test.
- Failures retain Playwright traces/screenshots and speech/item logs under
  `test-results/screen-reader/`; the HTML report is in `playwright-report/`.
- Changes to spoken wording should be reviewed for meaning, not accepted blindly.

This supplements the axe suite. It does not test visual contrast, all styling
variants, JAWS, or mobile assistive technology.
