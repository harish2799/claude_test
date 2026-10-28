// Week 1 deck: node names vs real dimensions, FinFET -> GAA, backside power.
// Optional technical deep dive. Run: NODE_PATH=tools/node_modules node tools/build_week01_deepdive_slides.js
const path = require("path");
const { HEX, createDeck, text, badge, card, stat, bullets, arrow, wafer, writeDeck } = require("./deck_lib");

const OUT = path.join(__dirname, "..", "weekly", "week-01", "week-01-deep-dive-slides.pptx");
const pres = createDeck({ title: "Week 1 deep dive — Node names, FinFET to GAA", week: 1 });

// ---------------------------------------------------------------- 1. Title
{
  const s = pres.addSlide({ masterName: "TITLE_DARK" });
  s.addText("Node names,\nFinFET → GAA", { placeholder: "title" });
  s.addText("Week 1  ·  Why “3nm” isn’t 3 nm, how transistors wrapped the gate around the channel, and why power is moving to the back of the wafer",
    { placeholder: "body" });
  wafer(s, 7.75, 2.8, 1.75);
  s.addNotes("Welcome to week 1. Three ideas: node names are marketing, gate control drives transistor shape, and backside power is the next big structural change.");
}

// ---------------------------------------------------------------- 2. Roadmap
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("What you’ll be able to explain", { placeholder: "title" });
  const items = [
    ["Node names", "Why “3nm” is a brand and which metrics are real"],
    ["Gate control", "The electrostatics behind planar → FinFET → GAA"],
    ["Nanosheet build", "The process steps, and which ones are hard"],
    ["Backside power", "What moves under the wafer and what it changes"],
    ["The 2nm race", "TSMC, Intel and Samsung, through career and investor eyes"],
  ];
  items.forEach(([t, b], i) => {
    const y = 1.25 + i * 0.78;
    badge(s, i + 1, 0.6, y, 0.48);
    text(s, t, { x: 1.3, y: y - 0.02, w: 3.0, h: 0.5, fontSize: 18, bold: true, color: HEX.navy, valign: "middle" });
    text(s, b, { x: 4.2, y: y - 0.02, w: 5.3, h: 0.5, fontSize: 15, valign: "middle" });
  });
  s.addNotes("Roadmap for the week. Each item maps to a section of the written lesson and the podcast episode.");
}

// ---------------------------------------------------------------- 3. Brand not dimension
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("“3nm” is a product name, not a measurement", { placeholder: "title" });
  stat(s, { x: 0.5, y: 1.2, w: 2.6, value: "3 nm", label: "What the node is called", color: HEX.slate });
  stat(s, { x: 3.3, y: 1.2, w: 2.8, value: "~15–20 nm", label: "Typical gate length today", valueSize: 40 });
  stat(s, { x: 6.4, y: 1.2, w: 3.1, value: "~48 nm", label: "Gate pitch (CPP) of a 3nm-class node", color: HEX.teal, valueSize: 40 });
  // naming staircase
  const names = ["28", "20", "16/14", "10", "7", "5", "3", "2"];
  names.forEach((n, i) => {
    const x = 0.5 + i * 1.13;
    s.addShape("chevron", { x, y: 3.55, w: 1.08, h: 0.6, fill: { color: i < 6 ? HEX.mist : HEX.copperTint },
      line: { color: i < 6 ? HEX.mist : HEX.copperTint } });
    text(s, n, { x: x + 0.12, y: 3.55, w: 0.86, h: 0.6, fontSize: 15, bold: true, align: "center",
      valign: "middle", color: HEX.navy });
  });
  text(s, "Each step keeps the ~0.7× naming rhythm customers expect, even though no physical feature shrinks by that much.",
    { x: 0.5, y: 4.35, w: 9, h: 0.6, fontSize: 14, color: HEX.slate, italic: true });
  s.addNotes("Gate length stopped tracking node names in the late 1990s. Names kept the 0.7x cadence for marketing. Intel renamed its nodes in 2021 to line up with the industry.");
}

