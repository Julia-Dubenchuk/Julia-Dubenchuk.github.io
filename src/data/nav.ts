/**
 * The four sections, in header order.
 *
 * These are real routes rather than client-side tabs: the design's tab bar is
 * canvas state, but on a static site each view deserves its own URL so it can
 * be linked, shared and indexed — and so the site needs no JavaScript at all.
 */

export interface NavEntry {
  label: string;
  href: string;
}

export const nav: NavEntry[] = [
  { label: "About", href: "/" },
  { label: "My other activities", href: "/activities" },
  { label: "CV", href: "/cv" },
];
