# 05 — Project Setup Spec: Astro Static Site Skeleton

> Structure and tooling only — **no content is written here**. This document describes the skeleton
> that exists, so the remaining work is writing rather than building. It is the input for the
> content phase.
>
> Status: current. Last checked against the repo on 2026-09-21.

---

## Metadata

- Type: brownfield — the skeleton exists; this spec is reconstructed from the working tree and
  `docs/00`–`04`, not from a live interview
- Rounds: 4 documentation passes (`00` + `06`, then `01` + `02`, then `03`, then `04`)
- Final ambiguity: **0% on structure** — every tooling decision is settled; **~32% overall**, being
  the 7 of 22 questions in `04-open-questions.md` still answered `-`, all of them content
  scheduling or deferred operations
- Status: **PASSED for build and tooling.** Content remains unwritten by design (00 §2)
- Scope: build, routing, content model, styling seam, path gate, deploy. Notes surface deferred;
  tests absent

## Clarity Breakdown

| Dimension | Score | Weight | Weighted |
|---|---|---|---|
| Goal clarity | 0.95 | 0.35 | 0.333 |
| Constraint clarity | 0.95 | 0.25 | 0.238 |
| Success criteria | 0.90 | 0.25 | 0.225 |
| Context clarity | 0.85 | 0.15 | 0.128 |
| **Total clarity** | | | **0.923** |
| **Ambiguity** | | | **0.077** |

Scores are a judgement against the doc set, not an instrument reading. Goal and constraints score
high because `00-tech-spec.md` §2 states the product in one sentence and `06-conventions.md` gives
each invariant a reason; context scored lowest when this spec was written, because the site had
not yet been deployed — it has been since 2026-09-21.

## Topology

| Component | Status | Description | Coverage |
|---|---|---|---|
| Build | active | Astro 7.2.10, static output, `astro check && astro build` | AC1–AC2 |
| Content layer | active | `src/content.config.ts` — `about` via `glob()`, `projects` via `file()` | AC5 |
| Data layer | active | `site.ts`, `nav.ts`, `elsewhere.ts`, `urls.ts` in `src/data/` | AC4 |
| Routing & layout | active | 4 routes in `src/pages/`, one `BaseLayout.astro` | AC6 |
| Design system | active (vendored) | `organic.css` read-only, page layer in `site.css` | AC9 |
| Path-safety gate | active | `scripts/check-paths.mjs` in `prebuild` and in CI | AC3 |
| Deploy pipeline | active | `.github/workflows/deploy.yml` → GitHub Pages | AC10 |
| Documentation | active | `docs/00`–`06`, `decisions/` | AC12 |
| Notes surface | deferred | two-vault Obsidian design, out of v1 (00 §5) | — |
| Tests | absent | no test runner installed; the build is the only gate | — |

## Goal

Stand up a static site skeleton where every content slot is editable without opening a component,
every path resolves through a single base-path seam, the design system stays vendored and unedited,
zero client JavaScript ships, and a push to `main` publishes the result. The output lets the site's
author see **what goes where** without reading a template, so that the only remaining work is the
personal-voice writing `00-tech-spec.md` §2 reserves to her.

## Decisions (ADR-style)

### D1 — Static Astro on GitHub Pages

- **Decision:** Astro with static output, hosted on GitHub Pages, deployed by Actions.
- **Alternatives:** Next.js (heavier toolchain on a text site, hosting migration not needed),
  Eleventy, a hosted site builder — all argued in `decisions/0001-astro-static-on-github-pages.md`.
- **Consequence:** no server, no runtime to operate; the revisit condition is recorded rather than
  left to drift (04, Architecture).

### D2 — One definition of origin and base path

- **Decision:** `SITE_ORIGIN` and `BASE_PATH` live in `src/data/urls.ts`; `astro.config.ts` imports
  them rather than repeating them. All links go through `withBase()`, all absolute URLs through
  `absoluteUrl()`.
- **Alternatives:** hard-coding the origin in the config and in `og:` tags — rejected: a drifted
  origin breaks `og:image` with no build error.
- **Consequence:** the repo is a *user site*, so `BASE_PATH` is `""` and `withBase()` is a
  pass-through today. It is kept as the seam: one constant would fix all call sites if the site
  ever moved to a subpath.

### D3 — Content lives in data, never in templates

- **Decision:** prose in `src/content/`, records in `src/content/projects.yaml`, copy and metadata
  in `src/data/site.ts`, nav in `nav.ts`, outbound links in `elsewhere.ts`.
