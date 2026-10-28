"""Load the source list and company watchlist."""

import tomllib
from dataclasses import dataclass, field
from pathlib import Path

PACKAGE_DIR = Path(__file__).resolve().parent
DEFAULT_DB_PATH = PACKAGE_DIR.parent / "data" / "tracker.db"


@dataclass(frozen=True)
class Source:
    name: str
    url: str
    category: str
    filter: bool = True
    region: str | None = None


@dataclass(frozen=True)
class Company:
    name: str
    segment: str
    aliases: tuple[str, ...] = field(default_factory=tuple)


def load_sources(path: Path = PACKAGE_DIR / "sources.toml") -> list[Source]:
    with open(path, "rb") as f:
        data = tomllib.load(f)
    return [Source(**s) for s in data.get("source", [])]


def load_watchlist(path: Path = PACKAGE_DIR / "watchlist.toml") -> list[Company]:
    with open(path, "rb") as f:
        data = tomllib.load(f)
    return [
        Company(name=c["name"], segment=c["segment"], aliases=tuple(c.get("aliases", [c["name"]])))
        for c in data.get("company", [])
    ]
