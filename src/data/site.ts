/**
 * Site and Profile content.
 *
 * Content lives in data, never in templates — everything a person would want to
 * change without opening a component belongs here.
 *
 * Text below comes from the "Yuliia Blog" design. Anything still reading
 * PLACEHOLDER is waiting on you.
 */

export interface SocialLink {
  label: string;
  href: string;
}

export const site = {
  name: "Yuliia Dubenchuk",
  /** Shown in the round mark beside the name in the header. */
  initial: "Y",

  metaTitle: "Yuliia Dubenchuk — Front-End Developer",
  metaDescription:
    "Front-End Developer · React & TypeScript · 7+ years · growing into full-stack with Node.js and NestJS.",
  ogDescription:
    "Front-End Developer from Ukraine. React and TypeScript, growing into full-stack with Node.js and NestJS.",

  /** The line above the name on the About page. */
  heroKicker: "Hello, I'm",

  /** The sentence directly under the name. */
  intro:
    "Front-End Developer · React & TypeScript · 7+ years · growing into full-stack with Node.js and NestJS.",

  /** Skill pills under the intro. `tone` picks the tag ramp. */
  tags: [
    { label: "React", tone: "accent" },
    { label: "TypeScript", tone: "accent" },
    { label: "Node.js", tone: "accent-2" },
    { label: "NestJS", tone: "accent-2" },
    { label: "Ukraine", tone: "outline" },
  ] as { label: string; tone: "accent" | "accent-2" | "outline" }[],

  /** Caption beside the small round photo in the About sidebar. */
  catCaption: "And this one, who supervises every commit.",

  cv: {
    fileStem: "Yuliia_Dubenchuk_CV",
    updated: "August 2026",
    /** Shown on the About sidebar card. */
    blurb: "Updated August 2026 · PDF or DOCX",
    lead: "The short version is below. The full document has the project detail, references and dates.",
  },

  socials: [
    { label: "GitHub", href: "https://github.com/Julia-Dubenchuk" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/juliadubenchuk" },
    { label: "Email", href: "mailto:dubenchuk6@gmail.com" },
  ] satisfies SocialLink[],

  copyright: "© 2026 Yuliia Dubenchuk",

  notFound: {
    heading: "Page not found",
    body: "That page doesn't exist — it may have moved, or the link may be wrong.",
    linkLabel: "Back to the start",
  },
} as const;

/** The CV summary table. */
export const cvRows: { k: string; v: string }[] = [
  { k: "Role", v: "Front-End Developer, growing into full-stack" },
  { k: "Experience", v: "7+ years" },
  { k: "Core", v: "React, TypeScript, modern CSS, testing" },
  { k: "Server-side", v: "Node.js, NestJS, REST APIs, Postgres" },
  { k: "Based in", v: "Ukraine — open to remote" },
  { k: "Languages", v: "Ukrainian (native), English (Upper-Intermediate, B2)" },
];
