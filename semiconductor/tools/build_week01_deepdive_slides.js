// Week 1 deep dive: transistor physics, how nodes are measured, FinFET -> nanosheet,
// how nanosheets are built, wiring and backside power, industry view.
// Every technical term is explained in plain words on first use.
// Run: NODE_PATH=tools/node_modules node tools/build_week01_deepdive_slides.js   (from semiconductor/)
const fs = require("fs");
const path = require("path");
const { HEX, createDeck, text, badge, card, stat, bullets, writeDeck } = require("./deck_lib");

const WEEK_DIR = path.join(__dirname, "..", "weekly", "week-01");
const IMG = (f) => path.join(WEEK_DIR, "images", f);
const OUT = path.join(WEEK_DIR, "week-01-deep-dive-slides.pptx");
const pres = createDeck({ title: "Week 1 deep dive — Inside the transistor", week: 1 });

const CHART_STYLE = {
  dataLabelFontSize: 11, dataLabelColor: HEX.ink, dataLabelFontFace: "+mn-lt",
  catAxisLabelColor: HEX.slate, catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt",
  valAxisLabelColor: HEX.slate, valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
  valGridLine: { color: HEX.line, size: 0.5 }, catGridLine: { style: "none" },
};

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function imageSlide(title, file, takeaway, notes) {
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText(title, { placeholder: "title" });
  const { w, h } = pngSize(IMG(file));
  const iw = Math.min(9.0, 3.6 * (w / h)), ih = iw * (h / w);
  s.addImage({ path: IMG(file), x: (10 - iw) / 2, y: 1.1, w: iw, h: ih, altText: title });
  text(s, takeaway, { x: 0.5, y: 4.78, w: 9, h: 0.4, fontSize: 15, bold: true, color: HEX.copper, align: "center", valign: "middle" });
  s.addNotes(notes);
}

function section(title, sub, notes) {
  const s = pres.addSlide({ masterName: "SECTION_DARK" });
  s.addText(title, { placeholder: "title" });
  s.addText(sub, { placeholder: "body" });
  s.addNotes(notes);
}

function table(s, header, rows, opts) {
  const head = header.map((t) => ({ text: t, options: { bold: true, color: HEX.paper, fill: { color: HEX.navy } } }));
  const body = rows.map((r, i) => r.map((c, j) => ({ text: c, options: { bold: j === 0, color: HEX.ink,
    fill: { color: i % 2 ? HEX.paper : HEX.mist } } })));
  s.addTable([head, ...body], { fontFace: "Calibri", fontSize: 13, valign: "middle", margin: 0.07,
    border: { type: "solid", color: HEX.line, pt: 0.75 }, ...opts });
}

// ---------------------------------------------------------------- 1. Title
{
  const s = pres.addSlide({ masterName: "TITLE_DARK" });
  s.addText("Week 1 deep dive:\ninside the transistor", { placeholder: "title" });
  s.addText("Part 2 of week 1. The real physics, measurements and manufacturing behind “smaller chips”, with every term explained the first time it appears.",
    { placeholder: "body" });
  const { w, h } = pngSize(IMG("15-finfet-vs-nanosheet-3d.png"));
  s.addImage({ path: IMG("15-finfet-vs-nanosheet-3d.png"), x: 6.2, y: 1.5, w: 3.5, h: 3.5 * h / w, altText: "FinFET and nanosheet in 3D" });
  s.addNotes("This is the deep dive for week 1. Read or watch the beginner deck first. Here we go one level deeper on each idea.");
}

