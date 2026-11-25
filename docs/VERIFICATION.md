# Verification

AXVRMA 3.1 was checked on November 25, 2026 on Apple Silicon macOS using Node.js 24.19.0, Vite 8.3.5, Playwright 1.64.1 and Chromium 156. The production artifact used `SITE_URL=https://axvrma.com`. The comparison baseline was the checked-out AXVRMA 3.0 commit `78a1355`, which matched the remote HEAD when the audit started.

## Results

- `npm ci`, `npm run generate`, `npm run typecheck`, `npm test`, `npm run build` and `npm run verify` passed. The install reported zero known vulnerabilities and noted the unused optional `fsevents` installation script.
- Unit tests went from 17 to 19. The added coverage verifies supplied derivatives, responsive candidates, missing optional assets, pending files, orphaned variants, reviewed certificate redaction and rejection of unknown files in editorial asset directories.
- Browser tests went from 71 to 78. All five original demos and the original canonical routes, generated fragment targets, 404, publication gates and strict CSP were exercised. New coverage includes keyboard marquee control, static reduced-motion and no-JavaScript fallbacks, photo dialog focus restoration, mobile image selection, milestone reflow and consistent qualification text.
- Route and redirect manifests matched the 3.0 baseline byte for byte. The build has 32 public pages, six enterprise case studies, 17 independent case studies, seven flagships, 39 exact legacy redirects, the 404, robots and sitemap. Auditbench retains the Lighthouse Agent mappings.

## Accessibility and visual QA

The automated checks cover all 32 public routes, both homepage themes, the mobile menu, expanded demos and the public photo dialog. Playwright checks layouts at 320, 375, 390, 768, 1024, 1280, 1440 and 1920 CSS pixels in light and dark, with a 640px equivalent-zoom check on key flows. Chromium and Axe results describe this automated coverage.

Visual review found a narrow Workshop diagram overflow, a skip link artifact in section captures an awkward heading wrap and a mobile chapter-list marker alignment issue. The final styles resolve those issues. Lighthouse also surfaced a mismatch between visible product preview text and its link name. The linked art now uses its visible text and image descriptions as its accessible name.

Public screenshots in `.tools/axvrma-3.1/public/` cover desktop home in light and dark, mobile home, marquee, milestones, featured products, Story and Workshop. An isolated loopback preview exercised the pending DP World and IIT assets, and `.tools/axvrma-3.1/private-review/` contains their private visual evidence, including certificate expansion. Certificate checks at 320, 390, 768 and 1440 CSS pixels in both themes confirmed zero Axe violations in the modal, full-resolution loading and Esc focus restoration. Production has the factual milestone treatments while those two images await clearance.

## Repeat the checks

```sh
npm ci
SITE_URL=https://axvrma.com npm run verify
npx playwright install chromium
npm run test:e2e
npm run preview
```

With preview running, use `node scripts/capture-visuals.mjs` for screenshots and the homepage word and image measurements. Set `VISUAL_URL` or `VISUAL_DIR` to use a different preview origin or output. Run `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse` separately. See [performance](PERFORMANCE.md) for the measured comparison.
