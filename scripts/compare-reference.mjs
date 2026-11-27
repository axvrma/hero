import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const output = resolve(process.env.COMPARISON_DIR || ".research/reference-comparison");
const reference = "https://personalfolio.framer.website/";
const implementation = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173/";
const viewports = [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [768, 1024], [430, 932], [390, 844], [375, 812]];
const threshold = 0.1;

async function prepare(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.documentElement.scrollHeight; y += 690) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((done) => setTimeout(done, 25));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await Promise.race([
      Promise.allSettled([...document.images].filter((image) => {
        const bounds = image.getBoundingClientRect();
        return bounds.width && bounds.height && bounds.left < innerWidth && bounds.right > 0;
      }).map((image) => image.decode())),
      new Promise((done) => setTimeout(done, 1600)),
    ]);
  });
  await page.waitForTimeout(700);
}

async function geometry(page, isReference) {
  return page.evaluate((isReference) => {
    const box = (node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x: Math.round(x), y: Math.round(y + scrollY), width: Math.round(width), height: Math.round(height) };
    };
    const visible = (node) => {
      const r = box(node);
      return r.width > 0 && r.height > 0 && r.x + r.width > 0 && r.x < innerWidth;
    };
    const visibleNodes = (selector) => [...document.querySelectorAll(selector)].filter(visible);
    const whole = (node) => {
      const r = box(node);
      return r.width >= innerWidth - 4 && r.x >= -10 && r.x <= 10;
    };
    const containing = (word, predicate) => {
      const found = visibleNodes("h2,h3,p").filter((node) => node.textContent.trim().includes(word));
      for (const node of found) {
        for (let parent = node; parent && parent !== document.body; parent = parent.parentElement) {
          if (predicate(parent)) return parent;
        }
      }
    };
    const sized = (words, min, max) => containing(words, (node) => {
      const { height, width } = box(node);
      return width >= 265 && height >= min && height <= max;
    });
    if (!isReference) {
      const result = {};
      for (const node of visibleNodes("[data-compare]")) (result[node.dataset.compare] ??= []).push(box(node));
      for (const values of Object.values(result)) values.sort((a, b) => a.y - b.y || a.x - b.x);
      return result;
    }
    const mobile = innerWidth < 800;
    const narrow = innerWidth < 1200;
    const named = (name) => visibleNodes(`[data-framer-name="${name}"]`);
    const nameOne = (name) => named(name)[0];
    const byBackground = (color, width, height) => visibleNodes("div").filter((node) => {
      const bounds = box(node);
      return bounds.width >= width && bounds.height >= height && getComputedStyle(node).backgroundColor === color;
    });
    const refs = {
      hero: [nameOne("Hero Section")],
      nav: [mobile ? visibleNodes("nav").find((node) => box(node).y === 8 && box(node).height === 54) : containing("Home", (node) => { const r = box(node); return r.y < 18 && r.width >= 320 && r.width <= 375 && r.height < 66; })],
      work: [nameOne("Case Study")],
      case: narrow && !mobile
        ? ["Curating AR", "Building profitable", "Terrific:", "Curating AR"].map((name, i) => {
            const candidates = byBackground(["rgb(46, 71, 70)", "rgb(27, 44, 44)", "rgb(23, 36, 38)", "rgb(17, 28, 29)"][i], 690, 340);
            return candidates[0] ?? sized(name, 350, 365);
          })
        : named(mobile ? "Case #1 Mobile" : "Case #1"),
      writing: [nameOne("Blogs")],
      article: byBackground("rgb(6, 18, 25)", 300, 375),
      services: [nameOne("Services") ?? containing("Diverse Services", (node) => whole(node) && box(node).height > 850)],
      service: byBackground("rgb(7, 21, 29)", 300, 205).filter((node) => box(node).y < (mobile ? 6820 : 5500)),
      recognition: [nameOne("Testimonials") ?? containing("Word on the Street", (node) => whole(node) && box(node).height > 500)],
      "recognition-card": byBackground("rgba(22, 39, 52, 0.87)", 300, 350).slice(0, 4),
      about: [nameOne("About Section") ?? containing("Know who am I", (node) => whole(node) && box(node).height > 500)],
      faq: [nameOne("FAQs")],
      contact: [sized("Have any more", 490, 650)],
      footer: [visibleNodes("footer")[0]],
    };
    const result = {};
    for (const [key, nodes] of Object.entries(refs)) {
      const distinct = new Map(nodes.filter(Boolean).map((node) => {
        const r = box(node);
        return [Object.values(r).join(","), r];
      }));
      result[key] = [...distinct.values()].sort((a, b) => a.y - b.y || a.x - b.x);
    }
    return result;
  }, isReference);
}

