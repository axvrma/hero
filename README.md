# AXVRMA 4.0 · The Anatomy of Curiosity

Abhishek Verma’s engineering portfolio opens with “Complexity in. Simplicity out.” Soft copper light and a fine optical field frame the opening portrait. Small type, thin rules and native disclosures keep the reading path short.

- `/` introduces the person, engineering outcomes, career, selected projects, principles, recognition and contact.
- `/work` holds six enterprise cases, seven independent products, hackathons, the ten-project archive and the BoxBay AI experiment.
- `/about` follows the personal story through early computing, design, engineering, continued study and the workshop. The résumé prints from `/about#resume`.

The same build produces the sitemap, robots.txt, a true 404 and 72 direct permanent redirects.

## Develop

Use Node.js 24.

```sh
nvm use
npm ci
npm run dev
```

Vite prints a loopback address, usually `http://127.0.0.1:5173`. Rerun `npm run generate` after editing content or static templates to refresh the development HTML.

## Verify and preview

```sh
SITE_URL=https://axvrma.com npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview -- --port 4174
```

With the production preview running, use `npm run lighthouse` for the homepage audit and `node scripts/capture-visuals.mjs` for screenshots. Netlify uses Node.js 24, `npm run build` and `dist`. Production canonicals use `https://axvrma.com`. Deploy previews use their own origin and carry noindex. Publish through the existing Netlify workflow after owner authorization.

## Project documentation

- [Architecture](docs/ARCHITECTURE.md) and [security](docs/SECURITY.md)
- [Design system and illustration inventory](docs/DESIGN-SYSTEM.md) and [storytelling](docs/STORYTELLING.md)
- [Content editing](docs/CONTENT.md), [asset integration](docs/ASSETS.md) and [publication approvals](docs/CONTENT-REVIEW.md)
- [Route migration](docs/ROUTES.md), [verification and screenshots](docs/VERIFICATION.md) and [performance](docs/PERFORMANCE.md)
