import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/work",
  "/about",
  "/experience",
  "/engineering",
  "/contact",
  "/resume",
  "/work/atlas",
  "/work/vibes",
  "/work/envision",
  "/work/servio",
  "/work/prism",
  "/work/lighthouse-agent",
];
for (const route of routes)
  test(`route ${route} is server-rendered, navigable and accessible`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    if (route !== "/")
      await expect(page.locator("h1")).not.toContainText("I build software");
    await expect(page.locator('.desktop-nav a[href="/work"]')).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
test("theme preference survives navigation and reload and works without storage", async ({
  page,
}) => {
  await page.goto("/");
  const initial = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /Switch to .* theme/ }).click();
  const chosen = initial === "light" ? "dark" : "light";
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosen);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosen);
  await page.goto("/work/atlas");
  await expect(page.locator("html")).toHaveAttribute("data-theme", chosen);
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw Error("disabled");
      },
    }),
  );
  await page.reload();
  await page.getByRole("button", { name: /Switch to .* theme/ }).click();
  await expect(page.locator("main")).toBeVisible();
});
test("dark and light home pass automated accessibility", async ({ page }) => {
  for (const theme of ["dark", "light"]) {
    await page.addInitScript(
      (value) => localStorage.setItem("theme", value),
      theme,
    );
    await page.goto("/");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
test("mobile navigation supports keyboard, Escape, focus restoration and destination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const button = page.locator(".menu-toggle");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-menu a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await button.click();
  await page
    .locator("#mobile-menu")
    .getByRole("link", { name: /Engineering/ })
    .click();
  await expect(page).toHaveURL(/\/engineering/);
  await expect(page.locator("h1")).toContainText("Make the complexity");
});
test("ecosystem links lead to corresponding case studies", async ({ page }) => {
  await page.goto("/");
  for (const id of ["atlas", "vibes", "envision", "servio", "prism"])
    await expect(
      page.locator(`.map-node[data-product="${id}"]`),
    ).toHaveAttribute("href", `/work/${id}`);
  await page.locator('.map-node[data-product="atlas"]').click();
  await expect(page.locator("h1")).toContainText("Atlas");
});
test("project search filters results and reports empty state", async ({
  page,
}) => {
  await page.goto("/work");
  const search = page.getByRole("searchbox");
  await search.fill("lighthouse");
  await expect(page.locator(".archive-row:visible")).toHaveCount(1);
  await expect(page.locator("#search-count")).toHaveText("1 project");
  await search.fill("no-such-project");
  await expect(page.locator(".search-empty")).toBeVisible();
  await search.fill("");
  await expect(page.locator(".archive-row:visible")).toHaveCount(12);
});
for (const width of [320, 390, 768, 1024, 1440, 1920])
  test(`responsive layout has no horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/work",
      "/work/atlas",
      "/work/envision",
      "/about",
      "/contact",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
    }
  });
test("reduced motion disables smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator("html")
      .evaluate((el) => getComputedStyle(el).scrollBehavior),
  ).toBe("auto");
});
test("all page content remains available with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/work/atlas");
  await expect(page.locator("h1")).toContainText("Atlas");
  await expect(page.locator("#architecture")).toBeVisible();
  await context.close();
});
test("all legacy redirects preserve canonical destinations", async ({
  request,
}) => {
  const { readFile } = await import("node:fs/promises");
  const redirects = JSON.parse(
    await readFile(".generated/redirects.json", "utf8"),
  );
  for (const [from, to] of redirects) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status(), from).toBe(301);
    expect(response.headers().location).toBe(to);
  }
});
test("unknown routes return the real 404 document", async ({ page }) => {
  const response = await page.goto("/not-a-route");
  expect(response.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Nothing here");
});
test("public routes load without failed local resources or browser errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (
      response.url().startsWith("http://127.0.0.1:4173") &&
      response.status() >= 400
    )
      errors.push(`${response.status()} ${response.url()}`);
  });
  for (const route of routes) {
    await page.goto(route);
    await page.locator("footer").scrollIntoViewIfNeeded();
  }
  expect(errors).toEqual([]);
});
test("mobile menu is accessible when expanded", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".menu-toggle").click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("retired Web XR demo preserves its source and omits the dead launch action", async ({page}) => {
  await page.goto("/work/web-xr");
  await expect(page.getByRole("link", {name: "View source"})).toHaveAttribute("href", "https://github.com/axvrma/web-xr");
  await expect(page.getByRole("link", {name: "Launch application"})).toHaveCount(0);
});