// ---------------------------------------------------------------- 2. Map
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("The six parts of this deep dive", { placeholder: "title" });
  const parts = [
    ["How a transistor really works", "Electrons, doping, the channel, threshold voltage"],
    ["Why small transistors leak", "The I-V curve, 60 mV/decade, the 'dam' picture"],
    ["How a node is measured", "Gate pitch, metal pitch, tracks, density, SRAM"],
    ["FinFET → nanosheet", "3D shapes, effective width, the 8 build steps"],
    ["Wiring and backside power", "Why wires are now the bottleneck"],
    ["The industry view", "Who's racing, who sells the tools, which jobs grow"],
  ];
  parts.forEach(([t, b], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    card(s, { x: 0.5 + col * 4.6, y: 1.15 + row * 1.3, w: 4.4, h: 1.15, num: i + 1, title: t, body: b, titleSize: 15, bodySize: 13,
      fill: col ? HEX.mist : HEX.tealTint });
  });
  s.addNotes("Six parts. Each one has a diagram, the plain-words version, and the real numbers engineers use.");
}

// ================================================================ Part 1
section("1 · How a transistor really works", "From silicon atoms to an on/off switch", "Part one: what physically happens inside the switch.");

imageSlide("Inside a MOSFET: OFF vs ON", "11-mosfet-off-on.png",
  "A gate voltage above Vt pulls electrons up and creates the channel",
  "MOSFET stands for metal-oxide-semiconductor field-effect transistor. The source and drain are silicon with extra electrons added. The body in between is p-type, which has almost no free electrons, so nothing flows. Put a positive voltage on the gate and its electric field pulls electrons to the surface just under the gate oxide. Once enough gather, they form a thin conducting layer called the channel, and current flows from source to drain.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Six terms, in plain words", { placeholder: "title" });
  const terms = [
    ["Doping", "Adding a pinch of another element to silicon. n-type gives spare electrons; p-type leaves “holes”."],
    ["Channel", "The thin layer of electrons the gate pulls up. Only exists when the switch is ON. About 1–2 nm deep."],
    ["Threshold voltage (Vt)", "The gate voltage where the channel appears. Typically ~0.25–0.35 V today."],
    ["Gate oxide / high-k", "The insulator under the gate, ~1 nm. Hafnium oxide (“high-k”) replaced SiO₂ around 2007 to stop it leaking."],
    ["VDD (supply voltage)", "The voltage that runs the chip, ~0.7 V today. Lower VDD = less power, but the switch must still turn fully on."],
    ["nMOS + pMOS = CMOS", "Every logic gate pairs an n-type and a p-type transistor, so almost no current flows when idle."],
  ];
  terms.forEach(([t, b], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    card(s, { x: 0.5 + col * 4.6, y: 1.1 + row * 1.35, w: 4.4, h: 1.2, title: t, body: b, titleSize: 15, bodySize: 12.5,
      fill: i % 3 === 0 ? HEX.tealTint : HEX.mist });
  });
  s.addNotes("Keep this slide handy. These six terms come back every week.");
}

// ================================================================ Part 2
section("2 · Why small transistors leak", "Reading the switch's report card", "Part two: how engineers grade a transistor, and why shrinking it hurts.");

imageSlide("The I–V curve: a transistor's report card", "12-id-vg-curve.png",
  "Good switch: tiny OFF leak, big ON current, steep in between",
  "This plots drain current against gate voltage on a logarithmic scale, where each grid line is ten times more current. Three things matter. The OFF current at zero volts is leakage. The ON current at VDD is how hard the switch drives. The slope in between is how sharply it turns on. The red device has the same ON current but leaks about 160 times more when off.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("The three numbers that grade a switch", { placeholder: "title" });
  stat(s, { x: 0.5, y: 1.1, w: 2.9, value: "I_on", label: "ON current. Higher = faster chip.", color: HEX.teal, valueSize: 40 });
  stat(s, { x: 3.55, y: 1.1, w: 2.9, value: "I_off", label: "OFF leakage. Lower = better battery and less heat.", color: HEX.red, valueSize: 40 });
  stat(s, { x: 6.6, y: 1.1, w: 2.9, value: "SS", label: "Subthreshold swing: mV of gate voltage for 10× current.", color: HEX.copper, valueSize: 40 });
  card(s, { x: 0.5, y: 3.0, w: 9.0, h: 1.95, fill: HEX.copperTint, title: "Why can't SS go below ~60 mV per decade?",
    body: "Electrons have a spread of energies set by temperature, like water molecules in a warm pond. At room temperature the thermal voltage kT/q ≈ 26 mV, and turning current up 10× needs ln(10) ≈ 2.3 times that: 26 × 2.3 ≈ 60 mV. No ordinary transistor beats this. Real ones are ~65–75 mV/decade. The worse the gate control, the bigger the number." });
  s.addNotes("SS stands for subthreshold swing. Physics sets a floor of about 60 millivolts per decade at room temperature, because of the thermal spread of electron energies.");
}

