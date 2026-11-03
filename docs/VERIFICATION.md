# Executed verification

Executed locally on 3 November 2026 with Node 24.19.0, macOS ARM64, Chromium from Playwright, and Vite 8.3.5. No remote publish or infrastructure mutation was performed.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed: TypeScript checks the centralized flagship registry against Product/CaseSection types |
| `npm test` | 12 tests cover the registry, content escaping/sanitizing, URL validation, preserved content and deployment metadata validation |
| `npm run build` | Passed: 24 public static routes, 404, assets and SEO files |
| Build output checks | Passed: all route documents, one h1 per route, descriptions, local links/assets, fragment targets, duplicate IDs, 36 exact redirects |
| `npm run test:e2e` | 31 passed against the production artifact with configured headers |
| Browser accessibility | No axe WCAG 2 A/AA and 2.1 AA violations in tested public pages, dark/light home, and expanded mobile navigation |
| Responsive layout | No horizontal overflow at 320, 390, 768, 1024, 1440 and 1920 px on home, archive, Atlas/Envision case studies, about and contact |
| Interactions | Theme persistence and blocked-storage fallback; mobile keyboard open/Escape/focus restoration/navigation; product-map navigation; archive filtering; reduced motion |
| Static delivery | Content works without JavaScript; unknown paths produce 404; exact legacy 301 responses; no failed local resources or browser errors across representative routes |
| Dependency audit | `npm audit` and `npm audit --omit=dev`: zero known vulnerabilities after removing unused runtime SDK dependencies and retaining patched development-tool overrides |
| Determinism and SEO environments | Same generated files have identical SHA256 across repeated runs; 24-entry configured-origin sitemap, exact canonical and preview noindex/preview-origin verified |
| Visual review | Viewed desktop dark/light home, mobile home, and the Atlas case study capture; original screenshots and illustrations reserve their space |
| `git diff --check` | Passed |

The first browser pass exposed Vite preview’s SPA fallback at clean URLs. The preview now resolves real directory indexes and the real 404. A subsequent pass identified a 4.49:1 light-theme contrast ratio on architecture indices; the token was darkened and the full suite then passed. Tests do not hide those issues through broad exclusions.

## Netlify build correction

The production failure was reproduced with `CONTEXT=production URL=https://axvrma.netlify.app SITE_URL= npm run build`. Vite completed, but the output checker incorrectly treated every occurrence of the current Netlify hostname as stale. The checker now validates canonical and Open Graph URLs against the same resolved deployment origin used by generation, including local `.env` values. The matching production build passes across all 24 routes and 36 redirects. Seven regression checks cover the Netlify default URL, custom SITE_URL, genuinely stale metadata, preview identity, local dotenv and builds without a configured origin. No frontend code changed for this correction.

## Lighthouse

The prior local mobile Lighthouse 13.6.0 result (recorded before the integration cleanup) is retained in [`lighthouse-summary.json`](lighthouse-summary.json). The run used simulated mobile throttling: 150 ms RTT, approximately 1.6 Mbps throughput, and 4× CPU slowdown.

| Category / metric | Measured result |
| --- | --- |
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1.2 s |
| CLS | 0 |
| Total blocking time | 0 ms |

This is one local homepage lab measurement, not a production field guarantee. It does not measure INP or prove every page/device meets the same score. Re-run using `npm run preview` and `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse`. Detailed HTML/JSON audit artifacts and browser screenshots live under ignored `.tools/`; the compact measurement summary is committed.

## Remaining external verification

- Content is now built directly from local repository files; no external integration or API key is needed.
- The deployment origin is intentionally unconfigured. `axvrma.com` returned 403; set the verified SITE_URL before production. The SEO environment test used reserved example domains solely as fixtures, then restored a local no-origin build.
- Atlas, Vibes, Envision and Prism public application URLs returned 200. The fixed Servio URL had a TLS hostname mismatch and needs a hosting-side correction. It is intentionally retained exactly as requested.
- Production domain routing and hosting headers require an authorized deployment preview; no backend functions remain.
- Browser automation covers Chromium. Safari/Firefox, assistive-technology review, physical devices and field INP remain unmeasured.

The existing résumé, LinkedIn and Pop Pay demo URLs returned 200. The old Web XR demo returned 404, so its launch action is suppressed with an explicit metadata override; its case study and source remain.

All sixteen original repository URLs returned HTTP 200, following the GitHub redirects for renamed repositories. Legacy project identities retain their original source URLs.
