<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { ClipboardIcon, ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline';
import { createHighlighter } from 'shiki'
import githublight from 'shiki/themes/github-light.mjs';
import githubdark from 'shiki/themes/github-dark.mjs';

const highlighter = await createHighlighter({
  themes: [githublight, githubdark],
  langs: [
    import('shiki/langs/shellscript.mjs'),
    import('shiki/langs/javascript.mjs'),
    import('shiki/langs/html.mjs'),
  ]
})

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  inline: {
    type: Boolean,
    default: false
  },
  slim: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'html'
  }
});

// get the code from the default slot
const slots = useSlots() as { default?: () => any[] };
const codeBlock = computed(() => {
  if (slots.default) {
    const string = slots.default().map(vNode => {
      return vNode.children;
    }).join('');
    const highlighted = highlighter.codeToHtml(string, {
      lang: props.language,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      }
    });
    return highlighted;
  }
  return '';
});

// copy the code to the clipboard
const copied = ref(false);
function copyCodeFromElement(el: HTMLElement | null) {
  const timeoutIdMap: WeakMap<HTMLElement, NodeJS.Timeout> = new WeakMap();
  if (!el || !el.matches('div.code-block > button.copy')) {
    return;
  }
  const parent = el.parentElement;
  const sibling = el.nextElementSibling;
  if (!parent || !sibling) {
    return;
  }
  const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className);
  const clone = sibling.cloneNode(true) as HTMLElement;
  let text = clone.textContent || '';
  if (isShell) {
    text = text.replace(/^ *(\$|>) /gm, '').trim();
  }
  copyToClipboard(text).then(() => {
    el.classList.add('copied');
    copied.value = true;
    clearTimeout(timeoutIdMap.get(el));
    const timeoutId = setTimeout(() => {
      el.classList.remove('copied');
      copied.value = false;
      el.blur();
      timeoutIdMap.delete(el);
    }, 2000);
    timeoutIdMap.set(el, timeoutId);
  });
}

async function copyToClipboard(text: string) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement('textarea');
    const prevFocus = document.activeElement;
    element.value = text;
    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '');
    element.style.contain = 'strict';
    element.style.position = 'fixed';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.opacity = '0';
    element.style.outline = 'none';
    element.style.pointerEvents = 'none';
    element.style.fontSize = '12pt'; // Prevent zooming on iOS
    document.body.appendChild(element);
    element.focus();
    element.select();
    // Explicit selection workaround for iOS
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand('copy');
    document.body.removeChild(element);
    if (prevFocus && typeof (prevFocus as HTMLElement).focus === 'function') (prevFocus as HTMLElement).focus();
  }
}
</script>

<template>
  <div :class="['code-block', props.slim ? 'slim my-3 text-xs lg:text-sm' : 'my-5 text-sm', 'group relative w-full rounded-md border border-gray-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900', props.class]">
    <button
      :title="$t('labels.copy_code')"
      :class="['copy', props.slim ? 'right-1 top-1' : 'right-2 top-2', 'absolute z-10 flex h-9 items-center justify-center rounded-md border border-zinc-400 bg-zinc-100 px-2 text-zinc-700 opacity-0 transition-transform hover:shadow-lg focus:opacity-100 group-hover:opacity-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300', copied ? 'w-auto cursor-default' : 'w-9 cursor-pointer hover:border-secondary-dark hover:bg-secondary hover:text-black hover:dark:border-secondary-dark hover:dark:bg-secondary hover:dark:text-black']"
      @click="copyCodeFromElement($event.currentTarget as HTMLElement)"
    >
      <span v-if="copied" class="pl-1 pr-3 text-xs font-semibold">{{ $t('labels.copied') }}</span>
      <ClipboardIcon v-if="!copied" class="h-5 w-5" aria-hidden="true" />
      <ClipboardDocumentCheckIcon v-else class="h-5 w-5" aria-hidden="true" />
    </button>
    <span v-html="codeBlock"></span>
  </div>
</template>

<style>
html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
}

pre.shiki,
.shiki code {
  @apply font-mono !bg-transparent text-left whitespace-pre break-normal;
  direction: ltr;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

pre.shiki {
  @apply relative m-0 px-0 py-4 overflow-x-auto;
}

.slim pre.shiki {
  @apply py-3;
}

.shiki code {
  @apply block px-5 w-fit min-w-full;
}

.slim .shiki code {
  @apply px-4;
}
</style>
