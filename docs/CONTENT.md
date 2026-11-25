# Content editing

Edit repository sources, then run `npm run typecheck` and `npm run verify`. Sign off on the rendered page and its factual claims before publishing. Keep pending evidence and restricted material outside this public repository.

## Profile and career

Edit profile and verified contact destinations in `content/portfolio.json`. Employment entries need a unique slug-like `id`, company, duration and factual contributions. A current role derives its title from the ordered `progression` entries under a single employer. Update the job there to keep the homepage, résumé and structured data consistent.

Add a chapter in `content/editorial.mjs` with a unique `id`, a theme, a headline and a first-person summary. Refer to a job by its ID for dates and employer, or provide a `period` for nonemployment chapters. Link the chapter from `storyChapters` where appropriate. The experience page renders the complete timeline. Homepage milestone selections are in `src/components/homepage.mjs`. The education entry in `content/portfolio.json` carries the qualification wording, partner, specialisations, dates and abbreviated display name used by the homepage and structured data.

## Enterprise case studies and principles

Add an entry to `content/enterprise.mjs` with a unique `id`, organization, summary, team and individual roles, constraints, decisions, trade-offs, outcome and lesson. The generator creates `/experience/<id>` and includes it in the sitemap. Point to existing principle identifiers. Label generic trade-offs and public illustrations in the copy. Use fictional examples and avoid proprietary implementation details. A new case appears in the Experience index automatically.

## Product and archive edits

Edit the flagship identity, fixed destinations, evidence, architecture, limitations and ordering in `content/products.mjs`. Add matching editorial framing in `motivations` in `content/editorial.mjs`. A new flagship needs an intentionally designed showcase in `src/components/visuals.mjs` and updates to registry tests. Preserve legacy aliases and canonical names when editing.

The archive comes from `content/legacy-projects.json` plus any new entries in the `projects` array of `portfolio.json`. The generator sanitizes preserved HTML. Mark a retired demo by exact URL in `content/archive-overrides.json` while retaining its project page and source. Edit event copy and public screenshots in `content/hackathons.mjs`.

## Metric approval

Keep pending values, baselines, outcomes and evidence outside Git. The public register assigns a non-sensitive ID and case ID to each claim. Once disclosure and public evidence are verified, record the approved value, unit, label, scope, baseline, outcome, team attribution, and evidence reference. Record the evidence status and the organisation, employer and case identifiers. Add non-sensitive references to evidence and the distinct clearance record and set `publication: "approved"` only after disclosure approval. The build rejects incomplete approved entries and adds complete approved figures to the impact section, related case, relevant career chapter and printable résumé. A derived time reduction requires separately cleared source times. Check generated HTML and review the attribution before release.

## Lab experiments and photography

Add Lab experiments in `content/editorial.mjs` with their actual status and purpose. Publish external links only after confirming the destination and identity. See [asset placement](ASSETS.md) for photography and [content review](CONTENT-REVIEW.md) for pending items.
