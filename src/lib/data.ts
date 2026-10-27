import { parse } from 'yaml';
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import profileRaw from '../data/profile.yaml?raw';
import publicationsRaw from '../data/publications.yaml?raw';

// YAML data files are read and validated at build time, so a typo fails the build
// with a clear message instead of rendering a broken page.

const linksSchema = z.object({
  cv: z.string(),
  publicationList: z.string(),
  scholar: z.url(),
  github: z.url(),
  orcid: z.url(),
  linkedin: z.url(),
});

const profileSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  researchQuestion: z.string(),
  role: z.string(),
  affiliation: z.string(),
  affiliationNote: z.string(),
  location: z.string(),
  email: z.email(),
  updated: z.string(),
  intro: z.string(),
  bio: z.array(z.string()),
  interests: z.array(z.string()),
  metrics: z.object({
    papers: z.number(),
    journal: z.number(),
    conference: z.number(),
    citations: z.number(),
    hIndex: z.number(),
    i10Index: z.number(),
    checked: z.string(),
    checkedShort: z.string(),
  }),
  links: linksSchema,
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      place: z.string(),
      dates: z.string(),
      detail: z.string().optional(),
    }),
  ),
  experience: z.array(
    z.object({ role: z.string(), org: z.string(), place: z.string(), dates: z.string() }),
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string(),
      badge: z.string(),
      url: z.url().optional(),
    }),
  ),
  awards: z.array(z.string()),
  languages: z.array(z.string()),
});

const paperSchema = z.object({
  authors: z.string(),
  title: z.string(),
  venue: z.string(),
  details: z.string().optional(),
  year: z.number(),
  doi: z.string().optional(),
  note: z.string().optional(),
  project: z.string().optional(),
  code: z.url().optional(),
});

const publicationsSchema = z.object({
  contributionNote: z.string(),
  journal: z.array(paperSchema),
  conference: z.array(paperSchema),
  inPreparation: z.array(
    z.object({ title: z.string(), note: z.string(), project: z.string().optional() }),
  ),
  thesis: z.array(paperSchema),
});

export type Paper = z.infer<typeof paperSchema>;
export type Profile = z.infer<typeof profileSchema>;

function load<T>(file: string, source: string, schema: z.ZodType<T>): T {
  const result = schema.safeParse(parse(source));
  if (!result.success) {
    throw new Error(`Invalid src/data/${file}: ${result.error.message}`);
  }
  return result.data;
}

export const profile = load('profile.yaml', profileRaw, profileSchema);
export const publications = load('publications.yaml', publicationsRaw, publicationsSchema);

const badgeFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/badges/*', {
  eager: true,
});

export function badgeImage(fileName: string): ImageMetadata {
  const match = Object.entries(badgeFiles).find(([path]) => path.endsWith(`/${fileName}`));
  if (!match) throw new Error(`Badge image not found in src/assets/badges/: ${fileName}`);
  return match[1].default;
}

/** Split an author string so the site owner's name can be bolded. */
export function splitAuthors(authors: string, me = 'T. Tahir'): { text: string; isMe: boolean }[] {
  return authors.split(', ').map((text) => ({ text, isMe: text === me }));
}
