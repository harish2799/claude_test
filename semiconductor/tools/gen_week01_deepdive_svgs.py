"""Generate the week 1 deep-dive illustrations as SVG.

Usage: python tools/gen_week01_deepdive_svgs.py
Writes weekly/week-01/images/src/1x-*.svg; render to PNG with tools/render_images.js.
Computed figures (the I-V curve, oblique 3D boxes, the 8-step process flow) are
easier to keep accurate in code than by hand.
"""

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "weekly" / "week-01" / "images" / "src"

NAVY, INK, COPPER, TEAL, AMBER = "#0B1F33", "#14202E", "#C8763A", "#2A9D8F", "#E9C46A"
SLATE, SKY, RED, MIST, LINE = "#5B7083", "#8FB8DE", "#B23A48", "#EEF2F6", "#D5DDE5"
BLUE, TEAL_T, COPPER_T, SPACER, POLY = "#2E86C1", "#DDF1EE", "#F6E7DA", "#C9D1D9", "#9AA6B2"
FONT = "Liberation Sans, Arial, sans-serif"


def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" font-family="{FONT}">\n'
            f'<defs><marker id="ah" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" '
            f'refX="12" refY="7" orient="auto-start-reverse"><path d="M0,0 L14,7 L0,14 z" fill="{INK}"/></marker>'
            f'<marker id="ahc" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" refX="12" refY="7" '
            f'orient="auto-start-reverse"><path d="M0,0 L14,7 L0,14 z" fill="{RED}"/></marker></defs>\n'
            f'<rect width="{w}" height="{h}" fill="#FFFFFF"/>\n' + "\n".join(body) + "\n</svg>\n")


def R(x, y, w, h, fill, stroke=None, sw=0, rx=0, op=1, dash=None):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    d = f' stroke-dasharray="{dash}"' if dash else ""
    o = f' opacity="{op}"' if op != 1 else ""
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}"{s}{d}{o}/>'


def T(x, y, s, size=18, fill=INK, anchor="start", bold=False, italic=False):
    b = ' font-weight="bold"' if bold else ""
    i = ' font-style="italic"' if italic else ""
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"{b}{i}>{s}</text>'


def L(x1, y1, x2, y2, stroke=INK, sw=2, dash=None, arrow=False, both=False, red=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = "ahc" if red else "ah"
    a = (f' marker-end="url(#{m})"' if arrow else "") + (f' marker-start="url(#{m})"' if both else "")
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{sw}"{d}{a}/>'


def P(points, fill, stroke=None, sw=0, op=1):
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in points)
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    o = f' opacity="{op}"' if op != 1 else ""
    return f'<polygon points="{pts}" fill="{fill}"{s}{o}/>'


def dots(x, y, w, h, n_cols, n_rows, r=4, fill=NAVY):
    out = []
    for i in range(n_cols):
        for j in range(n_rows):
            out.append(f'<circle cx="{x + (i + 0.5) * w / n_cols:.1f}" cy="{y + (j + 0.5) * h / n_rows:.1f}" r="{r}" fill="{fill}"/>')
    return out


def card(x, y, w, h, fill=MIST):
    return R(x, y, w, h, fill, rx=18)


def shade(hex_color, f):
    c = [int(hex_color[i:i + 2], 16) for i in (1, 3, 5)]
    c = [max(0, min(255, int(v * f))) for v in c]
    return "#" + "".join(f"{v:02X}" for v in c)


def box(x, y, w, h, depth, color, op=1, stroke=None):
    """Oblique 3D box; (x, y, w, h) is the front face, depth goes up-right."""
    dx, dy = depth * 0.6, -depth * 0.4
    return [
        P([(x, y), (x + dx, y + dy), (x + w + dx, y + dy), (x + w, y)], shade(color, 1.15), stroke, 1, op),
        P([(x + w, y), (x + w + dx, y + dy), (x + w + dx, y + h + dy), (x + w, y + h)], shade(color, 0.8), stroke, 1, op),
        R(x, y, w, h, color, stroke, 1 if stroke else 0, op=op),
    ]


def shift(x, y, depth):
    return x + depth * 0.6, y - depth * 0.4


