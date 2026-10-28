# Semiconductor learning + tracker

A 12-week learning plan (see [PLAN.md](PLAN.md)) and a Python news tracker that will produce a daily brief at 7:00 AM IST.

## Layout
```
notes/      weekly lessons, quizzes, glossary
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

## Configuration
- `tracker/sources.toml`: feeds. `filter = true` keeps only items that mention a chip keyword or a watchlist company.
- `tracker/watchlist.toml`: 29 companies with aliases. Aliases are matched case-sensitively on word boundaries.

## Progress
- [x] Week 1: skeleton, sources, SQLite schema, RSS fetch, lesson 1
- [ ] Week 2: Claude tagging (topic, company, region, importance)
- [ ] Week 3: first daily brief generated locally
- [ ] Week 4: GitHub Actions daily run at 7:00 AM IST, brief committed to `briefs/`
