import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { brandMarquee } from "../../src/components/homepage.mjs";

const analyze = async (page) => (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze()).violations.map(({ id }) => id);

test("marquee presents one list and pauses for the control, hover, focus and offscreen", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const marquee = page.getByRole("region", { name: "Employers" });
  const control = marquee.getByRole("button", { name: "Pause employer marquee" });
  const track = marquee.locator(".brands-track");
  await expect(marquee.getByRole("listitem")).toHaveCount(4);
  await expect(track).toHaveCSS("animation-play-state", "running");
  await control.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await control.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "false");
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.keyboard.press("Tab");
  await marquee.scrollIntoViewIfNeeded();
  await expect(track).toHaveCSS("animation-play-state", "running");
  await marquee.hover();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(marquee).not.toHaveClass(/\bin-view\b/);
  await expect(track).toHaveCSS("animation-play-state", "paused");
});

test("reduced motion freezes the backgrounds, employer strip and workflows", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 750 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(page.locator(".brands-track")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".signal").first()).toHaveCSS("animation-name", "none");
  await expect(page.locator(".hero-field svg")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".ambient-glow").first()).toHaveCSS("animation-name", "none");
  await expect(page.getByRole("button", { name: "Pause background motion" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause employer marquee" })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Employers" }).getByRole("listitem")).toHaveText(["DP World", "Airtel Africa", "IRIS Worldwide", "Nurtr"]);
});

test("live backgrounds run by section and remember the keyboard pause on Work", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/");
  const control = page.getByRole("button", { name: "Pause background motion" });
  const heroField = page.locator(".hero-field svg");
  await expect(heroField).toHaveCSS("animation-play-state", "running");

  for (const id of ["impact", "work"]) {
    const glow = page.locator(`#${id} .ambient-glow`);
    await expect(glow).toHaveCSS("animation-play-state", "paused");
    await page.locator(`#${id}`).evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
    await expect(glow).toHaveCSS("animation-play-state", "running");
  }
  await expect(heroField).toHaveCSS("animation-play-state", "paused");
  await control.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(heroField).toHaveCSS("animation-play-state", "paused");

  await page.goto("/work");
  await expect(control).toHaveAttribute("aria-pressed", "true");
  for (const id of ["enterprise", "products"]) {
    await page.locator(`#${id}`).evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
    await expect(page.locator(`#${id} .ambient-scene`)).toHaveClass(/\bin-view\b/);
    await expect(page.locator(`#${id} .ambient-glow`)).toHaveCSS("animation-play-state", "paused");
  }
  await control.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "false");
  await page.locator("#products").evaluate((section) => section.scrollIntoView({ behavior: "instant", block: "start" }));
  await expect(page.locator("#products .ambient-glow")).toHaveCSS("animation-play-state", "running");
});

test("original drawings and assembly control work with WebGL disabled", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (context, ...args) {
      return context.includes("webgl") ? null : getContext.call(this, context, ...args);
    };
  });
  await page.goto("/");
  await expect(page.locator(".hero-optic svg")).toBeVisible();
  await expect(page.locator("#impact .technical-diagram svg")).toHaveCount(3);
  const principles = page.locator(".principles-disclosure");
  await expect(principles).toHaveJSProperty("open", false);
  await page.goto("/#principles");
  await expect(principles).toHaveJSProperty("open", true);
  const control = page.getByRole("button", { name: "Assemble the layers" });
  await control.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-assembly]")).toHaveClass(/\bassembled\b/);
  await control.press("Enter");
  await expect(control).toHaveAttribute("aria-pressed", "false");
});

