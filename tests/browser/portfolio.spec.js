import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
const routes = JSON.parse(await readFile(".generated/routes.json", "utf8")).map(({ path }) => path);
const axeTags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
for (const route of routes)
  test(`route ${route} is server-rendered, navigable and accessible`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.locator('.desktop-nav a[href="/work"]')).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(axeTags)
      .analyze();
    expect(result.violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)])).toEqual([]);
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
      .withTags(axeTags)
      .analyze();
    expect(result.violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)])).toEqual([]);
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
    .getByRole("link", { name: "Story", exact: true })
    .click();
  await expect(page).toHaveURL(/\/story/);
  await expect(page.locator("h1")).toContainText("It all started with a question");
});
for (const width of [320, 1440])
  test(`Hackathons is reachable from navigation and a direct URL at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const link = page.locator("footer").getByRole("link", { name: "Hackathons" });
    await link.press("Enter");

    const section = page.getByRole("region", { name: "Built under pressure." });
    const heading = section.getByRole("heading", { level: 2 });
    await expect(page).toHaveURL(/\/#hackathons$/);
    await expect(heading).toBeInViewport();
    await page.keyboard.press("Tab");
    await expect(section.getByRole("link", {
      name: "Live Demo: Excuse Generator 3000",
    })).toBeFocused();

    await page.goto("/work");
    await expect(link).toHaveAttribute("href", "/#hackathons");
    await page.goto("/#hackathons");
    await expect(heading).toBeInViewport();
  });
test("ecosystem links lead to corresponding case studies", async ({ page }) => {
  await page.goto("/work");
  await page.getByText("Explore the product map", { exact: true }).click();
  for (const id of ["atlas", "vibes", "envision", "servio", "prism", "luminescent", "auditbench"])
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
  await search.fill("web xr");
  await expect(page.locator(".archive-row:visible")).toHaveCount(1);
  await expect(page.locator("#search-count")).toHaveText("1 project");
  await search.fill("no-such-project");
  await expect(page.locator(".search-empty")).toBeVisible();
  await search.fill("");
  await expect(page.locator(".archive-row:visible")).toHaveCount(10);
});
for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920])
  for (const theme of ["light", "dark"])
    test(`representative layouts fit ${width}px in ${theme} mode`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      for (const route of routes.filter((route) =>
        !route.startsWith("/work/") ||
        ["/work/atlas", "/work/vibes", "/work/envision", "/work/servio", "/work/prism", "/work/luminescent", "/work/auditbench"].includes(route))) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        expect(overflow, route).toBe(false);
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
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("#mobile-menu").getByRole("link", { name: "Story" })).toBeVisible();
  await page.locator("#mobile-menu").getByRole("link", { name: "Story" }).click();
  await expect(page.locator("#story-first-computer")).toBeVisible();
  await page.getByText("The first computer", { exact: true }).click();
  await page.getByText("Notepad", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "Notes" })).toBeVisible();
  await context.close();
});
test("all legacy redirects preserve canonical destinations", async ({
  request,
}) => {
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
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
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
    const broken = await page.locator("img").evaluateAll((images) =>
      images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src));
    expect(broken, route).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test("mobile menu is accessible when expanded", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".menu-toggle").click();
  const result = await new AxeBuilder({ page })
    .withTags(axeTags)
    .analyze();
  expect(result.violations).toEqual([]);
});

test("retired Web XR demo preserves its source and omits the dead launch action", async ({page}) => {
  await page.goto("/work/web-xr");
  await expect(page.getByRole("link", {name: "View source"})).toHaveAttribute("href", "https://github.com/axvrma/web-xr");
  await expect(page.getByRole("link", {name: "Launch application"})).toHaveCount(0);
});

test("desktop skip link leads into the page with keyboard navigation", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Explore my work" })).toBeFocused();
});

test("story demos load on demand and support keyboard input, errors and clearing", async ({ page }) => {
  const modules = [];
  page.on("request", (request) => {
    if (/\/assets\/demos-/.test(request.url())) modules.push(request.url());
  });
  await page.goto("/story");
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
  await page.goto("/experience/configuration-driven-ui");
  await page.getByText("One renderer, two regions", { exact: true }).press("Enter");
  await expect(page.getByLabel("Berth")).toBeVisible();
  await page.getByLabel("Fictional service region").selectOption("highlands");
  await expect(page.getByLabel("Access notes")).toBeVisible();
  await expect(page.getByLabel("Berth")).toHaveCount(0);
  await expect(page.locator("[data-config]")).toContainText("Access notes");
  await page.goto("/experience/dynamic-shipment-workflows");
  await page.getByText("Explore a fictional shipment", { exact: true }).click();
  await page.getByLabel("Example shipment").selectOption("cooled");
  await page.getByLabel("Check temperature range · Cold-chain coordinator").check();
  await expect(page.getByRole("status")).toHaveText("1 of 3 example tasks complete.");
  await page.getByLabel("Example shipment").selectOption("standard");
  await expect(page.getByRole("status")).toHaveText("0 of 2 example tasks complete.");
});

for (const theme of ["light", "dark"])
  test(`expanded demos in ${theme} mode pass automated accessibility`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
    for (const route of ["/story", "/experience/configuration-driven-ui", "/experience/dynamic-shipment-workflows"]) {
      await page.goto(route);
      for (const summary of await page.locator("[data-demo] > summary").all()) await summary.click();
      if (route === "/story") await page.getByLabel("Expression").waitFor();
      else await page.getByRole("combobox").waitFor();
      const result = await new AxeBuilder({ page }).withTags(axeTags).analyze();
      expect(result.violations.map(({ id, nodes }) => [id, nodes.map(({ target }) => target)]), route).toEqual([]);
    }
  });

test("résumé and contact links lead to their verified destinations", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.getByRole("link", { name: "Open original résumé" })).toHaveAttribute("href", /^https:\/\/drive\.google\.com\/file/);
  await expect(page.getByRole("heading", { name: "DP World", exact: true })).toBeVisible();
  await expect(page.locator(".role-progression")).toContainText("September 2023");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".site-header")).toBeHidden();
  await expect(page.getByRole("heading", { name: "DP World", exact: true })).toBeVisible();
  await page.emulateMedia({ media: "screen" });
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: "Email me" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://linkedin.com/in/axvrma");
  await expect(page.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/axvrma");
});

test("production artifact preview serves the Netlify CSP on pages and missing routes", async ({ request }) => {
  for (const path of ["/", "/story", "/no-such-page"]) {
    const response = await request.get(path);
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("script-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).not.toMatch(/unsafe-(inline|eval)/);
    expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");
  }
});

test("an approved image can expand with keyboard focus and Escape restores it", async ({ page }) => {
  await page.route("**/about", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace("</main>", '<figure><a data-photo href="/images/atlas-720.webp"><img src="/images/atlas-720.webp" width="720" height="450" alt="Atlas test fixture"></a></figure></main>');
    await route.fulfill({ response, body });
  });
  await page.goto("/about");
  const dialog = page.getByRole("dialog", { name: "Expanded photograph", includeHidden: true });
  await expect(dialog).toHaveCount(1);
  const photo = page.getByRole("link", { name: "Atlas test fixture" });
  await photo.press("Enter");
  await expect(page.getByRole("button", { name: "Close image" })).toBeFocused();
  await expect(dialog.getByRole("img", { name: "Atlas test fixture" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(photo).toBeFocused();
});

test("content and expanded demos reflow at a 200 percent-equivalent CSS viewport", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 500 });
  for (const path of ["/", "/resume", "/story", "/experience/configuration-driven-ui"]) {
    await page.goto(path);
    for (const summary of await page.locator("[data-demo] > summary").all()) await summary.click();
    if (path === "/story") await page.getByLabel("Expression").waitFor();
    if (path.endsWith("configuration-driven-ui")) await page.getByRole("combobox").waitFor();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(640);
  }
});
