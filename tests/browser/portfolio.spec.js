import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { products } from "../../content/products.mjs";
import { featured } from "../../content/personal-folio.mjs";
import { enterpriseCases } from "../../content/enterprise.mjs";
import { hackathonProjects } from "../../content/hackathons.mjs";

const routes = ["/", "/work", "/about"];
const redirects = JSON.parse(await readFile(".generated/redirects.json", "utf8"));
const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const viewports = [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [375, 812]];

test("desktop navigation links to the four homepage sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Home", "Work", "About", "FAQ"]);
  for (const [label, fragment] of [["Work", "work"], ["About", "about"], ["FAQ", "faq"], ["Home", "home"]]) {
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`/#${fragment}$`));
  }
});

test("mobile menu supports keyboard, Escape and anchor activation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.getByRole("button", { name: "Open menu" });
  await button.focus();
  await page.keyboard.press("Enter");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Home", "Work", "About", "FAQ"]);
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(nav).toHaveCount(0);
  await button.click();
  await nav.getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  const questions = page.getByRole("button", { name: "Frequently Asked Questions" });
  await expect(questions).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await nav.getByRole("link", { name: "FAQ" }).click();
  await expect(page).toHaveURL(/#faq$/);
  await expect(questions).toHaveAttribute("aria-expanded", "true");
  await page.locator(".accordion details").last().locator("summary").click();
  await expect(page.getByText(/Connect with me through LinkedIn/)).toBeVisible();
});

test("skip link and call to action are reachable by keyboard", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(".hero-actions").getByRole("link", { name: /Let’s talk/ })).toBeFocused();
});

test("the generated sitemap and all legacy routes resolve", async ({ request }) => {
  const manifest = JSON.parse(await readFile(".generated/routes.json", "utf8"));
  expect(manifest.map(({ path }) => path)).toEqual(routes);
  const documents = new Map(await Promise.all(routes.map(async (path) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    return [path, await response.text()];
  })));
  const canonical = documents.get("/").match(/rel="canonical" href="([^"]+)"/)?.[1];
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url))
    .toEqual(canonical ? routes.map((route) => new URL(route, canonical).href) : []);
  expect(redirects).toHaveLength(72);
  for (const [from, to] of redirects) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    expect(response.headers().location, from).toBe(to);
    const [path, anchor] = to.split("#");
    expect(documents.has(path), from).toBe(true);
    if (anchor) expect(documents.get(path), from).toContain(`id="${anchor}"`);
  }
  const campaign = await request.get("/work/lighthouse-agent?ref=portfolio", { maxRedirects: 0 });
  expect(campaign.headers().location).toBe("/work?ref=portfolio#auditbench");
  expect((await request.get("/does-not-exist")).status()).toBe(404);
});

test("featured case links resolve to the right work chapters", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".case-card");
  await expect(cards).toHaveCount(featured.length);
  for (const item of featured) {
    const card = cards.filter({ hasText: item.title });
    await expect(card.getByRole("link", { name: /View case study/ })).toHaveAttribute("href", `/work#${item.id}`);
  }
  await cards.first().getByRole("link", { name: /View case study/ }).click();
  await expect(page).toHaveURL(/\/work#intelligent-invoice-processing$/);
  const details = page.locator("#details-intelligent-invoice-processing");
  await expect(details).toHaveJSProperty("open", true);
  await details.locator("summary").press("Enter");
  await expect(details).toHaveJSProperty("open", false);
  await page.goto("/work/lighthouse-agent");
  await expect(page.locator("#details-auditbench")).toHaveJSProperty("open", true);
});

test("enterprise history and independent project links are preserved", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator(".enterprise-entry")).toHaveCount(6);
  await expect(page.locator(".product-entry")).toHaveCount(7);
  await expect(page.locator(".archive-entry")).toHaveCount(10);
  for (const { id, title } of enterpriseCases) {
    const entry = page.locator(`#${id}`);
    await expect(entry.getByRole("heading", { name: title })).toBeVisible();
    await expect(entry.getByText("My contribution", { exact: true })).toBeVisible();
  }
  for (const { id, live, source } of [...products, ...hackathonProjects]) {
    const entry = page.locator(`#${id}`);
    await expect(entry.getByRole("link", { name: /^Source code:/ })).toHaveAttribute("href", new URL(source).href);
    await expect(entry.locator(`a[href="${new URL(live).href}"]`).first()).toBeVisible();
  }
  await expect(page.locator("#boxbay-ai")).toContainText("Independent prototype");
  await expect(page.locator("#boxbay-ai")).toContainText("hypothetical");
});

