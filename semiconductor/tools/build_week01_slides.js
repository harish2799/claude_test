// Week 1 beginner deck: what a chip is, why "3nm" is a nickname, how switches got
// smaller (FinFET -> gate-all-around), and backside power. No background needed.
// Run: NODE_PATH=tools/node_modules node tools/build_week01_slides.js   (from semiconductor/)
const fs = require("fs");
const path = require("path");
const { HEX, createDeck, text, badge, card, stat, wafer, writeDeck } = require("./deck_lib");

const WEEK_DIR = path.join(__dirname, "..", "weekly", "week-01");
const IMG = (f) => path.join(WEEK_DIR, "images", f);
const OUT = path.join(WEEK_DIR, "week-01-slides.pptx");
const pres = createDeck({ title: "Week 1 — How computer chips work", week: 1 });

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

// Full-width illustration with a one-line takeaway underneath.
function imageSlide(title, file, takeaway, notes) {
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText(title, { placeholder: "title" });
  const { w, h } = pngSize(IMG(file));
  const maxW = 9.0, maxH = 3.6;
  const iw = Math.min(maxW, maxH * (w / h)), ih = iw * (h / w);
  s.addImage({ path: IMG(file), x: (10 - iw) / 2, y: 1.1, w: iw, h: ih, altText: title });
  text(s, takeaway, { x: 0.5, y: 4.78, w: 9, h: 0.4, fontSize: 15, bold: true, color: HEX.copper, align: "center",
    valign: "middle" });
  s.addNotes(notes);
  return s;
}

// ---------------------------------------------------------------- 1. Title
{
  const s = pres.addSlide({ masterName: "TITLE_DARK" });
  s.addText("How computer\nchips work", { placeholder: "title" });
  s.addText("Week 1  ·  No background needed. What's inside a chip, why “3nm” is just a nickname, and the clever tricks that keep chips getting better",
    { placeholder: "body" });
  wafer(s, 7.75, 2.8, 1.75);
  s.addNotes("Welcome! This week assumes no background at all. The picture on the right is a silicon wafer: a thin disc that hundreds of chips are made on at the same time.");
}

// ---------------------------------------------------------------- 2. This week in one minute
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("This week in one minute", { placeholder: "title" });
  const items = [
    ["A chip is billions of tiny switches", "Each switch is ON or OFF, 1 or 0. Everything your phone does is built from that."],
    ["“3nm” is a nickname", "Like a “2 × 4” plank of wood, the name doesn't match the real size."],
    ["Tiny switches leak", "So engineers wrapped the switch's control around it from more and more sides."],
    ["Power is moving underneath", "Power wires go below the switches, like pipes moved to a basement."],
  ];
  items.forEach(([t, b], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    card(s, { x: 0.5 + col * 4.6, y: 1.2 + row * 1.95, w: 4.4, h: 1.75, num: i + 1, title: t, body: b,
      titleSize: 16, bodySize: 14, fill: i % 3 === 0 ? HEX.tealTint : HEX.mist });
  });
  s.addNotes("If you remember only four things from this week, make it these four. The rest of the slides explain each one with a picture.");
}

// ---------------------------------------------------------------- 3-4. Chip and switch
imageSlide("What's inside a chip?", "01-phone-to-switch.png",
  "Zoom into any phone or laptop and you end up at billions of tiny on/off switches",
  "The chip is the phone's brain. It has areas for different jobs: the CPU runs apps, the GPU draws graphics, an AI engine handles things like photo enhancement, and memory keeps data close by. Every one of those areas is made of the same building block: the transistor, a microscopic switch.");

imageSlide("A transistor is just a tap", "02-transistor-is-a-tap.png",
  "Gate open = current flows = 1.  Gate closed = no current = 0.",
  "Think of a water tap. Current flows from the source to the drain through a path called the channel. The gate is the tap handle: a small voltage on it opens or closes the path. Combine billions of these and you can do maths, show videos and run AI.");