# --------------------------------------------------------------------------- 11
def fig_mosfet():
    b = [T(700, 42, "Inside a real transistor (MOSFET), cut open from the side", 28, NAVY, "middle", True),
         T(700, 74, "Threshold voltage (Vt) ≈ 0.25–0.35 V: the gate voltage at which the channel appears", 19, SLATE, "middle")]
    for k, on in enumerate((False, True)):
        x0 = 30 + k * 690
        b.append(card(x0, 90, 650, 530, TEAL_T if on else MIST))
        b.append(T(x0 + 325, 132, "ON: gate at +0.7 V" if on else "OFF: gate at 0 V", 26, NAVY, "middle", True))
        b.append(R(x0 + 30, 330, 590, 230, "#E4DCEB"))
        b.append(T(x0 + 325, 550, "p-type silicon body (almost no free electrons)", 16, SLATE, "middle"))
        for sx in (x0 + 30, x0 + 450):
            b.append(R(sx, 330, 170, 95, SKY, rx=10))
            b += dots(sx + 10, 340, 150, 70, 8, 3, 4)
        b.append(T(x0 + 115, 450, "n+ source", 17, NAVY, "middle", True))
        b.append(T(x0 + 115, 470, "(full of free electrons)", 14, SLATE, "middle"))
        b.append(T(x0 + 535, 450, "n+ drain", 17, NAVY, "middle", True))
        b.append(R(x0 + 200, 318, 250, 12, "#B9C3CC"))
        b.append(R(x0 + 200, 250, 250, 68, COPPER, rx=4))
        b.append(T(x0 + 325, 292, "GATE", 22, "#FFFFFF", "middle", True))
        b.append(L(x0 + 215, 323, x0 + 195, 290, INK, 1.5))
        b.append(T(x0 + 190, 285, "oxide ~1 nm", 14, INK, "end"))
        # terminals
        b.append(L(x0 + 90, 330, x0 + 90, 205, INK, 3))
        b.append(T(x0 + 90, 195, "Source 0 V", 17, INK, "middle", True))
        b.append(L(x0 + 325, 250, x0 + 325, 180, INK, 3))
        b.append(T(x0 + 325, 170, "Gate +0.7 V" if on else "Gate 0 V", 17, COPPER if on else INK, "middle", True))
        b.append(L(x0 + 560, 330, x0 + 560, 205, INK, 3))
        b.append(T(x0 + 560, 195, "Drain +0.7 V", 17, INK, "middle", True))
        if on:
            b.append(R(x0 + 200, 330, 250, 16, BLUE))
            b += dots(x0 + 205, 330, 240, 16, 14, 1, 3, "#FFFFFF")
            b.append(L(x0 + 230, 375, x0 + 420, 375, BLUE, 4, arrow=True))
            b.append(T(x0 + 325, 400, "electrons flow →", 16, BLUE, "middle", True))
            b.append(T(x0 + 325, 500, "Gate voltage pulls electrons to the surface:", 17, INK, "middle"))
            b.append(T(x0 + 325, 522, "a ~1–2 nm thin channel connects source and drain", 17, INK, "middle"))
            b.append(T(x0 + 325, 602, "Channel formed: switch ON (1)", 20, TEAL, "middle", True))
        else:
            b.append(T(x0 + 325, 380, "no channel", 18, RED, "middle", True))
            b.append(T(x0 + 325, 505, "The p-type region blocks electrons", 17, INK, "middle"))
            b.append(T(x0 + 325, 602, "No path: switch OFF (0)", 20, RED, "middle", True))
    return svg(1400, 640, b)


