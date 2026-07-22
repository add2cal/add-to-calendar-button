<script setup lang="ts">
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';
import type { AddToCalendarButtonType } from 'add-to-calendar-button';

/**
 * Renders the <add-to-calendar-button> via the library's SSR entry: on the server
 * (and in the initial HTML) we emit the declarative-shadow-DOM shell, so the button
 * paints before any client JavaScript runs. On the client we re-render the plain tag,
 * which the already-imported web component then upgrades in place.
 *
 * Use this component everywhere in the app instead of the raw
 * <add-to-calendar-button> tag. The raw tag stays for code examples shown to users.
 *
 * All attributes are simply passed through (same names and values as with the plain
 * web component - kebab-case bindings work, the ssr entry normalizes them itself).
 */

defineOptions({
  inheritAttrs: false,
});

// The ssr html is generated on the server and carried to the client via useState:
// hydration then keeps the painted shell in place. The plain tag (and with it the
// swap) only renders once the custom element signals a COMPLETE render via its
// whenInitialized() callback - before that, the shell stays untouched.
// The state key derives deterministically from the attrs (identical on server and
// client, independent of render order); a per-content discriminator separates
// multiple buttons with the exact same config.
const attrs = useAttrs();
const attrsFingerprint = JSON.stringify(attrs, Object.keys(attrs).sort());
const atcbContentCounter = (import.meta.server ? (globalThis as never) : (window as never)) as { __atcbSsrCount?: Record<string, number> };
atcbContentCounter.__atcbSsrCount = atcbContentCounter.__atcbSsrCount || {};
const discriminator = (atcbContentCounter.__atcbSsrCount[`${attrsFingerprint}`] = (atcbContentCounter.__atcbSsrCount[`${attrsFingerprint}`] || 0) + 1);
const html = useState<string>(`atcb-ssr-${attrsFingerprint.length}-${discriminator}`, () => '');
const hydrated = ref(false);

if (import.meta.server) {
  html.value = atcb_generate_ssr_html(attrs as AddToCalendarButtonType & { [key: string]: unknown });
}

// Custom v-html replacement: writes the markup exactly once on mount and never
// re-applies it on re-render. Crucial for the declarative shadow DOM shell: Vue's
// regular v-html re-sets innerHTML during hydration, which does NOT parse DSD
// templates - the painted shadow root would be destroyed and the shell flash away.
const vSsrHtml = {
  mounted(el: HTMLElement, binding: { value: string }) {
    // skip the assignment when the server-rendered markup is already in place
    // (hydration): re-setting innerHTML would re-parse WITHOUT declarative shadow
    // DOM support and destroy the painted shadow root
    if (el.innerHTML === binding.value || el.querySelector('add-to-calendar-button')) {
      return;
    }
    el.innerHTML = binding.value;
  },
  // server-side, behave like v-html (the prerendered markup is what matters)
  getSSRProps(binding: { value: string }) {
    return { innerHTML: binding.value };
  },
};

const shellHost = ref<HTMLElement | null>(null);

if (import.meta.client) {
  onMounted(async () => {
    // register every style first (synchronous registry), then the web component:
    // the upgrade never needs a css fetch and the shell swaps straight into the
    // fully styled button
    await import('@/utils/atcbStyles');
    await import('add-to-calendar-button');
    // the shell element upgrades in place - wait for its complete render
    const el = shellHost.value?.querySelector('add-to-calendar-button') as (HTMLElement & { whenInitialized?: () => Promise<void> }) | null;
    if (el && typeof el.whenInitialized === 'function') {
      await el.whenInitialized();
    }
    // only now swap the ssr markup for the plain tag (attrs-driven, reactive).
    // The swapped-in tag upgrades instantly (same module, same attributes), so
    // there is no second blank window either
    hydrated.value = true;
  });
}
</script>

<template>
  <add-to-calendar-button v-if="hydrated" v-bind="$attrs"></add-to-calendar-button>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span v-else ref="shellHost" v-ssr-html="html" class="contents"></span>
</template>