test("all eight viewports have responsive controls, fonts and no horizontal overflow", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    expect(await page.evaluate(async () => {
      await document.fonts.ready;
      return {
        width: document.documentElement.scrollWidth,
        fontFailures: [...document.fonts].filter(({ status }) => status === "error").length,
        bodyFontLoaded: [...document.fonts].some(({ family, status }) => family === "Manrope" && status === "loaded"),
      };
    }), `${width}×${height}`).toEqual({ width, fontFailures: 0, bodyFontLoaded: true });
    if (width < 810) {
      for (const button of await page.locator(".hero-actions .button").all()) expect((await button.boundingBox()).width).toBe(312);
    }
  }
  for (const width of [809, 810, 1279, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const expected = width < 810 ? 328 : width < 1280 ? 726 : 1024;
    expect((await page.locator(".case-card").first().boundingBox()).width, `${width}px breakpoint`).toBe(expected);
  }
  for (const path of ["/work#configuration-driven-ui", "/about#story-first-program", "/work#atlas", "/work#design-spec-generator"]) {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBe(320);
  }
});

test("site meets tested Axe checks at desktop and mobile widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
      expect(results.violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)]), `${width} ${route}`).toEqual([]);
    }
  }
});

test("accordion opens a single answer, article opens a dialog, and carousel responds", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const faq = page.locator(".accordion details");
  await expect(faq.first()).toHaveJSProperty("open", true);
  await faq.nth(1).locator("summary").press("Enter");
  await expect(faq.nth(1)).toHaveJSProperty("open", true);
  await expect(faq.first()).toHaveJSProperty("open", false);
  const article = page.locator("[data-article]").first();
  await article.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".reading-body")).not.toBeEmpty();
  await page.keyboard.press("Escape");
  await expect(article).toBeFocused();
  await page.getByRole("button", { name: "Next recognition" }).click();
  await expect.poll(() => page.locator("[data-carousel]").evaluate((node) => node.scrollLeft)).toBeGreaterThan(0);
});

test("real scrolling reveals sections, and motion can be paused", async ({ page }) => {
  await page.goto("/");
  const card = page.locator(".case-card").last();
  await expect(card).not.toHaveClass(/revealed/);
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/revealed/);
  const motion = page.getByRole("button", { name: "Pause motion" });
  await motion.click();
  await expect(page.getByRole("button", { name: "Resume motion" })).toHaveAttribute("aria-pressed", "true");
  const animationState = await page.locator(".employer-track").evaluate((node) => getComputedStyle(node).animationPlayState);
  expect(animationState).toBe("paused");
});

test("native no-script content, real certificate and résumé remain usable", async ({ browser, page, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 390, height: 844 } });
  const staticPage = await context.newPage();
  await staticPage.goto("/");
  await staticPage.getByRole("navigation").getByRole("link", { name: "FAQ" }).click();
  await expect(staticPage).toHaveURL(/#faq$/);
  await staticPage.locator(".accordion details").last().locator("summary").click();
  await expect(staticPage.getByText(/Connect with me through LinkedIn/)).toBeVisible();
  await context.close();
  await page.goto("/about#resume");
  await expect(page.getByRole("button", { name: "Print or save PDF" })).toBeVisible();
  await page.getByRole("link", { name: "Expand certificate" }).click();
  await expect(page.getByRole("dialog", { name: "Expanded photograph" })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("img")).toHaveAttribute("src", /iit-guwahati.*redacted.webp$/);
  await page.getByRole("button", { name: "Close image" }).click();
  await expect(page.getByRole("link", { name: "Expand certificate" })).toBeFocused();
});

test("built pages use local images and do not produce console errors", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (entry) => { if (entry.type() === "error") errors.push(entry.text()); });
  for (const path of routes) {
    await page.goto(path);
    const broken = await page.locator("img").evaluateAll(async (images) => {
      await Promise.allSettled(images.map((image) => {
        image.loading = "eager";
        return image.decode();
      }));
      return images.filter((image) => !image.naturalWidth || new URL(image.currentSrc).origin !== location.origin).map((image) => image.src);
    });
    expect(broken, path).toEqual([]);
  }
  expect(errors).toEqual([]);
});
