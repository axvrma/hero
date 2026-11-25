# Performance

The AXVRMA 3.1 baseline and AXVRMA 3.2 production artifact were audited on November 25, 2026 at `http://127.0.0.1:4173/`. The baseline was commit `1fcbbd1`. The local preview delivered uncompressed text in both runs. Lighthouse 13.6.0 used headless Chromium 156, Node.js 24.19.0 and the same simulated mobile profile with 150 ms RTT, 1,638 kbps throughput and 4× CPU slowdown.

## Baseline and release measurement

- **Performance** went from 97 to 98. Accessibility and Best Practices scored 100 in both runs. The release SEO score was 100.
- **Largest Contentful Paint** went from 2,578.8 ms to 2,256.6 ms. The hero portrait remained the LCP element. The release met the 2.5-second target.
- **First Contentful Paint and Speed Index** went from 1,369.2 ms to 1,354.4 ms. **CLS and TBT** were 0 in the baseline and release runs.
- The initial certificate integration requested the viewer module during page load and inserted a link before its destination was set. The release imports and constructs the viewer on first interaction. The original anchor works with JavaScript disabled. Field Core Web Vitals are unavailable.

## Reading effort and payload

- Homepage copy grew from 504 to 535 words to accommodate the impact and recognition material. It remains approximately 48% shorter than the 1,037-word AXVRMA 3.0 homepage. The measurement counts rendered main-content words at 1440 × 1000, excluding site navigation, hidden duplicates, SVG text and closed disclosure bodies.
- The homepage is 30.28 kB before compression and 7.47 kB gzip. The shared CSS is 15.49 kB gzip, and the browser entry is 2.08 kB gzip.
- At 390 × 844 and device scale 2, the only first-view image was the 768px portrait at 53,742 bytes, matching the baseline mobile payload. The portrait remains eagerly loaded with a responsive preload. The certificate and its 480px and 800px previews load below the fold. The four staged logo derivatives total 26.8 kB and use native lazy loading in the isolated review build.
- The full-size certificate is 125,014 bytes and loads on expansion or direct navigation.

The release summary is available in [lighthouse-summary.json](lighthouse-summary.json). Local reports, screenshots and measurements are under `.tools/axvrma-3.2/`. Run `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse` against the production artifact preview to reproduce the audit.
