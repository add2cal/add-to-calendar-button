import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { themeConfig } from '../theme.config';

// Collections marked as on-demand in `themeConfig.onDemandRenderedCollections` are
// assumed to be large — that is the only reason to opt out of prerendering. For
// those, we also enable `deferRender` so the glob loader skips
// eager rendering during sync and renders entries on demand instead. This
// trades cached render output for lower memory usage during sync, which is the
// right trade for large collections. See https://astro.build/blog/astro-710/
const onDemandCollections = new Set<string>(themeConfig.onDemandRenderedCollections ?? []);

const faq_answers = defineCollection({
  loader: glob({ pattern: ['**/[^_]**.md'], base: './src/content/faq-answers', deferRender: onDemandCollections.has('faq_answers') }),
  schema: () =>
    z.object({
      publishDate: z.date().optional(),
      updateDate: z.date().optional(),
      draft: z.boolean().optional(),
      question: z.string(),
      category: z.string().optional(),
      llmsTxt: z.boolean().optional(),
    }),
});

export const collections = { faq_answers };
