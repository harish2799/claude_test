# Semiconductor Learning + Tracker Plan

## Profile
| | |
|---|---|
| Background | Electronics / EE / VLSI |
| Goals | Career, investing, general understanding, AI hardware |
| Career focus | Chip design / VLSI / verification, AI hardware / systems |
| Regions | India, USA, Europe (plus Taiwan/Korea/Japan/China as supply-chain context) |
| Time | 5–8 hours/week |
| Stack | Python, free sources, Claude API for summaries |
| Delivery | Daily brief at 7:00 AM IST (01:30 UTC), committed to the repo only (email later, maybe) |

## Weekly rhythm (~6 h)
- **Learn (2 h):** one lesson in `semiconductor/notes/`, written at EE level, with diagrams and a 10-question quiz.
- **Build (3 h):** one tracker milestone or one hands-on VLSI/AI-hardware exercise.
- **Review (1 h):** read the week's daily briefs, answer the quiz, add terms to the glossary.

## 12-week curriculum

### Module 1 — Process technology (weeks 1–3)
| Week | Learn | Build |
|---|---|---|
| 1 | Node naming vs. real pitches; FinFET → GAA/nanosheet; backside power delivery | Repo skeleton, source list, SQLite schema, first RSS fetch |
| 2 | Lithography: DUV multipatterning, EUV, High-NA EUV; why ASML matters | Claude tagging step (topic, company, region, importance) |
| 3 | Fab economics: wafer cost, yield, D0, capex; foundry vs IDM | First daily brief generated locally |

### Module 2 — Memory & advanced packaging (weeks 4–6)
| Week | Learn | Build |
|---|---|---|
| 4 | DRAM/NAND basics, HBM stack (TSVs, base die, HBM3E → HBM4) | Daily GitHub Actions run that commits `briefs/YYYY-MM-DD.md` |
| 5 | Chiplets, interposers, CoWoS / SoIC / EMIB / Foveros, UCIe | De-duplication + "story clustering" across sources |
| 6 | Why packaging is the AI bottleneck; OSATs; thermal & power | SEC EDGAR filings + earnings-date calendar for the watchlist |

### Module 3 — Design, verification & AI hardware (weeks 7–9)
| Week | Learn | Build |
|---|---|---|
| 7 | RTL → GDSII flow, EDA (Synopsys/Cadence/Siemens), PPA trade-offs | Hands-on: Yosys + OpenROAD on a small design (Sky130 PDK) |
| 8 | Verification: UVM concepts, cocotb, formal; why verification is ~50%+ of effort | Hands-on: cocotb testbench for a small Verilog block |
| 9 | AI accelerators: GPU vs TPU vs custom ASIC, systolic arrays, memory bandwidth, roofline model, interconnect (NVLink, Ethernet/UEC) | Hands-on: tiny systolic-array matmul in Verilog + cocotb test |

### Module 4 — Industry, policy & careers (weeks 10–12)
| Week | Learn | Build |
|---|---|---|
| 10 | Value chain map: IP → EDA → design → foundry → OSAT → systems; who has pricing power | Weekly rollup + company pages (latest news per company) |
| 11 | Policy: US CHIPS Act & export controls, EU Chips Act, India Semiconductor Mission (fabs, ATMP/OSAT, Design Linked Incentive) | Dashboard page: news volume by topic/region, earnings calendar |
| 12 | Careers: roles, skills and companies in India/US/Europe; reading earnings calls like an analyst | Jobs/hiring signal tag; retrospective + next 12-week plan |

## Tracker design

**Pipeline (runs daily via GitHub Actions cron):**
1. **Collect** — RSS feeds, company investor-relations / newsroom feeds, SEC EDGAR filings, government press releases, arXiv `cs.AR`.
2. **Store** — SQLite (`data/tracker.db`): articles, companies, tags, briefs.
3. **Classify** — small, cheap Claude model tags each item: topic, companies, region, importance (1–5).
4. **Brief** — larger Claude model writes the daily brief from the top items.
5. **Publish** — commit `semiconductor/briefs/YYYY-MM-DD.md`; dashboard page later.

**Daily brief format:**
- Top 3 stories (2–3 sentences each, "why it matters")
- By topic: Process · Memory & Packaging · Design/EDA · AI hardware · Policy · Business/Earnings
- Region watch: India · USA · Europe
- Learn-one-thing: one term or concept explained, linked to the current module
- Upcoming earnings / events

**Tags:** `process`, `lithography`, `memory`, `hbm`, `packaging`, `design-eda`, `verification`, `ai-hardware`, `policy`, `export-controls`, `earnings`, `capex`, `jobs`, `india`, `usa`, `europe`, `asia`

**Watchlist (broad, ~28):**
- AI / compute: Nvidia, AMD, Intel, Broadcom, Marvell, Qualcomm, Arm
- Foundry: TSMC, Samsung, Intel Foundry, GlobalFoundries, UMC
- Memory: SK hynix, Micron, Samsung Memory, Kioxia
- Equipment: ASML, Applied Materials, Lam Research, KLA, Tokyo Electron
- EDA / IP: Synopsys, Cadence, Siemens EDA
- Packaging / OSAT: ASE, Amkor
- India: Tata Electronics, Micron Sanand, CG Semi
- Europe: Infineon, STMicroelectronics, NXP

**Repo layout:**
```
semiconductor/
  PLAN.md
  notes/          # weekly lessons, glossary.md, quizzes
  tracker/        # Python package: collect, store, classify, brief
  briefs/         # daily briefs (generated)
  hands-on/       # Verilog, cocotb, OpenROAD exercises
  data/           # sqlite db (generated)
.github/workflows/daily-brief.yml
```

**Setup you'll need to do:** add `ANTHROPIC_API_KEY` as a GitHub Actions repository secret.

## Decisions
- Daily brief at **7:00 AM IST** → GitHub Actions cron `30 1 * * *` (UTC). Scheduled workflows only run from the repository's default branch.
- Briefs are **committed to the repo only** for now.

## Open questions
1. Semi Doped podcast feed: not found yet (episodes may already appear via the Chipstrat / Vik's Newsletter feeds).
