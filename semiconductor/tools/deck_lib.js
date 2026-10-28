// Shared theme, layouts and drawing helpers for the weekly slide decks.
const path = require("path");
const pptxgen = require("pptxgenjs");

const SKILL_THEME_SCRIPT = process.env.APPLY_THEME_JS; // optional, see build docs

// "Silicon & copper": deep wafer navy dominates, copper (interconnect) is the
// sharp accent, teal marks silicon/channels in diagrams.
const THEME = {
  name: "Silicon and Copper",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "14202E", lt1: "FFFFFF", dk2: "0B1F33", lt2: "EEF2F6",
    accent1: "C8763A", // copper
    accent2: "2A9D8F", // silicon teal
    accent3: "E9C46A", // SiGe amber
    accent4: "5B7083", // slate
    accent5: "8FB8DE", // light blue
    accent6: "B23A48", // alert red
    hlink: "2A9D8F", folHlink: "5B7083",
  },
};
const HEX = {
  navy: "0B1F33", ink: "14202E", copper: "C8763A", teal: "2A9D8F", amber: "E9C46A",
  slate: "5B7083", sky: "8FB8DE", red: "B23A48", paper: "FFFFFF", mist: "EEF2F6",
  line: "D5DDE5", copperTint: "F6E7DA", tealTint: "DDF1EE", navySoft: "1A3350",
};

function createDeck({ title, week }) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
  pres.title = title;
  pres.author = "Semiconductor learning track";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const footer = `Semiconductor Track  ·  Week ${week}`;

  pres.defineSlideMaster({
    title: "TITLE_DARK",
    background: { color: HEX.navy },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.55, w: 5.4, h: 1.6,
        fontFace: THEME.headFontFace, fontSize: 36, bold: true, color: HEX.paper, valign: "top", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.25, w: 5.4, h: 1.2,
        fontFace: THEME.bodyFontFace, fontSize: 16, color: HEX.sky, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "SECTION_DARK",
    background: { color: HEX.navy },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 2.0, w: 8.8, h: 1.0,
        fontFace: THEME.headFontFace, fontSize: 36, bold: true, color: HEX.paper, valign: "middle", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.0, w: 8.8, h: 0.8,
        fontFace: THEME.bodyFontFace, fontSize: 16, color: HEX.sky, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "RECAP_DARK",
    background: { color: HEX.navy },
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.4, w: 8.8, h: 0.8,
        fontFace: THEME.headFontFace, fontSize: 32, bold: true, color: HEX.paper, valign: "middle", align: "left", margin: 0 }, text: "" } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: HEX.paper },
    margin: [0.5, 0.5, 0.5, 0.5],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.3, w: 9.0, h: 0.75,
        fontFace: THEME.headFontFace, fontSize: 28, bold: true, color: HEX.navy, valign: "middle", margin: 0 }, text: "" } },
      { text: { text: footer, options: { x: 0.5, y: 5.25, w: 5, h: 0.25, fontFace: THEME.bodyFontFace,
        fontSize: 10, color: HEX.slate, margin: 0 } } },
    ],
    slideNumber: { x: 9.0, y: 5.25, w: 0.5, h: 0.25, fontFace: THEME.bodyFontFace, fontSize: 10, color: HEX.slate, align: "right" },
  });
  return pres;
}

// --- helpers -----------------------------------------------------------------

function text(slide, str, opts) {
  slide.addText(str, { isTextBox: true, fontFace: THEME.bodyFontFace, fontSize: 14, color: HEX.ink,
    valign: "top", margin: 0, ...opts });
}

function badge(slide, label, x, y, d = 0.42, fill = HEX.copper) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  slide.addText(String(label), { isTextBox: true, x, y, w: d, h: d, align: "center", valign: "middle",
    fontFace: THEME.headFontFace, fontSize: Math.round(d * 34), bold: true, color: HEX.paper, margin: 0 });
}

function card(slide, { x, y, w, h, fill = HEX.mist, title, body, num, titleColor = HEX.navy,
  bodySize = 13, titleSize = 15 }) {
  slide.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } });
  let tx = x + 0.18;
  if (num !== undefined) {
    badge(slide, num, x + 0.15, y + 0.15, 0.38);
    tx = x + 0.65;
  }
  if (title) text(slide, title, { x: tx, y: y + 0.15, w: x + w - tx - 0.15, h: 0.4, fontSize: titleSize,
    bold: true, color: titleColor, valign: "middle" });
  if (body) text(slide, body, { x: x + 0.18, y: y + 0.62, w: w - 0.36, h: h - 0.75, fontSize: bodySize });
}

function stat(slide, { x, y, w, value, label, color = HEX.copper, valueSize = 48 }) {
  text(slide, value, { x, y, w, h: 0.85, fontFace: THEME.headFontFace, fontSize: valueSize, bold: true, color,
    valign: "bottom" });
  text(slide, label, { x, y: y + 0.9, w, h: 0.7, fontSize: 13, color: HEX.slate });
}

function bullets(slide, items, opts) {
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1 } })),
    { isTextBox: true, fontFace: THEME.bodyFontFace, fontSize: 14, color: HEX.ink, valign: "top",
      paraSpaceAfter: 6, margin: 0, ...opts });
}

function arrow(slide, x, y, w, color = HEX.slate) {
  slide.addShape("rightArrow", { x, y, w, h: 0.32, fill: { color }, line: { color } });
}

// Wafer motif: circle of dies, used on dark title slides.
function wafer(slide, cx, cy, r) {
  slide.addShape("ellipse", { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: HEX.navySoft },
    line: { color: HEX.slate, width: 1 } });
  const die = 0.26, gap = 0.04, step = die + gap;
  for (let gx = cx - r; gx < cx + r; gx += step) {
    for (let gy = cy - r; gy < cy + r; gy += step) {
      const corners = [[gx, gy], [gx + die, gy], [gx, gy + die], [gx + die, gy + die]];
      if (corners.every(([px, py]) => (px - cx) ** 2 + (py - cy) ** 2 <= (r - 0.08) ** 2)) {
        const hot = Math.abs(gx - cx) < 0.5 && Math.abs(gy - cy) < 0.5;
        slide.addShape("rect", { x: gx, y: gy, w: die, h: die, fill: { color: hot ? HEX.copper : HEX.slate,
          transparency: hot ? 0 : 35 }, line: { color: HEX.navy, width: 0.5 } });
      }
    }
  }
  slide.addShape("ellipse", { x: cx - 0.06, y: cy + r - 0.16, w: 0.12, h: 0.12, fill: { color: HEX.navy },
    line: { color: HEX.navy } }); // notch
}

async function writeDeck(pres, outPath) {
  await pres.writeFile({ fileName: outPath });
  const themeScript = SKILL_THEME_SCRIPT || path.join(__dirname, "apply_theme.js");
  try {
    const { applyTheme } = require(themeScript);
    await applyTheme(outPath, THEME);
  } catch (e) {
    if (e.code !== "MODULE_NOT_FOUND") throw e;
    console.warn("apply_theme.js not found; deck keeps the default Office theme colours");
  }
  console.log(`Wrote ${outPath}`);
}

module.exports = { THEME, HEX, createDeck, text, badge, card, stat, bullets, arrow, wafer, writeDeck };