- **Alternatives:** copy inline in `.astro` components — rejected: a voice that needs a developer
  to change it will not get changed (06 §2).
- **Consequence:** adding a project or swapping the CV requires no template edit.

### D4 — Collections split by payload kind

- **Decision:** `about` uses `glob()` + `render()` because it is prose; `projects` uses `file()`
  over one YAML file because it is record-shaped.
- **Alternatives:** one markdown file per project — rejected as worse solo-author ergonomics.
- **Consequence:** both collections validate their shape, so a malformed entry fails the build with
  a named error instead of rendering broken.

### D5 — The design system is vendored and read-only

- **Decision:** `src/styles/organic.css` is copied in verbatim and never edited; restyling happens
  in `src/styles/site.css` using the system's tokens.
- **Alternatives:** editing the vendored file directly — rejected: it silently becomes a fork and
  the next re-vendor overwrites it.
- **Consequence:** deviations are documented where they occur. There are exactly two (06 §4).

### D6 — Zero client JavaScript

- **Decision:** ship no JS. The nav is four real routes; the CV format switch is a CSS `:has()`
  selector; third-party embeds are declined.
- **Alternatives:** client-side tabs, a LinkedIn embed — rejected on measurement (03, Privacy).
- **Consequence:** verified in the build output — `dist/` contains zero `.js` files and no
  `<script>` tag.

### D7 — The base-path gate runs twice

- **Decision:** `scripts/check-paths.mjs` runs in `prebuild` locally and again as a CI step before
  the build.
- **Alternatives:** CI only — rejected: a failure should arrive before the push, not after.
- **Consequence:** whether the gate is still needed at the origin root is an open question
  (04, Operations).

### D8 — Outbound links, never embeds

- **Decision:** writing published elsewhere is linked, with `utm_*` and `rcm` parameters stripped
  from stored URLs.
- **Alternatives:** LinkedIn embed iframes — rejected: six tracking cookies per visitor, ~30 KB
  plus four external scripts, and a fixed width that breaks the 375px layout.
- **Consequence:** the site sets no cookies and, since the fonts were self-hosted, makes no
  third-party request at all.

## Constraints

- Static output only; no server, no database, no form that accepts input.
- Identical content rules in every surface: nothing user-facing inside an `.astro` file.
- One definition of origin and base path; no second copy anywhere.
- No hard-coded hex, font name, or pixel value the design tokens already carry.
- Zero client JavaScript unless a feature genuinely needs it.
- No root-absolute paths outside the `withBase()` seam — enforced by the gate.
- Dependencies pinned to exact versions, installed with `npm ci`, Node from `.nvmrc`.
- All prose is written by Yuliia; unfilled slots ship as labelled placeholders.

## Non-Goals

- Any content writing — the CV, the projects, the biography, the images.
- Blog posts on this site, a CMS, or any authoring surface beyond editing files.
- Any backend, contact form, comments, analytics, or newsletter.
- Internationalisation, a custom domain, a dark/light theme toggle.
- The `/notes` surface — designed and settled, but out of v1.
- A test suite; the build, the type check and the path gate are the only gates today.

## Acceptance Criteria

- [x] **AC1** `npm run build` completes with zero errors and builds 4 pages
- [x] **AC2** `astro check` runs as part of the build and passes
- [x] **AC3** `npm run verify:paths` runs in `prebuild` and as a CI step before the build
- [x] **AC4** Every content slot is editable in `src/content/` or `src/data/` without opening a
      component
- [ ] **AC5** A malformed content entry fails the build with a named error — the schemas exist in
      `src/content.config.ts`, but no deliberate violation has been tested
- [x] **AC6** `/`, `/activities`, `/cv` and `/404` all build, from one `BaseLayout.astro`
- [x] **AC7** The build output ships zero client JavaScript — no `.js` file and no `<script>` tag
      in `dist/`
- [x] **AC8** Origin and base path have exactly one definition; `astro.config.ts` imports them
- [ ] **AC9** `organic.css` is byte-identical to upstream — unverifiable here, no upstream copy is
      vendored alongside it for comparison
- [x] **AC10** A push to `main` publishes to Pages over HTTPS — verified live at
      `https://julia-dubenchuk.github.io/`
- [x] **AC11** The built site is well under the 1 GB Pages limit — 168 KB
- [x] **AC12** The spec set and decision log are committed

## Assumptions Exposed & Resolved

