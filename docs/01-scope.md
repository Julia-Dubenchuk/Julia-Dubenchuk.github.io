# 01 — Scope

> **What this document is.** The boundary: what v1 contains, what it deliberately does not, and
> the rule that decides which side a new idea falls on. Cites `00-tech-spec.md`.
>
> Status: current. Last checked against the repo on 2026-09-21.

---

A static personal site that carries the half a LinkedIn profile cannot — voice, design, and the
non-technical person behind the developer (see `00-tech-spec.md`).

## Goal

Build a site that shows:

- who Yuliia is, in her own prose rather than in bullet points
- what she has built, as records that can be added without touching a template
- where her longer writing already lives
- that a CV exists and is one click away, without making it the point

## In scope

1. About page at `/` — long-form prose, skill tags, a photograph, a CV card, and one deliberately
   non-professional element
2. `/activities` — side projects as a card grid, then *Writing elsewhere*: outbound links to
   LinkedIn posts
3. `/cv` — a summary table and a download panel offering PDF or DOCX
4. `/404` — styled, with a route home
5. Every content slot editable as data: `src/content/`, `src/content/projects.yaml`,
   `src/data/site.ts`, `src/data/nav.ts`, `src/data/elsewhere.ts`, `public/cv/`
6. Static output from Astro, with zero client JavaScript unless a feature genuinely needs it
7. Deployment to GitHub Pages by the committed Actions workflow, served at the origin root as a
   user site
8. Per-page metadata — title, meta description, Open Graph tags, favicon
9. Loud, labelled placeholders for every slot whose content is not written yet
10. The **Organic** design system vendored read-only, with page-layer styling in `site.css`
11. A reserved fourth navigation slot, so a later content surface needs no restructuring

## Out of scope

1. Blog posts on this site — decided against entirely; longer writing is published on LinkedIn and
   linked from `/activities`
2. The Obsidian-backed notes surface at `/notes` — designed and settled, but not part of v1
3. A CMS, admin interface, or any authoring surface beyond editing files in the repository
4. Any backend — no API, no database, no contact form, no server of any kind
5. Comments, analytics, newsletter signup, and third-party embeds of any kind
6. A custom domain — the `github.io` address is v1
7. Internationalisation
8. AI-drafted biography or personal copy — the voice is the product
9. A dark/light theme toggle, unless it falls out of the design for free

The custom domain, the theme toggle, and the date the notes surface ships are open questions (see
`04-open-questions.md`). Each is additive, and none of them blocks v1.

## Main architecture rule

- **Content belongs to data files; templates belong to code.** A sentence of user-facing copy
  inside an `.astro` file is the signal it is in the wrong place.
- **The prose belongs to Yuliia.** Nothing ships in a borrowed voice; an unwritten slot ships as a
  visible placeholder instead.
- **Rendering belongs to build time.** No server, and no client JavaScript added for the look of
  interactivity — real routes and CSS instead.
- **The design system belongs upstream.** `organic.css` is vendored and read-only; local styling
  happens in `site.css` through its tokens, never by editing the system in place.
