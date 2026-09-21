# 0001 — Astro, static output, on GitHub Pages

## Status

**Accepted.** Conditional — §8 states the condition and the triggers that would reopen it.
Superseded by: none. **Premise amended — see the note below.**

> **Premise amended, 2026-09-21.** This record was written while a blog surface was still planned
> for v2, and calls the site "the blog" throughout. `00-tech-spec.md` §4 has since declined blog
> posts on this site **entirely**, not deferred them: longer writing is published on LinkedIn and
> linked from `/activities`. Read every "the blog" here as *this content site* — the Astro-rendered
> pages at the origin root — rather than a posts surface that exists.
>
> **The decision is unaffected.** It turns on the content-versus-application axis (§8), and
> dropping the posts surface moves the site further toward the content end, which is exactly where
> Astro was chosen to sit. The two-surface recommendation in §4 and §8 stands unchanged, read the
> same way: the content site stays on Astro, and an app-shaped surface is built beside it rather
> than folded into it.
>
> Amended rather than rewritten, because a reversal belongs in the decision it reverses
> (`03-nfr.md`, Auditability).

## Decision

Build the site on **Astro 7, static output, deployed to GitHub Pages**, and stay there. Do not
migrate to Next.js or any other framework at this time.

## Drivers

1. **Leak risk is not the axis; feature scale is** — and feature scale splits into content features
   (every candidate handles these) and application features (**hosting decides those first**, not
   the framework).
2. **The cost of being wrong is asymmetric in *shape*.** Staying wrong ends in a bounded port,
   priced at 11 files and 390 lines. Switching wrong ends in permanent complexity on a site that is
   mostly text.
3. **Migration cost must be measured, not asserted** — §2 counts it rather than estimating it.

## Alternatives

Sixteen candidates were compared in §4, including Next.js 16, React Router 8, TanStack Start,
SvelteKit 2, Nuxt 4, Eleventy 3, Hugo, Jekyll, Gatsby, Ghost, WordPress and hosted platforms. Two
were added only after review caught their absence, and both changed the analysis: **Astro plus an
adapter, off Pages** (the cheapest route to application features, whose absence had concealed the
central error) and the **two-surface architecture** (an Astro blog beside a separate React app).

A separate, narrower alternative was weighed inside Astro: whether content should be modelled with
`glob()` throughout rather than split between `file()` and `glob()` by payload kind. It was
**rejected on ergonomics, not on principle** — a single YAML file is better solo-author ergonomics
than N tiny ones for record-shaped content. Recording it here because a reversal is cheap and the
reasoning is otherwise invisible in `src/content.config.ts`.

## Why chosen

Three reasons, in order of weight, stated at full strength in §8: the discriminating axis is not
engaged (every roadmap feature is a content feature, and those barely distinguish between
frameworks); being wrong about staying is bounded while being wrong about switching is ongoing; and
a full-stack framework can substitute for a separate backend, eroding the reason to build one.

Two reasons given in the first version were **withdrawn** under review: that GitHub Pages counts
against Next.js (it counts equally against Astro), and that Astro's capability ceiling is higher
(it is not, on this deployment).

## Consequences

- The `.astro` dialect stays, and with it a re-acclimation cost on every return to the project.
- Staying is **step one of the two-surface architecture**, not the opposite of growing: an
  application surface gets added beside the blog when there is one to add.
- Any application feature means leaving GitHub Pages regardless of framework — roughly an
  afternoon, and neutral between the candidates.
- The decision is conditional. §8's routing table says what to do for each class of future
  feature, and the revisit triggers separate scheduled checkpoints from evidence.

---

- Status of this analysis: this document is a decision aid; nothing has been migrated.
- Current stack: **Astro 7.2.10**, static output, GitHub Pages **user site** served at the origin root
- Question: was Astro the right choice for a site expected to gain features over time?
- Iteration 3 — rewritten twice after independent architecture and quality review.
  v1's reasoning was unsound; v2 fixed the analysis but its decision rule did not
  implement it. See §10 for what changed and why.