imageSlide("Why short channels leak: the dam picture", "13-short-channel-dam.png",
  "In a short channel the drain helps lower the barrier: that's DIBL",
  "Think of electron energy as height. The source is a reservoir, the drain is lower ground, and the gate controls a dam in between. In a long channel only the gate sets the dam height. In a short channel the drain is so close that its voltage pulls the dam down and thins it. Electrons spill over even when the gate says off. That's drain-induced barrier lowering, DIBL.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Three ways to give the gate back control", { placeholder: "title" });
  card(s, { x: 0.5, y: 1.1, w: 4.1, h: 2.2, fill: HEX.copperTint, title: "The rule of thumb",
    body: "Engineers use a “natural length” λ:\nλ ≈ √(ε_si · t_si · t_ox / (N · ε_ox))\nThe gate length must be several λ. So shrink λ." });
  text(s, "In plain words: thinner silicon, a better insulator, or more gate around the channel.", { x: 0.5, y: 3.45, w: 4.1, h: 0.7,
    fontSize: 14, italic: true, color: HEX.slate });
  const levers = [
    ["Thinner silicon body (t_si)", "Less room for the drain's field to sneak under (5 nm sheets)."],
    ["Better insulator (t_ox, ε)", "High-k hafnium oxide since ~2007: thicker but more effective."],
    ["More gates around it (N)", "1 side → 3 sides (FinFET) → 4 sides (nanosheet)."],
  ];
  levers.forEach(([t, b], i) => card(s, { x: 4.9, y: 1.1 + i * 1.05, w: 4.6, h: 0.95, num: i + 1, title: t, body: b,
    titleSize: 14, bodySize: 12, fill: i === 2 ? HEX.tealTint : HEX.mist }));
  text(s, "Worked example: with SS = 75 mV/dec, cutting leakage 10× needs Vt +75 mV. At 60 mV/dec, only +60 mV. Steeper = lower VDD = less power.",
    { x: 0.5, y: 4.3, w: 9, h: 0.6, fontSize: 13, color: HEX.ink });
  s.addNotes("The natural-length formula just says: thin body, good insulator, and many gate sides all help the gate dominate the drain.");
}

// ================================================================ Part 3
section("3 · How a node is measured", "Forget the name: measure the pitches", "Part three: the real dimensions of a process node.");

