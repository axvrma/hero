# AXVRMA portfolio implementation report

The Vite static build replaces the former interface with the Personal Folio page sequence and responsive layouts. The homepage holds four case cards, three editorial cards, four animated engineering cards, the recognition carousel, About and FAQ. The two secondary page templates cover detailed work and the personal story. The source preserves Netlify configuration, the independent projects and demos, the printable résumé, the existing contact details and 72 direct redirects.

- [Reference design audit and type identification](reference-design-audit.md)
- [Asset inventory and publication status](ASSETS.md)
- [Owner review register](CONTENT-REVIEW.md)
- [Routes and legacy redirects](ROUTES.md)

## Chromium visual comparison

Four of eight viewports met the 98% masked target. Raw full-page similarity ranged from 79.53% to 89.51%. Masked similarity ranged from 97.23% to 98.46%.

- **1920 × 1080** · 89.51% raw · 98.14% masked · 15.19% of pixels excluded.
- **1440 × 900** · 86.89% raw · 98.45% masked · 19.98% of pixels excluded.
- **1280 × 800** · 85.44% raw · 98.12% masked · 22.33% of pixels excluded.
- **1024 × 768** · 85.78% raw · 97.63% masked · 21.00% of pixels excluded.
- **768 × 1024** · 88.56% raw · 98.46% masked · 18.69% of pixels excluded.
- **430 × 932** · 81.57% raw · 97.40% masked · 31.77% of pixels excluded.
- **390 × 844** · 80.17% raw · 97.23% masked · 34.77% of pixels excluded.
- **375 × 812** · 79.53% raw · 97.23% masked · 36.13% of pixels excluded.

The raw score includes all visible differences. For the masked score, the script excludes the pixels occupied by changed glyphs and the clipped visible boxes of replacement artwork and photographs. It retains section boundaries, backgrounds, card geometry, spacing, and unmatched page height. The script limits the glyph mask to pixel changes inside measured text runs. Scores use Pixelmatch’s 0.1 per-pixel color tolerance with antialiasing included. The tolerance is independent of the percentage of pixels that match.

The script captures every viewport from the same scroll origin and saves reference and local full-page screenshots, section crops, side-by-side views, difference images and measured box deltas in `.research/reference-comparison/`. Separate motion-enabled captures of the menu, work hover, accordion, reading dialog and carousel are in `.research/reference-interactions/`.

All four featured card rectangles match at the three widest widths and at the four mobile-variant widths. At 1024 px, the case rectangles match after the tablet spacing refinement. Main navigation bounds match in all sampled viewports. Differences remain in commercial-font metrics, illustrated replacements, card content density, footer art and the mobile FAQ affordance.

## Verification and publication

- The Node.js 24 production build, TypeScript, 24 unit tests and 12 Chromium tests passed. npm reported zero known dependency vulnerabilities. The local mobile Lighthouse run scored 100 in performance, accessibility, best practices and SEO, with 1.1 s LCP. [Lighthouse summary](lighthouse-summary.json)
- All 72 redirects, their destination anchors and a 404 were exercised against the production artifact. Browser checks covered all eight requested sizes, keyboard navigation, mobile FAQ, motion controls, the image viewer, and the no-JavaScript fallback. Axe found no violations in the tested rules on the three pages at 390 and 1440 px.
- The external demo URLs, professional links and repository destinations were checked. The browser-facing GitHub links to seven README files returned an upstream 503 during the batch, and the corresponding README files each returned 200 through GitHub’s raw-content endpoint.
- Production output was checked for preview drafts and sample testimonials. The published metadata retains the canonical domain and preview mode emits the preview origin and noindex.
- The review build uses the licensed Fraunces fallback. Pockota Medium requires a webfont licence. Brand marks and the DP World event photograph are staged with their recorded release status. The featured project cards use labeled illustrations where original images are unavailable.
- The compact mobile FAQ gives small-screen visitors access to all four questions. The original mobile layout displays the contact card without accordion controls. The tablet displays a compact link for the third editorial card. The template badge and the template author’s imagery are replaced by the owner’s content and attribution.
- The registered content still needs owner review for publishing factual figures, draft article prose and assets pending third-party clearance. The 2026 DP World award carries the owner-reported status. BoxBay is labeled a prototype.

The [Netlify Deploy Preview](https://deploy-preview-1--axvrma.netlify.app/) is live from [draft pull request #1](https://github.com/axvrma/hero/pull/1). The preview serves the three pages, a tested legacy redirect and its noindex directives. It includes the labeled review content. The production domain continues to serve the existing deployment.
