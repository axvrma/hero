# Portfolio verification

Run `npm run verify` and `npm run test:e2e` with Node.js 24. The first command runs content and publication checks, TypeScript and the Netlify-compatible production build. Playwright covers navigation, keyboard behavior, accessibility, legacy redirects, FAQ, editorial dialogs, recognition movement, photo expansion, fonts and loading. The eight requested viewports are included in the responsive browser check.

Run `npm run compare:reference` with the static preview listening on port 4173, or set `PORTFOLIO_URL`. The script captures both sites using Chromium with reduced motion and captures resized section evidence from the full-page frames. It reports raw pixel match, mask coverage, masked pixel match and DOM geometry deltas. Static frames align at the original page origin, and extra page height contributes to the result.

Run `node scripts/capture-visuals.mjs` for motion-enabled interaction frames. See the [implementation report](implementation-report.md) for measured results.
