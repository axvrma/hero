import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const local = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173/";
const reference = "https://personalfolio.framer.website/";
const output = resolve(process.env.INTERACTION_DIR || ".research/reference-interactions");
await mkdir(output, { recursive: true });
const browser = await chromium.launch();

async function capture(page, title) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(output, `${title}.png`) });
}

try {
  for (const [name, url] of [["reference", reference], ["implementation", local]]) {
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(url, { waitUntil: "domcontentloaded" });
    await mobile.evaluate(() => document.fonts.ready);
    await capture(mobile, `${name}-mobile-hero`);
    if (name === "reference") await mobile.locator('[data-framer-name="Menu Icon"]:visible').first().click();
    else await mobile.getByRole("button", { name: "Open menu" }).click();
    await capture(mobile, `${name}-mobile-menu`);
    await mobile.close();

    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktop.goto(url, { waitUntil: "domcontentloaded" });
    await desktop.evaluate(() => document.fonts.ready);
    const article = name === "reference" ? desktop.locator('[data-framer-name="Case #1"]:visible').first() : desktop.locator(".case-card").first();
    await article.hover();
    await capture(desktop, `${name}-work-hover`);
    const question = name === "reference"
      ? desktop.getByText("Can you facelift my design?", { exact: true }).filter({ visible: true }).last()
      : desktop.getByText("Do you collaborate on independent projects?", { exact: true });
    await question.click();
    await capture(desktop, `${name}-faq-open`);
    if (name === "implementation") {
      await desktop.locator("[data-article]").first().click();
      await capture(desktop, "implementation-article-open");
      await desktop.keyboard.press("Escape");
      await desktop.getByRole("button", { name: "Next recognition" }).click();
      await capture(desktop, "implementation-recognition-next");
    }
    await desktop.close();
  }
} finally {
  await browser.close();
}
