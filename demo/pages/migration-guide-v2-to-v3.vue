<script setup lang="ts">
import migrationGuide from '../../MIGRATION.md?raw';

const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));

definePageMeta({
  title: 'navigation.migration-v3',
  description: 'meta.migration-v3.description',
});

type Block = { type: string; lines: string[] };
type GuideBlock =
  | { type: 'html'; content: string }
  | { type: 'code'; content: string; language: string };

function inlineMarkdown(value: string) {
  const escaped = value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderBlock(block: Block) {
  if (block.type === 'paragraph') {
    return `<p>${inlineMarkdown(block.lines.join(' '))}</p>`;
  }
  if (block.type === 'ul' || block.type === 'ol') {
    const items = block.lines.map((line) => `<li>${inlineMarkdown(line.replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))}</li>`).join('');
    return `<${block.type}>${items}</${block.type}>`;
  }
  if (block.type === 'table') {
    const rows = block.lines.filter((_, index) => index !== 1).map((line) => line.slice(1, -1).split('|').map((cell) => cell.trim()));
    const headerRow = rows[0] ?? [];
    const head = `<thead><tr>${headerRow.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${rows.slice(1).map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<div class="table-wrap"><table>${head}${body}</table></div>`;
  }
  return '';
}

function renderMarkdown(markdown: string) {
  const lines = markdown.split('\n');
  const blocks: GuideBlock[] = [];
  const html: string[] = [];
  let block: Block | undefined;
  let inCode = false;
  let codeLanguage = 'html';

  const flush = () => {
    if (block) html.push(renderBlock(block));
    block = undefined;
  };

  const flushHtml = () => {
    if (html.length) {
      blocks.push({ type: 'html', content: html.join('') });
      html.length = 0;
    }
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        if (block) {
          blocks.push({
            type: 'code',
            content: block.lines.join('\n'),
            language: codeLanguage,
          });
        }
        block = undefined;
      } else {
        flush();
        flushHtml();
        const fenceLanguage = line.slice(3).trim();
        codeLanguage = fenceLanguage === 'js' || fenceLanguage === 'ts' ? 'javascript' : fenceLanguage || 'html';
        block = { type: 'code', lines: [] };
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      block?.lines.push(line);
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flush();
      const hashes = heading[1] ?? '#';
      const headingText = heading[2] ?? '';
      const level = hashes.length;
      const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      html.push(`<h${level} id="${id}">${inlineMarkdown(headingText)}</h${level}>`);
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    if (/^\s{2,}\S/.test(line) && (block?.type === 'ul' || block?.type === 'ol')) {
      const lastIndex = block.lines.length - 1;
      block.lines[lastIndex] = `${block.lines[lastIndex] ?? ''} ${line.trim()}`;
      continue;
    }
    const type = /^\s*[-*]\s+/.test(line) ? 'ul' : /^\s*\d+\.\s+/.test(line) ? 'ol' : line.startsWith('|') ? 'table' : 'paragraph';
    if (block?.type !== type) {
      flush();
      block = { type, lines: [] };
    }
    block.lines.push(line);
  }
  flush();
  flushHtml();
  return blocks;
}

const renderedGuide = renderMarkdown(migrationGuide);
</script>

<template>
  <article class="migration-guide">
    <template v-for="(block, index) in renderedGuide" :key="index">
      <!-- The source is a trusted, repository-local Markdown file. -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-if="block.type === 'html'" class="contents" v-html="block.content"></div>
      <LazyCodeBlock v-else :language="block.language">{{ block.content }}</LazyCodeBlock>
    </template>
  </article>
</template>

<style scoped>
.migration-guide :deep(h1) {
  @apply mb-12 underline decoration-primary-light decoration-4 dark:decoration-primary-dark;
}

.migration-guide :deep(h2) {
  @apply mb-4 mt-14 border-t border-zinc-300 pt-12 dark:border-zinc-700;
}

.migration-guide :deep(h3) {
  @apply mb-3 mt-8;
}

.migration-guide :deep(p),
.migration-guide :deep(ul),
.migration-guide :deep(ol) {
  @apply my-4;
}

.migration-guide :deep(ul),
.migration-guide :deep(ol) {
  @apply ml-6 text-left;
}

.migration-guide :deep(ul) {
  @apply list-disc;
}

.migration-guide :deep(ol) {
  @apply list-decimal;
}

.migration-guide :deep(li) {
  @apply my-2 pl-1;
}

.migration-guide :deep(.table-wrap) {
  @apply my-6 overflow-x-auto;
}

.migration-guide :deep(table) {
  @apply w-full min-w-max border-collapse text-left text-sm;
}

.migration-guide :deep(th),
.migration-guide :deep(td) {
  @apply border border-zinc-300 px-3 py-2 align-top dark:border-zinc-700;
}

.migration-guide :deep(th) {
  @apply bg-zinc-100 font-semibold dark:bg-zinc-800;
}
</style>