| Assumption | Challenge | Resolution |
|---|---|---|
| "A personal site so people can find me" | LinkedIn and GitHub already outrank a new domain for her name | Reframed: the site shows what a profile cannot — voice, design, the person (00 §2) |
| The site is a blog | Writing already has an audience on LinkedIn | No blog; longer writing is linked from `/activities` (00 §4) |
| The biography could be ghost-drafted | The voice *is* the product | All prose written by Yuliia; empty slots ship as loud placeholders |
| Deployed as a project page under a subpath | The repo is named `Julia-Dubenchuk.github.io` | User site at the origin root; `BASE_PATH` is `""`, `withBase()` kept as the seam |
| LinkedIn posts could be embedded | Measured: six cookies, ~30 KB, four scripts, breaks 375px | Outbound links with `utm_*` and `rcm` stripped |
| Fonts load via the design system's `@import` | Blocks on the CSS request chain; Lighthouse measured 847ms | Self-hosted woff2 in `src/styles/fonts.css`; no third-party request (06 §4) |
| The CV is the hero element | A CV is what a profile already gives you | Demoted: present, easy to find, not the primary call to action |
| Next.js would serve this better | Rated against the actual surface | Astro; the revisit condition is written down instead of assumed (decision 0001 §8) |

## Technical Context (existing repo)

- Root `package.json` (`personal-site`, `type: module`, private, Node `>=22`); scripts are `dev`,
  `build` (`astro check && astro build`), `prebuild`, `preview`, `check`, `verify:paths`.
- Dependencies pinned exactly: `astro` 7.2.10, `typescript` 6.0.3, `@astrojs/check` 0.9.10.
- `.nvmrc` holds `v22.14.0`; CI reads it via `node-version-file`, so local and CI cannot drift.
- `astro.config.ts` imports `SITE_ORIGIN` and `BASE_PATH` from `src/data/urls.ts`.
- `.github/workflows/deploy.yml` builds on push to `main`, runs the path gate, and deploys with
  `enablement: true` so the first deploy needs no Settings toggle.
- Assets: `public/cv/` (the real CV, PDF + DOCX), `public/og-card.png` (rendered from
  `scripts/og/card.html`), `public/favicon-{16,32,180}.png`,
  two PNGs in `src/assets/` optimised to WebP at build.
- Docs `00`–`06`, plus `decisions/0001-astro-static-on-github-pages.md`, carry the
  reasoning; `decisions/0002-obsidian-two-vaults.md` is still unwritten.
- Git: the whole tree is committed and pushed to `origin/main`, and every push deploys.

## Ontology (Key Entities)

| Entity | Type | Fields / Shape | Relationships |
|---|---|---|---|
| Site config | core | `site` — name, meta, hero, tags, cv, socials, 404 copy | read by every page through `BaseLayout` |
| Layout | core | `BaseLayout.astro` — title, description, canonical, OG, favicon | wraps all 4 routes |
| URL seam | core | `SITE_ORIGIN`, `BASE_PATH`, `withBase()`, `absoluteUrl()` | imported by `astro.config.ts` and every link |
| About document | core | markdown + `title` frontmatter | one file, rendered at `/` |
| Project | core | `id`, `name`, `blurb`, `stack`, `status`, `dot`, `order?` | many per YAML file; rendered by `ProjectCard` |
| Nav entry | supporting | `label`, `href` | one per real route; header order |
| Elsewhere post | supporting | `title`, `date`, `href`, `excerpt?` | outbound only, below the project grid |
| CV row | supporting | `k`, `v` | the summary table on `/cv` |
| CV file | supporting | `fileStem` + `.pdf` / `.docx` under `public/cv/` | fixed paths; swapped without code |
| Design token | supporting | `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--shadow-*` | defined in `organic.css`, consumed by `site.css` |

## Ontology Convergence

| Round | Document | Entities named | New | Changed | Stable | Stability |
|---|---|---|---|---|---|---|
| 0 | repo skeleton (`04a6126` + working tree) | 10 | 10 | — | — | n/a |
| 1 | `00-tech-spec.md` §8, `06-conventions.md` | 7 | 0 | 0 | 7 | 70% |
| 2 | `01-scope.md`, `02-functional-requirements.md` | 10 | 0 | 0 | 10 | 100% |
| 3 | `03-nfr.md`, `04-open-questions.md` | 10 | 0 | 0 | 10 | 100% |

The model converged immediately because the code was written before the documents: no round
introduced an entity the skeleton did not already have, and none renamed one. Round 1 names seven
of the ten because the URL seam, the layout, and the design tokens are conventions rather than
content slots, and were documented a pass later.
