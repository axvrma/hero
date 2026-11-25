# Performance

The production-configured static artifact was audited on 26 November 2026 in local time using Node.js 24.19.0, Chromium and Lighthouse 13.6.0. Lighthouse used its simulated mobile profile with 150 ms RTT, about 1.64 Mbps throughput and 4× CPU slowdown. The local artifact server delivered uncompressed responses. These are laboratory measurements.

## Budgets

- Mobile Lighthouse performance at least 90, with a goal of 95. Automated accessibility target 100 and SEO target 95.
- Largest Contentful Paint below 2.5 s. Cumulative Layout Shift below 0.1. Total Blocking Time below 100 ms.
- Home transfers at most 250 KiB in the Lighthouse navigation audit. The shared entry JavaScript target is 6 KiB uncompressed. Home’s HTML and shared stylesheet targets are 60 KiB and 38 KiB uncompressed.
- Load one responsive portrait candidate at high priority. Lazy-load supporting photos and product imagery. Load demo and photo-viewer code on demand.

## Results

- **Home** · Performance 99, accessibility 100, best practices 100, SEO 100. LCP 2.11 s, CLS 0, blocking time 0 ms.
- **Work** · Performance 100, accessibility 100, best practices 100, SEO 100. LCP 1.50 s, CLS 0, blocking time 0 ms.
- **About** · Performance 99, accessibility 100, best practices 100, SEO 100. LCP 1.96 s, CLS 0, blocking time 0 ms.

Home used about 180 KiB during the mobile audit, including eager first-view assets and Chrome’s nearby lazy-image requests. Its production HTML is about 48 KiB, the shared CSS about 34 KiB and the shared entry JavaScript under 6 KiB. At a 390px viewport and 1× device scale, the screenshot run loaded the 480px hero crop at 23,390 bytes. The Playwright 2× mobile test selected the 640px source.

No renderer or animation library is in the browser bundle. The illustrations are compact SVG geometry, and persistent motion runs only while its scene is visible. Pointer movement schedules a frame on demand. Photography uses WebP sources with dimensional attributes. Reduced-motion and no-JavaScript visitors receive the same complete drawings.

The [Home summary](lighthouse-summary.json) is tracked. The local JSON and HTML reports for all three pages are in `.tools/axvrma-motion/lighthouse/`. Hosted performance and field data await an authorized deployment.