// ---------------------------------------------------------------- 5. Real numbers
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Real example: how many switches?", { placeholder: "title" });
  const steps = [
    ["1971", "2,300", "Intel 4004, the first chip with a whole processor on it"],
    ["2000", "42 million", "Intel Pentium 4, a desktop PC chip"],
    ["2023", "19 billion", "Apple A17 Pro, the chip in an iPhone 15 Pro"],
  ];
  steps.forEach(([year, n, what], i) => {
    const x = 0.5 + i * 3.1;
    s.addShape("roundRect", { x, y: 1.25, w: 2.85, h: 2.75, rectRadius: 0.08,
      fill: { color: i === 2 ? HEX.copperTint : HEX.mist }, line: { color: i === 2 ? HEX.copperTint : HEX.mist } });
    text(s, year, { x: x + 0.2, y: 1.4, w: 2.45, h: 0.4, fontSize: 16, bold: true, color: HEX.slate });
    text(s, n, { x: x + 0.2, y: 1.85, w: 2.45, h: 0.8, fontFace: "Cambria", fontSize: 36, bold: true,
      color: i === 2 ? HEX.copper : HEX.navy, valign: "middle" });
    text(s, "transistors", { x: x + 0.2, y: 2.65, w: 2.45, h: 0.35, fontSize: 14, color: HEX.slate });
    text(s, what, { x: x + 0.2, y: 3.05, w: 2.45, h: 0.85, fontSize: 14 });
    if (i < 2) s.addShape("rightArrow", { x: x + 2.88, y: 2.45, w: 0.2, h: 0.3, fill: { color: HEX.copper }, line: { color: HEX.copper } });
  });
  text(s, "Same fingernail-sized chip, about 8 million times more switches in about 50 years. That's only possible because each switch keeps getting smaller.",
    { x: 0.5, y: 4.3, w: 9, h: 0.75, fontSize: 15, color: HEX.ink });
  s.addNotes("These are real published transistor counts. The jump from thousands to billions is the whole story of the chip industry: make the switch smaller, fit more of them, get a more capable chip.");
}

imageSlide("How small is “small”?", "03-how-small.png",
  "A switch is about 4,000 times thinner than a human hair",
  "A nanometre is one billionth of a metre. Today's transistor gates are about 15 to 20 nanometres long: smaller than a virus, but still about 100 silicon atoms across. That's why we can't keep shrinking forever.");

// ---------------------------------------------------------------- 7. Why smaller is better
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Why do we want smaller switches?", { placeholder: "title" });
  const why = [
    ["More switches, same space", "More features in the same chip: better cameras, AI, games."],
    ["Faster", "Signals travel shorter distances, so the chip can work quicker."],
    ["Longer battery life", "Smaller switches need less energy to flip on and off."],
    ["Cheaper per switch", "More chips fit on each silicon wafer, so each one costs less."],
  ];
  why.forEach(([t, b], i) => {
    const y = 1.2 + i * 0.95;
    badge(s, i + 1, 0.6, y + 0.1, 0.5);
    text(s, t, { x: 1.35, y, w: 3.2, h: 0.7, fontSize: 18, bold: true, color: HEX.navy, valign: "middle" });
    text(s, b, { x: 4.6, y, w: 4.9, h: 0.7, fontSize: 15, valign: "middle" });
  });
  s.addNotes("This is why companies spend tens of billions of dollars on new factories. Each new generation of smaller switches gives better phones, laptops and AI servers.");
}

imageSlide("“3nm” is a nickname, not a size", "04-name-vs-real.png",
  "Compare chips by what they do (speed, battery, cost), not by the nm in their name",
  "A 2 by 4 plank of wood actually measures one and a half by three and a half inches. The name stuck from long ago. Chip names work the same way. Thirty years ago the number matched the switch size. Today the switches are about 20 nanometres long and about 48 nanometres apart, but the generations kept counting down: 7, 5, 3, 2. So 3nm just means 'the generation after 5nm'.");

imageSlide("Problem: tiny switches leak", "05-hold-the-hose.png",
  "More grip around the channel = less leaking = less wasted battery",
  "When a switch gets very small, the gate loses control and current leaks through even when it's off, like a tap that drips. Leaking wastes battery and makes heat. The fix has been to wrap the gate around the channel from more sides: one side on old flat switches, three sides on FinFETs, and all four sides on gate-all-around switches.");

// ---------------------------------------------------------------- 10. Timeline
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("When each switch design arrived", { placeholder: "title" });
  const events = [
    ["Before 2011", "Flat switches", "Gate on 1 side", HEX.slate],
    ["2011", "FinFET", "Intel first; gate on 3 sides", HEX.navy],
    ["2022", "Gate-all-around", "Samsung first; gate on 4 sides", HEX.teal],
    ["2025", "TSMC & Intel go GAA", "Used in the newest phone and AI chips", HEX.teal],
    ["2030s", "Stacked switches", "Two switches on top of each other", HEX.copper],
  ];
  s.addShape("line", { x: 0.7, y: 2.45, w: 8.6, h: 0, line: { color: HEX.line, width: 3 } });
  events.forEach(([when, what, detail, color], i) => {
    const cx = 1.1 + i * 1.95;
    s.addShape("ellipse", { x: cx - 0.2, y: 2.25, w: 0.4, h: 0.4, fill: { color }, line: { color: HEX.paper, width: 2 } });
    text(s, when, { x: cx - 0.85, y: 1.55, w: 1.7, h: 0.5, fontSize: 16, bold: true, color, align: "center", valign: "bottom" });
    text(s, what, { x: cx - 0.85, y: 2.85, w: 1.7, h: 0.6, fontSize: 15, bold: true, color: HEX.navy, align: "center" });
    text(s, detail, { x: cx - 0.85, y: 3.45, w: 1.7, h: 0.9, fontSize: 13, color: HEX.slate, align: "center" });
  });
  text(s, "Each change took about 10 years of research before reaching your phone.", { x: 0.5, y: 4.6, w: 9, h: 0.4,
    fontSize: 14, italic: true, color: HEX.copper, align: "center" });
  s.addNotes("Big structural changes are rare. FinFET lasted about ten years. Gate-all-around is the new standard for the most advanced chips. Stacking switches on top of each other is the next idea in research labs.");
}

