#!/usr/bin/env node

// This script generates an `llms.txt` file after
// the Astro build has finished. Unlike the previous version, it does NOT
// scrape the full body of every page or article. Instead it lists:
//   - the site headline and description (from the rendered home page)
//   - the available languages (linked to their localized home page)
//   - an optional intro quote (from `theme.config.ts -> llms.intro`)
//   - pages   : title + meta description + URL
//   - FAQ     : question + full markdown answer
//   - articles: title + excerpt + URL
//
// Inclusion is controlled via the `llms` block in `theme.config.ts`:
//   - excludePagesPattern, includePages (glob patterns / explicit URLs)
//   - addArticles, addFAQ ("none" | "all" | "selected")

import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
// The Cloudflare adapter places static assets under dist/client/; fall back
// to dist/ for plain static builds.
const _distBase = path.join(rootDir, 'dist');
const distDir = fs.existsSync(path.join(_distBase, 'client')) ? path.join(_distBase, 'client') : _distBase;
const contentDir = path.join(rootDir, 'src', 'content');

console.log('🚀 Starting llms.txt generation...');

// ---------------------------------------------------------------------------
// theme.config.ts parsing (lightweight regex parser - good enough for our
// needs and avoids pulling in a TS compiler at build time)
// ---------------------------------------------------------------------------

let cachedConfig = null;

