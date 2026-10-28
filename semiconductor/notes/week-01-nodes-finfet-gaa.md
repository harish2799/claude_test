# Week 1 — Node names vs. real dimensions, and FinFET → GAA

**Level:** EE / VLSI background. **Time:** ~2 h reading + 30 min exercises + quiz.

**After this week you should be able to:**
1. Explain why "3nm" is a product name, not a physical dimension, and say which metrics actually describe a node.
2. Explain the electrostatic reason the industry moved planar → FinFET → gate-all-around (GAA).
3. Walk through how a nanosheet transistor is built and name the hard process steps.
4. Explain backside power delivery and what it changes for physical design.
5. Connect all of this to the 2nm-class race (TSMC, Intel, Samsung) and to your career and investing goals.

---

## 1. "3nm" is a brand, not a dimension

Until the mid-1990s, the node name roughly tracked the transistor's gate length. After that the two drifted apart. Gate length stopped shrinking much (around 15–20 nm today) because of leakage and variability, but density kept improving through other tricks. Each new node kept the ~0.7× naming step (`28 → 20 → 14/16 → 10 → 7 → 5 → 3 → 2`) because customers and investors expected it.

**The numbers that actually describe a node:**

| Metric | What it is | Why it matters |
|---|---|---|
| **CPP** (contacted poly pitch, also called gate pitch) | Distance between neighbouring gates, including the contact between them | Sets the horizontal size of standard cells |
| **MMP** (minimum metal pitch) | Tightest line + space on the lowest metal layers | Sets cell height and routing density |
| **Cell height** | `tracks × MMP`, e.g. 6 tracks × 23 nm ≈ 138 nm | Smaller cells give more logic per mm² |
| **Logic density** | Million transistors per mm² (MTr/mm²); one common version is Mark Bohr's `0.6 × NAND2 density + 0.4 × scan flip-flop density` | One number for comparing processes, though libraries and real designs vary a lot |
| **SRAM bit-cell area** | µm² per 6T cell | SRAM has scaled far worse than logic lately, which is a big deal for caches and AI chips |

**Rough reported pitches** (published or analyst figures; they differ by source and by version, so use them for scale, not as specs):

| Node | CPP (nm) | MMP (nm) |
|---|---|---|
| Intel 22nm (2011, first FinFET) | ~90 | ~80 |
| Intel 14nm | ~70 | ~52 |
| TSMC N7 | ~57 | ~40 |
| TSMC N5 | ~51 | ~28 |
| TSMC N3E | ~48 | ~23 |
| TSMC N2 (GAA) | mid-40s | low-20s (estimates) |

Notice that **CPP has barely moved since N5**. Recent density gains come mostly from **DTCO (design-technology co-optimisation)**, not from shrinking pitches:
- **Fewer tracks per cell:** 9T → 7.5T → 6T → ~5T cell heights.
- **Fin depopulation:** 3 → 2 → 1 fins per device in the densest cells.
- **Contact over active gate (COAG)** and **single diffusion break:** these save area at cell edges and over the gate.
- **Buried / backside power rails:** these free up tracks that were spent on power (section 4).

> **Takeaway:** when you compare "Intel 18A vs TSMC N2 vs Samsung SF2", don't compare the names. Compare density, performance per watt, SRAM cell size, yield, and wafer cost. Intel renamed its nodes in 2021 (10nm Enhanced SuperFin → "Intel 7") partly to line up with the industry's naming.

---

## 2. Why the transistor structure keeps changing: electrostatics

The gate has to control the channel better than the drain does. When the gate length gets short:
- The drain field reaches into the channel. This causes **DIBL** (drain-induced barrier lowering) and **Vt roll-off**.
- **Subthreshold swing (SS)** gets worse than the ideal `(kT/q)·ln10 ≈ 60 mV/decade` at 300 K. A worse SS means more off-state leakage at the same Vt, or a higher Vt at the same leakage, which forces a higher VDD.

