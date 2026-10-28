"""Command line: python -m tracker {init-db,fetch,latest}"""

import argparse
import sys
from pathlib import Path

from . import db
from .config import DEFAULT_DB_PATH, load_sources, load_watchlist
from .fetch import fetch_all


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="tracker", description="Semiconductor news tracker")
    parser.add_argument("--db", type=Path, default=DEFAULT_DB_PATH, help="SQLite database path")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("init-db", help="create tables and load sources + watchlist")

    fetch = sub.add_parser("fetch", help="fetch all feeds and store new articles")
    fetch.add_argument("--source", help="only fetch sources whose name contains this text")

    latest = sub.add_parser("latest", help="print the most recent stored articles")
    latest.add_argument("-n", type=int, default=20)

    args = parser.parse_args(argv)
    sources, companies = load_sources(), load_watchlist()
    conn = db.connect(args.db)
    db.init(conn, sources, companies)  # idempotent, keeps config and DB in sync

    if args.command == "init-db":
        print(f"Initialized {args.db} with {len(sources)} sources and {len(companies)} companies")

    elif args.command == "fetch":
        if args.source:
            sources = [s for s in sources if args.source.lower() in s.name.lower()]
        results = fetch_all(conn, sources, companies)
        for r in results:
            status = f"ERROR {r.error}" if r.error else f"{r.fetched} items, {r.kept} kept, {r.new} new"
            print(f"{r.source:<50} {status}")
        failed = sum(1 for r in results if r.error)
        print(f"\n{sum(r.new for r in results)} new articles; {failed}/{len(results)} sources failed")
        if failed == len(results):
            return 1

    elif args.command == "latest":
        for row in db.latest_articles(conn, args.n):
            companies_txt = f" [{row['companies']}]" if row["companies"] else ""
            print(f"{(row['published_at'] or '')[:10]}  {row['source']}: {row['title']}{companies_txt}")
            print(f"            {row['url']}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
