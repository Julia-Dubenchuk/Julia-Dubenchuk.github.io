# Yuliia Dubenchuk — personal site

Yuliia Dubenchuk's personal site — About, other activities, and a downloadable
CV.

Built with [Astro](https://astro.build) (static output), deployed to GitHub Pages
on every push to `main`. The look comes from the **Organic** design system, and
the page structure from the **Yuliia Blog** design.

> **Live** at <https://julia-dubenchuk.github.io/>. Every content slot is filled;
> see [`docs/00-tech-spec.md`](docs/00-tech-spec.md) §6 for what still counts as
> unverified.

## Running it

Node 22 or newer — `.nvmrc` pins `v22.14.0`, which CI uses too.

```bash
npm install
npm run dev           # local dev server
npm run build         # base-path gate + astro check + build
npm run preview       # serve the built site, at the real base path
npm run check         # types and templates only
npm run verify:paths  # the base-path gate on its own
```

Use `npm run preview`, not `npm run dev`, when checking links and assets — see
*The base path*.

## Pages

| Route | What it is |
|---|---|
| `/` | About — intro, skills, prose, and the sidebar (photo, CV card, cat) |
| `/activities` | Side projects as a card grid, then *Writing elsewhere* — outbound links to LinkedIn posts |
| `/cv` | CV summary table and the download panel |
| `/404` | Styled not-found page, with a route home |

The design showed these as tabs holding client-side state. They are real routes
here so each can be linked, shared and indexed — and so the site needs no
JavaScript at all.

## Filling in content

Nothing here requires editing a component.

| What | Where |
|---|---|
| About prose | `src/content/about/about.md` |
| Name, intro, skill tags, CV blurb, Patreon card, socials, 404 copy | `src/data/site.ts` |
| CV summary table | `cvRows` in `src/data/site.ts` |
| Projects | `src/content/projects.yaml` |
| Writing published elsewhere | `src/data/elsewhere.ts` |
| Nav labels and order | `src/data/nav.ts` |
| Your photo | replace `src/assets/yuliia-avatar.png` |
| The cat | replace `src/assets/cat-tight.png` |
| CV files | replace `public/cv/Yuliia_Dubenchuk_CV.pdf` and `.docx` |
| Social preview image | `public/og-card.png` — 1200×630, regenerated from `scripts/og/card.html` |
| Favicon | replace `public/favicon-16.png`, `-32.png` and `-180.png` |

**Adding a project** — copy a block in `projects.yaml`. Each needs a unique `id`,
plus `name`, `blurb`, `stack`, `status`, and `dot` (which tint the round mark
takes: `accent-300`, `accent-2-300`, `accent-200`, or `accent-2-200`). Optional:
`link`, a full URL to the repository or the running project — the card labels it
*Source on GitHub* for a github.com URL and *Visit <host>* otherwise — and
`order`. The grid reflows on its own.

**Adding a link to writing elsewhere** — append an entry to `elsewhere` in
`src/data/elsewhere.ts` with `title`, `date` (ISO, e.g. `2026-09-02`), `href`,
and an optional `excerpt`. The list sorts newest first on its own. Strip the
`utm_*` and `rcm` parameters LinkedIn appends to a shared URL — `rcm` identifies
whoever the link was shared with.

These are deliberately links rather than embeds. A LinkedIn embed iframe sets six
tracking cookies per visitor before any interaction, loads roughly 30KB plus four
external scripts, is fixed-width in a way that breaks the 375px layout, and would
end this site's zero-JavaScript property.

A missing or misspelled field fails the build with a named error rather than
rendering a broken page.

### The photographs

`src/assets/yuliia-avatar.png` (370×370) and `src/assets/cat-tight.png` (240×240)
are cropped from the original illustrations, framed to match the design's
circles. Astro resizes and converts them to WebP on build.

The cat is comfortably sharp — 240px of source behind a 92px circle. The
portrait is 370px behind a 300px circle, about 1.2×: that is all the detail the
source holds at this framing, since the head occupies roughly 370px of the
1448×1086 illustration. Cropping wider would gain pixels but lose the design's
framing. If you ever want it crisper on a high-DPI screen, the fix is a
higher-resolution render of the same illustration, not a different crop.

To change either one, replace the file and rebuild — the crop and the circle are
handled by CSS, so any square-ish image works.

## The look

`src/styles/organic.css` is the **Organic** design system, vendored verbatim —
**treat it as read-only.** Restyle by editing `src/styles/site.css`, and build
with the system's classes (`.btn`, `.card`, `.tag`, `.seg`, `.field`, `.washed`).

The rules that govern this — why the vendored file is not edited, how tokens are
used, the two documented deviations, and the contrast requirements for small
text in the accent colour — are in
[`docs/06-conventions.md`](docs/06-conventions.md) §3 and §4.

## The base path

The repo is named `Julia-Dubenchuk.github.io`, so this is a GitHub Pages **user
site** served at the origin root, `https://julia-dubenchuk.github.io/`.
`BASE_PATH` in `src/data/urls.ts` is empty and `withBase()` is a pass-through.

Route internal links and `public/` paths through `withBase()` anyway, and use
`absoluteUrl()` for `og:` and canonical tags. The reason it is kept when it
currently does nothing is in [`docs/06-conventions.md`](docs/06-conventions.md)
§5, along with the standing of the `verify:paths` prebuild gate.

## Deployment

`.github/workflows/deploy.yml` builds and publishes on push to `main`. The
workflow enables Pages itself; if the first run fails on permissions, set
**Settings → Pages → Source** to **GitHub Actions** and re-run it.

The Pages artifact is served directly, so Jekyll never processes the output and
no `.nojekyll` file is needed for Astro's `_astro/` directory.

## Documentation

This file is the instructions. `docs/` holds the reasoning — why the site is
like this, and what must stay true. The rule dividing the two is
[`docs/06-conventions.md`](docs/06-conventions.md) §1.

| Document | What it answers |
|---|---|
| [`00-tech-spec.md`](docs/00-tech-spec.md) | Why the site exists, what is in it, and when v1 is finished |
| [`01-scope.md`](docs/01-scope.md) | The goal, what is in and out of scope, and the main architecture rule |
| [`02-functional-requirements.md`](docs/02-functional-requirements.md) | FR-001–FR-012: what the site must do, checkable against a build |
| [`03-nfr.md`](docs/03-nfr.md) | Capacity, performance, accessibility, security, privacy, recovery |
| [`04-open-questions.md`](docs/04-open-questions.md) | Unresolved decisions by area, each with what would settle it |
| [`05-project-setup-spec.md`](docs/05-project-setup-spec.md) | The skeleton as built, as ADR-style decisions and acceptance criteria |
| [`06-conventions.md`](docs/06-conventions.md) | The invariants a change can violate, each with its reason |
| [`decisions/`](docs/decisions) | Architecture decision records, starting with Astro on GitHub Pages |

Start with `00`. If you are about to change something, read `06` first.
