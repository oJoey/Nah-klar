import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    frage: z.string(),
    seiten: z.array(z.enum(['start', 'mieten', 'vermieten'])),
    reihenfolge: z.number().default(50),
  }),
});

export const collections = { faq };