## 1. The question behind the question

"Will it scale?" is doing two jobs, and they have different answers.

**Traffic scale is a non-issue.** Static files on a CDN will out-serve anything a
personal site receives, on every option below. Nothing here should be decided on
performance under load.

**Feature scale is the real question**, and it splits:

| | What it means | Does the frontend framework decide it? |
|---|---|---|
| **Content features** | More posts, tags, series, search, RSS, i18n, an editing workflow | Barely — every option handles these |
| **Application features** | Accounts, auth'd areas, dashboards, a self-hosted comment system, state shared across routes | Yes — but **hosting decides it first** |

That last cell is the correction that reshaped this document. See §3.

## 2. What this codebase actually is

Migration cost should be measured, not asserted. Counted today:

| | |
|---|---|
| `.astro` components and pages | **11 files, 390 lines** — this is the real rewrite surface |
| Files touching Astro-specific APIs | **9** (`astro:content`, `astro:assets`, `getStaticPaths`, `Astro.*`) |
| Source files under `src/` | 25 |
| Posts | **4**, with real frontmatter and `PLACEHOLDER` bodies |
| Design system | **432 lines of plain CSS, 48 tokens, zero scoped `<style>` blocks** — ports untouched |
| Content in markdown / YAML | About prose, projects |
| Content in TypeScript | `src/data/site.ts`, `nav.ts` — hero copy, socials, metadata, 404 copy |
| Runtime dependencies | `astro`, `@astrojs/check`, `typescript` — **no React, no adapter** |

Two facts here matter more than the rest.

**The design system is genuinely portable.** All styling lives in two global
stylesheets; not one component carries a scoped style block. A framework change does
not touch it. This is the single biggest reason switching stays cheap.

**React is not installed, and there are no islands.** Astro's headline advantage over a
plain static generator is "zero JS by default *plus* React where it is needed." This
project uses the first half and has never used the second. Every claim below about
React islands is a claim about an available option, not an exercised one.

## 3. Two decisions, in the right order

The first version of this document treated Astro-vs-Next as the decision and hosting as
a complication. That was backwards, and it produced a false result.

### Decision 1 — stay on GitHub Pages?

**This is the decision that gates capability, and it is neutral between frameworks.**

GitHub Pages serves static files. It has no server or edge runtime. That disables:

- Next.js: SSR, ISR, middleware, server actions, `cookies()`/`headers()`, default image
  optimisation, and dynamic route handlers (statically-renderable GET handlers survive)
- Astro: **SSR adapters, server islands, Actions, sessions, and dynamic API endpoints — every one**

The first version of this document used the Pages constraint to disqualify Next and
then credited Astro with exactly the capabilities that same constraint removes. That
was the central error. On static Pages the two frameworks have the **same** ceiling:
client-side JavaScript plus calls to an external API.

**What leaving Pages costs:** roughly an afternoon and nothing in money, *for either
framework*. Cloudflare Pages, Netlify and Vercel all have free tiers that cover a
personal site, connect straight to the repo, and give better preview deploys than a
hand-rolled Actions workflow. For Astro it is `npx astro add cloudflare` plus a host
connection — **no component changes at all**. For Next it is simplest on Vercel;
Cloudflare needs `@opennextjs/cloudflare` and has more edges. Neither framework has a
hosting advantage here.

**An unmentioned upside of leaving:** on a root domain the base-path machinery retires —
`BASE_PATH`, `withBase()`, `absoluteUrl()` and the `check-paths.mjs` prebuild gate all
exist only because this deploys to a project subpath. That is a real simplification, and
it sits on the *leave* side of the ledger.

So: any application feature means moving host regardless of framework. That move is
cheap. It is not an argument for either side.

### Decision 2 — given that, which framework?

Only now does the framework question have content, and it is narrower than it looks:

- **Staying on Pages** — both are static. Astro wins on markdown ergonomics and
  zero-JS defaults; Next wins on familiarity for React practitioners and on ecosystem.
  Astro is the better fit, but the margin is modest and it is *not* about capability
  ceilings.
- **Leaving Pages** — Astro with an adapter reaches most application features. What
  remains genuinely hard in Astro is **state shared across routes and across islands**
  (see §5). That, and only that, is what Next buys.

## 4. The candidates

| Stack | What it is | Pros | Cons | Fit here |
|---|---|---|---|---|
| **Astro 7, static, Pages** *(current)* | Content-first framework, zero JS by default, React islands available, SSR possible with an adapter | Best-in-class markdown and content collections; top Lighthouse scores with no effort; free hosting; design system already portable | `.astro` is a dialect not used elsewhere in a typical React practice; **on Pages, no SSR/server islands/API routes**; weak at cross-route state | **Strong for a content site.** The status quo. |
| **Astro 7 + adapter, off Pages** | Same codebase, `astro add cloudflare/netlify/vercel` | Unlocks SSR, server islands, API endpoints, auth'd pages; **costs an afternoon and zero component rewrites**; keeps everything already built | Still weak at shared client state; still the `.astro` dialect | **The cheapest route to "app-ish" features.** Missing from v1 of this doc; its absence hid the error in §3. |
| **Next.js 16** | The default React meta-framework — RSC, server actions, route handlers, middleware, ISR | No new dialect for a React-based maintainer; best-in-class for auth'd surfaces; largest ecosystem | Ships a React runtime, so good scores take care rather than coming free; heavier for a text site; **requires leaving Pages to be worth choosing** | **Strong if this becomes an app.** |
| **Astro (content) + separate React/Next app** | Two surfaces: blog stays Astro, app features live in their own deployment on a subdomain | Blog stays optimal and cheap; app surface is React; a separate backend API gets a real consumer; the two evolve independently | Two deploys, two repos, shared design tokens to keep in sync | **Best fit where an application surface is anticipated.** The same separate-service pattern recommended for a backend, applied to the frontend. |
| **React Router 8** *(ex-Remix)* | Full-stack React on web standards; per-route loaders and actions | Excellent data-loading model; less magic than Next; standards knowledge transfers | Smaller ecosystem; the Remix→React Router rename churned the docs; needs a server | Good, but Next dominates it for the same job. |
| **TanStack Start 1.x** | Newer full-stack React; type-safe routing and data | Best-in-class type safety; excellent router | Youngest React option; smallest ecosystem; most churn risk | Novelty is the wrong bet for a site touched a few times a year. |
| **SvelteKit 2** | Full-stack Svelte | Superb DX; tiny bundles; strong at both content and app | Not React — a new language surface that compounds with neither an existing React practice nor a planned Node backend | Technically excellent; strategically inconsistent with a React-centred stack. |
| **Nuxt 4** | Full-stack Vue; mature content module | Batteries included; excellent content story; strong conventions | Vue, with the same strategic problem as Svelte; largest conceptual distance from the current stack | Same verdict as SvelteKit, for the same reason. |
| **Eleventy 3** | Minimal JS static site generator | Very simple, very fast, near-zero maintenance; **does have a component model (WebC)**, plus includes and shortcodes; pairs fine with serverless functions | WebC would be a *third* dialect; no first-class React; nothing here that Astro does not already do better for this use case | A sideways move at best. |
| **Hugo** | Go static site generator | Fastest builds; single binary; famously stable | Go templates slow design iteration; no React | Wrong for a design-led site iterated on visually. |
| **Jekyll** | Ruby SSG, Pages' native engine | Zero-config on Pages | Slow, dated, no component model | No reason to choose it in 2026. |
| **Gatsby 5** | React SSG with a GraphQL data layer | Was the React blog default for years | Development largely stalled since 2023; heavy GraphQL indirection | **Avoid.** |
| **Vite React SPA + separate API** | Client-rendered React, separate backend | Clean separation; the separate-backend half matches a full-stack learning goal | As a *blog* this is the worst option — poor SEO, blank first paint, hand-rolled routing and feeds | Wrong as a replacement; right as the *second surface* above. |
| **Ghost** | Purpose-built publishing platform | Best writing and editing experience; memberships and newsletters built in | A product to configure, not a project to build; the site stops being a portfolio piece | Reasonable if writing were the only goal. |
| **WordPress** | The incumbent CMS, optionally headless | Vast plugin ecosystem; headless WP behind a JS frontend is a legitimate professional stack | Brings a database, a PHP runtime, an update treadmill and a security surface, for a site with four posts | Disproportionate to the problem. |
| **Hashnode / dev.to / Medium** | Hosted blogging platforms | Zero maintenance; built-in distribution | No control over design or domain — the "worse-ranked copy of a profile" problem an owned site exists to avoid | Use as a **syndication** target, not the home. |

