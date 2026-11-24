# Abhishek Verma · Beyond the Code

Abhishek Verma’s engineering portfolio. It introduces his work as a Senior Software Engineer at DP World, documents how teams solved enterprise problems, and connects his independent products to the questions that started them.

The repository builds 32 public pages, including six enterprise case studies and 17 independent project case studies. It also builds a real 404, a sitemap, robots.txt and 39 exact legacy redirects.

## Develop

Use Node.js 24.

```sh
nvm use
npm ci
npm run dev
```

Vite prints a local address, usually `http://127.0.0.1:5173`. Generation runs before development and production builds. Rerun `npm run generate` after editing content or a server-rendered template to refresh the development HTML.

## Edit and review

- [Content editing](docs/CONTENT.md) explains editing the profile, career, enterprise cases and product registry.
- [Design system](docs/DESIGN-SYSTEM.md) and [storytelling](docs/STORYTELLING.md) describe the visual language and page hierarchy.
- [Asset placement](docs/ASSETS.md) lists the exact paths and approval steps for photography.
- [Content review](docs/CONTENT-REVIEW.md) tracks owner approvals and open factual questions.

## Verify and deploy

```sh
npm run generate
npm run typecheck
npm test
SITE_URL=https://axvrma.com npm run build
SITE_URL=https://axvrma.com npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

With the production preview running, run `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse` in another shell. See [verification](docs/VERIFICATION.md) and [performance](docs/PERFORMANCE.md) for the audit conditions.

Netlify uses Node.js 24, `npm run build`, and `dist` from the checked-in configuration. The production context uses `https://axvrma.com` for canonical URLs. Deploy previews use their own origin with noindex. Use the existing Git-triggered Netlify workflow to publish after review.

[Architecture](docs/ARCHITECTURE.md) · [Routes](docs/ROUTES.md) · [Security](docs/SECURITY.md)