imageSlide("How a gate-all-around switch is built", "06-layer-cake.png",
  "Build a layer cake, remove the jam, pour the gate into the gaps",
  "Engineers can't slide metal into a gap a few nanometres wide. So they grow a stack of alternating layers, silicon and a temporary material. A chemical that dissolves only the temporary layers leaves silicon sheets floating. Then the gate material is deposited one atom-thick layer at a time, so it coats every side of every sheet.");

imageSlide("Next trick: power from underneath", "07-power-in-basement.png",
  "Moving power wires below the switches saves space and wastes less electricity",
  "A chip has more than ten layers of tiny wires above the switches. Some carry data, some carry power. Sharing that space is like water pipes and internet cables crammed into the same ceiling. Backside power flips the wafer over and builds the power wiring underneath. Intel calls it PowerVia, TSMC calls it Super Power Rail.");

// ---------------------------------------------------------------- 13. Who makes them
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Only 3 companies make the newest chips", { placeholder: "title" });
  const cos = [
    ["TSMC", "Taiwan", "The world's biggest chip factory company. Makes chips for other companies.", "Customers: Apple, Nvidia, AMD, Qualcomm", HEX.tealTint],
    ["Samsung", "South Korea", "Makes its own chips and some for others. First to gate-all-around (2022).", "Customers: its own Galaxy phones, others", HEX.mist],
    ["Intel", "USA", "Famous for PC chips. Now also wants to make chips for other companies.", "Customers: its own PC and server chips", HEX.copperTint],
  ];
  cos.forEach(([name, where, what, who, fill], i) => {
    const x = 0.5 + i * 3.05;
    s.addShape("roundRect", { x, y: 1.2, w: 2.85, h: 3.4, rectRadius: 0.08, fill: { color: fill }, line: { color: fill } });
    text(s, name, { x: x + 0.2, y: 1.35, w: 2.45, h: 0.55, fontFace: "Cambria", fontSize: 26, bold: true, color: HEX.navy });
    text(s, where, { x: x + 0.2, y: 1.9, w: 2.45, h: 0.35, fontSize: 14, color: HEX.slate });
    text(s, what, { x: x + 0.2, y: 2.35, w: 2.45, h: 1.25, fontSize: 14 });
    text(s, who, { x: x + 0.2, y: 3.7, w: 2.45, h: 0.75, fontSize: 13, bold: true, color: HEX.copper });
  });
  text(s, "A company that makes chips for others is called a foundry. Most chip brands (Apple, Nvidia) design chips but don't make them.",
    { x: 0.5, y: 4.7, w: 9, h: 0.5, fontSize: 13, color: HEX.slate });
  s.addNotes("Apple and Nvidia design chips, then pay TSMC to manufacture them. That's why TSMC is one of the most important companies in the world. Building one advanced chip factory costs over 20 billion dollars.");
}

// ---------------------------------------------------------------- 14. Why it matters to you
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Why this matters to you", { placeholder: "title" });
  card(s, { x: 0.5, y: 1.2, w: 4.35, h: 3.3, fill: HEX.tealTint, title: "If you want a job in chips", titleSize: 17, bodySize: 14,
    body: "Every new switch design means new work: designing the circuits, checking they work, and making sure they don't overheat.\n\nIndia has large chip design centres for Intel, Qualcomm, Nvidia, AMD, Synopsys and Cadence." });
  card(s, { x: 5.15, y: 1.2, w: 4.35, h: 3.3, fill: HEX.copperTint, title: "If you follow the stock market", titleSize: 17, bodySize: 14,
    body: "When chips switch to a new design, these companies tend to benefit:\n\n• The factory companies (TSMC)\n• The makers of chip-making machines (ASML, Applied Materials, Lam Research)\n• The chip-design software makers (Synopsys, Cadence)" });
  text(s, "Not investment advice: just who sits where in the industry.", { x: 0.5, y: 4.65, w: 9, h: 0.35, fontSize: 12, italic: true, color: HEX.slate });
  s.addNotes("We'll go much deeper into jobs and companies in weeks 10 to 12. For now, notice that every technical change creates winners: whoever makes the machines, the factories and the software.");
}