test("the hero retains the responsive eager portrait without a visible tag", async ({ browser, baseURL }) => {
  const page = await browser.newPage({ baseURL, viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  try {
    await page.goto("/");
    const hero = page.locator(".hero");
    const portrait = hero.getByRole("img");
    await expect(portrait).toHaveAttribute("loading", "eager");
    await expect(portrait).toHaveAttribute("fetchpriority", "high");
    expect(await portrait.evaluate(async (image) => { await image.decode(); return image.currentSrc; })).toMatch(/hero-portrait-640\.webp$/);
    await expect(portrait).toHaveAttribute("alt", "Abhishek Verma in glasses and a dark sweater");
    await expect(hero.locator("figcaption")).toHaveCount(0);
  } finally {
    await page.close();
  }
});

test("the photo viewer shows the approved original and restores keyboard focus", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog", { name: "Expanded photograph", includeHidden: true });
  await expect(dialog).toHaveCount(0);
  const recognition = page.locator(".recognition-disclosure");
  await expect(recognition).toHaveJSProperty("open", false);
  await recognition.locator("summary").first().press("Enter");
  const trigger = page.locator("#recognition").getByRole("link", { name: /Expand photo: Abhishek holding/ });
  await trigger.press("Enter");
  await expect(dialog.getByRole("button", { name: "Close image" })).toBeFocused();
  await expect(dialog.getByRole("img")).toHaveAttribute("src", /\/google-assistant-2018\.webp$/);
  await expect(dialog.getByRole("link", { name: "Open full-size image" })).toHaveAttribute("href", /\/google-assistant-2018\.webp$/);
  await expect(dialog.locator("figcaption")).toHaveText("Google Assistant developer recognition · 2018");
  expect(await analyze(page)).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("certificate facts and redaction are retained and pending assets stay private", async ({ page, request }) => {
  const programme = "Post Graduate Certification Programme in Artificial Intelligence and Machine Learning";
  await page.goto("/about");
  const chapter = page.locator("#story-iit");
  await expect(chapter.getByText(programme, { exact: true })).toBeVisible();
  await expect(chapter.getByText(/Conducted jointly with Emeritus/)).toBeVisible();
  await expect(chapter.getByText("26 June 2025 – 20 May 2026 · Completed 6 July 2026")).toBeVisible();
  const certificate = chapter.getByRole("link", { name: "Expand certificate" });
  await certificate.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Expanded photograph" });
  expect(await dialog.getByRole("img").evaluate(async (img) => { await img.decode(); return [img.naturalWidth, img.naturalHeight]; })).toEqual([1684, 1191]);
  await page.keyboard.press("Escape");
  await expect(certificate).toBeFocused();
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(schema.mainEntity.hasCredential.name).toBe(programme);
  expect(schema.mainEntity.hasCredential.description).toContain("Completed 6 July 2026");

  for (const path of [
    "/images/brands/dp-world.webp", "/images/brands/airtel-africa.webp", "/images/brands/iris.webp", "/images/brands/nurtr.webp",
    "/images/recognition/original-certificate.pdf", "/images/recognition/dp-world-kudos-2023.webp",
    "/images/recognition/dp-world-kudos-2023-640.webp", "/.asset-inbox/axvrma-visual-assets/hero-portrait.webp",
  ]) expect((await request.get(path)).status(), path).toBe(404);
  await page.goto("/");
  await expect(page.locator(".impact-metrics")).toHaveCount(0);
  await page.locator(".recognition-disclosure > summary").click();
  await expect(page.locator("#recognition").getByRole("heading", { name: "DP World Kudos Award, 2023" })).toHaveCount(1);
  await page.getByText("More recognition", { exact: true }).click();
  await expect(page.getByText("DP World Kudos Award, 2026 (owner-reported)")).toBeVisible();
});

test("a cleared employer logo preserves proportions and the accessible name", async ({ page }) => {
  const content = JSON.parse(await readFile("content/portfolio.json", "utf8"));
  content.assets = new Map([["logo-dp-world", { path: "/images/brands/test-mark.webp", width: 120, height: 30, alt: "DP World", focalPoint: "center" }]]);
  await page.route("**/images/brands/test-mark.webp", (route) => route.fulfill({
    contentType: "image/svg+xml",
    body: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="30"><rect width="120" height="30"/></svg>',
  }));
  await page.route("/", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/<section class="brands"[\s\S]*?<\/section>/, brandMarquee(content));
    await route.fulfill({ response, body });
  });
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const tile = page.getByRole("region", { name: "Employers" }).getByRole("listitem").first();
    const image = tile.locator("img");
    await image.scrollIntoViewIfNeeded();
    expect(await image.evaluate(async (img) => {
      await img.decode();
      return [getComputedStyle(img).objectFit, img.clientWidth / img.clientHeight];
    })).toEqual(["contain", 4]);
    await expect(tile).toContainText("DP World");
    await expect(tile.getByRole("img")).toHaveCount(0);
  }
});

