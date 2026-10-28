"""Fetch RSS/Atom feeds, filter for chip-related items, and store them."""

import html
import re
import sqlite3
import time
import urllib.request
from dataclasses import dataclass
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import feedparser

from . import db
from .config import Company, Source

# Substack (*.substack.com) answers 403 to non-browser user agents.
USER_AGENT = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/124.0 Safari/537.36 semiconductor-tracker/0.1")
ACCEPT = "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5"
SUMMARY_MAX_CHARS = 1000

# Used only for sources with filter = true. Matched case-insensitively on word
# boundaries; watchlist company mentions also count as relevant.
RELEVANCE_KEYWORDS = [
    "semiconductor", "semiconductors", "chip", "chips", "chipmaker", "chipmakers",
    "foundry", "foundries", "wafer", "wafers", "fab", "fabs", "lithography", "EUV",
    "High-NA", "transistor", "transistors", "GAA", "nanosheet", "FinFET",
    "HBM", "HBM3E", "HBM4", "DRAM", "NAND", "memory chip", "packaging", "CoWoS",
    "chiplet", "chiplets", "UCIe", "interposer", "OSAT", "GPU", "GPUs", "accelerator",
    "ASIC", "TPU", "NPU", "RISC-V", "EDA", "tape-out", "tapeout", "2nm", "3nm",
    "18A", "14A", "A16", "CHIPS Act", "export controls",
]
_KEYWORD_RE = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in RELEVANCE_KEYWORDS) + r")\b", re.IGNORECASE
)
# Shopping/deal posts on broad feeds mention chips but aren't news.
_NOISE_RE = re.compile(r"\b(save \$|deals?|% off|coupon|discount|lowest price|price drop)\b", re.IGNORECASE)
_TAG_RE = re.compile(r"<[^>]+>")
_WS_RE = re.compile(r"\s+")


@dataclass
class Entry:
    url: str
    title: str
    summary: str
    published_at: str | None


@dataclass
class SourceResult:
    source: str
    fetched: int = 0
    kept: int = 0
    new: int = 0
    error: str | None = None


def clean_text(raw: str | None) -> str:
    text = html.unescape(_TAG_RE.sub(" ", raw or ""))
    return _WS_RE.sub(" ", text).strip()


def normalize_url(url: str) -> str:
    """Drop tracking parameters and fragments so the same story dedupes."""
    parts = urlsplit(url.strip())
    query = [(k, v) for k, v in parse_qsl(parts.query) if not k.lower().startswith("utm_")]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), ""))


def parse_feed(data: bytes) -> list[Entry]:
    parsed = feedparser.parse(data)
    entries = []
    for e in parsed.entries:
        url = e.get("link")
        title = clean_text(e.get("title"))
        if not url or not title:
            continue
        stamp = e.get("published_parsed") or e.get("updated_parsed")
        published_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", stamp) if stamp else None
        summary = clean_text(e.get("summary"))[:SUMMARY_MAX_CHARS]
        entries.append(Entry(normalize_url(url), title, summary, published_at))
    return entries


def match_companies(text: str, companies: list[Company]) -> list[str]:
    return [
        c.name
        for c in companies
        if any(re.search(r"\b" + re.escape(alias) + r"\b", text) for alias in c.aliases)
    ]


def is_relevant(title: str, text: str, company_matches: list[str]) -> bool:
    if _NOISE_RE.search(title):
        return False
    return bool(company_matches) or bool(_KEYWORD_RE.search(text))


def download(url: str, timeout: float = 20.0) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": ACCEPT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def store_entries(
    conn: sqlite3.Connection, source: Source, entries: list[Entry], companies: list[Company]
) -> SourceResult:
    result = SourceResult(source.name, fetched=len(entries))
    sid = db.source_id(conn, source.name)
    for entry in entries:
        text = f"{entry.title} {entry.summary}"
        matches = match_companies(text, companies)
        if source.filter and not is_relevant(entry.title, text, matches):
            continue
        result.kept += 1
        if db.insert_article(conn, sid, entry.url, entry.title, entry.summary,
                             entry.published_at, matches):
            result.new += 1
    conn.commit()
    return result


def fetch_all(
    conn: sqlite3.Connection, sources: list[Source], companies: list[Company], download=download
) -> list[SourceResult]:
    """Fetch every source. A failing source is reported, not raised."""
    results = []
    for source in sources:
        error = None
        for url in filter(None, (source.url, source.fallback_url)):
            try:
                entries = parse_feed(download(url))
                break
            except Exception as exc:  # network errors, HTTP errors, timeouts
                error = f"{type(exc).__name__}: {exc}"
        else:
            results.append(SourceResult(source.name, error=error))
            continue
        result = store_entries(conn, source, entries, companies)
        if error:
            result.source += " (via fallback)"
        results.append(result)
    return results