// ---------------------------------------------------------------- 4. Metrics
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("The numbers that actually describe a node", { placeholder: "title" });
  const m = [
    ["CPP", "Contacted poly (gate) pitch: sets standard-cell width"],
    ["MMP", "Minimum metal pitch: sets cell height and routing"],
    ["Cell height", "tracks × MMP, e.g. 6 × 23 nm ≈ 138 nm"],
    ["Logic density", "MTr/mm², e.g. 0.6·NAND2 + 0.4·scan flip-flop"],
    ["SRAM bit cell", "µm² per 6T cell: barely shrinking lately"],
    ["Cost & yield", "$ per wafer and good dies per wafer decide everything"],
  ];
  m.forEach(([t, b], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    card(s, { x: 0.5 + col * 3.05, y: 1.25 + row * 1.95, w: 2.85, h: 1.75, title: t, body: b, num: i + 1,
      fill: i === 4 ? HEX.copperTint : HEX.mist });
  });
  s.addNotes("Compare nodes on pitches, density, SRAM cell area, performance per watt, yield and wafer cost, never on the name. SRAM scaling slowing down matters a lot for caches and AI chips.");
}

// ---------------------------------------------------------------- 5. Pitch chart
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Pitches have nearly stopped shrinking", { placeholder: "title" });
  const labels = ["Intel 22nm", "Intel 14nm", "TSMC N7", "TSMC N5", "TSMC N3E", "TSMC N2 (est.)"];
  s.addChart(pres.charts.BAR, [
    { name: "Gate pitch (CPP, nm)", labels, values: [90, 70, 57, 51, 48, 45] },
    { name: "Min metal pitch (MMP, nm)", labels, values: [80, 52, 40, 28, 23, 21] },
  ], {
    x: 0.4, y: 1.15, w: 6.1, h: 3.95, barDir: "col", barGrouping: "clustered",
    chartColors: [HEX.navy, HEX.copper], showValue: true, dataLabelPosition: "outEnd",
    dataLabelFontSize: 10, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.slate, catAxisLabelFontSize: 10, catAxisLabelFontFace: "+mn-lt",
    valAxisLabelColor: HEX.slate, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
    valGridLine: { color: HEX.line, size: 0.5 }, catGridLine: { style: "none" },
    showLegend: true, legendPos: "t", legendFontSize: 11, legendFontFace: "+mn-lt", legendColor: HEX.ink,
    showTitle: false,
  });
  card(s, { x: 6.8, y: 1.25, w: 2.7, h: 2.2, fill: HEX.copperTint, title: "Read the chart",
    body: "Gate pitch moved only ~6 nm from N5 to N2. Density still improves, mostly through DTCO tricks." });
  text(s, "Approximate published and analyst figures; they vary by source and process variant.",
    { x: 6.8, y: 3.65, w: 2.7, h: 0.9, fontSize: 11, color: HEX.slate, italic: true });
  s.addNotes("Figures are rounded, approximate, and vary by source. The point is the trend: pitch scaling has slowed sharply, so density comes from design-technology co-optimisation.");
}

// ---------------------------------------------------------------- 6. DTCO / cell tracks
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("DTCO: smaller cells at the same pitch", { placeholder: "title" });
  const cells = [
    { label: "7.5-track", tracks: 7.5, rails: true },
    { label: "6-track", tracks: 6, rails: true },
    { label: "5-track + backside power", tracks: 5, rails: false },
  ];
  const k = 0.42, base = 4.6;
  cells.forEach((c, i) => {
    const x = 0.6 + i * 1.75, w = 1.25, h = c.tracks * k, y = base - h;
    s.addShape("rect", { x, y, w, h, fill: { color: HEX.mist }, line: { color: HEX.slate, width: 1 } });
    for (let t = 1; t < Math.floor(c.tracks); t++) {
      s.addShape("line", { x: x + 0.08, y: y + t * k, w: w - 0.16, h: 0, line: { color: HEX.teal, width: 1.5 } });
    }
    if (c.rails) {
      [y - 0.06, base - 0.06].forEach((ry) => s.addShape("rect", { x, y: ry, w, h: 0.12,
        fill: { color: HEX.copper }, line: { color: HEX.copper } }));
    } else {
      s.addShape("rect", { x, y: base + 0.02, w, h: 0.12, fill: { color: HEX.copper, transparency: 50 },
        line: { color: HEX.copper, dashType: "dash" } });
    }
    text(s, c.label, { x: x - 0.2, y: base + 0.2, w: w + 0.4, h: 0.45, fontSize: 12, align: "center", color: HEX.ink });
  });
  text(s, "Teal lines = routing tracks  ·  Copper = power rails", { x: 0.6, y: 1.15, w: 4.9, h: 0.3, fontSize: 11, color: HEX.slate });
  bullets(s, [
    "Fewer tracks per cell: 9T → 7.5T → 6T → ~5T",
    "Fin depopulation: 3 → 2 → 1 fin per device",
    "Contact over active gate (COAG)",
    "Single diffusion break at cell edges",
    "Power rails moved under the cell, freeing tracks",
  ], { x: 6.0, y: 1.3, w: 3.5, h: 3.5, fontSize: 15 });
  s.addNotes("Cell height equals tracks times metal pitch. Cutting tracks shrinks area even at constant pitch. Moving power rails to the back frees tracks in every cell.");
}