## 5. Where Astro actually breaks down

"Weak at app features" is too vague to act on. Concretely, in the order they are met:

1. **State between islands on one page.** Each island is a separate React root. Two islands share no context or store; the answer is an external store such as nanostores. Workable, but the state layer stops being React's.
2. **State across navigation.** Astro does full document loads by default, so client state resets on every route change. View Transitions with `transition:persist` mitigates it per-element, but does not cleanly persist a React tree.
3. **Anything per-user.** Auth'd views, personalisation, drafts — all need SSR, which needs an adapter, which needs leaving Pages. **This is a hosting wall before it is a framework wall.**
4. **Nested server-fetched data.** Server islands are per-component async holes, not a composable server-rendering model. A dashboard with nested data gets awkward in a way Next's model does not.
5. **Middleware is thinner** than Next's, though it exists.

Points 1 and 2 are where "the project ends up rebuilding an SPA inside Astro" stops being a
figure of speech. Nothing before them is a real limit.

**What narrows the gap once off Pages.** Verified present in the installed 7.2.10:
**Astro Actions** (`astro:actions`) — typed server functions callable from client code,
Astro's direct answer to Next's server actions — and **session support**
(`Astro.session`, configurable). Both require server output, so both are unavailable on
Pages. But off Pages they mean the residual gap to Next is smaller than points 1-5
suggest: it is essentially points 1 and 2 only.

**This list has a shelf life.** §6 argues Astro's server and content surfaces churn
quickly across majors. That cuts both ways, and it means this section should be
re-checked at §8's scheduled checkpoint rather than trusted indefinitely.

## 6. The strongest case for switching now

Stated at full strength, because the recommendation goes the other way.

**Switching is cheapest today and never gets cheaper.** The real number is 11 `.astro`
files and 390 lines, of which 9 touch Astro-specific APIs. The 432 lines of CSS port
untouched, and the content is markdown, YAML and two TypeScript files. That is days of
work, not weeks — and it only grows.

**The maintenance argument is architectural, not a matter of preference.** Where the
maintainer's professional work is in React and TypeScript, and the site is touched a few
times a year, every return costs re-acclimation to `.astro` *and* to Astro's
content-collections API — the framework's most churn-prone surface, which has broken
across majors and which this project is already on version 7 of. The asymmetry that
matters: **a mainstream framework's churn is absorbed during professional work; a niche
dialect's churn is absorbed solely on personal time.** For a solo maintainer of a
low-touch site that is a first-order concern.

**And the hedge Astro is sold on is not being used.** There is no React here and no
islands. The dialect cost is being paid in full and none of the hybrid benefit
collected. The moment an island *is* added, a React runtime ships anyway — at which
point React is running inside a non-React framework, which is a worse deal than running
it inside the one built for it. (§9 nonetheless recommends trying exactly this —
deliberately, as a cheap experiment that produces evidence about whether the dialect
cost is real in practice.)

If the honest read is that this becomes an application, switching now is rational and
waiting is the expensive choice. **A 60/40 lean toward application features justifies
moving today.**

