import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project in src/content/projects/. See README.md for every field.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      order: z.number(),
      // main: full row with thumbnail on the home page; compact: short row; also: one-line mention.
      tier: z.enum(['main', 'compact', 'also']).default('main'),
      year: z.string(),
      status: z.string(),
      summary: z.string(),
      result: z.string(),
      role: z.string(),
      tools: z.array(z.string()).default([]),
      question: z.string().optional(),
      contribution: z.array(z.string()).default([]),
      findings: z.array(z.string()).default([]),
      limitation: z.string().optional(),
      youtube: z.string().default(''),
      videoLabel: z.string().default('45-second demo'),
      // Illustrated cover: used for the home-page row and the project-page banner when set.
      cover: image().optional(),
      coverAlt: z.string().default(''),
      coverCaption: z.string().optional(),
      thumbnail: image().optional(),
      thumbnailAlt: z.string().default(''),
      poster: image().optional(),
      figures: z
        .array(
          z.object({
            src: image(),
            caption: z.string(),
            alt: z.string().optional(),
            kind: z.enum(['method', 'result']).default('result'),
            plate: z.boolean().default(true),
          }),
        )
        .default([]),
      links: z
        .object({
          code: z.string().optional(),
          paper: z.string().optional(),
          other: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
        })
        .default({ other: [] }),
    }),
});

export const collections = { projects };