// ---------------------------------------------------------------- 7. Section
{
  const s = pres.addSlide({ masterName: "SECTION_DARK" });
  s.addText("Gate control is everything", { placeholder: "title" });
  s.addText("Why the transistor keeps changing shape", { placeholder: "body" });
  s.addNotes("Section two: electrostatics.");
}

// ---------------------------------------------------------------- 8. Electrostatics
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Short channels leak: wrap more gate around them", { placeholder: "title" });
  stat(s, { x: 0.5, y: 1.15, w: 3.2, value: "60 mV/dec", label: "Ideal subthreshold swing at 300 K: (kT/q)·ln10", valueSize: 40 });
  card(s, { x: 0.5, y: 3.0, w: 3.2, h: 1.9, fill: HEX.copperTint, title: "Natural length",
    body: "λ ≈ √(ε_si · t_si · t_ox / (N · ε_ox))\nGate length should be several λ. N = gates around the channel." });
  const levers = [
    ["Thinner body (t_si)", "Fins, nanosheets, FD-SOI"],
    ["Better dielectric (t_ox, ε)", "High-k / metal gate since 45nm"],
    ["More gates around channel (N)", "1 → 3 → 4 sides: planar → FinFET → GAA"],
  ];
  levers.forEach(([t, b], i) => card(s, { x: 4.1, y: 1.15 + i * 1.27, w: 5.4, h: 1.12, num: i + 1, title: t, body: b,
    fill: i === 2 ? HEX.tealTint : HEX.mist, bodySize: 13 }));
  s.addNotes("DIBL and Vt roll-off happen when the drain controls the channel. Swing worse than 60 mV per decade means more leakage or higher VDD. The levers are body thickness, dielectric, and number of gates.");
}

// ---------------------------------------------------------------- 9. Structures
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("From planar to stacked: the gate wraps further", { placeholder: "title" });
  const panels = [
    { name: "Planar", sides: "Gate on 1 side", when: "to 28/20nm", kind: "planar" },
    { name: "FinFET", sides: "Gate on 3 sides", when: "22nm (2011) → 3nm", kind: "fin" },
    { name: "GAA nanosheet", sides: "Gate on 4 sides", when: "SF3 2022, N2, 18A", kind: "gaa" },
    { name: "CFET", sides: "nFET stacked on pFET", when: "Research, 2030s", kind: "cfet" },
  ];
  panels.forEach((p, i) => {
    const x = 0.5 + i * 2.3, y = 1.2, w = 2.1, h = 2.55;
    s.addShape("roundRect", { x, y, w, h, rectRadius: 0.08, fill: { color: HEX.mist }, line: { color: HEX.mist } });
    const sub = { x: x + 0.2, y: y + 2.0, w: w - 0.4, h: 0.4 };
    s.addShape("rect", { ...sub, fill: { color: HEX.slate }, line: { color: HEX.slate } }); // substrate
    const cx = x + w / 2;
    const gate = (gx, gy, gw, gh) => s.addShape("rect", { x: gx, y: gy, w: gw, h: gh, fill: { color: HEX.copper },
      line: { color: HEX.copper } });
    const si = (sx, sy, sw, sh, color = HEX.teal) => s.addShape("rect", { x: sx, y: sy, w: sw, h: sh,
      fill: { color }, line: { color } });
    if (p.kind === "planar") {
      si(sub.x, sub.y - 0.12, sub.w, 0.12);
      gate(cx - 0.45, sub.y - 0.62, 0.9, 0.45);
    } else if (p.kind === "fin") {
      gate(cx - 0.4, y + 0.55, 0.8, sub.y - (y + 0.55));
      si(cx - 0.16, y + 0.75, 0.32, sub.y - (y + 0.75));
    } else if (p.kind === "gaa") {
      gate(cx - 0.55, y + 0.4, 1.1, sub.y - (y + 0.4) - 0.05);
      [0, 1, 2].forEach((k) => si(cx - 0.4, y + 0.6 + k * 0.42, 0.8, 0.18));
    } else {
      gate(cx - 0.55, y + 0.25, 1.1, sub.y - (y + 0.25) - 0.05);
      [0, 1].forEach((k) => si(cx - 0.4, y + 0.42 + k * 0.33, 0.8, 0.15, HEX.sky));
      [0, 1].forEach((k) => si(cx - 0.4, y + 1.15 + k * 0.33, 0.8, 0.15));
      text(s, "p", { x: cx + 0.45, y: y + 0.45, w: 0.3, h: 0.4, fontSize: 12, bold: true, color: HEX.navy });
      text(s, "n", { x: cx + 0.45, y: y + 1.18, w: 0.3, h: 0.4, fontSize: 12, bold: true, color: HEX.navy });
    }
    text(s, p.name, { x, y: y + h + 0.1, w, h: 0.35, fontSize: 15, bold: true, color: HEX.navy, align: "center" });
    text(s, `${p.sides}\n${p.when}`, { x, y: y + h + 0.45, w, h: 0.6, fontSize: 12, color: HEX.slate, align: "center" });
  });
  s.addNotes("Cross-sections looking down the channel. Copper is the gate, teal is the silicon channel, grey is the substrate. Each step wraps more gate around the channel. CFET stacks the p-type device over the n-type.");
}