## 7. The cost of being wrong, both ways

The first version of this document priced only one direction. Both:

| | If staying was wrong | If switching was wrong |
|---|---|---|
| **What it costs** | Port 11 files / 390 lines later, when there are more of them — **plus §6's re-acclimation tax on every visit until then** | Carry Next's heavier toolchain on a text site; a hosting migration that was not needed; Lighthouse scores that take deliberate care rather than coming free |
| **Shape** | One-off port, but with an ongoing cost running until it is paid | Ongoing, modest, paid on every visit |
| **Reversible?** | Yes — the portable CSS and content make it cheap | Yes on the same terms, though app features built on Next's server model would not port back |

This asymmetry favours staying, but by less than the first draft of this table implied.
Note the honest tension: **§6's strongest argument — that staying carries a private
maintenance tax — belongs in the left column, and it partly offsets the advantage.** The
asymmetry that survives is about *shape*: staying wrong ends with a bounded port already
priced at 11 files, while switching wrong ends with permanent complexity on a site that
is mostly text.

## 8. Conclusion

**Recommendation: stay on Astro — but the recommendation is conditional, and the
condition is a forecast the maintainer must supply.**

What survives review, in order of weight:

1. **The discriminating axis is not engaged.** About, activities, writing, CV — every
   feature currently on the roadmap is a content feature, and by §1 those barely
   distinguish between frameworks. So no *capability* argument favours moving. Note what
   this does and does not establish: it is a reason for indifference-plus-inertia, not a
   positive case for Astro. Astro is modestly better at content (§3), and "modest" is the
   right word.
2. **Being wrong about staying is bounded; being wrong about switching is ongoing** (§7).
   This is the strongest reason, and it is about the *shape* of the two errors rather
   than their size.
3. **A full-stack framework can substitute for a separate backend — with a caveat.**
   Where learning a dedicated backend framework is a goal, Next's route handlers and
   server actions make it locally rational to write the endpoint inline instead, and the
   rational local choice at each decision point erodes the reason for a separate service
   at all. Astro's thinner server story keeps a separate API honest by giving it real
   work. (v1 called these "orthogonal." They are **substitutes**.) **The caveat:** this
   is an argument about discipline, not architecture, and it only bites if §9's advice to
   build the API as a separate service is abandoned. It also runs one way — Next's server
   surface would teach HTTP and middleware patterns that transfer *to* a Node backend.
   Treat it as a trade-off, not a clincher.

Two reasons the first version gave have been **withdrawn**: that GitHub Pages counts
against Next (it counts equally against Astro), and that Astro's capability ceiling is
higher (it is not, on this deployment).

**And "stay on Astro" is not the opposite of growing.** §4 rates the two-surface
architecture — Astro blog plus a separate React app — as the best fit where an
application surface is anticipated. Staying is **step one of exactly that architecture**:
the blog stays where it is and is good at what it does, and the app surface gets added
beside it when there is one to add. This is the same separate-service reasoning §9
already recommends for a backend, applied to the frontend. The recommendation is not
inertia; it is the first move of the path this document rates highest.

**The condition.** §6 sets the threshold at a 60/40 lean toward application features, and
this document cannot answer that on the maintainer's behalf — v1 did, by picking its own
list of hypothetical features, every one of which happened to be non-discriminating. So:

> **Name three features plausibly wanted within two years.** Then route them:
>
> | What they need | What to do | Cost |
> |---|---|---|
> | Posts, tags, search, RSS, i18n, newsletter, embedded comments | **Stay exactly as is** | Nothing |
> | Accounts, per-user data, self-hosted comments, anything needing a server | **Astro + adapter, off Pages** — not a framework change | An afternoon, zero component rewrites |
> | State shared across routes or across islands | **Next.js, off Pages** | 11 files / 390 lines, plus the host move |
> | A genuinely app-shaped surface (dashboard, tool, product) | **Two surfaces** — keep the blog on Astro, build the app separately | A new deployment, not a migration |

