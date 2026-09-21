# 03 — Non-functional requirements

> **What this document is.** The qualities the site must hold, stated as numbers or rules that can
> be checked. Functional behaviour is in `02-functional-requirements.md`; the invariants behind
> these figures are in `06-conventions.md`.
>
> Status: current. Last checked against the repo on 2026-09-21.

---

Minimal NFR set for v1 and early life as a published site.

## Capacity

- Routes: 4 today (`/`, `/activities`, `/cv`, `/404`), designed for tens, never thousands
- Projects: the grid must hold at least 12 entries with no layout or template change
- Writing-elsewhere links: at least 20 entries in `src/data/elsewhere.ts`
- Published site size: 168 KB built, against GitHub Pages' 1 GB limit
- Page weight: the heaviest page is About at roughly **55 KB** on a first visit — 4 KB HTML,
  14 KB CSS, ~36 KB of WebP images. A repeat visit is about 4 KB, because everything else is
  cached. The web fonts are self-hosted, so they count against Pages like any other asset —
  four woff2 files, 54 KB in total, fetched once and then cached.
- **Visitors: the 100 GB/month Pages bandwidth allowance covers on the order of 1.5 million
  first-time page views a month** — roughly 1 million three-page sessions, or a sustained
  30,000 visitors a day, every day, before the soft limit is in sight
- Concurrency is not a limit this site can reach: Pages serves from a CDN and there is no origin
  server to saturate, so simultaneous visitors cost nothing beyond bandwidth
- For scale: a personal site found by name is expected to see tens to hundreds of visits a month.
  The headroom is four orders of magnitude, which is why no capacity work is planned.
- Builds: Pages allows 10 per hour; a single author pushing to `main` will not approach it
- Authors: one; nothing in the workflow assumes concurrent editing

## Performance

- Deployed pages score **≥ 95** on Lighthouse Performance, Accessibility and SEO
- Zero client JavaScript shipped — the CV format switch is CSS `:has()`, the nav is real routes
- **Zero third-party origins at runtime.** Everything, fonts included, is served from the Pages
  origin; the only outbound requests a visitor makes are the ones they click.
- Build completes in under a minute on CI, including `astro check` and the base-path gate
- Images are sized for their slot; no single asset larger than 300 KB

## Accessibility

- Every page is usable by keyboard alone, with a visible focus state
- Every section is reachable through a labelled landmark (`aria-labelledby` on each `section`)
- Text and interactive elements meet WCAG AA contrast against their background
- Images carry real alternative text, or are marked decorative deliberately
- Nothing depends on hover or on colour alone to convey meaning

## Reliability

- No horizontal scroll at 375, 768 and 1280px
- A failed build must never replace the live site; the deploy step runs only after a green build
- The base-path gate runs twice — in `prebuild` locally and again in CI — so a bad path cannot
  reach production through a skipped local run
- Rollback is a revert commit and a re-run of the workflow; nothing else holds state
- There is no server, so there is no runtime failure mode to recover from

## Content and assets

- Content is stored as UTF-8 text in `src/content/` and `src/data/`, never in templates
- Dates in content are stored ISO-8601 and formatted at the call site
- CV downloads live at fixed paths derived from `site.cv.fileStem`, so a replacement is a file
  swap, not a code change
- Outbound URLs are stored clean — no `utm_*`, no LinkedIn `rcm` share parameter
- Placeholder content must be visibly labelled as placeholder, never plausible filler

## Consistency

- The origin and base path have exactly one definition, `src/data/urls.ts`; `astro.config.ts`
  imports them rather than repeating them
- Every fact has exactly one home: instructions in `README.md`, rules in `06-conventions.md`
- Every nav entry resolves to a real route; a nav entry without a page is a build-time mistake,
  not a 404 in production
- Styling takes values from design-system tokens; no hard-coded hex, font name, or pixel value the
  tokens already carry

## Security

- No backend, no database, no form that accepts input — there is no request to attack
- No secrets in the repository; the deploy workflow uses only the scoped `GITHUB_TOKEN`
  permissions it declares (`contents: read`, `pages: write`, `id-token: write`)
- The production URL is served over HTTPS
- No third-party script, embed, or iframe is loaded on any page
- Dependencies are pinned to exact versions and installed with `npm ci`

## Privacy

- The site sets no cookies and runs no analytics, tag manager, or tracker
- No visitor data is collected, because nothing is able to collect it
- No third party sees a visitor at all. The fonts were the last exception and are now self-hosted
  (`06-conventions.md` §4), so a visitor's IP reaches GitHub and nobody else
- Shared LinkedIn URLs are stripped of `rcm`, which identifies the recipient of a share
- The email address in `site.socials` is published deliberately; nothing else personal is

## Auditability

Git history is the audit log. A record must exist for:

- every content change — one commit, attributable, revertible
- every deploy — a GitHub Actions run, with its build log retained
- every architectural decision — an entry under `docs/decisions/`
- every reversal — recorded in the decision it reverses, not silently rewritten

## Observability

There is no runtime telemetry by design; the checks that stand in for it run at build and deploy
time and must be green.

### Minimum checks

- `astro check` — type and template errors
- `npm run verify:paths` — root-absolute paths that would break under a base path
- Content schema validation — a malformed entry fails the build with a named error
- The Actions run's final status, per push to `main`
- Lighthouse Performance, Accessibility and SEO on the deployed URL
- Every nav route and the 404 page load after a deploy

A red build or a failed deploy is the alert; there is no queue, backlog, or degraded state that can
accumulate unnoticed.

## Backup and recovery

- The GitHub repository is the single source of truth; the published site is a derived artifact
- The whole site is reproducible from a clean checkout with `npm ci && npm run build`
- Binary assets — the CV files, photographs, the OG image and favicon — are versioned in the
  repo, so a recovery needs no external storage
- Recovery from a bad deploy is a revert and a workflow re-run; recovery from a lost Pages site is
  a re-run alone