// ---------------------------------------------------------------- 10. Effective width
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Same footprint, but nanosheets can be sized freely", { placeholder: "title" });
  card(s, { x: 0.5, y: 1.2, w: 4.3, h: 2.1, title: "2-fin FinFET", body:
    "W = fins × (2·H + W_fin)\n= 2 × (2·50 + 6)\n= 212 nm\n\nDrive comes in whole fins only: 1, 2 or 3." });
  card(s, { x: 5.2, y: 1.2, w: 4.3, h: 2.1, fill: HEX.tealTint, title: "3-sheet nanosheet", body:
    "W = sheets × 2·(W_sheet + T_sheet)\n= 3 × 2·(30 + 5)\n= 210 nm\n\nSheet width is a design choice: 15, 30 or 45 nm." });
  stat(s, { x: 0.5, y: 3.5, w: 4.3, value: "212 nm", label: "FinFET effective width", color: HEX.navy, valueSize: 32 });
  stat(s, { x: 5.2, y: 3.5, w: 4.3, value: "210 nm", label: "Nanosheet effective width", color: HEX.teal, valueSize: 32 });
  s.addNotes("Worked exercise from the lesson. Raw width is similar. The real wins are better electrostatics and continuous sizing, which brings back analog-style transistor sizing for library designers.");
}

// ---------------------------------------------------------------- 11. Section
{
  const s = pres.addSlide({ masterName: "SECTION_DARK" });
  s.addText("Building a nanosheet", { placeholder: "title" });
  s.addText("Grow a layer cake, then carve the gate into it", { placeholder: "body" });
  s.addNotes("Section three: process flow.");
}

// ---------------------------------------------------------------- 12. Layer cake visual
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Sacrificial SiGe makes room for the gate", { placeholder: "title" });
  const layers = [HEX.teal, HEX.amber, HEX.teal, HEX.amber, HEX.teal, HEX.amber];
  const lx = 0.7, lw = 3.0;
  layers.forEach((c, i) => s.addShape("rect", { x: lx, y: 1.45 + i * 0.36, w: lw, h: 0.32, fill: { color: c },
    line: { color: HEX.paper, width: 1 } }));
  s.addShape("rect", { x: lx, y: 1.45 + 6 * 0.36, w: lw, h: 0.5, fill: { color: HEX.slate }, line: { color: HEX.slate } });
  text(s, "1 · Grow Si / SiGe superlattice", { x: lx, y: 4.25, w: lw, h: 0.35, fontSize: 14, bold: true, color: HEX.navy, align: "center" });
  arrow(s, 4.0, 2.6, 1.2, HEX.copper);
  text(s, "Etch SiGe away\nfill with gate", { x: 3.85, y: 3.0, w: 1.5, h: 0.6, fontSize: 11, color: HEX.slate, align: "center" });
  const rx = 5.6, rw = 3.4;
  s.addShape("rect", { x: rx, y: 1.3, w: rw, h: 2.75, fill: { color: HEX.copper }, line: { color: HEX.copper } });
  [0, 1, 2].forEach((k) => {
    const yy = 1.81 + k * 0.72;
    s.addShape("rect", { x: rx + 0.4, y: yy, w: rw - 0.8, h: 0.32, fill: { color: HEX.teal }, line: { color: HEX.teal } });
    [rx + 0.18, rx + rw - 0.4].forEach((sx) => s.addShape("rect", { x: sx, y: yy - 0.18, w: 0.22, h: 0.68,
      fill: { color: HEX.line }, line: { color: HEX.line } })); // inner spacers
  });
  s.addShape("rect", { x: rx, y: 4.05, w: rw, h: 0.2, fill: { color: HEX.slate }, line: { color: HEX.slate } });
  text(s, "6–7 · Channels released, gate wraps all around", { x: rx - 0.2, y: 4.35, w: rw + 0.4, h: 0.35, fontSize: 14,
    bold: true, color: HEX.navy, align: "center" });
  text(s, "Teal = Si channel  ·  Amber = SiGe (sacrificial)  ·  Copper = gate  ·  Light grey = inner spacers",
    { x: 0.5, y: 4.8, w: 9, h: 0.3, fontSize: 11, color: HEX.slate, align: "center" });
  s.addNotes("Left: the superlattice as grown. Right: after channel release and replacement metal gate. The inner spacers isolate the gate from source and drain between the sheets.");
}

