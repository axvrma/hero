# Verification

Validated on November 24, 2026 on Apple Silicon macOS with Node.js 24.19.0, Vite 8.3.5, Playwright 1.64.1 and Chromium 156. The production artifact used `SITE_URL=https://axvrma.com`.

## Results

- `npm ci` installed from the lockfile and reported zero known dependency vulnerabilities. It noted that the optional `fsevents` install script is outside npm’s allowlist. Build and preview worked on this host.
- `npm run generate` and `npm run typecheck` passed. Generation emitted 32 complete static pages and one 404.
- `npm test` passed all 17 tests. Coverage includes content and URL handling, canonical origins, registry identity, employment progression, approval gating, missing photos, arithmetic and calendar dates.
- `npm run build` and `npm run verify` passed. The checker resolved route, asset, responsive image, fragment and redirect references. Two isolated production builds had identical artifact checksums. A simulated Netlify deploy preview used its preview origin and emitted noindex and robots restrictions.
- `npx playwright install chromium` completed and `npm run test:e2e` passed all 71 tests. The suite verified every public route, all 39 redirects, the real 404, key contact and résumé links, and the production CSP in artifact preview. It exercised search, keyboard navigation, theme persistence, photograph focus with a fixture, no-JavaScript reading and navigation, reduced motion, and all five interactive demos.
- Direct HTTPS requests returned HTTP 200 for all seven preserved flagship live and source destinations and all three preserved hackathon live and source destinations. This checks reachability at the time of the run.

## Accessibility and responsive coverage

Axe checks covered all 32 public routes, the expanded mobile menu, both homepage themes, and the expanded interactive demos in both themes. The initial run found undersized targets in the enterprise table of contents. The targets were increased and the final checks reported zero violations. Keyboard checks exercised skip navigation, native disclosures, form errors, menus and dialog dismissal with focus restoration. Reflow checks ran from 320px to 1920px in both themes, plus a 640px CSS viewport to represent 200% zoom from 1280px in key flows.

Playwright captures in the local `.tools/axvrma-3/` directory cover the homepage in light and dark, the work and invoice pages, the selected product section, and desktop and mobile story layouts. Screenshots were inspected for visible layout issues. Real approved photography is still pending, so the photo dialog was verified with a local fixture.

Chromium and Axe results provide automated evidence toward WCAG 2.2 AA. Full conformance, assistive-technology coverage and behavior on the deployed domain remain outside this local run.

## Repeat the checks

```sh
npm ci
SITE_URL=https://axvrma.com npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

With the preview running, use `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse`. See [performance](PERFORMANCE.md) for the measurement and baseline. A live deployment would also need the usual smoke check on its public origin.