A rough measure is the **natural (electrostatic) length**: approximately `λ ≈ √(ε_si · t_si · t_ox / (N · ε_ox))`. Here `N` is the effective number of gates around the channel. The gate length needs to be several λ for good control. So you can:
- make the silicon body thinner (`t_si`),
- use a thinner, higher-k gate dielectric (`t_ox`, ε), or
- **wrap more gate around the channel (`N`)**. This is the planar → FinFET → GAA story.

| Structure | Gate wraps | Used from | Notes |
|---|---|---|---|
| Planar bulk MOSFET | 1 side | — to 28/20nm | Body too thick for short gates |
| FD-SOI (planar) | 1 side, thin body + back bias | 28/22nm (ST, GF, Samsung) | Niche: low power, RF, automotive |
| **FinFET** | 3 sides | Intel 22nm (2011); TSMC 16nm, Samsung 14nm (~2015) → N3 | Dominant for about 10 years |
| **GAA nanosheet** | 4 sides | Samsung SF3 (2022), TSMC N2, Intel 18A ("RibbonFET") | Current leading edge |
| Forksheet | 3 sides plus a dielectric wall between n and p | Research (imec) | Tighter n-to-p spacing |
| **CFET** (complementary FET) | nFET stacked on pFET | Research; expected in the 2030s | Roughly halves the cell footprint |

### FinFET limits
- **Drive is quantised.** Effective width per fin is `W ≈ 2·H_fin + W_fin`, so device strength comes in whole fins only (1, 2, 3...). Designers can't size a transistor continuously.
- To get more current, fins got **taller and thinner** (fin width ~5–7 nm). That pushes against mechanical stability, variability and etch limits.
- Fin depopulation to 1 fin per device left little room to grow drive further.

### GAA nanosheet answers
- The gate surrounds each sheet, which gives the best electrostatics and allows a **shorter gate length** at the same leakage.
- Usually **3–4 sheets stacked vertically** share one footprint. Effective width is `W_eff ≈ N_sheets × 2·(W_sheet + T_sheet)`.
- **Sheet width can vary per device.** Designers get back continuous sizing: narrow sheets for dense, low-power cells and wide sheets for high-performance cells.

---

## 3. How a nanosheet transistor is built (simplified flow)

1. **Si / SiGe superlattice epitaxy.** Grow alternating layers, e.g. 3× (SiGe ~10 nm / Si ~5 nm). The Si layers become channels; the SiGe layers are sacrificial.
2. **Pattern the stack into fins**, like a FinFET, but each fin is now a layered stack.
3. **Build a dummy (poly) gate and gate spacers.**
4. **Recess the source/drain areas**, then **etch the SiGe sideways and fill the gaps with dielectric to form inner spacers.** This is one of the hardest new steps. Inner spacers cut gate-to-source/drain capacitance, and their thickness must be controlled to about a nanometre.
5. **Grow the source/drain epitaxy** (SiP for nMOS, SiGe:B for pMOS) from the exposed sheet edges.
6. **Remove the dummy gate, then do the channel release:** etch away the SiGe layers selectively, leaving suspended Si sheets.
7. **Replacement metal gate:** deposit the interface oxide, the high-k dielectric (HfO₂), and the work-function metals **all the way around and between the sheets** using ALD. The gap between sheets is ~10 nm, so there is little room for several work-function metal stacks. That makes offering many **Vt flavours** harder.
8. **Contacts and back-end-of-line (BEOL) interconnect.**

**Why this matters for the equipment industry:** GAA needs more **epitaxy, selective/isotropic etch, ALD and metrology** steps than FinFET. That is a big part of why Applied Materials, Lam Research, Tokyo Electron, ASM International and KLA talk up GAA as a growth driver. ASML's EUV is needed for the patterning, but much of the *new* spending goes to deposition and etch.

---

## 4. Backside power delivery (BSPDN)

