import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const origin = process.env.VISUAL_URL || "http://127.0.0.1:4174";
const output = process.env.VISUAL_DIR || ".tools/axvrma-minimal/public";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();

function wordCounts() {
  const main = document.querySelector("main");
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const all = [];
  const editorial = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const element = node.parentElement;
    if (element.closest("[aria-hidden=true], [hidden], .sr-only, svg, script, style") ||
        !element.getClientRects().length || !element.checkVisibility({ visibilityProperty: true }) ||
        (element.closest("details:not([open])") && !element.closest("summary"))) continue;
    all.push(node.textContent);
    if (!element.closest("figcaption, .eyebrow, .mono, .index, nav, .hero-identity, .journey-stages dl, .brand-section, .brands, .award-type")) {
      editorial.push(node.textContent);
    }
  }
  const count = (parts) => (parts.join(" ").match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
  return { mainWords: count(all), editorialWords: count(editorial), mainHeightPx: main.offsetHeight };
}

async function capture(page, name, { selector, fullPage = false } = {}) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const options = { path: join(output, `${name}.png`), animations: "disabled" };
  if (selector) await page.locator(selector).screenshot(options);
  else await page.screenshot({ ...options, fullPage });
}

async function load(page, path, site = origin) {
  await page.goto(new URL(path, site).href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = [...document.querySelectorAll("main img")];
    for (const image of images) image.loading = "eager";
    await Promise.all(images.map((image) => image.decode()));
  });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce", isMobile: true, hasTouch: true });
  const metrics = {};
  if (process.env.BASELINE_VISUAL_URL) {
    await load(desktop, "/", process.env.BASELINE_VISUAL_URL);
    metrics.baselineDesktop = await desktop.evaluate(wordCounts);
    await capture(desktop, "baseline-home-desktop");
  }
  await load(desktop, "/");
  metrics.desktop = await desktop.evaluate(wordCounts);
  await capture(desktop, "home-desktop-hero");
  await capture(desktop, "home-desktop", { fullPage: true });

  const scenes = [
    ["employer-marquee", ".brands"], ["engineering-impact", "#impact"],
    ["career-journey", "#journey"], ["featured-products", "#work"],
    ["engineering-principles", "#principles"], ["recognition", "#recognition"],
    ["closing", "#contact"],
  ];
  for (const name of ["principles","recognition"]) await desktop.locator(`.${name}-disclosure > summary`).click();
  for (const [name, selector] of scenes) await capture(desktop, name, { selector });
  const toggle = desktop.getByRole("button", { name: "Assemble the layers" });
  await toggle.click();
  await capture(desktop, "principles-assembled", { selector: "[data-assembly]" });
  await desktop.locator("#recognition").getByRole("link", { name: "Expand certificate" }).press("Enter");
  await desktop.locator(".photo-dialog img").evaluate((image) => image.decode());
  await capture(desktop, "certificate-expanded");
  await desktop.keyboard.press("Escape");

  await load(mobile, "/");
  metrics.mobile = await mobile.evaluate(wordCounts);
  metrics.mobileHeroImage = await mobile.locator(".hero img").evaluate((image) => ({
    path: new URL(image.currentSrc).pathname,
    bytes: performance.getEntriesByName(image.currentSrc)[0]?.encodedBodySize ?? 0,
  }));
  await capture(mobile, "home-mobile-hero");
  await capture(mobile, "home-mobile", { fullPage: true });
  for (const name of ["principles","recognition"]) await mobile.locator(`.${name}-disclosure > summary`).click();
  for (const [name, selector] of scenes) await capture(mobile, `${name}-mobile`, { selector });

  for (const [path, name] of [["/work", "work"], ["/about", "about"]]) {
    for (const [page, layout] of [[desktop, "desktop"], [mobile, "mobile"]]) {
      await load(page, path);
      await capture(page, `${name}-${layout}-first-view`);
      await capture(page, `${name}-${layout}`, { fullPage: true });
    }
  }

  await writeFile(join(output, "page-metrics.json"), JSON.stringify(metrics, null, 2) + "\n");
  console.log(metrics);
} finally {
  await browser.close();
}
