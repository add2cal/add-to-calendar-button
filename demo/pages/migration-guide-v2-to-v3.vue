<script setup lang="ts">
import migrationGuide from '../../MIGRATION.md?raw';

definePageMeta({
  title: 'navigation.migration-v3',
  description: 'meta.migration-v3.description',
});

type Block = { type: string; lines: string[] };

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
  if (block.type === 'code') {
    return `<pre><code>${inlineMarkdown(block.lines.join('\n'))}</code></pre>`;
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
  const html: string[] = [];
  let block: Block | undefined;
  let inCode = false;

  const flush = () => {
    if (block) html.push(renderBlock(block));
    block = undefined;
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) flush();
      else {
        flush();
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
  return html.join('');
}

const renderedGuide = renderMarkdown(migrationGuide);
</script>

<template>
  <!-- The source is a trusted, repository-local Markdown file. -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <article class="migration-guide" v-html="renderedGuide"></article>
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

.migration-guide :deep(code) {
  @apply rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800;
}

.migration-guide :deep(pre) {
  @apply my-6 overflow-x-auto rounded-lg bg-zinc-900 p-5 text-left text-zinc-100;
}

.migration-guide :deep(pre code) {
  @apply bg-transparent p-0 text-inherit;
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
