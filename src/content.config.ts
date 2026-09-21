import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file, glob } from "astro/loaders";

/**
 * Collections are split by payload kind:
 *   - record-shaped content (projects) uses file() — one editable file, which
 *     is better solo-author ergonomics than N tiny ones.
 *   - prose (about) uses glob() + render().
 */

const about = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/about" }),
  schema: z.object({ title: z.string() }),
});

const projects = defineCollection({
  loader: file("src/content/projects.yaml"),
  schema: z.object({
    name: z.string(),
    blurb: z.string(),
    stack: z.string(),
    status: z.string(),
    /** Which tint the round mark takes. */
    dot: z.enum(["accent-300", "accent-2-300", "accent-200", "accent-2-200"]),
    /** Optional outbound link — source repository, or the running project. */
    link: z.url().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { about, projects };