async function replacementImages(page, isReference) {
  return page.evaluate((isReference) => {
    const selector = isReference ? "img" : "img, [data-content-image] > :not(img), .footer-stickers > span";
    return [...document.querySelectorAll(selector)].flatMap((node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      if (width < 5 || height < 5 || x >= innerWidth || x + width <= 0) return [];
      if (getComputedStyle(node).visibility === "hidden") return [];
      if (isReference && (width >= innerWidth * .94 && height > 660 || !node.currentSrc)) return [];
      let left = x, right = x + width, top = y, bottom = y + height;
      for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
        const s = getComputedStyle(parent);
        const clips = ["hidden", "clip", "auto", "scroll"];
        if (clips.includes(s.overflowX) || clips.includes(s.overflowY)) {
          const edge = parent.getBoundingClientRect();
          if (clips.includes(s.overflowX)) { left = Math.max(left, edge.left); right = Math.min(right, edge.right); }
          if (clips.includes(s.overflowY)) { top = Math.max(top, edge.top); bottom = Math.min(bottom, edge.bottom); }
        }
      }
      return right > left && bottom > top ? [{ x: left, y: top + scrollY, width: right - left, height: bottom - top }] : [];
    });
  }, isReference);
}

async function glyphRegions(page) {
  return page.evaluate(() => {
    const boxes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || node.parentElement.closest("script, style, [hidden]")) continue;
      range.selectNodeContents(node);
      for (const { x, y, width, height } of range.getClientRects()) {
        if (width > 0 && height > 0 && x < innerWidth && x + width > 0) {
          boxes.push({ x: x - 2, y: y + scrollY - 2, width: width + 4, height: height + 4 });
        }
      }
    }
    return boxes;
  });
}

async function capture(browser, viewport, url, prefix, isReference) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, bypassCSP: true, reducedMotion: "reduce" });
  try {
    await prepare(page, url);
    await page.addStyleTag({ content: "* { animation-play-state: paused !important; }" });
    const boxes = await geometry(page, isReference);
    const imageMasks = await replacementImages(page, isReference);
    const textRegions = await glyphRegions(page);
    const options = { fullPage: true, animations: "disabled", caret: "hide", scale: "css", timeout: 60000 };
    const data = await page.screenshot({ ...options, path: `${prefix}.png` });
    await page.addStyleTag({ content: "*, *::before, *::after { -webkit-text-fill-color: transparent !important; text-shadow: none !important; }" });
    const withoutGlyphs = await page.screenshot(options);
    const pixels = PNG.sync.read(data);
    const emptyGlyphs = PNG.sync.read(withoutGlyphs);
    if (pixels.height !== emptyGlyphs.height) throw new Error("Text masking changed layout");
    const glyphMask = new Uint8Array(pixels.width * pixels.height);
    fillBoxes(glyphMask, textRegions, pixels.width, pixels.height);
    for (let p = 0; p < glyphMask.length; p++) {
      if (!glyphMask[p]) continue;
      const offset = p * 4;
      const changed = Math.abs(pixels.data[offset] - emptyGlyphs.data[offset]) +
        Math.abs(pixels.data[offset + 1] - emptyGlyphs.data[offset + 1]) +
        Math.abs(pixels.data[offset + 2] - emptyGlyphs.data[offset + 2]);
      glyphMask[p] = changed > 42 ? 1 : 0;
    }
    return { pixels, boxes, glyphMask, imageMasks };
  } finally {
    await page.close();
  }
}

function place(image, width, height) {
  const aligned = new PNG({ width, height });
  aligned.data.fill(0);
  for (let p = 3; p < aligned.data.length; p += 4) aligned.data[p] = 255;
  PNG.bitblt(image, aligned, 0, 0, image.width, image.height, 0, 0);
  return aligned;
}

function crop(image, box, buffer = 24) {
  const x = Math.max(0, box.x - buffer);
  const y = Math.max(0, box.y - buffer);
  const width = Math.min(image.width - x, box.width + buffer * 2);
  const height = Math.min(image.height - y, box.height + buffer * 2);
  const result = new PNG({ width, height });
  PNG.bitblt(image, result, x, y, width, height, 0, 0);
  return result;
}

