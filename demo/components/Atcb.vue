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

const props = defineProps({
  // When true, the component skips importing the web component + styles on the
  // client. The server-rendered shell stays painted (no upgrade, no swap).
  // Used by the playground to defer script loading for bots.
  skipClientLoad: {
    type: Boolean,
    default: false,
  },
  // When true, register every style delta and every locale up front (via the
  // library's aggregate "styles/all" and "i18n/all" modules) instead of only
  // the one style/locale this button needs. Used by the playground, where the
  // visitor can switch styles and languages at runtime without a reload.
  loadAll: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['hydrated']);

const normalizeLanguage = (language: unknown) => typeof language === 'string' ? language.split(/[-_]/)[0]?.toLowerCase() || 'en' : 'en';

// Locales load on demand: the playground (loadAll) imports the aggregate
// "i18n/all" module so every language is registered up front and runtime
// switches are fetch-free. Everywhere else only the active language is
// imported (English ships in the main bundle, so it is skipped). The library's
// own ensure_locale fallback covers any miss.
const loadLocale = async (language: string) => {
  if (props.loadAll) {
    await import('add-to-calendar-button/i18n/all');
  } else if (language !== 'en') {
    await import(/* @vite-ignore */ `add-to-calendar-button/i18n/${language}`);
  }
};

// The ssr html is generated on the server and carried to the client via useState:
// hydration then keeps the painted shell in place. The plain tag (and with it the
// swap) only renders once the custom element signals a COMPLETE render via its
// whenInitialized() callback - before that, the shell stays untouched.
// The state key derives deterministically from the attrs (identical on server and
// client, independent of render order); a per-content discriminator separates
// multiple buttons with the exact same config.
const attrs = useAttrs();
const loadedLanguage = ref(normalizeLanguage(attrs.language));
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

  // The statically generated playground starts with blank attrs; its real config
  // arrives from localStorage after mount. If that config describes an all-past
  // event with pastDateHandling="hide", discard the stale build-time shell before
  // the component bundle loads. The SSR generator deliberately returns a host
  // without a DSD template for that case.
  watchEffect(() => {
    if (hydrated.value || props.skipClientLoad) return;
    const nextHtml = atcb_generate_ssr_html({ ...attrs } as AddToCalendarButtonType & { [key: string]: unknown });
    if (nextHtml.includes('<template shadowrootmode="open">')) return;
    html.value = nextHtml;
    if (shellHost.value) shellHost.value.innerHTML = nextHtml;
  });

  watch(() => attrs.language, (language) => {
    if (props.skipClientLoad) return;
    loadedLanguage.value = normalizeLanguage(language);
  });

  onMounted(async () => {
    // bots (or any caller that sets skipClientLoad) keep the shell forever -
    // no script download, no upgrade, no swap
    if (props.skipClientLoad) return;
    // register styles before the web component so the upgrade never needs a css
    // fetch and the shell swaps straight into the fully styled button. The
    // playground (loadAll) imports the aggregate "styles/all" module so every
    // style delta is registered up front; everywhere else only the active
    // style is imported (the default style ships in the main bundle).
    const buttonStyle = typeof attrs.buttonStyle === 'string' && attrs.buttonStyle !== '' ? attrs.buttonStyle : 'default';
    const styleImport = props.loadAll
      ? import('add-to-calendar-button/styles/all')
      : buttonStyle === 'default'
        ? Promise.resolve()
        : import(/* @vite-ignore */ `add-to-calendar-button/styles/${buttonStyle}`);
    await Promise.all([
      import('add-to-calendar-button'),
      loadLocale(loadedLanguage.value),
      styleImport,
    ]);
    // the shell element upgrades in place - wait for its complete render
    const el = shellHost.value?.querySelector('add-to-calendar-button') as (HTMLElement & { whenInitialized?: () => Promise<void> }) | null;
    if (el && typeof el.whenInitialized === 'function') {
      await el.whenInitialized();
    }
    // only now swap the ssr markup for the plain tag (attrs-driven, reactive).
    // The swapped-in tag upgrades instantly (same module, same attributes), so
    // there is no second blank window either
    hydrated.value = true;
    emit('hydrated');
  });
}
</script>

<template>
  <add-to-calendar-button v-if="hydrated" v-bind="$attrs" :language="loadedLanguage"></add-to-calendar-button>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span v-else ref="shellHost" v-ssr-html="html" class="contents"></span>
</template>