# --------------------------------------------------------------------------- 12
def fig_idvg():
    X0, X1, YT, YB = 170, 1000, 110, 550
    def X(v): return X0 + v / 0.8 * (X1 - X0)
    def Y(lg): return YT + (-4 - lg) * (YB - YT) / 8
    def good(v): return -11 + v / 0.065 if v < 0.3 else -4.4 - 1.985 * math.exp(-(v - 0.3) / 0.12)
    def leaky(v): return -8.8 + v / 0.095 if v < 0.25 else -4.45 - 1.72 * math.exp(-(v - 0.25) / 0.11)
    b = [T(700, 42, "The switch's report card: current vs gate voltage (log scale)", 28, NAVY, "middle", True)]
    labels = ["100 µA", "10 µA", "1 µA", "100 nA", "10 nA", "1 nA", "100 pA", "10 pA", "1 pA"]
    for i, lab in enumerate(labels):
        y = Y(-4 - i)
        b.append(L(X0, y, X1, y, LINE, 1))
        b.append(T(X0 - 10, y + 6, lab, 15, SLATE, "end"))
    for v in (0, 0.2, 0.4, 0.6, 0.8):
        b.append(L(X(v), YT, X(v), YB, LINE, 1))
        b.append(T(X(v), YB + 26, f"{v:.1f}", 16, SLATE, "middle"))
    b.append(T((X0 + X1) / 2, YB + 56, "Gate voltage (V)", 18, INK, "middle", True))
    b.append(f'<text x="40" y="{(YT + YB) / 2}" font-size="17" fill="{INK}" font-weight="bold" text-anchor="middle" '
             f'transform="rotate(-90 40 {(YT + YB) / 2})">Current (each line = 10× more)</text>')
    b.append(L(X0, YT, X0, YB, INK, 2))
    b.append(L(X0, YB, X1, YB, INK, 2))
    for fn, col in ((leaky, RED), (good, TEAL)):
        pts = " ".join(f"{X(v):.1f},{Y(fn(v)):.1f}" for v in [i / 200 for i in range(161)])
        b.append(f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="5"/>')
    b.append(L(X(0.3), YT, X(0.3), YB, SLATE, 2, dash="8 6"))
    b.append(T(X(0.3) + 8, YB - 12, "Vt ≈ 0.3 V", 16, SLATE, bold=True))
    b.append(L(X(0.7), YT, X(0.7), YB, SLATE, 2, dash="8 6"))
    b.append(T(X(0.7) - 8, YB - 12, "VDD = 0.7 V", 16, SLATE, "end", True))
    # slope triangle on the good curve
    v1, v2 = 0.1, 0.165
    b.append(L(X(v1), Y(good(v1)), X(v2), Y(good(v1)), INK, 2))
    b.append(L(X(v2), Y(good(v1)), X(v2), Y(good(v2)), INK, 2))
    b.append(T(X(v2) + 10, Y(good(v1)) - 10, "65 mV more → 10× current", 15, INK, bold=True))
    # Ioff markers
    b.append(f'<circle cx="{X(0)}" cy="{Y(good(0))}" r="8" fill="{TEAL}"/>')
    b.append(f'<circle cx="{X(0)}" cy="{Y(leaky(0))}" r="8" fill="{RED}"/>')
    b.append(T(X(0) + 16, Y(good(0)) + 22, "OFF leak ≈ 10 pA", 15, TEAL, bold=True))
    b.append(L(X(0) + 6, Y(leaky(0)) - 8, X(0) + 40, 186, RED, 1.5))
    b.append(T(X(0) + 44, 182, "OFF leak ≈ 1.6 nA (160× worse)", 15, RED, bold=True))
    b.append(f'<circle cx="{X(0.7)}" cy="{Y(good(0.7))}" r="8" fill="{TEAL}"/>')
    b.append(T(X(0.7) - 12, Y(good(0.7)) - 14, "ON current", 15, TEAL, "end", True))
    # explanation panel
    px = 1040
    b.append(card(px, 100, 340, 470))
    b.append(T(px + 20, 140, "How to read it", 21, NAVY, bold=True))
    lines = [("Left dot = OFF leak", INK, True), ("current when the switch", SLATE, False), ("should be off", SLATE, False),
             ("Right dot = ON current", INK, True), ("how strongly it switches on", SLATE, False),
             ("Steepness = control", INK, True), ("best possible at room temp:", SLATE, False),
             ("60 mV per 10× current", SLATE, False)]
    y = 180
    for s, c, bold in lines:
        b.append(T(px + 20, y, s, 17, c, bold=bold))
        y += 26 if not bold else 26
        if s.endswith("off") or s.startswith("how"):
            y += 14
    b.append(R(px + 20, 438, 26, 8, TEAL)); b.append(T(px + 56, 446, "well-controlled switch", 16))
    b.append(R(px + 20, 470, 26, 8, RED)); b.append(T(px + 56, 478, "short, poorly controlled", 16))
    b.append(T(px + 20, 520, "Same ON current, but the red", 16, INK))
    b.append(T(px + 20, 543, "one leaks far more when OFF", 16, INK))
    return svg(1400, 640, b)


# --------------------------------------------------------------------------- 13
def fig_dam():
    b = [T(700, 42, "Why short switches leak: think of electrons as water held back by a dam", 27, NAVY, "middle", True)]
    for k, short in enumerate((False, True)):
        x0 = 30 + k * 690
        b.append(card(x0, 70, 650, 540, COPPER_T if short else MIST))
        b.append(T(x0 + 325, 112, "Short channel: the drain lowers the dam" if short else "Long channel: the gate holds the dam",
                   23, NAVY, "middle", True))
        a = x0 + 50
        if short:
            hump = f"M{a},380 L{a + 190},380 C{a + 230},380 {a + 240},320 {a + 270},320 C{a + 300},320 {a + 310},470 {a + 350},470 L{a + 550},470"
        else:
            hump = f"M{a},380 L{a + 150},380 C{a + 210},380 {a + 210},230 {a + 275},230 C{a + 340},230 {a + 340},470 {a + 400},470 L{a + 550},470"
        b.append(f'<path d="{hump} L{a + 550},560 L{a},560 Z" fill="#E4DCEB"/>')
        b.append(f'<path d="{hump}" fill="none" stroke="{NAVY}" stroke-width="5"/>')
        wl = 340
        b.append(R(a, wl, 190 if short else 160, 380 - wl, BLUE, op=0.85))
        b += dots(a + 5, wl + 5, 150, 30, 8, 2, 4, "#FFFFFF")
        b.append(T(a + 75, 410, "Source", 19, NAVY, "middle", True))
        b.append(T(a + 75, 432, "electrons waiting", 15, SLATE, "middle"))
        b.append(T(a + 470, 500, "Drain", 19, NAVY, "middle", True))
        b.append(T(a + 470, 522, "(lower = higher voltage)", 14, SLATE, "middle"))
        b.append(L(a - 20, 560, a - 20, 160, INK, 2, arrow=True))
        b.append(f'<text x="{a - 30}" y="360" font-size="15" fill="{INK}" text-anchor="middle" transform="rotate(-90 {a - 30} 360)">electron energy</text>')
        if short:
            for i, (dx, dy) in enumerate(((235, 300), (262, 290), (292, 330), (320, 400))):
                b.append(f'<path d="M{a + dx},{dy} q-7,12 0,17 q7,-5 0,-17 z" fill="{BLUE}"/>')
            b.append(T(a + 275, 270, "barrier lower + thinner", 17, RED, "middle", True))
            b.append(L(a + 470, 450, a + 330, 360, RED, 3, arrow=True, red=True))
            b.append(T(a + 480, 300, "drain voltage pulls", 16, RED, "middle", True))
            b.append(T(a + 480, 320, "the dam down (DIBL)", 16, RED, "middle", True))
            b.append(T(x0 + 325, 590, "Electrons spill over even when the gate says OFF = leakage", 17, INK, "middle"))
        else:
            b.append(T(a + 275, 210, "barrier height set by the gate", 17, COPPER, "middle", True))
            b.append(T(x0 + 325, 590, "Gate is in charge: no water spills when OFF", 17, INK, "middle"))
    return svg(1400, 640, b)


# --------------------------------------------------------------------------- 14
def fig_layout():
    b = [T(700, 40, "Measuring a node: a standard cell seen from above", 28, NAVY, "middle", True),
         T(700, 70, "Chips are built from 'standard cells' (small Lego bricks for logic). Their size is set by two pitches.", 18, SLATE, "middle")]
    # left: transistor layer
    b.append(card(30, 90, 650, 520))
    b.append(T(355, 128, "Transistor layer: fins + gates", 22, NAVY, "middle", True))
    for y in (220, 255, 430, 465):
        b.append(R(60, y, 590, 16, TEAL, rx=3))
    for i in range(5):
        b.append(R(120 + i * 110, 175, 26, 350, COPPER, rx=3))
    b.append(L(133, 160, 243, 160, INK, 2.5, arrow=True, both=True))
    b.append(T(188, 150, "CPP (gate pitch) ≈ 48 nm", 16, INK, "start", True))
    b.append(T(408, 320, "pMOS", 15, TEAL, "middle", True))
    b.append(T(408, 410, "nMOS", 15, TEAL, "middle", True))
    b.append(T(355, 560, "Copper = gates (switch controls)   Teal = fins (channels)", 16, INK, "middle"))
    b.append(T(355, 588, "Fewer fins per transistor = smaller cell (fin depopulation)", 15, SLATE, "middle", italic=True))
    # right: metal layer
    b.append(card(720, 90, 650, 520))
    b.append(T(1045, 128, "First metal layer above it", 22, NAVY, "middle", True))
    top, pitch = 155, 58
    for k in range(7):
        yc = top + k * pitch
        if k in (0, 6):
            b.append(R(830, yc - 15, 480, 30, NAVY, rx=3))
            b.append(T(1070, yc + 6, "VDD power rail" if k == 0 else "VSS (ground) rail", 15, "#FFFFFF", "middle", True))
        else:
            b.append(R(830, yc - 11, 480, 22, SKY, rx=3))
    b.append(L(1330, top + pitch, 1330, top + 2 * pitch, INK, 2.5, arrow=True, both=True))
    b.append(T(1338, top + 1.5 * pitch + 6, "MMP", 15, INK, bold=True))
    b.append(T(1338, top + 1.5 * pitch + 24, "≈23nm", 13, INK))
    b.append(L(805, top, 805, top + 6 * pitch, INK, 2.5, arrow=True, both=True))
    b.append(f'<text x="790" y="{top + 3 * pitch}" font-size="16" fill="{INK}" font-weight="bold" text-anchor="middle" '
             f'transform="rotate(-90 790 {top + 3 * pitch})">cell height = 6 tracks</text>')
    b.append(T(1045, 560, "Cell height = tracks × MMP = 6 × 23 ≈ 138 nm", 17, INK, "middle", True))
    b.append(T(1045, 588, "Light blue = wiring tracks for signals", 15, SLATE, "middle", italic=True))
    return svg(1400, 630, b)


# --------------------------------------------------------------------------- 15
def fig_3d():
    b = [T(700, 40, "FinFET vs nanosheet in 3D (not to scale)", 28, NAVY, "middle", True),
         T(700, 70, "Current flows into the page along the fin / sheets. The gate crosses over like a bridge.", 18, SLATE, "middle")]
    b.append(card(20, 90, 670, 530))
    b.append(T(355, 128, "FinFET: gate wraps 3 sides", 23, NAVY, "middle", True))
    b += box(80, 440, 420, 50, 180, SLATE)
    b += box(300, 260, 44, 180, 260, TEAL)
    gx, gy = shift(240, 230, 100)
    b += box(gx, gy, 170, 440 - 230 + 0, 70, COPPER, op=0.92)
    b += box(300, 260, 44, 180, 100, TEAL)
    b.append(L(285, 262, 285, 438, INK, 2, arrow=True, both=True))
    b.append(T(278, 355, "H ≈ 50 nm", 15, INK, "end", True))
    b.append(L(300, 520, 344, 520, INK, 2, arrow=True, both=True))
    b.append(T(322, 545, "W ≈ 6 nm", 15, INK, "middle", True))
    b.append(L(540, 230, 430, 250, INK, 1.5))
    b.append(T(545, 228, "gate", 16, COPPER, bold=True))
    b.append(L(540, 330, 345, 340, INK, 1.5))
    b.append(T(545, 328, "fin", 16, TEAL, bold=True))
    b.append(T(545, 348, "(channel)", 14, TEAL))
    b.append(T(355, 585, "Width per fin = 2·H + W = 2·50 + 6 = 106 nm", 18, INK, "middle", True))
    b.append(T(355, 607, "Only whole fins: 1, 2, 3... (drive comes in steps)", 15, SLATE, "middle", italic=True))

    b.append(card(710, 90, 670, 530, TEAL_T))
    b.append(T(1045, 128, "Nanosheet: gate wraps every side", 23, NAVY, "middle", True))
    b += box(770, 450, 420, 40, 180, SLATE)
    sheets = [(880, y) for y in (300, 350, 400)]
    for x, y in sheets:
        b += box(x, y, 150, 22, 260, TEAL)
    gx, gy = shift(850, 250, 100)
    b += box(gx, gy, 210, 200, 70, COPPER, op=0.92)
    for x, y in sheets:
        b += box(x, y, 150, 22, 100, TEAL)
    b.append(L(880, 520, 1030, 520, INK, 2, arrow=True, both=True))
    b.append(T(955, 545, "sheet width ≈ 30 nm (designer can choose)", 15, INK, "middle", True))
    b.append(L(1045, 300, 1045, 322, INK, 2))
    b.append(L(1040, 311, 1110, 280, INK, 1.5))
    b.append(T(1115, 280, "≈ 5 nm thick", 15, INK, bold=True))
    b.append(T(1045, 585, "Width = 3 × 2·(30 + 5) = 210 nm", 18, INK, "middle", True))
    b.append(T(1045, 607, "Similar width to 2 fins, but better control + any width", 15, SLATE, "middle", italic=True))
    return svg(1400, 640, b)


# --------------------------------------------------------------------------- 16
def fig_process():
    titles = ["1. Grow layer cake", "2. Dummy gate + spacers", "3. Cut away the sides", "4. Inner spacers",
              "5. Grow source & drain", "6. Remove dummy + SiGe", "7. Fill real gate", "8. Add contacts"]
    captions = [("Si and SiGe layers,", "each a few nm thick"), ("a placeholder 'gate' marks", "where the real one goes"),
                ("etch the stack away except", "under the dummy gate"), ("notch SiGe ends, fill with", "insulator (nm precision)"),
                ("crystal grows out from", "the sheet edges"), ("selective etch eats SiGe:", "sheets now float"),
                ("high-k + metal coat every", "sheet, atom layer by layer"), ("metal plugs connect", "S, D and gate to wires")]
    hard = {3, 5, 6}
    b = [T(700, 34, "Building a nanosheet transistor: the 8 main steps (side view, current flows left → right)", 25, NAVY, "middle", True)]
    lx = 330
    for col, lab in ((TEAL, "Si (channel)"), (AMBER, "SiGe (temporary)"), (POLY, "dummy gate"), (SPACER, "spacer"),
                     (BLUE, "source/drain"), (COPPER, "real gate"), (NAVY, "contact")):
        b.append(R(lx, 50, 20, 16, col)); b.append(T(lx + 26, 64, lab, 14)); lx += 26 + len(lab) * 7.4 + 22
    for i in range(8):
        px, py = 20 + (i % 4) * 345, 85 + (i // 4) * 320
        b.append(R(px, py, 330, 305, COPPER_T if i in hard else MIST, COPPER if i in hard else None, 2 if i in hard else 0, rx=14))
        b.append(T(px + 15, py + 32, titles[i], 18, NAVY, bold=True))
        if i in hard:
            b.append(R(px + 255, py + 14, 62, 24, COPPER, rx=12))
            b.append(T(px + 286, py + 31, "HARD", 13, "#FFFFFF", "middle", True))
        ox, oy = px + 15, py + 50
        b.append(R(ox, oy + 170, 300, 30, SLATE))
        layers = [(oy + 156, AMBER), (oy + 142, TEAL), (oy + 128, AMBER), (oy + 114, TEAL), (oy + 100, AMBER), (oy + 86, TEAL)]
        if i == 0:
            for y, c in layers: b.append(R(ox, y, 300, 14, c))
        if i == 1:
            for y, c in layers: b.append(R(ox, y, 300, 14, c))
        if i >= 2:
            for y, c in layers:
                if c == TEAL:
                    b.append(R(ox + 100, y, 100, 14, c))
                elif i == 2:
                    b.append(R(ox + 100, y, 100, 14, c))
                elif i in (3, 4):
                    b.append(R(ox + 110, y, 80, 14, c))
                if c == AMBER and i >= 3:
                    b.append(R(ox + 100, y, 10, 14, SPACER)); b.append(R(ox + 190, y, 10, 14, SPACER))
        if i in (1, 2, 3, 4):
            b.append(R(ox + 110, oy + 20, 80, 66, POLY)); b.append(T(ox + 150, oy + 58, "dummy", 13, "#FFFFFF", "middle", True))
        if i >= 1:
            b.append(R(ox + 100, oy + 20, 10, 66, SPACER)); b.append(R(ox + 190, oy + 20, 10, 66, SPACER))
        if i >= 4:
            b.append(R(ox + 20, oy + 76, 80, 94, BLUE, rx=6)); b.append(R(ox + 200, oy + 76, 80, 94, BLUE, rx=6))
            b.append(T(ox + 60, oy + 128, "S", 18, "#FFFFFF", "middle", True)); b.append(T(ox + 240, oy + 128, "D", 18, "#FFFFFF", "middle", True))
        if i == 5:
            b.append(R(ox + 110, oy + 20, 80, 66, "#FFFFFF", SLATE, 1.5, dash="5 4"))
            b.append(T(ox + 150, oy + 58, "empty", 13, SLATE, "middle"))
        if i >= 6:
            b.append(R(ox + 110, oy + 20, 80, 150, COPPER))
            for y, c in layers:
                if c == TEAL: b.append(R(ox + 100, y, 100, 14, c))
            b.append(R(ox + 100, oy + 20, 10, 66, SPACER)); b.append(R(ox + 190, oy + 20, 10, 66, SPACER))
        if i == 7:
            b.append(R(ox + 40, oy + 20, 40, 56, NAVY)); b.append(R(ox + 220, oy + 20, 40, 56, NAVY))
            b.append(R(ox + 135, oy + 2, 30, 18, NAVY))
        b.append(T(px + 165, py + 268, captions[i][0], 15, INK, "middle"))
        b.append(T(px + 165, py + 288, captions[i][1], 15, INK, "middle"))
    return svg(1400, 730, b)


# --------------------------------------------------------------------------- 17
def fig_power():
    b = [T(700, 40, "Where the power wires go: three designs (side view)", 28, NAVY, "middle", True)]
    cols = [("Traditional: front-side power", MIST), ("Intel PowerVia (18A)", TEAL_T), ("TSMC Super Power Rail (A16)", TEAL_T)]
    for c, (title, fill) in enumerate(cols):
        x0 = 20 + c * 460
        b.append(card(x0, 70, 440, 560, fill))
        b.append(T(x0 + 220, 108, title, 21, NAVY, "middle", True))
        lx, w = x0 + 50, 340
        if c == 0:
            y = 140
            b.append(R(lx + 60, y, 30, 14, AMBER, rx=7)); b.append(R(lx + 250, y, 30, 14, AMBER, rx=7))
            b.append(T(lx + 170, y + 12, "power enters from top", 13, SLATE, "middle"))
            y = 165
            for k, (h, gap) in enumerate(((16, 30), (14, 26), (12, 22), (10, 18), (8, 14), (6, 12), (5, 10), (4, 9))):
                n = max(3, 6 + k)
                seg = w / n
                for j in range(n):
                    col = COPPER if (j + k) % 3 == 0 else SKY
                    b.append(R(lx + j * seg + seg * 0.15, y, seg * 0.7, h, col))
                y += h + gap * 0.6
            b.append(R(lx, y + 4, w, 26, TEAL)); b.append(T(lx + w / 2, y + 22, "transistors", 14, "#FFFFFF", "middle", True))
            b.append(R(lx, y + 30, w, 140, "#8A6F55")); b.append(T(lx + w / 2, y + 105, "thick silicon wafer", 15, "#FFFFFF", "middle"))
            b.append(L(lx + w + 25, 150, lx + w + 25, y + 10, RED, 3, arrow=True, red=True))
            b.append(T(x0 + 220, 560, "Power squeezes down through the", 16, INK, "middle"))
            b.append(T(x0 + 220, 582, "thinnest wires → voltage lost (IR drop)", 16, RED, "middle", True))
            b.append(T(x0 + 220, 604, "and signal space wasted", 16, INK, "middle"))
        else:
            y = 150
            b.append(R(lx, y, w, 40, SLATE)); b.append(T(lx + w / 2, y + 26, "carrier wafer (support)", 14, "#FFFFFF", "middle"))
            y = 200
            for k, h in enumerate((10, 8, 7, 6, 5, 4)):
                n = 5 + k
                seg = w / n
                for j in range(n):
                    b.append(R(lx + j * seg + seg * 0.15, y, seg * 0.7, h, SKY))
                y += h + 10
            b.append(R(lx, y + 4, w, 26, TEAL)); b.append(T(lx + w / 2, y + 22, "transistors", 14, "#FFFFFF", "middle", True))
            ty = y + 30
            b.append(R(lx, ty, w, 18, "#CDB9A3")); b.append(T(lx + w + 4, ty + 14, "thin Si", 11, INK))
            py = ty + 30
            for k, h in enumerate((14, 18, 22)):
                for j in range(3):
                    b.append(R(lx + 20 + j * 110, py, 80, h, COPPER))
                py += h + 12
            for cx in (lx + 55, lx + 290):
                if c == 1:
                    b.append(R(cx - 4, ty - 26, 8, 56, COPPER))
                else:
                    b.append(R(cx - 14, ty, 28, 30, COPPER))
            for j in range(4):
                b.append(R(lx + 30 + j * 90, py + 4, 30, 14, AMBER, rx=7))
            b.append(T(lx + w / 2, py + 40, "power enters from below", 13, SLATE, "middle"))
            if c == 1:
                b.append(T(x0 + 220, 560, "Thin 'nano-TSV' pillars carry power", 16, INK, "middle"))
                b.append(T(x0 + 220, 582, "up beside the transistors", 16, INK, "middle"))
                b.append(T(x0 + 220, 604, "Simpler; shipping first", 16, TEAL, "middle", True))
            else:
                b.append(T(x0 + 220, 560, "Power connects straight into each", 16, INK, "middle"))
                b.append(T(x0 + 220, 582, "transistor's source from below", 16, INK, "middle"))
                b.append(T(x0 + 220, 604, "Harder; saves more area", 16, TEAL, "middle", True))
    return svg(1400, 650, b)


# --------------------------------------------------------------------------- 18
def fig_roadmap():
    b = [T(700, 40, "What comes after nanosheets: squeezing n and p transistors closer", 27, NAVY, "middle", True),
         T(700, 70, "Every logic gate needs an n-type and a p-type transistor. Seen end-on:", 18, SLATE, "middle")]
    panels = [("Nanosheet (today, 2nm)", "n and p side by side, gap between", 300),
              ("Forksheet (proposed next)", "insulating wall lets them sit closer", 230),
              ("CFET (2030s research)", "p stacked on top of n", 140)]
    for k, (title, sub, fp) in enumerate(panels):
        x0 = 20 + k * 460
        b.append(card(x0, 90, 440, 470, TEAL_T if k == 2 else MIST))
        b.append(T(x0 + 220, 128, title, 21, NAVY, "middle", True))
        b.append(T(x0 + 220, 154, sub, 15, SLATE, "middle"))
        base = 430
        cx = x0 + 220
        b.append(R(x0 + 40, base, 360, 26, SLATE))
        def stack(x, y0, n, color, label):
            out = [R(x - 10, y0 - 12, 120, n * 34 + 6, COPPER, rx=8)]
            for i in range(n):
                out.append(R(x, y0 + i * 34, 100, 18, color, rx=3))
            out.append(T(x + 50, y0 - 20, label, 15, NAVY, "middle", True))
            return out
        if k == 0:
            b += stack(cx - 140, 300, 3, TEAL, "n-type"); b += stack(cx + 40, 300, 3, SKY, "p-type")
        elif k == 1:
            b += stack(cx - 112, 300, 3, TEAL, "n-type"); b += stack(cx + 12, 300, 3, SKY, "p-type")
            b.append(R(cx - 6, 278, 12, 130, "#FFFFFF", SLATE, 2)); b.append(T(cx, 272, "wall", 13, SLATE, "middle"))
        else:
            b += stack(cx - 50, 330, 2, TEAL, ""); b += stack(cx - 50, 225, 2, SKY, "")
            b.append(T(cx + 80, 260, "p-type", 15, NAVY, "start", True)); b.append(T(cx + 80, 360, "n-type", 15, NAVY, "start", True))
        b.append(L(cx - fp / 2, base + 50, cx + fp / 2, base + 50, INK, 2.5, arrow=True, both=True))
        b.append(T(cx, base + 80, "footprint", 15, INK, "middle", True))
        b.append(T(cx, base + 102, ["100%", "~75%", "~50%"][k], 17, COPPER, "middle", True))
    b.append(T(700, 590, "Smaller footprint per logic gate = more logic per mm², even when pitches barely shrink", 18, INK, "middle", True))
    return svg(1400, 610, b)


FIGS = {
    "11-mosfet-off-on": fig_mosfet, "12-id-vg-curve": fig_idvg, "13-short-channel-dam": fig_dam,
    "14-standard-cell-pitches": fig_layout, "15-finfet-vs-nanosheet-3d": fig_3d, "16-nanosheet-process-8-steps": fig_process,
    "17-backside-power-designs": fig_power, "18-after-nanosheets": fig_roadmap,
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, fn in FIGS.items():
        (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
        print(f"Wrote {OUT / name}.svg")