imageSlide("A standard cell from above", "14-standard-cell-pitches.png",
  "Cell width is counted in gate pitches; cell height in metal tracks",
  "Chips are built from standard cells: pre-designed blocks like a NAND gate or a flip-flop. Their width is a whole number of gate pitches, called CPP. Their height is a whole number of metal tracks times the metal pitch, called MMP. A six-track cell at 23 nanometre pitch is about 138 nanometres tall.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Pitches have nearly stopped shrinking", { placeholder: "title" });
  const labels = ["Intel 22nm", "Intel 14nm", "TSMC N7", "TSMC N5", "TSMC N3E", "TSMC N2 (est.)"];
  s.addChart(pres.charts.BAR, [
    { name: "Gate pitch CPP (nm)", labels, values: [90, 70, 57, 51, 48, 45] },
    { name: "Metal pitch MMP (nm)", labels, values: [80, 52, 40, 28, 23, 21] },
  ], { x: 0.4, y: 1.1, w: 6.1, h: 4.0, barDir: "col", barGrouping: "clustered", chartColors: [HEX.navy, HEX.copper],
    showValue: true, dataLabelPosition: "outEnd", showLegend: true, legendPos: "t", legendFontSize: 11, legendFontFace: "+mn-lt",
    legendColor: HEX.ink, ...CHART_STYLE });
  card(s, { x: 6.8, y: 1.2, w: 2.7, h: 2.3, fill: HEX.copperTint, title: "Read the chart",
    body: "From N5 to N2, gate pitch moved only ~6 nm. Density still improves, mostly through DTCO (next slide)." });
  text(s, "Approximate published/analyst figures; they vary by source and process variant.", { x: 6.8, y: 3.7, w: 2.7, h: 0.8,
    fontSize: 11, italic: true, color: HEX.slate });
  s.addNotes("Rounded, approximate figures. The trend is what matters: pitch scaling has slowed sharply.");
}

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("DTCO: shrink the cell, not the pitch", { placeholder: "title" });
  s.addChart(pres.charts.BAR, [
    { name: "Cell height (nm) at MMP = 23 nm", labels: ["7.5 tracks", "6 tracks", "5 tracks"], values: [172.5, 138, 115] },
  ], { x: 0.4, y: 1.1, w: 4.6, h: 3.9, barDir: "col", chartColors: [HEX.teal], showValue: true, dataLabelPosition: "outEnd",
    showLegend: false, showTitle: true, title: "Same pitch, fewer tracks", titleFontSize: 13, titleColor: HEX.ink, titleFontFace: "+mn-lt",
    ...CHART_STYLE });
  text(s, "DTCO = design-technology co-optimisation: process and cell designers change the rules together.", { x: 5.3, y: 1.15, w: 4.2, h: 0.7,
    fontSize: 14, bold: true, color: HEX.navy });
  bullets(s, [
    "Fewer tracks per cell (7.5 → 6 → 5): −33% height",
    "Fin depopulation: 3 → 2 → 1 fin per transistor",
    "Contact over active gate (COAG): put the gate contact right on top of the transistor",
    "Single diffusion break: thinner gaps between cells",
    "Backside power: frees the tracks used by power rails",
  ], { x: 5.3, y: 1.95, w: 4.2, h: 3.0, fontSize: 13 });
  s.addNotes("Cell height equals tracks times metal pitch. Cutting tracks shrinks area even when the pitch is fixed.");
}

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Density and the SRAM problem", { placeholder: "title" });
  card(s, { x: 0.5, y: 1.1, w: 4.3, h: 3.85, fill: HEX.mist, title: "Logic density (MTr/mm²)",
    body: "Million transistors per square millimetre. One common formula weights a small and a large cell:\n\n0.6 × NAND2 density + 0.4 × scan flip-flop density\n\nUseful for comparing processes, but real chips vary a lot with design and libraries." });
  card(s, { x: 5.1, y: 1.1, w: 4.4, h: 3.85, fill: HEX.copperTint, title: "SRAM has stopped shrinking",
    body: "SRAM is the fast memory (cache) on every chip. A bit cell uses 6 transistors.\n\nTSMC's reported high-density SRAM cell: ~0.021 µm² at N5 and roughly the same at N3E. N2 reportedly gets only a modest shrink.\n\nAI chips need huge caches, so this pushes designs toward chiplets and stacked cache (week 5)." });
  s.addNotes("SRAM scaling stalling is one of the most important trends of the decade. Figures are as reported publicly and rounded.");
}

// ================================================================ Part 4
section("4 · From FinFET to nanosheet", "Shapes, sizes, and how they're built", "Part four: the 3D structures and the manufacturing flow.");

