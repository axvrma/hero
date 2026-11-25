# Performance

The baseline and final builds were audited on November 25, 2026 from the same uncompressed static artifact preview at `http://127.0.0.1:4173/`. The baseline was commit `78a1355`. Both builds used Node.js 24.19.0, Lighthouse 13.6.0 and headless Chromium 156 on Apple Silicon macOS. Lighthouse used its simulated mobile profile with 150 ms RTT, 1,638 kbps throughput and 4× CPU slowdown.

## Baseline and final measurements

- **Performance** moved from 100 to 98 and 97 in the two final runs. Accessibility, Best Practices and SEO stayed at 100.
- **Largest Contentful Paint** moved from 1,359.8 ms to 2,259.2 ms and 2,479.1 ms. The baseline painted the geometric hero and headline. The final runs identified the portrait as the largest painted element.
- **First Contentful Paint and Speed Index** were 1,359.8 ms at baseline and 1,356.1 ms and 1,352.7 ms in the final runs.
- **Cumulative Layout Shift and Total Blocking Time** were 0 in all three runs.

Both final runs met the stated lab targets. The local preview measurements represent the simulated mobile configuration. Field Core Web Vitals are unavailable.

## Text and payload

- The homepage dropped from **1,037 to 504 words**, a **51.4% reduction**. The measurement counts rendered main-content words at 1440 × 1000 with reduced motion. It excludes header and footer navigation, hidden duplicates, SVG text, and closed disclosure bodies. The main content height dropped from 9,820px to 6,622px at that viewport.
- The production homepage is 27.92 kB of HTML before compression, down from 30.85 kB. Its gzip size went from 8.59 kB to 6.96 kB. Shared CSS went from 12.06 kB to 14.73 kB gzip. The browser entry went from 1.89 kB to 1.98 kB gzip.
- At 390 × 844 and device scale 2, the only image intersecting the first view was the 768px hero at **53,742 bytes**. Lighthouse selected the 640px candidate at **39,962 bytes**. The mobile first-view image budget is 250 KB. The baseline used the inline orbit and fetched no first-view bitmap.
- A homepage-only responsive preload matches the eager, high-priority portrait. The remaining photos and product screenshots use lazy loading and reserve intrinsic dimensions. The expandable photo and interactive demo modules load on demand. Story-only portraits stay on Story.

The latest machine-readable result is in [lighthouse-summary.json](lighthouse-summary.json). Local reports, screenshots and text and payload measurements are under `.tools/axvrma-3.1/`. Run `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse` against the production artifact preview to repeat the audit.