const save = (file, png) => writeFile(file, PNG.sync.write(png));
const percent = (n, total) => Math.round(10000 * n / total) / 100;

function fillBoxes(mask, boxes, width, height) {
  for (const { x, y, width: w, height: h } of boxes) {
    const left = Math.max(0, Math.floor(x));
    const right = Math.min(width, Math.ceil(x + w));
    for (let row = Math.max(0, Math.floor(y)); row < Math.min(height, Math.ceil(y + h)); row++) {
      mask.fill(1, row * width + left, row * width + right);
    }
  }
}

function pairGeometry(expected, actual) {
  return Object.fromEntries(Object.entries(actual).map(([key, local]) => [
    key,
    { reference: expected[key] ?? [], local, deltas: local.slice(0, expected[key]?.length ?? 0).map((box, i) =>
      Object.fromEntries(Object.keys(box).map((field) => [field, box[field] - expected[key][i][field]]))) },
  ]));
}

const browser = await chromium.launch();
const summary = [];
try {
  for (const [width, height] of viewports) {
    const viewport = { width, height };
    const label = `${width}x${height}`;
    const dir = resolve(output, label);
    await mkdir(dir, { recursive: true });
    const [ref, local] = await Promise.all([
      capture(browser, viewport, reference, `${dir}/reference`, true),
      capture(browser, viewport, implementation, `${dir}/implementation`, false),
    ]);
    const maxHeight = Math.max(ref.pixels.height, local.pixels.height);
    const refAligned = place(ref.pixels, width, maxHeight);
    const localAligned = place(local.pixels, width, maxHeight);
    const sideBySide = new PNG({ width: width * 2, height: maxHeight });
    PNG.bitblt(refAligned, sideBySide, 0, 0, width, maxHeight, 0, 0);
    PNG.bitblt(localAligned, sideBySide, 0, 0, width, maxHeight, width, 0);
    await save(`${dir}/side-by-side.png`, sideBySide);
    const diff = new PNG({ width, height: maxHeight });
    const settings = { threshold, includeAA: true };
    const rawDifferent = pixelmatch(refAligned.data, localAligned.data, diff.data, width, maxHeight, settings);
    await save(`${dir}/difference.png`, diff);

    const refMask = new Uint8Array(width * maxHeight);
    const localMask = new Uint8Array(width * maxHeight);
    refMask.set(ref.glyphMask);
    localMask.set(local.glyphMask);
    fillBoxes(refMask, ref.imageMasks, width, maxHeight);
    fillBoxes(localMask, local.imageMasks, width, maxHeight);
    let excluded = 0;
    for (let p = 0; p < refMask.length; p++) {
      if (!refMask[p] && !localMask[p]) continue;
      // The extra area of either page is part of the score.
      if (p >= Math.min(ref.pixels.height, local.pixels.height) * width) continue;
      excluded++;
      const offset = p * 4;
      refAligned.data.fill(40, offset, offset + 3);
      localAligned.data.fill(40, offset, offset + 3);
    }
    const maskedDifferent = pixelmatch(refAligned.data, localAligned.data, diff.data, width, maxHeight, settings);
    await save(`${dir}/difference-masked.png`, diff);
    const geometryReport = pairGeometry(ref.boxes, local.boxes);
    for (const name of ["hero", "work", "case", "writing", "services", "recognition", "about", "faq", "contact", "footer"]) {
      for (const [tag, capture] of [["reference", ref], ["implementation", local]]) {
        const box = capture.boxes[name]?.[0];
        if (box) await save(`${dir}/${name}-${tag}.png`, crop(capture.pixels, box));
      }
    }
    const row = {
      viewport: label,
      referenceHeight: ref.pixels.height, implementationHeight: local.pixels.height,
      rawSimilarityPercent: percent(width * maxHeight - rawDifferent, width * maxHeight),
      maskedSimilarityPercent: percent(width * maxHeight - excluded - maskedDifferent, width * maxHeight - excluded),
      excludedPercent: percent(excluded, width * maxHeight),
      geometry: geometryReport,
    };
    summary.push(row);
    console.log(`${label} · raw ${row.rawSimilarityPercent}% · masked ${row.maskedSimilarityPercent}% · excluded ${row.excludedPercent}%`);
    await writeFile(resolve(output, "summary.json"), JSON.stringify({ reference, implementation, threshold, viewports: summary }, null, 2) + "\n");
  }
} finally {
  await browser.close();
}