function loadThemeConfig() {
  if (cachedConfig) return cachedConfig;

  const config = {
    site: '',
    hostname: '',
    i18n: {
      defaultLocale: 'en',
      locales: ['en'],
      languages: {},
    },
    onDemandRenderedCollections: [],
    llms: {
      autoGeneration: false,
      intro: '',
      excludePagesPattern: [],
      includePages: [],
      addArticles: 'none',
      addEvents: 'none',
      addFAQ: 'none',
    },
  };

  try {
    // Strip leading full-line `//` comments so the lightweight regex parser
    // below ignores commented-out config. Only lines whose first non-whitespace
    // is `//` are removed, leaving `//` inside string values (e.g. https:// URLs)
    // untouched.
    const themeConfigContent = fs.readFileSync(path.join(rootDir, 'theme.config.ts'), 'utf-8').replace(/^\s*\/\/.*$/gm, '');

    // site URL
    const siteMatch = themeConfigContent.match(/site:\s*(?:import\.meta\.env\.[A-Z_]+\s*\|\|\s*)?['"]([^'"]+)['"]/);
    if (siteMatch) {
      config.site = siteMatch[1].replace(/\/+$/, '');
      try {
        config.hostname = new URL(config.site).hostname;
      } catch {
        /* ignore */
      }
    }

    // i18n block - grab a balanced-ish slice starting at `i18n: {`
    const i18nBlock = extractBlock(themeConfigContent, /i18n:\s*\{/);
    if (i18nBlock) {
      const defaultLocaleMatch = i18nBlock.match(/defaultLocale:\s*['"]([^'"]+)['"]/);
      if (defaultLocaleMatch) config.i18n.defaultLocale = defaultLocaleMatch[1];

      const localesMatch = i18nBlock.match(/locales:\s*\[([^\]]*)\]/);
      if (localesMatch) {
        config.i18n.locales = localesMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);
      }

      const languagesBlock = extractBlock(i18nBlock, /languages:\s*\{/);
      if (languagesBlock) {
        const entryRe = /([A-Za-z0-9_-]+)\s*:\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = entryRe.exec(languagesBlock)) !== null) {
          config.i18n.languages[m[1]] = m[2];
        }
      }
    }

    // onDemandRenderedCollections - collections rendered SSR (no static HTML
    // in /dist), e.g. ['articles', 'integration_options'].
    const onDemandMatch = themeConfigContent.match(/onDemandRenderedCollections:\s*\[([\s\S]*?)\]/);
    if (onDemandMatch) {
      config.onDemandRenderedCollections = onDemandMatch[1]
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''))
        .filter(Boolean);
    }

    // llms block
    const llmsBlock = extractBlock(themeConfigContent, /llms:\s*\{/);
    if (llmsBlock) {
      const autoGenMatch = llmsBlock.match(/autoGeneration:\s*(true|false)/);
      if (autoGenMatch) config.llms.autoGeneration = autoGenMatch[1] === 'true';

      const introMatch = llmsBlock.match(/intro:\s*(['"`])([\s\S]*?)\1/);
      if (introMatch) config.llms.intro = introMatch[2];

      const excludeMatch = llmsBlock.match(/excludePagesPattern:\s*\[([\s\S]*?)\]/);
      if (excludeMatch) {
        config.llms.excludePagesPattern = excludeMatch[1]
          .split(',')
          .map((s) => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);
      }

      const includeMatch = llmsBlock.match(/includePages:\s*\[([\s\S]*?)\]/);
      if (includeMatch) {
        config.llms.includePages = includeMatch[1]
          .split(',')
          .map((s) => {
            const v = s.trim().replace(/['"]/g, '');
            return v && !v.startsWith('/') ? `/${v}` : v;
          })
          .filter(Boolean);
      }

      const addArticlesMatch = llmsBlock.match(/addArticles:\s*(?:LlmsContentInclusion\.([A-Za-z]+)|['"]([A-Za-z]+)['"])/);
      if (addArticlesMatch) {
        const v = (addArticlesMatch[1] || addArticlesMatch[2] || '').toLowerCase();
        if (['none', 'all', 'selected'].includes(v)) config.llms.addArticles = v;
      }

      const addFAQMatch = llmsBlock.match(/addFAQ:\s*(?:LlmsContentInclusion\.([A-Za-z]+)|['"]([A-Za-z]+)['"])/);
      if (addFAQMatch) {
        const v = (addFAQMatch[1] || addFAQMatch[2] || '').toLowerCase();
        if (['none', 'all', 'selected'].includes(v)) config.llms.addFAQ = v;
      }

      const addEventsMatch = llmsBlock.match(/addEvents:\s*(?:LlmsContentInclusion\.([A-Za-z]+)|['"]([A-Za-z]+)['"])/);
      if (addEventsMatch) {
        const v = (addEventsMatch[1] || addEventsMatch[2] || '').toLowerCase();
        if (['none', 'all', 'selected'].includes(v)) config.llms.addEvents = v;
      }
    }
  } catch (error) {
    console.warn('Warning: Could not parse theme.config.ts:', error.message);
  }

  cachedConfig = config;
  return config;
}

/**
 * Extract a brace-balanced block starting after a match of `startRegex`.
 * Returns the inner contents of the outermost `{ ... }` block.
 */
function extractBlock(source, startRegex) {
  const match = source.match(startRegex);
  if (!match) return null;
  const openIdx = source.indexOf('{', match.index);
  if (openIdx === -1) return null;
  let depth = 0;
  for (let i = openIdx; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(openIdx + 1, i);
    }
  }
  return null;
}

function getPrefixDefaultLocale() {
  for (const fileName of ['astro.config.ts', 'astro.config.mjs', 'astro.config.js']) {
    const p = path.join(rootDir, fileName);
    if (!fs.existsSync(p)) continue;
    const content = fs.readFileSync(p, 'utf-8');
    const m = content.match(/prefixDefaultLocale:\s*(true|false)/);
    if (m) return m[1] === 'true';
  }
  return false;
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function getPageMetaFromFile(filePath) {
  try {
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let title = '';
    const titleTag = doc.querySelector('title');
    if (titleTag) {
      // Use only the first segment of "Title | Site"
      title = titleTag.textContent.trim().split('|')[0].trim();
    }

    let description = '';
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (metaDesc) description = (metaDesc.getAttribute('content') || '').trim();

    let noindex = false;
    const robotsMetas = doc.querySelectorAll('meta[name="robots"]');
    for (const m of robotsMetas) {
      const content = (m.getAttribute('content') || '').toLowerCase();
      if (content.includes('noindex')) {
        noindex = true;
        break;
      }
    }

    return { title, description, noindex };
  } catch (error) {
    console.warn(`Warning: Could not read meta for ${filePath}:`, error.message);
    return { title: '', description: '', noindex: false };
  }
}

// ---------------------------------------------------------------------------
// URL / language helpers
// ---------------------------------------------------------------------------

function detectLanguageFromPath(urlPath, availableLocales, defaultLocale) {
  const match = urlPath.match(/^\/([a-z]{2})(?:\/|$)/);
  if (match && availableLocales.includes(match[1])) return match[1];
  return defaultLocale;
}

function localeHomeUrl(site, locale, defaultLocale, prefixDefaultLocale) {
  if (locale === defaultLocale && !prefixDefaultLocale) return `${site}/`;
  return `${site}/${locale}`;
}

/**
 * Convert a single glob pattern (subset: `*`, `**`) into a RegExp.
 */
function globToRegex(pattern) {
  let p = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  p = p.replace(/\*\*/g, '__DOUBLE_STAR__');
  p = p.replace(/\*/g, '[^/]*');
  p = p.replace(/__DOUBLE_STAR__/g, '.*');
  return new RegExp(`^${p}$`);
}

function matchesAnyPattern(urlPath, patterns) {
  if (!patterns || patterns.length === 0) return false;
  const variants = [urlPath, urlPath.endsWith('/') ? urlPath.slice(0, -1) : `${urlPath}/`];
  return patterns.some((pat) => {
    const re = globToRegex(pat);
    return variants.some((v) => re.test(v));
  });
}

// ---------------------------------------------------------------------------
// Page discovery (from /dist)
// ---------------------------------------------------------------------------

function getDistPages(config) {
  const pages = [];
  if (!fs.existsSync(distDir)) return pages;

  const { defaultLocale, locales } = config.i18n;

  function visit(dir, urlBase = '') {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (entry.startsWith('[') && entry.endsWith(']')) continue; // dynamic routes
        visit(fullPath, `${urlBase}/${entry}`);
        continue;
      }
      if (!entry.endsWith('.html')) continue;
      if (entry === '404.html') continue;

      let urlPath;
      if (entry === 'index.html') {
        urlPath = urlBase === '' ? '/' : `${urlBase}/`;
      } else {
        urlPath = `${urlBase}/${entry.replace(/\.html$/, '')}`;
      }

      pages.push({
        filePath: fullPath,
        urlPath,
        language: detectLanguageFromPath(urlPath, locales, defaultLocale),
      });
    }
  }

  visit(distDir);
  return pages;
}

function isUnderCollection(urlPath, segments) {
  // Strip leading locale segment if any
  const stripped = urlPath.replace(/^\/[a-z]{2}(?=\/)/, '');
  return segments.some((seg) => stripped === `/${seg}` || stripped.startsWith(`/${seg}/`));
}

// ---------------------------------------------------------------------------
// Collection discovery (articles + FAQ)
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!fmMatch) return { data: {}, body: content };

  const raw = fmMatch[1];
  const body = fmMatch[2];
  const data = {};

  // Simple line-based parser supporting `key: value` and `key: "value"`.
  // Multi-line / nested structures are ignored (not needed for our fields).
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (value === '') continue;
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value === 'true') value = true;
    else if (value === 'false') value = false;
    data[m[1]] = value;
  }

  return { data, body };
}

function scanCollectionDir(collectionDir, defaultLocale) {
  // Returns: [{ locale, slug, data, body, filePath }]
  const items = [];
  if (!fs.existsSync(collectionDir)) return items;

  function visit(dir, locale = null) {
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (entry.startsWith('.') || entry.startsWith('_')) continue;
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        // First level subdirs are treated as locale (matching Astro's glob
        // base + `{lang}/...` convention used elsewhere in this project).
        visit(fullPath, locale || entry);
      } else if (entry.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, body } = parseFrontmatter(raw);
        items.push({
          locale: locale || defaultLocale,
          slug: entry.replace(/\.md$/, ''),
          data,
          body: body.trim(),
          filePath: fullPath,
        });
      }
    }
  }

  visit(collectionDir);
  return items;
}

// Resolve a collection item's URL path slug. A custom `slug` frontmatter is
// used verbatim; otherwise we fall back to the filename, which Astro's glob
// loader lowercases when building the route - so we lowercase it too.
function collectionSlug(item) {
  const custom = typeof item.data.slug === 'string' && item.data.slug;
  const slug = custom || item.slug.toLowerCase();
  // If slug already contains the locale prefix (e.g. "de/foo"), strip it.
  return slug.replace(/^[a-z]{2}\//, '');
}

function articleUrlPath(item, defaultLocale, prefixDefaultLocale) {
  const slug = collectionSlug(item);
  const usePrefix = item.locale !== defaultLocale || prefixDefaultLocale;
  return usePrefix ? `/${item.locale}/blog/${slug}` : `/blog/${slug}`;
}

function eventUrlPath(item, defaultLocale, prefixDefaultLocale) {
  const slug = collectionSlug(item);
  const usePrefix = item.locale !== defaultLocale || prefixDefaultLocale;
  return usePrefix ? `/${item.locale}/events/detail/${slug}` : `/events/detail/${slug}`;
}

/**
 * Resolve a collection's overview page (e.g. `/blog`, `/integration`) for the
 * default locale. Returns `{ url, title, description }` only if the overview was
 * built as static HTML in /dist AND is not knocked out by `excludePagesPattern`.
 * Used when a collection is rendered on-demand (no static detail pages exist),
 * so we link to its entry point instead of dropping the content entirely.
 */
function resolveOverviewEntryPoint(segment, defaultLocale, prefixDefaultLocale, site, excludePatterns) {
  const urlPath = prefixDefaultLocale ? `/${defaultLocale}/${segment}` : `/${segment}`;

  if (matchesAnyPattern(urlPath, excludePatterns)) return null;

  // Astro emits overview pages either as `<segment>/index.html`
  // (build.format: 'directory') or `<segment>.html` (build.format: 'file').
  const baseDir = prefixDefaultLocale ? path.join(distDir, defaultLocale) : distDir;
  const candidates = [path.join(baseDir, segment, 'index.html'), path.join(baseDir, `${segment}.html`)];
  const indexFile = candidates.find((f) => fs.existsSync(f));
  if (!indexFile) return null;

  const meta = getPageMetaFromFile(indexFile);
  if (meta.noindex) return null;

  return { url: `${site}${urlPath}`, title: meta.title || segment, description: meta.description };
}

function selectCollectionItems(items, mode, locale, includePages, urlBuilder) {
  return items
    .filter((it) => it.locale === locale)
    .filter((it) => {
      const url = urlBuilder(it);
      if (includePages.includes(url)) return true;
      if (mode === 'all') return true;
      if (mode === 'selected') return it.data.llmsTxt === true;
      return false;
    });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function generateLLMFiles() {
  const config = loadThemeConfig();

  if (!config.llms.autoGeneration) {
    console.log('ℹ️  llms.autoGeneration is disabled in theme.config.ts. Skipping.');
    return;
  }

  const { site, hostname, i18n, llms } = config;
  const { defaultLocale, locales, languages } = i18n;
  const prefixDefaultLocale = getPrefixDefaultLocale();

  // Discover pages
  const distPages = getDistPages(config);
  console.log(`📄 Found ${distPages.length} HTML pages in /dist`);

  // Discover collections
  const articleItems = scanCollectionDir(path.join(contentDir, 'articles'), defaultLocale);
  const faqItems = scanCollectionDir(path.join(contentDir, 'faq-answers'), defaultLocale);
  const eventItems = scanCollectionDir(path.join(contentDir, 'events'), defaultLocale);
  console.log(`📚 Found ${articleItems.length} article(s), ${eventItems.length} event(s) and ${faqItems.length} FAQ entry/entries`);

  // A single llms.txt is generated, using the default-locale content. The
  // available-languages list (below) lets an LLM point users to the right
  // localized URL when needed.
  const lang = defaultLocale;
  console.log(`\n🌐 Generating llms.txt (default locale: ${lang})`);

  const homePath = !prefixDefaultLocale ? '/' : `/${lang}/`;
  const homeFile = !prefixDefaultLocale ? path.join(distDir, 'index.html') : path.join(distDir, lang, 'index.html');
  const rootMeta = fs.existsSync(homeFile) ? getPageMetaFromFile(homeFile) : { title: '', description: '' };

  // ---- Header ----
  let out = '';
  const headline = rootMeta.title;
  out += `# ${headline}`;
  if (hostname) {
    if (headline) out += ' | ';
    out += `${hostname}`;
  }
  out += `\n\n`;

  // ---- Intro quote ----
  if (llms.intro && llms.intro.trim()) {
    const quoted = llms.intro
      .trim()
      .split(/\r?\n/)
      .map((line) => `> ${line}`)
      .join('\n');
    out += `${quoted}\n\n`;
  }

  // ---- Last updated timestamp ----
  out += `Last updated on: ${new Date().toISOString()}\n\n`;

  // ---- Languages ----
  out += `## Languages\n\n`;
  for (const code of locales) {
    const name = languages[code] || code;
    const url = localeHomeUrl(site, code, defaultLocale, prefixDefaultLocale);
    const suffix = code === defaultLocale ? ': default' : '';
    out += `- [${name}](${url})${suffix}\n`;
  }
  out += `\n`;

  // ---- Pages ----
  const collectionSegments = ['blog', 'events', 'faq', 'faq-answers'];
  const langPages = distPages
    .filter((p) => p.language === lang)
    .filter((p) => {
      // Skip pages that belong to the article/event/FAQ collections - those are
      // handled separately below.
      if (isUnderCollection(p.urlPath, collectionSegments)) return false;

      const explicitlyIncluded = llms.includePages.includes(p.urlPath);
      if (explicitlyIncluded) return true;

      if (matchesAnyPattern(p.urlPath, llms.excludePagesPattern)) return false;

      const meta = getPageMetaFromFile(p.filePath);
      if (meta.noindex) return false;
      return true;
    })
    // Stable ordering: home first, then alphabetical
    .sort((a, b) => {
      if (a.urlPath === homePath) return -1;
      if (b.urlPath === homePath) return 1;
      return a.urlPath.localeCompare(b.urlPath);
    });

  if (langPages.length > 0) {
    out += `## Pages\n\n`;
    for (const p of langPages) {
      const meta = getPageMetaFromFile(p.filePath);
      const title = meta.title || p.urlPath;
      const url = `${site}${p.urlPath}`;
      const details = meta.description ? `: ${meta.description}` : '';
      out += `- [${title}](${url})${details}\n`;
    }
    out += `\n`;
  }

  // ---- FAQ ----
  const selectedFaq = selectCollectionItems(
    faqItems,
    llms.addFAQ,
    lang,
    llms.includePages,
    // FAQ entries don't get dedicated URLs in this template, so the
    // includePages override matches against a synthetic path.
    (it) => `/faq#${it.slug}`,
  );
  if (selectedFaq.length > 0) {
    out += `## FAQ\n\n`;
    for (const it of selectedFaq) {
      const question = it.data.question || it.slug;
      const url = `${site}/faq#${it.slug}`;
      const answer = it.body ? `: ${it.body.replace(/\s+/g, ' ').trim()}` : '';
      out += `- [${question}](${url})${answer}\n`;
    }
    out += `\n`;
  }

  // ---- Articles ----
  // When the `articles` collection is rendered on-demand, no static article
  // pages exist in /dist. Rather than listing items we cannot reliably link
  // to, point agents at the /blog overview as the entry point.
  const articlesOnDemand = config.onDemandRenderedCollections.includes('articles');
  if (articlesOnDemand && llms.addArticles !== 'none') {
    const entry = resolveOverviewEntryPoint('blog', defaultLocale, prefixDefaultLocale, site, llms.excludePagesPattern);
    if (entry) {
      out += `## Articles\n\n`;
      out += `- [${entry.title}](${entry.url})${entry.description ? `: ${entry.description}` : ''}\n`;
      out += `  This collection is rendered on-demand. Use this overview page as the entry point to discover all articles.\n\n`;
    }
  } else {
    const selectedArticles = selectCollectionItems(articleItems, llms.addArticles, lang, llms.includePages, (it) => articleUrlPath(it, defaultLocale, prefixDefaultLocale));
    if (selectedArticles.length > 0) {
      out += `## Articles\n\n`;
      for (const it of selectedArticles) {
        const title = it.data.title || it.slug;
        const excerpt = it.data.excerpt || '';
        const url = `${site}${articleUrlPath(it, defaultLocale, prefixDefaultLocale)}`;
        const details = excerpt ? `: ${excerpt}` : '';
        out += `- [${title}](${url})${details}\n`;
      }
      out += `\n`;
    }
  }

  // ---- Events ----
  // Mirrors the Articles logic: when the `events` collection is rendered
  // on-demand, no static event pages exist in /dist, so we point agents at the
  // /events overview instead of listing items we cannot reliably link to.
  const eventsOnDemand = config.onDemandRenderedCollections.includes('events');
  if (eventsOnDemand && llms.addEvents !== 'none') {
    const entry = resolveOverviewEntryPoint('events', defaultLocale, prefixDefaultLocale, site, llms.excludePagesPattern);
    if (entry) {
      out += `## Events\n\n`;
      out += `- [${entry.title}](${entry.url})${entry.description ? `: ${entry.description}` : ''}\n`;
      out += `  This collection is rendered on-demand. Use this overview page as the entry point to discover all events.\n\n`;
    }
  } else {
    const selectedEvents = selectCollectionItems(eventItems, llms.addEvents, lang, llms.includePages, (it) => eventUrlPath(it, defaultLocale, prefixDefaultLocale));
    if (selectedEvents.length > 0) {
      out += `## Events\n\n`;
      for (const it of selectedEvents) {
        const title = it.data.title || it.slug;
        const description = it.data.description || '';
        const url = `${site}${eventUrlPath(it, defaultLocale, prefixDefaultLocale)}`;
        const details = description ? `: ${description}` : '';
        out += `- [${title}](${url})${details}\n`;
      }
      out += `\n`;
    }
  }

  // ---- Integration options ----
  // Integration detail pages have no dedicated llms setting. The /integration
  // overview is picked up by the Pages section automatically (unless excluded
  // via excludePagesPattern), so on-demand rendering needs no special handling
  // here - the overview already serves as the entry point.

  const outPath = path.join(distDir, `llms.txt`);
  fs.writeFileSync(outPath, out, 'utf-8');
  console.log(`   ✅ Wrote ${path.basename(outPath)} (${(out.length / 1024).toFixed(1)}KB)`);

  console.log(`\n🎉 llms.txt generation complete.`);
}

generateLLMFiles().catch((error) => {
  console.error('❌ Error generating llms.txt:', error);
  process.exit(1);
});
