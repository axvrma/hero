# Performance

The repository’s Lighthouse script measured the homepage from the static artifact server at `http://127.0.0.1:4173/` on November 24, 2026. Baseline and final runs used Node.js 24.19.0, Lighthouse 13.6.0 and headless Chromium 156 on Apple Silicon macOS. Lighthouse used its mobile configuration with simulated network throttling of 150 ms RTT, 1,638 kbps throughput and 4× CPU slowdown.

## Baseline and final measurements

- **Category scores** for Performance, Accessibility, Best Practices and SEO were 100 in both runs.
- **Largest Contentful Paint** was 1,354.4 ms at baseline and 1,352.8 ms in the final run.
- **First Contentful Paint and Speed Index** were 1,354.4 ms at baseline and 1,352.8 ms in the final run.
- **Cumulative Layout Shift** was 0 in both runs.
- **Total Blocking Time** was 0 ms in both runs.

The final run met the stated synthetic homepage targets. The difference in paint measurements is small enough to treat the two runs as equivalent. Field INP is unavailable. Lab scores describe this local configuration and do not establish production Core Web Vitals. Approved photos should be audited after placement because a hero photograph can change LCP.

## Payload and loading

The homepage is about 31 kB of HTML before compression, down from 46 kB at baseline. The shared stylesheet is about 12 kB compressed and the browser entry module is about 1.9 kB compressed. The story and workflow demos load an additional module only when opened. Optional photograph expansion also loads separately. The geometric hero is inline SVG. Existing project images use reserved dimensions, responsive candidates where supplied, and lazy loading below the fold. Geist fonts are served from the site.

The machine-readable homepage summary lives in [lighthouse-summary.json](lighthouse-summary.json). The local HTML and JSON reports are in `.tools/`. To reproduce the run, start `npm run preview` after a build and run `AUDIT_URL=http://127.0.0.1:4173/ npm run lighthouse` from another shell.
