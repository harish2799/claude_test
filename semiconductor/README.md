# Semiconductor learning + tracker

A 12-week learning plan (see [PLAN.md](PLAN.md)) and a Python news tracker that will produce a daily brief at 7:00 AM IST.

## Layout
```
notes/      weekly lessons, quizzes, glossary
weekly/     per-week slides (.pptx) and podcast (script + MP3)
tools/      slide-deck builders (Node) and podcast generator (Python)
tracker/    Python package: sources, watchlist, SQLite storage, fetcher
tests/      pytest suite with sample feeds
briefs/     daily briefs (generated, from week 3)
hands-on/   Verilog / cocotb / OpenROAD exercises (from week 7)
data/       SQLite database (generated, git-ignored)
```

## Run it
```bash
cd semiconductor
pip install -r requirements.txt -r requirements-dev.txt

python -m tracker init-db          # create data/tracker.db, load sources + watchlist
python -m tracker fetch            # fetch every feed, store new chip-related articles
python -m tracker fetch --source "Google News"   # fetch a subset
python -m tracker latest -n 20     # show the newest stored articles

python -m pytest                   # run tests
```

`fetch` prints one line per source (items fetched / kept / new, or the error). One failing feed doesn't stop the rest.

## Weekly slides and podcast
Each `weekly/week-NN/` folder has:
- `week-NN-slides.pptx`: beginner-friendly visual deck (no background needed), with speaker notes
- `week-NN-deep-dive-slides.pptx`: optional technical version
- `images/`: illustrations drawn as SVG (`images/src/`) and rendered to PNG
- `podcast-script.md`: a Q&A between Dr. Meera (expert) and Rohan (learner)
- `podcast.mp3`: generated from the script by the **Weekly podcast audio** GitHub Action
  (Microsoft Edge neural voices via `edge-tts`, then `ffmpeg`), committed back automatically

Rebuild locally:
```bash
cd semiconductor/tools && npm install && cd ..
NODE_PATH=$(npm root -g) node tools/render_images.js weekly/week-01/images   # SVG -> PNG (Playwright)
NODE_PATH=tools/node_modules node tools/build_week01_slides.js
pip install edge-tts && python tools/make_podcast.py --all   # needs ffmpeg + internet
```

## Configuration
- `tracker/sources.toml`: feeds. `filter = true` keeps only items that mention a chip keyword or a watchlist company.
- `tracker/watchlist.toml`: 29 companies with aliases. Aliases are matched case-sensitively on word boundaries.

## Progress
- [x] Week 1: beginner lesson ([notes/week-01-how-chips-work.md](notes/week-01-how-chips-work.md)), slides, podcast; skeleton, 26 sources (incl. 14 newsletters), SQLite schema, RSS fetch, lesson 1
- [ ] Week 2: Claude tagging (topic, company, region, importance)
- [ ] Week 3: first daily brief generated locally
- [ ] Week 4: GitHub Actions daily run at 7:00 AM IST, brief committed to `briefs/`