imageSlide("FinFET vs nanosheet in 3D", "15-finfet-vs-nanosheet-3d.png",
  "Similar total width, but nanosheets wrap every side and can be any width",
  "A FinFET channel is a tall thin fin with the gate on three sides. A nanosheet transistor uses a stack of three thin horizontal sheets with the gate wrapped all the way around each. Effective width is the total perimeter the gate controls: two times height plus width for a fin, and two times width plus thickness, times the number of sheets, for nanosheets.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Worked example: sizing a transistor", { placeholder: "title" });
  table(s, ["Device", "Formula", "Effective width"], [
    ["1 fin (H 50, W 6)", "1 × (2·50 + 6)", "106 nm"],
    ["2 fins", "2 × (2·50 + 6)", "212 nm"],
    ["3 fins", "3 × (2·50 + 6)", "318 nm"],
    ["3 sheets, 15 nm wide", "3 × 2·(15 + 5)", "120 nm"],
    ["3 sheets, 30 nm wide", "3 × 2·(30 + 5)", "210 nm"],
    ["3 sheets, 45 nm wide", "3 × 2·(45 + 5)", "300 nm"],
  ], { x: 0.5, y: 1.15, w: 5.6, colW: [2.0, 2.0, 1.6], rowH: 0.5 });
  card(s, { x: 6.4, y: 1.15, w: 3.1, h: 3.5, fill: HEX.tealTint, title: "Why it matters",
    body: "Fins only come in steps of 106 nm. Sheet width can be anything in between.\n\nLibrary designers get back fine control: narrow sheets for low-power cells, wide sheets for fast ones." });
  s.addNotes("Effective width sets drive current. FinFETs come in whole fins; nanosheets can be tuned continuously.");
}

imageSlide("How a nanosheet transistor is built", "16-nanosheet-process-8-steps.png",
  "Build with a temporary material, then swap it for the real gate",
  "The trick is to build everything around placeholders. Grow alternating silicon and silicon-germanium layers. Put a dummy gate on top. Cut away the sides, notch the silicon-germanium ends and fill them with insulator, grow the source and drain. Then remove the dummy gate and dissolve the silicon-germanium, leaving floating silicon sheets. Finally coat everything with the real gate stack and add contacts.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("The three hardest steps, explained", { placeholder: "title" });
  const hard = [
    ["Inner spacers (step 4)", "Etch a few nanometres sideways into each SiGe layer and fill the notch with insulator. Stops the gate shorting to source/drain and cuts unwanted capacitance. Needs ~1 nm control, uniformly, on billions of devices."],
    ["Channel release (step 6)", "A chemical must dissolve SiGe but barely touch silicon: a selectivity of 100:1 or more. Too little and SiGe remains; too much and the sheets get thinned or damaged."],
    ["Gate fill (step 7)", "Insulator plus several metal layers must coat all sides of every sheet inside ~10 nm gaps, using atomic layer deposition (ALD). Little room means fewer threshold-voltage options (Vt flavours) for designers."],
  ];
  hard.forEach(([t, b], i) => card(s, { x: 0.5 + i * 3.05, y: 1.15, w: 2.85, h: 3.75, num: i + 1, title: t, body: b, titleSize: 14,
    bodySize: 12.5, fill: HEX.copperTint }));
  s.addNotes("Vt flavours are the different threshold voltages designers pick from: low Vt for speed, high Vt for low leakage. Each needs a slightly different metal stack, and nanosheets leave little room.");
}

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Who sells the tools for each step", { placeholder: "title" });
  table(s, ["Step type", "What it does", "Main toolmakers"], [
    ["Lithography", "Prints the patterns with light (week 2)", "ASML (EUV: sole supplier)"],
    ["Epitaxy", "Grows perfect crystal layers (Si/SiGe, S/D)", "Applied Materials, ASM International"],
    ["Deposition / ALD", "Coats films one atomic layer at a time", "ASM International, Lam, Tokyo Electron, AMAT"],
    ["Etch", "Removes material, incl. selective SiGe etch", "Lam Research, Tokyo Electron, AMAT"],
    ["Metrology / inspection", "Measures and finds defects at nm scale", "KLA, Applied Materials, Onto"],
  ], { x: 0.5, y: 1.15, w: 9.0, colW: [2.0, 3.8, 3.2], rowH: 0.58 });
  text(s, "GAA adds many epi, ALD, etch and metrology steps compared with FinFET, so these companies call it a growth driver.",
    { x: 0.5, y: 4.65, w: 9, h: 0.45, fontSize: 13, italic: true, color: HEX.copper });
  s.addNotes("Investing angle: a new transistor architecture increases equipment spending per wafer, especially deposition and etch.");
}

