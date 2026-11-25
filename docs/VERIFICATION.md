# AXVRMA 4.0 verification

Verified the production-configured artifact on 26 November 2026 in local time. The comparison checkout is `8c5621a` from `origin/main`, labelled AXVRMA 3.2 in its README.

## Build and routes

- `npm ci`, `npm run generate`, `npm run typecheck`, `npm test`, `npm run build`, `npm run verify` and `npm run test:e2e` completed on Node.js 24.19.0. The unit suite passed 24 tests. The Chromium browser suite passed 23 tests. npm audit reported zero vulnerabilities.
- The production output is three canonical documents and a real 404. All 72 HTTP redirects passed the local status and Location checks. The generated manifest covers all 32 former canonical addresses and 39 pre-existing aliases. Netlify’s redirect parser 14.4.0 read all 72 rules and preserved the target fragments.
- The browser exercised the keyboard skip link, section navigation, auto-opened deep links, disclosures, image dialog and print CSS. All five retained demos were checked, including the retro desktop, arithmetic, elapsed time, fictional regional configuration and fictional shipment workflow.
- Local browser tests found zero failed resources, page errors or CSP violations. They checked the actual preview headers and 404s for unknown and retired server paths. The no-JavaScript and WebGL-disabled cases passed. A motion test checked the hero and both section backgrounds, their offscreen state, reduced motion and the keyboard pause across navigation.

## Accessibility and reflow

Axe recorded zero violations on Home, Work and About at 390px and 1440px. Expanded demos and the photograph dialog also passed Axe. Manual and automated checks covered keyboard focus, Escape and focus restoration, native summaries, a labelled paused marquee, reduced motion, readable static content and diagram descriptions. Reflow passed at 320, 375, 390, 640, 768, 1024, 1440 and 1920 CSS pixels, including expanded examples and archive entries. Lighthouse returned 100 accessibility on all three pages. These checks provide automated and interaction evidence for the WCAG 2.2 AA target.

A supplemental WebKit 27.2 iPhone 13 smoke check used a local HTTPS connection to exercise the strict CSP. All three pages reflowed at 390px, and certificate expansion and the Lighthouse Agent redirect worked. The regional and shipment demos use native radio groups for two-choice inputs.

## Screenshots and reading effort

The Playwright capture script saves full desktop and mobile screenshots of Home, Work and About under `.tools/axvrma-minimal/public/`. It also captures the hero, employer marquee, engineering impact, career, featured products, principles, recognition, closing, assembled optical state and expanded certificate. The desktop viewport was 1440 × 1000 and the mobile viewport was 390 × 844. The motion revision’s recording and desktop and mobile stills are in `.tools/axvrma-motion/`. The reference captures are in `.tools/axvrma-4/reference/`.

Using the same browser word count at 1440px, the minimal revision before the motion pass had **126 primary words**, down from **302** in the initial 4.0 edition and **391** in the previous checkout. The broader visible-main count fell from 475 to 191. The rendered homepage fell from 10,769 px to 4,316 px at the desktop test width. The 390px version has 126 primary words and 3,813 px of rendered main content. Counts omit navigation, captions, annotations, metadata and closed disclosures. The capture script records the measurements and responsive hero bytes.

## External links and deployment

All 52 emitted external destinations were checked. The Business Shield custom host returned a certificate-name error in one concurrent probe. Direct HTTPS retries succeeded, including checks against both DNS endpoints. The existing live URL remains in place. The verified archived uSpec link required GET after its server rejected HEAD. Two inherited archive references now display as plain text, preserving the attribution for the placeholder cargoes-runner URL and the generic Figma Community link that returned a blocked response.

The local build is ready for the existing Netlify configuration. Deployment requires the owner’s explicit authorization. Live CDN headers, canonical behavior and redirect execution await that deployment. The staged employer marks, 2023 DP World award photograph and business figures remain gated by their outstanding approvals. [Publication status](CONTENT-REVIEW.md) · [Performance results](PERFORMANCE.md)