The middle row is the one v1 and v2 both got wrong: they sent auth and per-user data
straight to Next, when §3 and §5 both say those are a **hosting** wall, not a framework
wall. Only cross-route and cross-island state genuinely buys Next.

An all-content forecast is not automatically the right prior. This deserves a real
answer rather than a default.

### Revisit triggers

Two different things, deliberately kept apart — a checkpoint says *when to look*,
evidence says *what is found*. Conflating them means the calendar alone could appear to
decide the question.

**Checkpoints — when to re-open this. These fire on their own:**
- **Before starting any feature that needs a server.** The real boundary, visible before
  any code is written.
- **At the next redesign, or in six months, whichever comes first.** Re-check §5 while
  here; it has a shelf life.

**Evidence — what a checkpoint should weigh. None of these alone decides it:**
- React islands are added and sharing state between them becomes a fight *(the strongest
  single signal, and it is visible in code)*
- More React is being written inside islands than Astro around them
- State is wanted that survives navigation between routes
- Accounts, login, or per-user data are wanted → note this routes to **adapter**, not to
  Next; see the table above
- A self-hosted rather than embedded comment system is wanted → same, adapter
- Something app-shaped that is not the blog has been started → two surfaces

**If two or more of the *evidence* items are true, the answer has changed.** Reaching a
checkpoint is not itself evidence, and neither is leaving GitHub Pages — §3 established
that the host move is neutral between frameworks.

## 9. Worth doing regardless

- **Keep content in markdown and YAML** — it is the portability layer. Note that
  `src/data/site.ts` and `nav.ts` are TypeScript, not markdown; they port fine, but they
  are content living in code and worth remembering as such.
- **Keep the design system as plain CSS with tokens.** Already true, already verified,
  and it is what makes any migration cheap. Do not adopt a CSS-in-JS approach that would
  couple styling to a framework.
- **Install `@astrojs/react` and write the next interactive component in React.** This
  costs an afternoon, is fully reversible, and *tests* Astro's central claim instead of
  assuming it. It also converts the `.astro` dialect from "the language of this project"
  into a thin outer layer. **What it spends:** the first island ships a React runtime on
  that page, so the site stops being the zero-JavaScript build the README describes. The
  cost is scoped per page rather than global — that scoping *is* Astro's advantage over
  Next — but it is a real trade, and §6 is right that at that point React is running
  inside a non-React framework. Do it because it produces evidence, not because it is
  free.
- **If a backend API is planned, start it as a separate repo now.** It is the real
  full-stack work, it is independent of this decision, and it is the part a reviewer
  reads most closely. Budget for it needing its own host — Railway, Fly or Render —
  since Pages cannot run it.
- **Watch a nearer scaling constraint than the framework.** `src/content.config.ts`
  encodes CSS token names directly in the projects schema
  (`dot: z.enum(["accent-300", ...])`). Adding a palette colour means editing schema,
  content and stylesheet together. The first friction actually met will be in the content
  model, not in Astro.

## 10. What changed across iterations, and why

Two independent reviews — one architectural, one quality — examined each version. They
converged on the same decisive defect both times.

### Iteration 2 → 3

- **The decision rule contradicted the analysis (both reviewers, independently, and both
  rated it the top finding).** v2 fixed §3 correctly, then wrote a rule in §8 that sent
  accounts and per-user data to a **Next.js migration** — when §3 and §5 both say those
  are a hosting wall solved by `npx astro add cloudflare` with zero component rewrites.
  The rule also could not reach either of the two candidates v2 had just added. It is now
  a four-way routing table.
- **"Stay" was never reconciled with "two surfaces are the best fit" (both).** §4 named the
  two-surface architecture best where an app surface is anticipated; §8 recommended
  staying and never mentioned it. §8 now says staying *is* step one of that architecture —
  which turns the recommendation from inertia into the first move of the path rated
  highest.