// ---------------------------------------------------------------- 13. Process flow
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Eight steps; three of them are the hard part", { placeholder: "title" });
  const steps = [
    ["Superlattice epi", false], ["Pattern fins", false], ["Dummy gate + spacers", false], ["Inner spacers", true],
    ["Source/drain epi", false], ["Channel release", true], ["Gate stack (ALD)", true], ["Contacts + BEOL", false],
  ];
  steps.forEach(([t, hard], i) => {
    const col = i % 4, row = Math.floor(i / 4), x = 0.5 + col * 2.3, y = 1.25 + row * 1.75;
    s.addShape("roundRect", { x, y, w: 2.1, h: 1.45, rectRadius: 0.08, fill: { color: hard ? HEX.copperTint : HEX.mist },
      line: { color: hard ? HEX.copper : HEX.mist, width: hard ? 1.5 : 0.5 } });
    badge(s, i + 1, x + 0.15, y + 0.15, 0.4, hard ? HEX.copper : HEX.slate);
    text(s, t, { x: x + 0.15, y: y + 0.65, w: 1.8, h: 0.6, fontSize: 14, bold: true, color: HEX.navy });
  });
  text(s, "Highlighted: lateral SiGe recess to nm control, selective SiGe removal, and fitting high-k + work-function metals into ~10 nm gaps (this limits Vt flavours).",
    { x: 0.5, y: 4.75, w: 9, h: 0.45, fontSize: 12, color: HEX.slate });
  s.addNotes("GAA adds many epitaxy, selective etch, ALD and metrology steps. That is why equipment makers such as Applied Materials, Lam, Tokyo Electron, ASM International and KLA call GAA a growth driver.");
}

// ---------------------------------------------------------------- 14. Backside power
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Backside power: signals on top, power underneath", { placeholder: "title" });
  const stack = (x, title, layers) => {
    let y = 1.3;
    layers.forEach(([label, color, h, txt = HEX.paper]) => {
      s.addShape("rect", { x, y, w: 2.2, h, fill: { color }, line: { color: HEX.paper, width: 1 } });
      text(s, label, { x: x + 0.1, y, w: 2.0, h, fontSize: 11, color: txt, align: "center", valign: "middle" });
      y += h;
    });
    text(s, title, { x, y: y + 0.1, w: 2.2, h: 0.35, fontSize: 14, bold: true, color: HEX.navy, align: "center" });
  };
  stack(0.5, "Traditional", [
    ["Signal + power wiring", HEX.copper, 1.6], ["Transistors", HEX.teal, 0.45], ["Silicon substrate", HEX.slate, 1.0],
  ]);
  stack(3.0, "Backside power", [
    ["Carrier wafer", HEX.slate, 0.55], ["Signal wiring only", HEX.navy, 1.2], ["Transistors", HEX.teal, 0.45],
    ["Power network", HEX.copper, 0.85],
  ]);
  card(s, { x: 5.6, y: 1.3, w: 3.9, h: 1.65, fill: HEX.tealTint, title: "Gains", body:
    "Lower IR drop · more routing tracks · higher density and clock for power-hungry AI chips" });
  card(s, { x: 5.6, y: 3.1, w: 3.9, h: 1.65, fill: HEX.copperTint, title: "Costs", body:
    "Wafer bonding and thinning · nano-TSVs · worse hotspots · new debug, PDK and EDA flows" });
  s.addNotes("Intel PowerVia ships with 18A using nano-TSVs. TSMC Super Power Rail arrives with A16 using direct backside contacts. For physical designers: new power-grid design, IR and EM sign-off, and thermal analysis.");
}

