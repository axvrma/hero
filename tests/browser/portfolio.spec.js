import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { products } from "../../content/products.mjs";
import { enterpriseCases } from "../../content/enterprise.mjs";
import { hackathonProjects } from "../../content/hackathons.mjs";

const routes = ["/", "/work", "/about"];
const redirects = JSON.parse(await readFile(".generated/redirects.json", "utf8"));
const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const summarize = (result) => result.violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)]);

test("the navigation has only Work, About and a printable résumé", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link")).toHaveText(["Work", "About", "Résumé"]);
  await nav.getByRole("link", { name: "Work" }).press("Enter");
  await expect(page).toHaveURL(/\/work$/);
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("aria-current", "page");
  await nav.getByRole("link", { name: "About" }).press("Enter");
  await expect(page).toHaveURL(/\/about$/);
  await nav.getByRole("link", { name: "Résumé" }).press("Enter");
  await expect(page).toHaveURL(/\/about#resume$/);
  await expect(page.getByRole("button", { name: "Print or save PDF" })).toBeVisible();
  const homeLink = page.getByRole("link", { name: "Abhishek Verma home" });
  await expect(homeLink).toHaveText("Abhishek Verma");
  await homeLink.press("Enter");
  await expect(page).toHaveURL(/\/$/);
});

test("a keyboard skip link enters the main navigation order", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Explore my work" })).toBeFocused();
});

test("the sitemap and build manifest identify exactly three canonical pages", async ({ request }) => {
  const manifest = JSON.parse(await readFile(".generated/routes.json", "utf8"));
  expect(manifest.map(({ path }) => path)).toEqual(routes);
  const homepage = await (await request.get("/")).text();
  const canonical = homepage.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  expect(entries).toEqual(canonical ? routes.map((route) => new URL(route, canonical).href) : []);
});

test("all historical addresses reach a canonical page and matching anchor in one 301", async ({ request }) => {
  const documents = new Map(await Promise.all(routes.map(async (path) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(200);
    return [path, await response.text()];
  })));
  expect(redirects).toContainEqual(["/work/lighthouse-agent", "/work#auditbench"]);
  expect(redirects).toContainEqual(["/project-lighthouse-agent.html", "/work#auditbench"]);
  for (const page of ["/work", "/about"]) {
    expect(redirects).toContainEqual([`${page}/index.html`, page]);
    const previousHostPath = await request.get(`${page}/`, { maxRedirects: 0 });
    expect(previousHostPath.status()).toBe(301);
    expect(previousHostPath.headers().location).toBe(page);
  }
  const campaign = await request.get("/work/lighthouse-agent?ref=portfolio", { maxRedirects: 0 });
  expect(campaign.headers().location).toBe("/work?ref=portfolio#auditbench");
  for (const [from, to] of redirects) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    expect(response.headers().location, from).toBe(to);
    const [path, anchor] = to.split("#");
    expect(documents.has(path), from).toBe(true);
    if (anchor) expect(documents.get(path), from).toContain(`id="${anchor}"`);
  }
});

test("case and archive disclosures open from old URLs and support keyboard toggles", async ({ page }) => {
  await page.goto("/work/atlas");
  await expect(page).toHaveURL(/\/work#atlas$/);
  const atlas = page.locator("#atlas");
  const details = atlas.locator("details");
  await expect(details).toHaveJSProperty("open", true);
  await expect(atlas.getByRole("heading", { name: "Architecture" })).toBeVisible();
  await details.locator("summary").press("Enter");
  await expect(details).toHaveJSProperty("open", false);
  await details.locator("summary").press("Enter");
  await expect(details).toHaveJSProperty("open", true);
  await page.goto("/experience/intelligent-invoice-processing");
  await expect(page).toHaveURL(/\/work#intelligent-invoice-processing$/);
  await expect(page.locator("#details-intelligent-invoice-processing")).toHaveJSProperty("open", true);
  await page.goto("/project-web-xr.html");
  const legacy = page.locator("#web-xr");
  await expect(legacy.locator("details")).toHaveJSProperty("open", true);
  await expect(legacy.getByRole("link", { name: /Source code/ })).toHaveAttribute("href", "https://github.com/axvrma/web-xr");
  await expect(legacy.getByRole("link", { name: /Live demo/ })).toHaveCount(0);
  await page.goto("/work/lighthouse-agent");
  await expect(page).toHaveURL(/\/work#auditbench$/);
  await expect(page.locator("#details-auditbench")).toHaveJSProperty("open", true);
});

test("all enterprise and independent work remains present with original external links", async ({ page }) => {
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
});

test("static pages pass Axe at desktop and mobile widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      expect(summarize(await new AxeBuilder({ page }).withTags(axeTags).analyze()), `${width} ${route}`).toEqual([]);
    }
  }
});

test("all pages and expanded content reflow without horizontal page scroll", async ({ page }) => {
  const scenarios = ["/", "/work#configuration-driven-ui", "/about#story-first-program", "/work#atlas", "/work#design-spec-generator"];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 375, 390, 640, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of scenarios) {
      await page.goto(path);
      for (const selector of ["#configuration-driven-ui .demo > summary", "[data-demo=calculator] > summary"]) {
        if (!path.includes("configuration-driven-ui") && selector.startsWith("#")) continue;
        if (!path.includes("first-program") && selector.startsWith("[")) continue;
        await page.locator(selector).click();
        await expect(page.locator(selector).locator("..").locator(".demo-interactive")).toBeVisible();
      }
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth, `${width} ${path}`).toBeLessThanOrEqual(width);
    }
  }
});

test("all pages retain content, links and native disclosures without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Complexity in/ })).toBeVisible();
    await expect(page.getByRole("region", { name: "Employers" }).getByRole("listitem")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "Pause employer marquee" })).toHaveCount(0);
    await page.getByRole("link", { name: "Explore Atlas" }).click();
    await expect(page).toHaveURL(/\/work#atlas$/);
    await expect(page.locator("#atlas").getByRole("heading", { name: "Atlas", exact: true })).toBeVisible();
    await page.locator("#details-atlas > summary").click();
    await expect(page.locator("#details-atlas").getByRole("heading", { name: "Architecture" })).toBeVisible();
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About" }).click();
    await page.getByText("The first computer", { exact: true }).click();
    await page.getByText("Notepad", { exact: true }).click();
    await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
    const certificate = page.getByRole("link", { name: "Expand certificate" });
    await expect(certificate).toHaveAttribute("href", /-redacted\.webp$/);
  } finally {
    await context.close();
  }
});

test("all pages load without missing local resources or browser and CSP errors", async ({ page, baseURL }) => {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(baseURL) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  for (const route of routes) {
    await page.goto(route);
    await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) => {
      image.loading = "eager";
      return image.decode();
    })));
    await page.locator("footer").scrollIntoViewIfNeeded();
  }
  expect(errors).toEqual([]);
});

test("missing and retired server routes return 404 with the Netlify security headers", async ({ page, request }) => {
  const response = await page.goto("/not-a-route");
  expect(response.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("A small detour.");
  for (const path of ["/", "/work", "/about", "/no-such-page", "/api/sync", "/admin"]) {
    const response = await request.get(path);
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("script-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).not.toMatch(/unsafe-(inline|eval)/);
    expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");
    if (!routes.includes(path)) expect(response.status()).toBe(404);
  }
});
