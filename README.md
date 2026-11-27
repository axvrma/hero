# AXVRMA portfolio

Abhishek Verma’s portfolio is a statically generated Vite site. The homepage introduces his work, engineering capabilities, recognition and background. The two secondary templates cover detailed work and his personal story, including a printable résumé. Netlify serves the static build and 72 permanent redirects.

## Develop and verify

Use Node.js 24.

```sh
nvm use
npm ci
npx playwright install chromium
npm run dev
```

Rerun `npm run generate` after changing content or static templates while Vite is live.

```sh
PORTFOLIO_PREVIEW=1 npm run verify
npm run test:e2e
npm run preview
npm run compare:reference
node scripts/capture-visuals.mjs
```

Keep the preview server running in a separate terminal for screenshot capture. The production build uses `CONTEXT=production SITE_URL=https://axvrma.com npm run build`. Netlify supplies the deployment context and preview origin. Review builds are noindex and distinguish draft content from professional recognition.

## Project documentation

- [Implementation report](docs/implementation-report.md)
- [Reference audit](docs/reference-design-audit.md)
- [Content review register](docs/CONTENT-REVIEW.md)
- [Asset inventory](docs/ASSETS.md)
- [Routes and redirects](docs/ROUTES.md)
