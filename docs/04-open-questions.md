# 04 — Open questions

> **What this document is.** Unresolved decisions grouped by area, each with the answer if there is
> one and the condition that would settle it if there is not. Cites `00-tech-spec.md`,
> `01-scope.md` and `06-conventions.md` by number and section.
>
> Status: current. Last checked against the repo on 2026-09-21.

---

Unresolved decisions grouped by area. Resolve before or during the milestone that needs them; an
answer of `-` means genuinely undecided, not forgotten.

## Product

- Q: Is a custom domain bought for v1?
- A: No. The `github.io` address is v1 (00 §4). The move is a DNS record plus one constant in
  `src/data/urls.ts`, so it stays cheap. **Settles when** the address is being said out loud —
  in an application, a talk bio, a business card — often enough that `julia-dubenchuk.github.io`
  is the wrong thing to say.
- Q: Does the site ever host blog posts?
- A: No. Decided against entirely, not deferred. Longer writing is published on LinkedIn and
  linked from `/activities` (00 §4).
- Q: Does the `/notes` surface ship, and when?
- A: It ships eventually — the two-vault architecture is settled and out of v1 (00 §5), though
  `decisions/0002-obsidian-two-vaults.md` is still unwritten. The date is open. **Settles when**
  v1 is actually deployed and there is a second note worth promoting out of the private vault.
- Q: Is a contact form ever added?
- A: No. There is no backend and none is planned (01, Out of scope). Contact is the email and
  social links in `src/data/site.ts`.

## Content

- Q: Who writes the prose?
- A: Yuliia, all of it. Ghost-drafting was proposed and rejected: the voice is the product
  (00 §2).
- Q: What happened to the four sample projects in `src/content/projects.yaml`?
- A: Deleted. One real entry — Progress Path — stands alone, because there is only one side
  project worth showing and padding the grid with invented ones would be the filler §8 of 06
  forbids.
- Q: When do the real CV files replace the placeholders in `public/cv/`?
- A: Done. Both formats carry the real CV, with no phone number in either.
- Q: When are the OG image and favicon replaced?
- A: Both done. The favicon is the Ryzhulya icon at 16, 32 and 180px; the OG card is rendered
  from the site's own palette, fonts and icon at 1200x630.
- Q: Is one photograph and its caption enough non-technical content?
- A: No — the criterion is currently only partly met and the section reads thin (00 §6,
  criterion 5). What it grows into is open.
- Q: How many projects should the grid hold before it needs a different layout?
- A: At least 12 entries must work with no template change (03, Capacity). Beyond that, open.

## Design

- Q: Is there a dark/light theme toggle?
- A: Not in v1, unless it falls out of the design for free (00 §4). **Settles when** the visual
  treatment is finished: tokens with a plausible dark mapping make it nearly free; a design leaning
  on one light-ground composition keeps it out.
- Q: Can `organic.css` be edited locally?
- A: No. It is vendored read-only; restyling happens in `site.css` through the system's tokens
  (06 §3).
- Q: What happens when the design needs something the system does not have?
- A: The deviation is documented where it occurs. There are exactly two today, both marked in the
  code (06 §4).

## Operations

- Q: Does the `verify:paths` gate stay now that the site serves at the origin root?
- A: - Its original subpath purpose is moot, but it still guards the `withBase()` seam against
  drift (06 §5). **Settles when** it either catches something real once, or costs more attention
  than the seam is worth.
- Q: Where are the Lighthouse scores measured, and by what?
- A: - The ≥ 95 target is fixed (00 §6, criterion 8; 03, Performance). The site is deployed now,
  so the measurement is possible; no tooling has been chosen. **Settles when** a run is done
  against the live URL and a way to repeat it is picked.
- Q: Is the Node version pinned?
- A: Yes. `.nvmrc` holds `v22.14.0` and CI reads it through `node-version-file`, so local and CI
  cannot drift.
- Q: Is analytics ever added?
- A: No. No cookies, no trackers, no third-party scripts (00 §4; 03, Privacy).
- Q: Is any backup needed beyond GitHub?
- A: No. The repository is the single source of truth and the site is a derived artifact
  rebuildable with `npm ci && npm run build` (03, Backup and recovery).

## Architecture

- Q: Is Astro on GitHub Pages still the right stack in two years?
- A: - `decisions/0001-astro-static-on-github-pages.md` §8 refuses to answer on the maintainer's
  behalf and puts the question back: name three features plausibly wanted within two years, then
  route them by what they need. Most answers mean *stay exactly as is*. **Settles when** those
  three features can be named concretely rather than hypothetically.
- Q: What happens if a feature needs a server?
- A: Astro with an adapter, hosted off Pages — a hosting change, not a framework change
  (decision 0001 §8).
- Q: Can a new content surface be added without restructuring the existing pages?
- A: Yes — a new collection, new routes, and one nav entry; the fourth nav slot is already
  reserved (00 §5, criterion 10).

## Documentation

- Q: Where do open questions live?
- A: Here. They were §9 of `00-tech-spec.md` until this file existed; that section is now a
  pointer, and 00 §4, 01, 02 and 06 §5 all cite this document.