- **Reason 1 overclaimed (both).** It called being a content site "framework-discriminating"
  and "sufficient on its own", contradicting §1's "barely" and §8's own conditionality.
  Restated as: the discriminating axis is not engaged, which is indifference-plus-inertia,
  not a positive case.
- **§7 was rhetorically loaded, and contradicted §6 (both).** "Unbounded", "in practice
  never", "worse Lighthouse scores" all overstated. Worse, §6's central argument — that
  staying carries a private maintenance tax on every visit — was missing from the "stay"
  column where it belongs. Both fixed; the asymmetry is smaller and now honest.
- **Reason 2 overclaimed and assumed the separate-service advice would be ignored
  (quality review).** The substitution argument only bites if §9's advice to build the API
  separately is abandoned, and it ignored that Next's server surface would also teach
  transferable patterns. Demoted to third with the caveat stated.
- **Trigger arithmetic double-counted (quality review).** "Two or more" spanned the
  scheduled checkpoints, so six months' passage plus any single signal would have
  concluded the answer had changed — including leaving Pages, which §3 says is neutral.
  Checkpoints and evidence are now separated.
- **Leaving-Pages cost was priced for Astro only (architecture review).** Stated as an
  afternoon with `npx astro add cloudflare`, without noting it is equally cheap for Next
  — residual bias in the section that had just fixed exactly that bias.
- **§5 was incomplete in Astro's disfavour (architecture review).** Astro **Actions** and
  **session support** were missing; both verified present in the installed 7.2.10. They
  narrow the off-Pages gap to essentially cross-route and cross-island state. Middleware
  added. A shelf-life caveat added.
- **Smaller:** Next's statically-renderable GET route handlers do survive `output: export`;
  leaving Pages retires the whole `withBase`/`BASE_PATH`/`check-paths.mjs` apparatus (a
  real upside, previously unmentioned); §9's React experiment now states that it forfeits
  the zero-JS build; the §9/§10 cross-reference was wrong.

### Iteration 1 → 2

- **The hosting asymmetry (both reviewers, independently).** Version 1 disqualified
  Next.js because GitHub Pages breaks its server features, then credited Astro with SSR
  adapters, server islands and API endpoints — which that same constraint breaks
  identically. Three of the four reasons in the old conclusion rested on this. Hosting
  is now Decision 1 (§3) and is scored as neutral.
- **A missing candidate that hid the error (both).** "Astro + adapter, off Pages" was
  absent. It is the cheapest route to application features and its absence is what let
  the asymmetry pass unnoticed. Now in the table.
- **A missing candidate that would have helped (both).** The two-surface architecture —
  Astro blog plus a separate React app on its own API — is the best fit where an
  application surface is anticipated, and version 1 dismissed it by evaluating an SPA
  only as a *blog replacement*.
- **The conclusion answered a question the document could not answer (quality review).**
  Version 1 asserted "what is being built is a content site" using its own selected
  feature list, every item of which was non-discriminating. Now conditional, with the
  question put directly (§8).
- **The triggers could not fire (quality review).** One required React islands that do
  not exist; the rest were introspective and would fire only when switching was most
  expensive. Scheduled checkpoints added.
- **The steelman was half-token (architecture review).** Version 1 labelled the
  maintenance argument a "preference" and discharged it in two sentences. It is
  architectural — a mainstream framework's churn is absorbed at work, a niche dialect's
  alone — and §6 now says so.
- **The cost of being wrong was priced in one direction only.** Now both (§7), which
  turns out to support the conclusion better than the original reasoning did.
- **Factual corrections.** Four posts existed at the time (version 1 said none — and all four have
  since been removed, along with the collection that held them); the rewrite surface is
  11 files / 390 lines (version 1 said "roughly twenty files" without measuring); some
  content lives in TypeScript, not only markdown and YAML; **React is not installed**, so
  every "use React in islands" claim describes an unexercised option; Eleventy 3 does
  have a component model (WebC); the WordPress dismissal was rhetorical rather than an
  assessment of the tool.
