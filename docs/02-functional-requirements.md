# 02 — Functional requirements

> **What this document is.** What the site must do, stated so that each item can be checked
> against the running build. Scope comes from `01-scope.md`; the reasons come from
> `00-tech-spec.md`; the invariants a change must not violate are in `06-conventions.md`.
>
> Status: current. Last checked against the repo on 2026-09-21.

---

## Summary

- [FR-001 About page](#fr-001-about-page)
- [FR-002 Skill tags and the personal element](#fr-002-skill-tags-and-the-personal-element)
- [FR-003 Project grid](#fr-003-project-grid)
- [FR-004 Writing elsewhere](#fr-004-writing-elsewhere)
- [FR-005 CV summary](#fr-005-cv-summary)
- [FR-006 CV download](#fr-006-cv-download)
- [FR-007 Navigation](#fr-007-navigation)
- [FR-008 Not-found page](#fr-008-not-found-page)
- [FR-009 Page metadata](#fr-009-page-metadata)
- [FR-010 Content validation](#fr-010-content-validation)
- [FR-011 Base-path safety](#fr-011-base-path-safety)
- [FR-012 Deployment](#fr-012-deployment)

---

## FR-001 About page

The site root `/` must render a long-form prose introduction from a single editable content file,
`src/content/about/about.md`, not from a bullet list and not from a template.

The page must also carry the name, the intro line, and a CV card — all of them sourced from
`src/data/site.ts`, so that changing any of them requires no component edit.

## FR-002 Skill tags and the personal element

The About page must show skill tags from `site.tags`, each with a tone that selects its tint from
the design system's tag ramp.

It must also carry at least one deliberately non-professional element — today a photograph with
its caption (`site.catCaption`) and a sidebar card for the Ryzhulya project (`site.patreon`), whose
button is the one outbound link on the page. These must be visually distinct from the professional
content rather than mixed into it, and the card must not outrank the CV as a call to action.

## FR-003 Project grid

`/activities` must render side projects as a card grid from `src/content/projects.yaml`.

Adding, removing or reordering a project must require editing that file only. Each entry carries
`id`, `name`, `blurb`, `stack`, `status`, `dot`, and optional `link` and `order`; the grid reflows
on its own. A card with a `link` renders one outbound anchor, labelled by its host and carrying the
project name in its `aria-label`.

## FR-004 Writing elsewhere

Below the grid, `/activities` must list writing published elsewhere, from `src/data/elsewhere.ts`.

Each item is an **outbound link**, never an embed. Stored URLs must not carry LinkedIn's `utm_*` or
`rcm` share parameters, because `rcm` identifies the recipient of a share.

## FR-005 CV summary

`/cv` must render a summary table from `cvRows` in `src/data/site.ts`, plus a lead sentence stating
what the full document adds.

The page must state only facts it can keep true — the format on offer and the date in
`site.cv.updated` — and must not restate CV content that would then drift from the file.

## FR-006 CV download

`/cv` must offer the CV in two formats, PDF and DOCX, served from fixed paths under `public/cv/`
derived from `site.cv.fileStem`.

Replacing the CV must mean replacing the files, with no code change. The format switch must work
with **no client JavaScript**: the selected radio reveals its own download link through a CSS
`:has()` selector.

## FR-007 Navigation

The header must render its entries from `src/data/nav.ts`, in file order, as real routes rather
than client-side tabs — so each view can be linked, shared and indexed.

The nav carries three entries for v1. A fourth entry must be addable without restructuring the
existing pages.

## FR-008 Not-found page

`/404` must render a styled page with a heading, a body line, and a link back to `/`, all from
`site.notFound`. It must use the same layout and header as every other page.

## FR-009 Page metadata

Every page must emit a title, a meta description, Open Graph tags and a favicon, composed in
`BaseLayout.astro` from `src/data/site.ts`.

Absolute URLs in `og:` tags and `<link rel="canonical">` must be built through `absoluteUrl()`, so
the origin has exactly one source of truth in `src/data/urls.ts`.

## FR-010 Content validation

A malformed content entry must fail the build with a named error, not render a broken page.

Both collections in `src/content.config.ts` validate their shape: `about` requires a `title`, and
`projects` requires `name`, `blurb`, `stack`, `status`, and a `dot` from the allowed set.

## FR-011 Base-path safety

`npm run verify:paths` must fail the build on any root-absolute path that Astro does not rewrite —
`href="/…"`, `src="/…"`, CSS `url(/…)`, markdown `](/…)`, and `={'/…'}` literals.

It runs in `prebuild` so it fails before a push, and again in CI as the second line of defence.
Links must be written through `withBase()` so the gate stays satisfiable. Whether this gate is
still needed is an open question — see `04-open-questions.md`.

## FR-012 Deployment

A push to `main` must build the site and deploy it to GitHub Pages through the committed
`.github/workflows/deploy.yml`, which also runs the base-path gate before building.

The workflow must be able to perform the first deploy without a manual Settings toggle
(`enablement: true`), and the production URL must load over HTTPS.
