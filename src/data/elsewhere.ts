/**
 * Writing published somewhere other than this site.
 *
 * These are outbound links, deliberately not embeds: a LinkedIn embed iframe
 * sets six tracking cookies per visitor before any interaction, pulls ~30KB
 * plus four external scripts, and is fixed-width in a way that breaks the
 * 375px layout. A link costs none of that and degrades gracefully if LinkedIn
 * changes anything.
 *
 * URLs are stored without LinkedIn's `utm_*` and `rcm` share parameters —
 * `rcm` identifies the recipient of a share and has no business being
 * republished here.
 */

export interface ElsewherePost {
  title: string;
  /** ISO date; formatted for display at the call site. */
  date: string;
  href: string;
  /** Optional opening line, shown under the title. */
  excerpt?: string;
}

export const elsewhereLead =
  "I post shorter pieces on LinkedIn. These live there rather than here.";

export const elsewhere: ElsewherePost[] = [
  {
    title: "Why TypeScript's any is not the enemy",
    date: "2026-09-17",
    href: "https://www.linkedin.com/posts/juliadubenchuk_typescript-webdevelopment-softwaredevelopment-activity-7506258568006868994-mm3z",
    excerpt:
      "If a programming language gives you a tool, there is probably a reason for it to exist. any is a good example.",
  },
  {
    title: "Building a real mental model of TypeScript",
    date: "2026-09-11",
    href: "https://www.linkedin.com/posts/juliadubenchuk_typescript-webdevelopment-ai-activity-7504152589123346433-zlPe",
    excerpt:
      "I've been writing TypeScript since 2019. And only now, I'm starting to build a real mental model of TypeScript.",
  },
  {
    title: "TypeScript 7 benchmarks on a NestJS project",
    date: "2026-09-02",
    href: "https://www.linkedin.com/posts/juliadubenchuk_typescript-typescript7-webdevelopment-activity-7500890884939415552-UN4K",
    excerpt:
      "When I saw the TypeScript 7 announcement, I had one question: how much faster would it be on a real project?",
  },
  {
    title: "Progress you can't see yet",
    date: "2026-08-26",
    href: "https://www.linkedin.com/posts/juliadubenchuk_personalgrowth-continuouslearning-growthmindset-activity-7498326785797988353-0tyN",
    excerpt:
      "Sometimes we think we're not making progress simply because we can't see the result yet.",
  },
  {
    title: "Small steps, big progress: what I learned from Atomic Habits",
    date: "2026-08-20",
    href: "https://www.linkedin.com/posts/juliadubenchuk_atomichabits-learning-continuouslearning-activity-7496158617847623680-6o1j",
    excerpt:
      "I bought Atomic Habits to improve my English. I didn't expect it to change the way I approach learning.",
  },
  {
    title:
      "Documentation as a foundation for future success in software engineering",
    date: "2026-08-15",
    href: "https://www.linkedin.com/posts/juliadubenchuk_softwareengineering-softwarearchitecture-activity-7494356015019253760-G2W7",
    excerpt:
      "One of the most useful things I learned this year wasn't a new framework or library. It was something much less exciting at first: documentation.",
  },
];