// ---------------------------------------------------------------- 15. Word list
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Words to know, in plain English", { placeholder: "title" });
  const words = [
    ["Transistor", "A tiny on/off switch"],
    ["Gate", "The switch's control, like a tap handle"],
    ["Channel", "The path current flows through"],
    ["Nanometre (nm)", "One billionth of a metre"],
    ["Node (e.g. “3nm”)", "A chip generation's name"],
    ["FinFET", "Switch with the gate on 3 sides"],
    ["Gate-all-around", "Switch with the gate on all sides"],
    ["Backside power", "Power wires moved under the switches"],
    ["Wafer", "Thin silicon disc chips are made on"],
    ["Foundry", "A company that makes chips for others"],
  ];
  const rows = words.map(([w, m], i) => [
    { text: w, options: { bold: true, color: HEX.navy, fill: { color: i % 2 ? HEX.paper : HEX.mist } } },
    { text: m, options: { color: HEX.ink, fill: { color: i % 2 ? HEX.paper : HEX.mist } } },
  ]);
  s.addTable(rows.slice(0, 5), { x: 0.5, y: 1.2, w: 4.4, colW: [1.75, 2.65], fontFace: "Calibri", fontSize: 13,
    rowH: 0.62, valign: "middle", border: { type: "solid", color: HEX.line, pt: 0.5 }, margin: 0.08 });
  s.addTable(rows.slice(5), { x: 5.1, y: 1.2, w: 4.4, colW: [1.75, 2.65], fontFace: "Calibri", fontSize: 13,
    rowH: 0.62, valign: "middle", border: { type: "solid", color: HEX.line, pt: 0.5 }, margin: 0.08 });
  s.addNotes("Ten words cover almost everything this week. The full glossary is in notes/glossary.md.");
}

// ---------------------------------------------------------------- 16-17. Check yourself + answers
const quiz = [
  ["What is a transistor?", "A tiny on/off switch. A chip has billions of them."],
  ["Is anything on a “3nm” chip actually 3 nm?", "No. It's a generation name, like “2 × 4” wood or “iPhone 15”."],
  ["Why do tiny switches leak?", "The gate loses control of the channel, so current slips through even when it's off."],
  ["How did engineers fix leaking?", "By wrapping the gate around more sides: 1 → 3 (FinFET) → all sides (gate-all-around)."],
  ["What does backside power do?", "Moves the power wires under the switches, freeing space on top and wasting less power."],
];
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Check yourself", { placeholder: "title" });
  quiz.forEach(([q], i) => {
    const y = 1.2 + i * 0.72;
    badge(s, i + 1, 0.6, y + 0.05, 0.44, HEX.teal);
    text(s, q, { x: 1.3, y, w: 8.2, h: 0.55, fontSize: 17, valign: "middle" });
  });
  text(s, "Say your answers out loud, then check the next slide.", { x: 0.5, y: 4.8, w: 9, h: 0.35, fontSize: 13, italic: true, color: HEX.slate });
  s.addNotes("Pause here and try answering before moving on. Explaining something out loud is one of the best ways to remember it.");
}
{
  const s = pres.addSlide({ masterName: "CONTENT" });
  s.addText("Answers", { placeholder: "title" });
  quiz.forEach(([q, a], i) => {
    const y = 1.15 + i * 0.78;
    badge(s, i + 1, 0.6, y + 0.08, 0.44, HEX.teal);
    text(s, q, { x: 1.3, y, w: 8.2, h: 0.32, fontSize: 13, color: HEX.slate });
    text(s, a, { x: 1.3, y: y + 0.3, w: 8.2, h: 0.4, fontSize: 15, bold: true, color: HEX.navy });
  });
  s.addNotes("If you got four or five right, you've understood week one.");
}

// ---------------------------------------------------------------- 18. Recap
{
  const s = pres.addSlide({ masterName: "RECAP_DARK" });
  s.addText("Five things to remember", { placeholder: "title" });
  const take = [
    "A chip is billions of tiny on/off switches called transistors",
    "Smaller switches = more features, faster, longer battery, cheaper",
    "“3nm” is a generation name, not a real measurement",
    "Tiny switches leak, so the gate now wraps all the way around",
    "Power wiring is moving underneath the switches",
  ];
  take.forEach((t, i) => {
    const y = 1.45 + i * 0.62;
    badge(s, i + 1, 0.6, y, 0.42);
    text(s, t, { x: 1.2, y, w: 8.3, h: 0.42, fontSize: 17, color: HEX.paper, valign: "middle" });
  });
  text(s, "Next: listen to the Week 1 podcast  ·  Next week: how chips are printed with light", { x: 0.6, y: 4.75, w: 8.8, h: 0.35,
    fontSize: 13, color: HEX.sky });
  s.addNotes("That's week one. The podcast covers the same ideas as a conversation, so it's a good way to review on the go.");
}

writeDeck(pres, OUT);
