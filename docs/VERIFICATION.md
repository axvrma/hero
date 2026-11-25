# Verification

AXVRMA 3.2 was checked on November 25, 2026 on Apple Silicon macOS using Node.js 24.19.0, Vite 8.3.5, Playwright 1.64.1 and Chromium 156. The production artifact used `SITE_URL=https://axvrma.com`. The reproduced baseline was commit `1fcbbd1`, which matched the remote HEAD at the start of the audit.

## Results

- `npm ci`, `npm run generate`, `npm run typecheck`, `npm test`, `npm run build`, `npm run verify` and `npm run test:e2e` passed.
- The baseline had 19 unit and 78 browser tests. The release checks passed 22 unit and 80 browser tests. Coverage includes individual asset approval, logo fallbacks and ratio, employer and recognition roles, metric disclosure and evidence status, derived reduction calculations, cross-page attribution, certificate rendering and keyboard access.
- Route and redirect manifests matched the baseline byte for byte. The artifact retains 32 public routes, six enterprise case studies, 17 independent case studies, seven flagships, 39 exact redirects, the 404, robots and sitemap. All five original interactive demos and the strict CSP were exercised.
- The production artifact scan confirmed the four pending logo derivatives, 2023 DP World group photo, original certificate PDF and restricted numerical claims are absent. The full redacted certificate matched the approved source bytes.

## Visual and accessibility review

Chromium and Axe checks covered all public routes, both homepage themes, the mobile menu, original interactive demos and the photo viewer. Reflow checks cover 320, 375, 390, 768, 1024, 1280, 1440 and 1920 CSS pixels in both themes. The employer marquee supports pause, resume, hover, keyboard focus, reduced motion and static no-JavaScript browsing. The modal opens on first interaction and Escape restores focus. Lighthouse flagged a premature viewer link before this change. The final SEO audit passed.

Public screenshots under `.tools/axvrma-3.2/public/` cover desktop and mobile in both themes, the hero, marquee, impact section, milestones, full certificate view, career timeline, flagship cases and products. A separate loopback build exercised the prepared logos, award photo and numeric layouts with fictional metric fixtures. The screenshots are under `.tools/axvrma-3.2/private-review/`. The image review checked containment of both award participants and the full certificate. The private build also passed layout and modal Axe checks at 320, 390, 768 and 1440 CSS pixels in both themes. The private mock release did not change the public approval records.

## Repeat the checks

```sh
npm ci
SITE_URL=https://axvrma.com npm run verify
npm run test:e2e
npm run preview
```

Run `node scripts/capture-visuals.mjs` for captures and `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse` for the production-artifact audit. See [performance](PERFORMANCE.md) and [owner review](CONTENT-REVIEW.md).