// ================================================================ Part 5
section("5 · Wiring and backside power", "The wires are now the bottleneck", "Part five: the metal layers above the transistors.");

imageSlide("Three ways to deliver power", "17-backside-power-designs.png",
  "Moving power under the transistors cuts voltage loss and frees space for signals",
  "A chip has over ten metal layers above the transistors. The bottom layers are only tens of nanometres wide and very resistive. Traditionally power comes in from the top and squeezes down through those thin wires, losing voltage, which is IR drop. Backside power flips the wafer, thins it, and builds the power network underneath. Intel's PowerVia uses thin nano-TSV pillars beside the transistors. TSMC's Super Power Rail connects directly into each transistor's source.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Backside power: gains, costs, design impact", { placeholder: "title" });
  card(s, { x: 0.5, y: 1.1, w: 2.9, h: 3.85, fill: HEX.tealTint, title: "Gains",
    body: "• Less IR drop (voltage lost in wires)\n• Power rails leave the cell: ~1 more signal track\n• Higher density and clock speed\n• Big win for power-hungry AI chips" });
  card(s, { x: 3.55, y: 1.1, w: 2.9, h: 3.85, fill: HEX.copperTint, title: "Costs",
    body: "• Wafer bonding and thinning to ~µm\n• Nano-TSVs or backside contacts\n• Hotspots: less silicon to spread heat\n• Debugging from the back gets harder" });
  card(s, { x: 6.6, y: 1.1, w: 2.9, h: 3.85, fill: HEX.mist, title: "For chip designers",
    body: "• New power-grid design and IR/EM sign-off (EM = electromigration, wires wearing out)\n• New thermal analysis\n• New PDK and EDA tool flows\n→ demand for physical-design skills" });
  s.addNotes("EM stands for electromigration: high current slowly pushes metal atoms and can break a wire. Sign-off means the final checks before a chip is manufactured.");
}

imageSlide("What comes after nanosheets", "18-after-nanosheets.png",
  "Forksheet, then CFET: put n and p closer, then on top of each other",
  "Every logic gate pairs n-type and p-type transistors. Today they sit side by side with a gap. Forksheet, proposed by the research centre imec, puts an insulating wall between them so they can sit closer. CFET, complementary FET, stacks one on top of the other, roughly halving the footprint. CFET is expected in the 2030s.");

// ================================================================ Part 6
section("6 · The industry view", "Who's racing, and what it means for you", "Part six: companies, careers, and investing.");

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("The 2nm-class race", { placeholder: "title" });
  table(s, ["Company", "Node", "Transistor", "Backside power", "Watch for"], [
    ["TSMC", "N2 → A16", "Nanosheet", "Super Power Rail (A16)", "Volume ramp; Apple and HPC first"],
    ["Intel", "18A", "RibbonFET", "PowerVia (first)", "Outside foundry customers"],
    ["Samsung", "SF3 → SF2", "MBCFET (first GAA, 2022)", "Planned (SF2Z)", "Yield and customer wins"],
  ], { x: 0.5, y: 1.2, w: 9.0, colW: [1.2, 1.3, 2.0, 1.9, 2.6], rowH: 0.62 });
  text(s, "Compare density, performance per watt, SRAM cell area, yield and wafer price, not node names.",
    { x: 0.5, y: 4.4, w: 9, h: 0.4, fontSize: 14, italic: true, color: HEX.copper });
  s.addNotes("Yield is the share of chips on a wafer that work. A low-yield ramp hurts foundry margins and delays customers' products.");
}

