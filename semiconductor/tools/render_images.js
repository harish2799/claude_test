// Render illustration SVGs to PNG with headless Chromium (Playwright).
// Usage: node tools/render_images.js weekly/week-01/images
//   reads <dir>/src/*.svg, writes <dir>/<name>.png at 2x resolution.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const dir = path.resolve(process.argv[2] || ".");
  const srcDir = path.join(dir, "src");
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg")).sort();
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const f of files) {
    const svg = fs.readFileSync(path.join(srcDir, f), "utf8");
    const [, , w, h] = svg.match(/viewBox="([\d.\s-]+)"/)[1].trim().split(/\s+/).map(Number);
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<html><body style="margin:0">${svg.replace("<svg ", `<svg width="${w}" height="${h}" `)}</body></html>`);
    const out = path.join(dir, f.replace(/\.svg$/, ".png"));
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: w, height: h } });
    console.log(`Wrote ${out}`);
  }
  await browser.close();
})();
