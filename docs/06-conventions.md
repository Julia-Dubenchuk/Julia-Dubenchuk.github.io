# 02 — Conventions

> **What this document is.** The invariants, each with the reason it exists. These are rules a
> change can *violate*; `README.md` holds the instructions a change can make *false*. That is the
> line between the two — see §1.
>
> This is the reference document of the set. Read it when you are about to change something, not
> front to back. Cites `00-tech-spec.md`.
>
> Status: current. Last checked against the repo on 2026-09-07.

---

## 1. What lives here versus in the README

`README.md` answers **"how do I run and change this?"** — commands, file locations, the table of
editable slots. `docs/` answers **"why is it like this, and what must stay true?"**

The decidable test: if a code change would make the sentence **false**, it belongs in the README.
If a code change would make the sentence a **violation**, it belongs here. "Projects live in
`src/content/projects.yaml`" is the former. "Content never lives in templates" is the latter.

Each fact gets exactly one home. When a rule and its instruction both want to exist, the
instruction stays in the README and the reason moves here.

## 2. Content lives in data, never in templates

Every content slot — prose, hero copy, skill tags, social links, page metadata, 404 copy — must be
editable without opening a component.

**Why:** the site exists to carry Yuliia's voice (`00-tech-spec.md` §2), and a voice that requires
a developer to change it will not get changed. It is also what makes the placeholders replaceable
by the person who has to replace them.

**In practice:** prose in `src/content/`, records in `src/content/projects.yaml`, copy and metadata
in `src/data/site.ts`, navigation in `src/data/nav.ts`, outbound links in `src/data/elsewhere.ts`.
Adding a project or swapping the CV download requires no template edit. If a change would put a
sentence of user-facing copy inside an `.astro` file, that is the signal it belongs in data.

## 3. `organic.css` is vendored and read-only

`src/styles/organic.css` is the **Organic** design system, copied in verbatim. Do not edit it.

- **To restyle**, edit `src/styles/site.css` and take values from the system's tokens —
  `var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`.
  Never hard-code a hex, a font name, or a pixel value the tokens already carry.
- **To change the system itself**, change it upstream and re-vendor, so the two cannot drift.
- **Build with its classes** — `.btn`, `.card`, `.tag`, `.seg`, `.field`, `.washed`.

**Why:** a vendored file that gets edited locally stops being vendored and silently becomes a fork,
and the next re-vendor overwrites the edits with no warning. The token discipline is what keeps a
redesign a token change rather than a search-and-replace.

`src/styles/site.css` carries page-layer layout and sizing only, and states this in its own header.

## 4. Deviations from the design system are documented where they occur

There are exactly three today, all marked in the code:

1. **Font loading.** The Google Fonts `@import` became a `<link>`, and then went away entirely:
   the two faces are vendored as woff2 in `src/assets/fonts/` and declared in
   `src/styles/fonts.css`, which is Google's own css2 output with the gstatic URLs rewritten. The
   measurement that forced it: the stylesheet was render-blocking, costing 847ms with an estimated
   1,650ms of savings, and held Lighthouse Performance at 89 against a 95 target. Self-hosting took
   it to 100 and removed the site's last third-party origin. No token or class changed.
2. **Contrast corrections**, in one marked block at the end of `site.css`. The design's active tab
   (white on terracotta), the system's `.btn-primary` (cream on terracotta), `.card-kicker` and
   `.card-meta` all measure around 3:1 — acceptable by the system's own note for chrome and large
   text, but below the 4.5:1 an accessibility audit applies to small labels. They now use ink and
   the deep ramp steps, which keeps every fill colour exactly and reads 4.6–5.1:1.

3. **`.tag-outline`'s label**, in the same block. The system draws it in the base terracotta,
   which is 3.03:1 on the cream ground at 11px — the exact case the standing rule below forbids.
   It takes `--color-accent-700` (5.72:1); the border keeps the base colour, so the pill is
   unchanged to look at. Lighthouse flagged this one and nothing else, and fixing it took
   Accessibility from 95 to 100.

**The rule: a fourth deviation gets documented the same way** — a marked block, the measurement
that justified it, and a sentence saying what deleting the block restores. An undocumented deviation is
indistinguishable from a mistake six months later.

**Contrast, as a standing rule:** small terracotta text takes `--color-accent-700` (5.7:1 on the
cream ground), never the base terracotta (3.0:1). Body copy uses `--color-neutral-800` (8.9:1),
secondary copy `--color-neutral-700` (5.5:1).

## 5. Every internal path goes through `withBase()`

Internal links and `public/` asset paths route through `withBase()` from `src/data/urls.ts`.
`absoluteUrl()` is for `og:` tags and `<link rel="canonical">`, which need a full origin.

**Why, given that it currently does nothing:** the repository is named `Julia-Dubenchuk.github.io`,
so this is a GitHub Pages *user site* served at the origin root, and `BASE_PATH` is the empty
string. `withBase()` is a pass-through today. It is kept because it is **the seam**: if the site
ever moves back to a project page — a differently named repository, served from a subdirectory —
setting one constant fixes all fifteen call sites at once instead of requiring a hunt.
`absoluteUrl()` earns its place regardless.

`src/data/urls.ts` is the single source of truth for the origin and the base — `astro.config.ts`
imports from it rather than repeating them, because a drifted origin produces a silently broken
`og:image` with no build error.

The `verify:paths` prebuild gate is a consistency check that keeps everything routed through the
seam. Its original purpose was subpath safety and is now moot; whether it stays is tracked in
`04-open-questions.md`.

## 6. Zero client JavaScript unless a feature genuinely needs it

The site ships no JavaScript. This is what buys the performance and accessibility targets, rather
than optimisation applied afterwards.

**In practice:** interactive-looking things are built with real routes and CSS. The navigation is
four real pages rather than client-side tabs, so each can be linked, shared and indexed. The CV
format switch is a CSS `:has()` selector rather than a script. Third-party embeds are declined for
the same reason — see `03-nfr.md` for the measurement.

## 7. A malformed content entry fails the build

Content collections validate their frontmatter, and a schema violation stops `npm run build` with a
named error rather than rendering a broken page.

**Why:** a build that fails loudly on the author's machine is strictly better than a page that
renders wrong on the internet. Keep schemas strict enough to catch a typo and permissive enough
that writing does not fight them.

## 8. Placeholders are loud, never silent

An unfilled slot ships as an obviously labelled placeholder. Nothing ships as unmarked filler text.

**Why:** silent filler survives to production because nobody notices it. A loud placeholder is a
visible debt. The CV and the project grid have since been paid off — the CV files are real, and
the sample projects were deleted rather than left standing, because one real project says more
than one real project beside three invented ones. No slot carries a placeholder today.

## 9. Commit hygiene, because the repository is public

The repository is public — required for GitHub Pages on a free plan. So a commit is a publication,
and git history is permanent: a force-push does not reliably un-publish anything, because forks,
mirrors and caches persist independently.

- **Stage explicitly.** Never `git add -A` in this repository. Look at what is being staged.
- **Nothing personal, ever.** Career notes, salary thoughts, drafts about employers, credentials
  pasted while debugging. If it should not be readable by a stranger, it must not enter a commit —
  not merely stay unlinked.
- **Check before the first push of anything new**, since that is the last reversible moment.
