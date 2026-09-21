/**
 * Single source of truth for the deployed origin and base path.
 *
 * `astro.config.ts` imports SITE_ORIGIN and BASE_PATH from here for its `site`
 * and `base` values. That is deliberate: if the origin were written once in the
 * config and again in this module, the two would drift, and a drifted origin
 * produces a silently broken `og:image` — no build error, no console warning,
 * just a blank card on every social scraper.
 *
 * The repo is named `Julia-Dubenchuk.github.io`, which makes this a GitHub Pages
 * *user site* served at the origin root — so BASE_PATH is empty and `withBase()`
 * is a pass-through. It is kept rather than removed because it is the seam: if
 * this ever moves back to a project page, setting BASE_PATH here fixes every
 * link at once. Astro prefixes assets it compiles; it does NOT rewrite
 * `<a href>`, links written inside content markdown, or string paths into
 * `public/`, which is why those go through `withBase()` regardless.
 */

export const SITE_ORIGIN = "https://julia-dubenchuk.github.io";

/**
 * No trailing slash. `withBase` owns joining, so the semantics are decided once.
 * Empty for a user site; set to e.g. "/personal-blog" for a project page.
 */
export const BASE_PATH = "";

/** Internal links and `public/` assets. */
export function withBase(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${suffix}`.replace(/\/{2,}/g, "/");
}

/** `og:url`, `og:image`, and `<link rel="canonical">` — these need a full origin. */
export function absoluteUrl(path: string): string {
  return `${SITE_ORIGIN}${withBase(path)}`;
}