test("contact channels resolve and the résumé prints within About", async ({ page }) => {
  await page.goto("/resume");
  await expect(page).toHaveURL(/\/about#resume$/);
  await expect(page.getByRole("link", { name: "Open original résumé" })).toHaveAttribute("href", /^https:\/\/drive\.google\.com\/file/);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.locator(".resume-print")).toBeVisible();
  await expect(page.locator(".resume-print")).toContainText("September 2023 Group SDE II");
  await expect(page.locator(".resume-print")).toContainText("2026) (owner-reported)");
  await page.emulateMedia({ media: "screen" });
  await page.goto("/contact");
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://linkedin.com/in/axvrma");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/axvrma");
});
test("story demos load on demand and support keyboard input, errors and clearing", async ({ page }) => {
  const modules = [];
  page.on("request", (request) => {
    if (/\/assets\/demos-/.test(request.url())) modules.push(request.url());
  });
  await page.goto("/about");
  expect(modules).toEqual([]);
  await page.getByText("The first calculator", { exact: true }).press("Enter");
  const input = page.getByLabel("Expression");
  await input.fill("2 + 3 × (4 - 1)");
  await input.press("Enter");
  await expect(page.getByText("Result: 11")).toBeVisible();
  expect(modules).toHaveLength(1);
  await input.fill("1/(3-3)");
  await input.press("Enter");
  await expect(page.getByText("Division by zero is undefined.")).toBeVisible();
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await page.locator("[data-calculator]").getByRole("button", { name: "Clear" }).click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();

  await page.locator("[data-demo=life] > summary").press("Enter");
  const date = page.getByLabel("Starting date");
  await date.fill("2999-01-01");
  const calculate = page.getByRole("button", { name: "Calculate elapsed time" });
  await calculate.click();
  await expect(page.getByText("Choose a starting date in the past or today.")).toBeVisible();
  await date.fill("2000-01-01");
  await calculate.click();
  await expect(page.locator("[data-unit=days]")).toHaveText(/\d/);
  expect(await page.evaluate(() => [localStorage.getItem("start"), sessionStorage.length])).toEqual([null, 0]);
});

test("fictional configurations change rendered fields, shipment roles and progress", async ({ page }) => {
  await page.goto("/work#configuration-driven-ui");
  await page.getByText("One renderer, two regions", { exact: true }).press("Enter");
  await expect(page.getByLabel("Berth")).toBeVisible();
  await page.getByRole("radio", { name: "Highlands" }).check();
  await expect(page.getByLabel("Access notes")).toBeVisible();
  await expect(page.getByLabel("Berth")).toHaveCount(0);
  await expect(page.locator("[data-config]")).toContainText("Access notes");
  await page.goto("/work#dynamic-shipment-workflows");
  await page.getByText("Explore a fictional shipment", { exact: true }).click();
  await page.getByRole("radio", { name: "Temperature-controlled freight" }).check();
  await page.getByLabel("Check temperature range · Cold-chain coordinator").check();
  await expect(page.locator("#dynamic-shipment-workflows").getByRole("status")).toHaveText("1 of 3 example tasks complete.");
  await page.getByRole("radio", { name: "Standard freight" }).check();
  await expect(page.locator("#dynamic-shipment-workflows").getByRole("status")).toHaveText("0 of 2 example tasks complete.");
});


test("all expanded interactive demos pass Axe", async ({ page }) => {
  for (const [route, ready] of [["/about", "Expression"], ["/work", "Coast"]]) {
    await page.goto(route);
    for (const summary of await page.locator("[data-demo] > summary").all()) await summary.click();
    await page.getByLabel(ready).waitFor();
    expect(await analyze(page), route).toEqual([]);
  }
});
