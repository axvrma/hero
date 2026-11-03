import lighthouse from "lighthouse";
import { chromium } from "@playwright/test";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
const server = createServer();
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
await new Promise((resolve) => server.close(resolve));
const browser = await chromium.launch({
  args: [
    `--remote-debugging-port=${port}`,
    "--remote-debugging-address=127.0.0.1",
  ],
});
try {
  const result = await lighthouse(
    process.env.AUDIT_URL || "http://127.0.0.1:4174/",
    {
      port,
      output: ["json", "html"],
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
  );
  const lhr = result.lhr;
  const summary = {
    date: lhr.fetchTime,
    url: lhr.finalDisplayedUrl,
    version: lhr.lighthouseVersion,
    settings: {
      formFactor: lhr.configSettings.formFactor,
      throttling: lhr.configSettings.throttling,
    },
    categories: Object.fromEntries(
      Object.entries(lhr.categories).map(([key, value]) => [
        key,
        Math.round(value.score * 100),
      ]),
    ),
    metrics: Object.fromEntries(
      [
        "first-contentful-paint",
        "largest-contentful-paint",
        "cumulative-layout-shift",
        "total-blocking-time",
        "speed-index",
      ].map((key) => [
        key,
        {
          value: lhr.audits[key].numericValue,
          display: lhr.audits[key].displayValue,
        },
      ]),
    ),
  };
  await mkdir(".tools", { recursive: true });
  await writeFile(".tools/lighthouse.json", result.report[0]);
  await writeFile(".tools/lighthouse.html", result.report[1]);
  await writeFile(
    "docs/lighthouse-summary.json",
    JSON.stringify(summary, null, 2) + "\n",
  );
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