Traditionally signal wiring and power wiring share the **front-side** metal stack. At small pitches this causes two problems:
- **IR drop:** thin wires at the bottom of the stack carry the supply current.
- **Routing congestion:** power rails use up tracks inside every standard cell.

**Backside power** moves the power network beneath the transistors:
1. Build the transistors and the front-side signal interconnect.
2. Bond the wafer face-down to a carrier wafer.
3. Thin the original wafer down to nearly the device layer.
4. Build the power network on the back, connected by **nano-TSVs** or **direct backside contacts** to source/drain.

| Company | Name | Approach |
|---|---|---|
| Intel | **PowerVia** (with 18A) | Nano-TSVs to the device layer |
| TSMC | **Super Power Rail** (A16, after N2) | Direct contact to source/drain; more complex, more area benefit |
| imec / research | Buried power rail (BPR) + BSPDN | Intermediate step |

**What changes for a physical-design or VLSI engineer:**
- Less IR drop and more front-side routing tracks lead to better density and frequency.
- The power-grid design, IR/EM sign-off, and the PDK and EDA flow all change.
- **Thermal:** thinning the silicon removes some of the heat-spreading path, so hotspots get worse.
- **Debug and failure analysis:** the traditional backside optical probing now has to go through the power network.

---

## 5. Big picture: what to watch in 2025–2027

- **TSMC N2:** TSMC's first GAA node, ramping 2025–2026. Apple, AMD and other high-performance customers come first. **A16** adds backside power.
- **Intel 18A:** RibbonFET plus PowerVia. This is the first time Intel ships both together, and it is the test of whether Intel Foundry can win outside customers.
- **Samsung SF2:** Samsung was first to GAA (SF3, 2022) but has struggled with yield and customer wins. Watch for whether that turns around.
- **SRAM scaling has nearly stalled.** It drives the move to **chiplets**, where cache goes on a cheaper die, and to stacked cache. You'll see this in Week 5.
- **Interconnect resistance:** at ~20 nm metal pitches, copper with barrier layers gets very resistive. Research on ruthenium, molybdenum and other metals is active. Many people now see BEOL wiring, not the transistor, as the real limiter.

**Career angle (design, verification, AI hardware):** GAA and backside power create demand for **standard-cell library design and characterisation**, **DTCO engineers**, **PDK and flow developers**, and **IR/EM, thermal and power-integrity sign-off** specialists. These sit at the boundary between process and design, which suits an EE/VLSI profile. Indian design centres of Synopsys, Cadence, Qualcomm, Nvidia, AMD and Intel do much of this work.

**Investing angle:** leading-edge transitions raise **wafer prices** (the foundry captures value), **equipment intensity** (deposition, etch and metrology vendors gain), and **EDA content** (more complex sign-off). The risk to watch is **yield ramp**: a delayed or low-yield ramp hits foundry margins and customers' launch schedules.

---

## Exercises (≈30 min)

1. **Cell height.** A library uses 6-track cells at MMP = 23 nm. What is the cell height? If DTCO moves it to 5 tracks at the same pitch, what percentage of area do you save, assuming the same cell width?
2. **Effective width.** Compare (a) a 2-fin FinFET with H_fin = 50 nm and W_fin = 6 nm, with (b) a 3-sheet nanosheet with W_sheet = 30 nm and T_sheet = 5 nm. Which has more effective width? What is the rough footprint of each, if fin pitch is ~30 nm?
3. **Subthreshold swing.** A device has SS = 75 mV/dec. To cut off-state leakage 10×, how much must Vt rise? What about at the ideal 60 mV/dec?
4. **Think it through.** Why does a limited space for work-function metals between sheets make it harder to offer 4–5 Vt flavours (uLVT, LVT, SVT, HVT...)? What could a library designer do instead?

<details>
<summary>Answers</summary>

