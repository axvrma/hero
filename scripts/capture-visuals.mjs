import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const origin = process.env.VISUAL_URL || "http://127.0.0.1:4173";
const output = process.env.VISUAL_DIR || ".tools/axvrma-3.2/public";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();

function visibleWordCount() {
  const walker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
  const words = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const element = node.parentElement;
    if (element.closest("[aria-hidden=true], [hidden], .sr-only, svg, script, style") ||
        !element.getClientRects().length || !element.checkVisibility({ visibilityProperty: true }) ||
        (element.closest("details:not([open])") && !element.closest("summary"))) continue;
    words.push(node.textContent);
  }
  return (words.join(" ").match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) || []).length;
}

async function capture(page, name, selector) {
  const path = join(output, `${name}.png`);
  if (selector) await page.locator(selector).screenshot({ path, animations: "disabled" });
  else await page.screenshot({ path, animations: "disabled" });
}

async function prepareFullPage(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.querySelectorAll("main img[loading=lazy]")) image.loading = "eager";
    await Promise.all([...document.querySelectorAll("main img")].map((image) => image.decode()));
  });
}

async function fullPage(page, name) {
  await prepareFullPage(page);
  await page.screenshot({ path: join(output, `${name}.png`), fullPage: true, animations: "disabled" });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", colorScheme: "light" });
  await desktop.goto(origin);
  await desktop.evaluate(() => document.fonts.ready);
  const metrics = {
    desktopWords: await desktop.evaluate(visibleWordCount),
    desktopMainHeight: await desktop.locator("main").evaluate((element) => element.offsetHeight),
  };
  await capture(desktop, "home-desktop-light-first-view");
  await fullPage(desktop, "home-desktop-light");
  if (await desktop.locator(".brand-section").count()) {
    await desktop.emulateMedia({ reducedMotion: "no-preference" });
    await capture(desktop, "marquee", ".brand-section");
    await desktop.emulateMedia({ reducedMotion: "reduce" });
  }
  for (const [name, selector] of [["business-impact", ".business-impact"], ["visual-proof", ".visual-proof"], ["featured-products", "#products"]]) {
    if (await desktop.locator(selector).count()) await capture(desktop, name, selector);
  }
  if (await desktop.getByRole("link", { name: "Expand certificate" }).count()) {
    await desktop.getByRole("link", { name: "Expand certificate" }).first().press("Enter");
    await desktop.locator(".photo-dialog img").evaluate((image) => image.decode());
    await capture(desktop, "certificate-expanded");
    await desktop.keyboard.press("Escape");
  }

  await desktop.goto(new URL("/experience", origin).href);
  await prepareFullPage(desktop);
  for (const id of ["dp-world", "nurtr"]) await desktop.locator(`#chapter-${id} summary`).click();
  await capture(desktop, "professional-journey", ".journey-section");
  for (const [name, slug] of [["invoice-case", "intelligent-invoice-processing"], ["shipment-case", "dynamic-shipment-workflows"]]) {
    await desktop.goto(new URL(`/experience/${slug}`, origin).href);
    await fullPage(desktop, name);
  }

  const dark = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", colorScheme: "dark" });
  await dark.goto(origin);
  await capture(dark, "home-desktop-dark-first-view");
  await fullPage(dark, "home-desktop-dark");
  if (await dark.locator(".business-impact").count()) await capture(dark, "business-impact-dark", ".business-impact");
  await dark.goto(new URL("/story", origin).href);
  await fullPage(dark, "story-desktop");
  await dark.goto(new URL("/lab", origin).href);
  await fullPage(dark, "workshop-desktop");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce", colorScheme: "light", isMobile: true, hasTouch: true });
  await mobile.goto(origin);
  metrics.mobileImages = await mobile.evaluate(async () => {
    await document.fonts.ready;
    const images = [...document.querySelectorAll("main img")].filter((image) => {
      const { bottom, top } = image.getBoundingClientRect();
      return bottom > 0 && top < innerHeight;
    });
    await Promise.all(images.map((image) => image.decode()));
    return images.map((image) => ({
      path: new URL(image.currentSrc).pathname,
      bytes: performance.getEntriesByName(image.currentSrc)[0]?.encodedBodySize ?? 0,
    }));
  });
  await capture(mobile, "home-mobile-first-view");
  await fullPage(mobile, "home-mobile");
  await mobile.goto(new URL("/story", origin).href);
  await fullPage(mobile, "story-mobile");
  await mobile.goto(new URL("/lab", origin).href);
  await fullPage(mobile, "workshop-mobile");

  const mobileDark = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: "reduce", colorScheme: "dark", isMobile: true, hasTouch: true });
  await mobileDark.goto(origin);
  await fullPage(mobileDark, "home-mobile-dark");
  if (await mobileDark.getByRole("link", { name: "Expand certificate" }).count()) {
    await mobileDark.getByRole("link", { name: "Expand certificate" }).first().press("Enter");
    await mobileDark.locator(".photo-dialog img").evaluate((image) => image.decode());
    await capture(mobileDark, "certificate-expanded-mobile-dark");
  }

  await writeFile(join(output, "page-metrics.json"), JSON.stringify(metrics, null, 2) + "\n");
  console.log(metrics);
} finally {
  await browser.close();
}