{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Career map: where this week's topics become jobs", { placeholder: "title" });
  table(s, ["Role", "What they do", "Why GAA/backside power matter"], [
    ["Standard-cell library designer", "Designs and characterises the logic “Lego bricks”", "New sheet-width and Vt options; new cell rules"],
    ["DTCO engineer", "Co-optimises process rules and cell layouts", "Track reduction, backside rails"],
    ["Physical design engineer", "Places and routes blocks into a chip layout", "New power grids, fewer tracks, congestion"],
    ["Power-integrity / IR-EM engineer", "Signs off voltage drop and wire wear", "Backside power changes everything here"],
    ["Verification engineer", "Proves the design works before tape-out", "More complex chips = more verification"],
  ], { x: 0.5, y: 1.15, w: 9.0, colW: [2.4, 3.3, 3.3], rowH: 0.62 });
  s.addNotes("Tape-out is when the final design is sent to the factory. Many of these roles are hiring in Bengaluru, Hyderabad and Noida design centres.");
}

// ---------------------------------------------------------------- practice
const problems = [
  ["A 6-track cell at MMP = 21 nm: how tall?", "6 × 21 = 126 nm"],
  ["Going from 6 to 5 tracks at the same pitch saves what % of cell area?", "1 − 5/6 ≈ 16.7%"],
  ["SS = 70 mV/dec. How much must Vt rise to cut leakage 100×?", "2 decades × 70 = 140 mV"],
  ["Effective width of 4 sheets, 25 nm wide, 5 nm thick?", "4 × 2·(25 + 5) = 240 nm"],
  ["Why does nanosheet gate fill limit Vt flavours?", "Each Vt needs a different metal stack; ~10 nm gaps leave no room"],
];
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Practice problems", { placeholder: "title" });
  problems.forEach(([q], i) => {
    const y = 1.15 + i * 0.72;
    badge(s, i + 1, 0.6, y + 0.05, 0.44, HEX.teal);
    text(s, q, { x: 1.3, y, w: 8.2, h: 0.55, fontSize: 16, valign: "middle" });
  });
  text(s, "Work them out on paper, then check the next slide.", { x: 0.5, y: 4.8, w: 9, h: 0.35, fontSize: 13, italic: true, color: HEX.slate });
  s.addNotes("These use only the formulas from this deck.");
}
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Answers", { placeholder: "title" });
  problems.forEach(([q, a], i) => {
    const y = 1.1 + i * 0.78;
    badge(s, i + 1, 0.6, y + 0.08, 0.44, HEX.teal);
    text(s, q, { x: 1.3, y, w: 8.2, h: 0.32, fontSize: 13, color: HEX.slate });
    text(s, a, { x: 1.3, y: y + 0.3, w: 8.2, h: 0.4, fontSize: 15, bold: true, color: HEX.navy });
  });
  s.addNotes("If you got these, you understand week one at an engineer's level.");
}

// ---------------------------------------------------------------- recap
{
  const s = pres.addSlide({ masterName: "RECAP_DARK" });
  s.addText("Deep dive in six lines", { placeholder: "title" });
  const take = [
    "A gate voltage above Vt pulls electrons up to form the channel",
    "Grade a switch by I_on, I_off and SS (≥ 60 mV/decade)",
    "Short channels leak because the drain lowers the barrier (DIBL)",
    "Nodes = pitches × tracks; density now comes mostly from DTCO",
    "Nanosheets: build with SiGe placeholders, then swap in the gate",
    "Backside power moves power wires under the transistors",
  ];
  take.forEach((t, i) => {
    const y = 1.35 + i * 0.55;
    badge(s, i + 1, 0.6, y, 0.4);
    text(s, t, { x: 1.2, y, w: 8.3, h: 0.4, fontSize: 16, color: HEX.paper, valign: "middle" });
  });
  text(s, "Listen: Week 1 deep-dive podcast  ·  Read: notes/week-01-deep-dive.md", { x: 0.6, y: 4.85, w: 8.8, h: 0.35,
    fontSize: 13, color: HEX.sky });
  s.addNotes("That's the full week one. Next week: lithography, how chips are printed with light.");
}

writeDeck(pres, OUT);
