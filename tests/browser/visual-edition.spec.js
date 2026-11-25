import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa"];
const brandCount = 7;

test("the marquee is one accessible list and pauses for the control, hover and focus", async ({ page }) => {
  await page.goto("/");
  const marquee = page.getByRole("region", { name: "Experience. Recognition. Learning." });
  const viewport = marquee.getByRole("region", { name: "Professional and academic associations" });
  const state = () => marquee.locator(".brand-track").evaluate((element) => getComputedStyle(element).animationPlayState);
  const toggle = marquee.getByRole("button", { name: "Pause marquee" });
  await expect(marquee.getByRole("list")).toHaveCount(1);
  await expect(marquee.getByRole("listitem")).toHaveCount(brandCount);
  await expect(marquee.getByRole("listitem").filter({ hasText: "Google Assistant" })).toContainText("Developer recognition");
  await expect(marquee.locator(".brand-copy")).toHaveAttribute("inert", "");
  await expect(marquee.locator(".brand-copy :is(button,a,[tabindex])")).toHaveCount(0);

  await expect.poll(state).toBe("running");
  await toggle.press("Enter");
  await expect(marquee.getByRole("button", { name: "Resume marquee" })).toBeFocused();
  await expect.poll(state).toBe("paused");
  await marquee.getByRole("button", { name: "Resume marquee" }).press("Enter");
  await expect.poll(state).toBe("running");
  await viewport.hover();
  await expect.poll(state).toBe("paused");
  await viewport.focus();
  await page.mouse.move(0, 0);
  await expect.poll(state).toBe("paused");
  await toggle.focus();
  await expect.poll(state).toBe("running");
});

async function expectStaticMarquee(page) {
  const marquee = page.locator(".brand-section");
  await expect(marquee.getByRole("button")).toHaveCount(0);
  await expect(marquee.getByRole("listitem")).toHaveCount(brandCount);
  await expect(marquee.locator(".brand-copy")).toBeHidden();
  const window = marquee.locator(".brand-window");
  await window.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => window.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
}

test("reduced motion displays a keyboard-scrollable static marquee", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expectStaticMarquee(page);
});

test("without JavaScript the organisation list and photo destinations still work", async ({ browser }, testInfo) => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const baseURL = testInfo.project.use.baseURL;
    await page.goto(baseURL);
    await expectStaticMarquee(page);
    await page.goto(new URL("/story", baseURL).href);
    const image = page.getByRole("link", { name: /Expand photo: Abhishek holding/ });
    await image.click();
    await expect(page).toHaveURL(/\/images\/recognition\/google-assistant-2018\.webp$/);
  } finally {
    await page.close();
  }
});

test("the portrait loads eagerly with the right mobile source and a provenance caption", async ({ browser }, testInfo) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  try {
    await page.goto(testInfo.project.use.baseURL);
    const hero = page.locator(".editorial-hero");
    const image = hero.getByRole("img");
    await expect(hero.getByText("Senior Software Engineer at DP World")).toBeVisible();
    await expect(hero.getByText("8+ years of engineering experience")).toBeVisible();
    await expect(hero.getByText("AI-assisted portrait")).toBeVisible();
    await expect(image).toHaveAttribute("fetchpriority", "high");
    await expect(image).toHaveAttribute("loading", "eager");
    await expect(image).toHaveAttribute("width", "1080");
    await expect(image).toHaveAttribute("height", "1440");
    const preload = page.locator('link[rel="preload"][as="image"]');
    await expect(preload).toHaveCount(1);
    await expect(preload).toHaveAttribute("imagesrcset", await image.getAttribute("srcset"));
    await expect(preload).toHaveAttribute("imagesizes", await image.getAttribute("sizes"));
    expect(await image.evaluate(async (element) => {
      await element.decode();
      return new URL(element.currentSrc).pathname;
    })).toBe("/images/portraits/hero-portrait-768.webp");
  } finally {
    await page.close();
  }
});

test("the mobile bento follows a readable image sequence with two compact personal photos", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const proof = page.locator(".proof-grid");
  const tiles = proof.locator("figure");
  await expect(tiles).toHaveCount(5);
  const [award, google, credential, portrait, workshop] = await Promise.all((await tiles.all()).map((tile) => tile.boundingBox()));
  expect(award.width).toBe(google.width);
  expect(google.y).toBeGreaterThan(award.y);
  expect(credential.y).toBeGreaterThan(google.y);
  expect(portrait.y).toBeGreaterThan(credential.y);
  expect(portrait.y).toBe(workshop.y);
  expect(portrait.width).toBeLessThan(award.width / 2);
  await expect(proof.locator(".proof-credential")).toContainText("PG Certification in AI & ML");
  await expect(proof.getByRole("link", { name: "Recognised at DP World." })).toHaveAttribute("href", "/experience#achievements");
});

test("the public image viewer loads original photographs and restores keyboard focus", async ({ page }) => {
  await page.goto("/story");
  const dialog = page.getByRole("dialog", { name: "Expanded photograph", includeHidden: true });
  await expect(dialog).toHaveCount(1);
  const trigger = page.getByRole("link", { name: /Expand photo: Abhishek holding/ });
  await trigger.press("Enter");
  await expect(dialog.getByRole("button", { name: "Close image" })).toBeFocused();
  await expect(dialog.getByRole("img")).toHaveAttribute("src", /\/google-assistant-2018\.webp$/);
  await expect(dialog.getByRole("link", { name: "Open full-size image" })).toHaveAttribute("href", /\/google-assistant-2018\.webp$/);
  await expect(dialog.locator("figcaption")).toHaveText("Google Assistant developer recognition · 2018");
  const result = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  expect(result.violations.map(({ id }) => id)).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("certificate facts are consistent and pending evidence is excluded from the public artifact", async ({ page, request }) => {
  const programme = "Post Graduate Certification Programme in Artificial Intelligence and Machine Learning";
  for (const route of ["/story", "/experience", "/resume", "/about"]) {
    await page.goto(route);
    await expect(page.getByText(programme, { exact: true })).toBeVisible();
    await expect(page.getByText("Conducted jointly with Emeritus.")).toBeVisible();
    await expect(page.getByText("26 June 2025 – 20 May 2026 · Completed 6 July 2026")).toBeVisible();
    await expect(page.getByRole("link", { name: "Expand certificate" })).toHaveCount(0);
  }
  for (const path of [
    "/images/recognition/iit-guwahati-ai-ml-2026-redacted.webp",
    "/images/recognition/iit-guwahati-ai-ml-2026-redacted-800.webp",
    "/images/recognition/dp-world-kudos-2023.webp",
    "/images/recognition/dp-world-kudos-2023-640.webp",
    "/.asset-inbox/axvrma-visual-assets/hero-portrait.webp",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
  await page.goto("/");
  const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(schema.mainEntity.hasCredential.name).toBe(programme);
  expect(schema.mainEntity.hasCredential.description).toContain("Completed 6 July 2026");
});
