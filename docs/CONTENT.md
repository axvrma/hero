# Content editing

All content is maintained in the repository. There is no external CMS or API-key requirement.

## Profile and career

Edit `content/portfolio.json`:

| Key | Content |
| --- | --- |
| `profile` | Name, role, location, hero heading/subtitle, contact heading and verified contact/résumé links |
| `experience` | Company, role, duration and responsibility bullets |
| `skills` | Capability categories and technology tags |
| `education` | Institution, degree/certification and duration |
| `achievements` | Existing recognition titles and descriptions |
| `projects` | Optional project editorial overrides or additional projects |

Career content was preserved from the existing portfolio. It is now ordinary local source data, rather than a fallback for a remote service. Update dates and responsibilities directly here as they change.

## Flagship case studies

`content/products.mjs` defines Atlas, Vibes, Envision, Servio and Prism. The registry is checked against the Product and CaseSection types in `content/types.ts` using `npm run typecheck`.

Each product includes its canonical slug, brand name, category, description, tagline, fixed live/source URLs, stack, implemented features, architecture, case-study sections, limitations and source evidence. Preserve the requested live URLs and historical repository identities. `vox-ar` maps to Envision, and `azure-devops-pr-helper` maps to Prism.

An entry in `portfolio.json` → `projects` can override a flagship description or stack by matching its canonical or legacy slug. The registry continues to own flagship identity, URLs and order.

## Additional projects

`content/legacy-projects.json` retains all sixteen original case-study bodies. Four map to flagships; twelve have dedicated secondary routes. Atlas is the new seventeenth project. Original HTML is retained under `content/legacy/` for reference and is not another executable generator.

Secondary entries in `portfolio.json` → `projects` may override `name`, `description`, `stack`, `source` and `live` by `id`; the archived case-study body is retained. A new entry creates a new case-study page from its description and real links. Use a unique lowercase hyphenated slug. Never add placeholder destinations or unsupported claims.

`content/archive-overrides.json` suppresses a specifically verified dead demo URL. A different replacement URL is allowed when supplied in local project content. Original archived data remains intact.

## Preview and publish

1. Edit the appropriate file.
2. Run `npm run generate` during development, or `npm run build` for a production artifact.
3. Run `npm run verify` and review the affected pages locally.
4. Commit the change and use Netlify's regular Git-triggered build or dashboard workflow to publish.

Builds do not mutate local content or external services. Text and attributes are HTML-escaped; preserved rich HTML is sanitized. Local development requires no environment variables. The optional SITE_URL setting supplies a verified production origin for canonical URLs and sitemap entries; Netlify's production URL is the fallback and deploy previews use their own origin with noindex.
