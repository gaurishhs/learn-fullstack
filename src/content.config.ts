import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({
    base: './src/content/lessons',
    pattern: '**/*.md',
    generateId: ({ data }) => `${data.course}/${data.slug}`,
  }),
  schema: z.object({
    course: z.enum(['html', 'css', 'javascript', 'python']),
    slug: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { lessons };