// ---------------------------------------------------------------- 15. The race
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("The 2nm-class race to watch", { placeholder: "title" });
  const head = (t) => ({ text: t, options: { bold: true, color: HEX.paper, fill: { color: HEX.navy } } });
  const rows = [
    ["TSMC", "N2 → A16", "Nanosheet", "Super Power Rail (A16)", "Volume ramp; Apple and HPC first"],
    ["Intel", "18A", "RibbonFET", "PowerVia (first)", "Can Intel Foundry win outside customers?"],
    ["Samsung", "SF3 → SF2", "MBCFET (first GAA, 2022)", "Planned (SF2Z)", "Yield and customer wins"],
  ];
  s.addTable([["Company", "Node", "Transistor", "Backside power", "Watch for"].map(head),
    ...rows.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: j === 0, color: HEX.ink,
      fill: { color: i % 2 ? HEX.paper : HEX.mist } } })))], {
    x: 0.5, y: 1.25, w: 9.0, colW: [1.2, 1.3, 2.0, 1.9, 2.6], fontFace: "Calibri", fontSize: 13,
    border: { type: "solid", color: HEX.line, pt: 0.75 }, rowH: 0.62, valign: "middle", margin: 0.08,
  });
  text(s, "Don’t compare names: compare density, perf/W, SRAM cell area, yield and wafer price.",
    { x: 0.5, y: 4.4, w: 9, h: 0.4, fontSize: 14, italic: true, color: HEX.copper });
  s.addNotes("TSMC N2 ramps 2025-2026 with A16 adding backside power. Intel 18A combines RibbonFET and PowerVia. Samsung was first to GAA but has struggled on yield and customer wins.");
}

// ---------------------------------------------------------------- 16. Career + investing
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Why this matters for you", { placeholder: "title" });
  card(s, { x: 0.5, y: 1.2, w: 4.35, h: 3.4, fill: HEX.tealTint, title: "Career: design and AI hardware", titleSize: 17,
    body: "Roles at the process–design boundary are growing:\n\n• Standard-cell library design and characterisation\n• DTCO engineering\n• PDK and EDA flow development\n• IR/EM, thermal and power-integrity sign-off\n\nMuch of this work happens in Indian design centres." });
  card(s, { x: 5.15, y: 1.2, w: 4.35, h: 3.4, fill: HEX.copperTint, title: "Investing: who gains", titleSize: 17,
    body: "• Foundries: higher wafer prices at the leading edge\n• Equipment: more epi, etch, ALD, metrology steps (AMAT, Lam, TEL, KLA)\n• EDA: more complex sign-off (Synopsys, Cadence)\n\nKey risk: a slow or low-yield ramp hits margins and customer launches." });
  s.addNotes("Tie the technology to roles and to where value flows. Not investment advice.");
}

// ---------------------------------------------------------------- 17. Recap
{
  const s = pres.addSlide({ masterName: "RECAP_DARK" });
  s.addText("Five things to remember", { placeholder: "title" });
  const take = [
    "Node names are brands: compare pitches, density, SRAM, cost",
    "Density now comes mostly from DTCO, not from shrinking pitches",
    "More gate around the channel = better control = lower VDD",
    "Nanosheets: inner spacers, channel release and gate fill are the hard steps",
    "Backside power frees routing and cuts IR drop, but adds thermal and flow work",
  ];
  take.forEach((t, i) => {
    const y = 1.5 + i * 0.62;
    badge(s, i + 1, 0.6, y, 0.42);
    text(s, t, { x: 1.2, y, w: 8.3, h: 0.42, fontSize: 16, color: HEX.paper, valign: "middle" });
  });
  text(s, "Next: exercises + quiz in notes/week-01  ·  Listen to the Week 1 podcast", { x: 0.6, y: 4.75, w: 8.8, h: 0.35,
    fontSize: 13, color: HEX.sky });
  s.addNotes("Recap. Then do the exercises and quiz, and listen to the podcast episode for the same ideas in conversation.");
}

writeDeck(pres, OUT);