1. 6 × 23 = **138 nm**. 5 × 23 = 115 nm. Saving = 1 − 115/138 ≈ **16.7%**.
2. (a) 2 × (2·50 + 6) = **212 nm**. (b) 3 × 2·(30 + 5) = **210 nm**. They are about the same. The footprints are also similar: two fins span roughly one fin pitch plus one fin width ≈ 36 nm, against a 30 nm-wide sheet stack. The win for GAA is better gate control and **adjustable width** (you could choose 15 nm or 45 nm sheets), not raw current per footprint.
3. One decade of current at 75 mV/dec needs a **75 mV** higher Vt. At 60 mV/dec it needs **60 mV**. A steeper slope gives the same leakage at lower Vt, and so a lower VDD.
4. Each Vt flavour usually needs a different work-function metal stack or thickness. With ~10 nm between sheets there's no room for thick or multiple metal layers, and they must fill the gap evenly. Options: fewer Vt flavours plus **gate-length biasing**, **sheet-width selection**, body-bias alternatives, and using dipole or doping techniques to shift Vt.
</details>

---

## Quiz (10 questions)

1. Name three metrics that describe a process node better than its marketing name.
2. What is DTCO? Give two examples of it.
3. What is the ideal subthreshold swing at room temperature, and where does it come from?
4. Why can't FinFETs be sized continuously?
5. In a nanosheet process, what are the SiGe layers for?
6. What do inner spacers do, and why are they hard to make?
7. Which companies call their GAA transistors "MBCFET" and "RibbonFET"?
8. Name two benefits and two challenges of backside power delivery.
9. Why does slowing SRAM scaling push the industry toward chiplets?
10. Which kinds of equipment vendors benefit most from the switch to GAA, and why?

<details>
<summary>Answers</summary>

1. CPP (gate pitch), minimum metal pitch, logic density in MTr/mm², SRAM bit-cell area. Cell height (tracks × MMP) also counts.
2. Design-technology co-optimisation: changing the process and the cell/layout rules together. Examples: track-height reduction, fin depopulation, COAG, single diffusion break, buried or backside power rails.
3. ≈ 60 mV/decade, from `(kT/q)·ln(10)`: the Boltzmann distribution of carriers over the source barrier.
4. Effective width comes in whole fins (`2·H_fin + W_fin` per fin), so drive strength comes in fixed steps.
5. They are sacrificial spacers between the Si channels. They are etched away selectively in the channel-release step so the gate can wrap all around each sheet.
6. They isolate the gate from source/drain between the sheets, cutting parasitic capacitance. They need a lateral SiGe recess and dielectric fill controlled to about a nanometre, which is hard to make uniform.
7. MBCFET (multi-bridge-channel FET): Samsung. RibbonFET: Intel.
8. Benefits: lower IR drop, more front-side routing tracks and better density, easier power delivery for high-current AI chips. Challenges: wafer bonding and thinning, nano-TSV or backside contact processing, hotspots from losing silicon heat spreading, new debug/FA methods, EDA and PDK flow changes.
9. If the SRAM cell barely shrinks at a new node, putting large caches on the expensive leading-edge die wastes money. Splitting cache or I/O onto cheaper-node chiplets, or stacking it (like AMD 3D V-Cache), keeps cost down.
10. Epitaxy, selective etch, ALD/deposition and metrology/inspection vendors (Applied Materials, Lam Research, Tokyo Electron, ASM International, KLA). GAA adds many such steps, like the superlattice epi, inner-spacer recess, channel release and conformal gate stack.
</details>

---

## Further reading
- **IRDS** (International Roadmap for Devices and Systems): "More Moore" chapter.
- **imec** research pages on nanosheet, forksheet, CFET and backside power.
- **WikiChip Fuse:** node-by-node pitch and density write-ups.
- **IEDM and VLSI Symposium papers** from TSMC, Intel and Samsung on their 2nm-class processes. This is where real pitch and density numbers are first published.
- **Semiconductor Engineering** knowledge-centre articles on GAA and backside power.

*The tracker's daily brief will link news to this week's topics under "Learn one thing".*
