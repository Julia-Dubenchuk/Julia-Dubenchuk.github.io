# 00 — Technical specification

> **What this document is.** The answer to *why does this site exist, what is in it, and when is
> it finished*. Everything else in `docs/` cites this one; this one cites nothing.
>
> Status: current. Last checked against the repo on 2026-09-07.

---

## 1. What this is

A static personal site for Yuliia Dubenchuk — a front-end developer with seven years in React and
TypeScript, currently learning Node.js and NestJS — published at
`https://julia-dubenchuk.github.io/`.

It is not a résumé in HTML, and it is not a blog.

## 2. Why it exists

**To establish a durable professional presence, findable by name, that succeeds specifically by
showing the half a LinkedIn profile cannot: the person behind the developer.**

That sentence is the product. It was not the starting assumption — the original framing was "a
personal site so people can find me", which a contrarian interview round rejected outright:
LinkedIn and GitHub already outrank a new domain for her name, so a site competing on the same
ground is a worse-ranked copy of a profile that already exists.

The differentiator is therefore everything a profile cannot carry — voice, design, the
non-technical half of a person, and the fact that it is hers. Two rules follow from this and are
not negotiable:

- **All prose is written by Yuliia.** Ghost-drafting the biography was explicitly proposed and
  explicitly rejected: the voice *is* the product, so a fluent draft in someone else's register
  defeats the reason the site exists. Unfilled slots ship as loud placeholders instead.
- **The visual treatment is part of the differentiator**, not decoration over it. Polished and
  long-lived with personality — not corporate-minimal, not a stock theme.

## 3. What is in scope for v1

| Surface | Route | What it is |
|---|---|---|
| **About** | `/` | Long-form prose introduction, skill tags, a photograph, a CV card, and one deliberately non-professional element |
| **My other activities** | `/activities` | Side projects as a card grid, then *Writing elsewhere* — outbound links to LinkedIn posts |
| **CV** | `/cv` | A summary table and a download panel offering PDF or DOCX |
| **Not found** | `/404` | Styled, with a route home |

Three real pages and an error page. The navigation carries three entries; a fourth slot is
reserved for the notes surface described in §5.

## 4. What is explicitly not in scope

Each of these was considered and declined, not overlooked.

- **Blog posts on this site.** Originally deferred to v2; since decided against entirely. Longer
  writing is published on LinkedIn and linked from `/activities`, which is the honest arrangement —
  the writing lives where the readers already are, and this site points at it.
- **A CMS, admin interface, or any authoring surface** beyond editing files in the repository.
- **Any backend** — no API, no database, no contact form, no server of any kind.
- **Comments, analytics, newsletter signup.** No third-party embeds; see `03-nfr.md` for the
  measured reason LinkedIn posts are links rather than iframes.
- **A custom domain.** The `github.io` address is v1. Buying one is a reversible later change and
  is tracked in `04-open-questions.md`.
- **Internationalisation.**
- **AI-drafted biography or personal copy** — see §2.
- **A dark/light theme toggle**, unless it falls out of the design for free.

## 5. Notes — decided, gated, and out of v1

An Obsidian-backed notes surface at `/notes` has been designed and reviewed but is **not part of
v1**. The architecture is settled: two vaults in two repositories, a public vault inside this repo,
a separate private repository for everything else, and promotion by moving a file and leaving a
stub behind. See `decisions/0002-obsidian-two-vaults.md` when it is written.

It is out of scope here because v1 must be finishable without it. Adding it later is additive — a
new content collection, new routes, and one nav entry — and requires no restructuring of the three
existing surfaces.

## 6. Acceptance criteria

v1 is done when all of the following are true. Current status is honest, not aspirational.

- [x] **Deploy.** Site builds with zero errors and deploys to GitHub Pages via the committed
  Actions workflow; the production URL loads over HTTPS — *live at
  `https://julia-dubenchuk.github.io/` since 2026-09-21*
- [x] **About prose.** About renders long-form prose from a single editable content file, not a
  bullet list
- [x] **CV download.** A visible CV download serves a real file from a fixed path; replacing it
  needs no code change
- [x] **Projects from data.** Projects render from a structured data file; adding one needs no
  template edit — *one real project; the sample entries have been removed rather than replaced*
- [x] **Personal content.** Non-technical, personal content is present and visually distinct from
  the project grid — *the About prose carries the cats and the Ryzhulya project, beside the
  photograph and its caption*
- [x] **Honest placeholders.** Every unfilled content slot ships as an obvious labelled
  placeholder, never unmarked filler
- [ ] **No horizontal scroll** at 375, 768 and 1280px — *believed met, unverified at real viewports*
- [ ] **Lighthouse.** Deployed pages score ≥ 95 on Performance, Accessibility and SEO —
  *unverified; the deploy it was waiting on now exists, so this can be measured*
- [x] **Page metadata.** Every page has a title, meta description, Open Graph tags and a favicon —
  *the OG image and favicon are placeholders*
- [x] **Extensible.** A later content surface can be added without restructuring the existing pages

**The remaining work is content, not code:** replace two placeholder images — the OG social preview
and the favicon. The CV, the About prose, the first project and the deploy are done.

## 7. Constraints that shaped it

- **Stack:** Astro, static output. The reasoning, the conditions under which it should be revisited,
  and two arguments that were later withdrawn are in `decisions/0001-astro-static-on-github-pages.md`.
- **Hosting:** GitHub Pages, deployed from this repository by GitHub Actions. The repository is
  named `Julia-Dubenchuk.github.io`, which makes it a *user site* served at the origin root.
- **Content model:** content lives in editable data and content files, never hardcoded in
  templates. Adding a project or swapping the CV must require no template edit. See
  `06-conventions.md`.
- **Urgency:** none. Quality is preferred over speed.
- **CV prominence:** present and easy to find, deliberately not the primary call to action. It was
  the hero element in an early draft and was demoted — a CV is what a profile already gives you.

## 8. Where the content lives

| What | File |
|---|---|
| About prose | `src/content/about/about.md` |
| Name, intro, tags, CV blurb, socials, 404 copy | `src/data/site.ts` |
| CV summary table | `cvRows` in `src/data/site.ts` |
| Projects | `src/content/projects.yaml` |
| Writing published elsewhere | `src/data/elsewhere.ts` |
| Navigation | `src/data/nav.ts` |
| CV downloads | `public/cv/` |

`README.md` explains how to run the site and how to edit each of these. This document does not
repeat it; see `06-conventions.md` §1 for the rule dividing the two.

## 9. Open questions

The live, deliberately unmade decisions are listed in `04-open-questions.md`, grouped by area and
each with the condition that would settle it. None of them blocks §6, and all of them are
reversible.
