"""SQLite storage for sources, articles, companies, tags and briefs."""

import sqlite3
from pathlib import Path

from .config import Company, Source

SCHEMA = """
CREATE TABLE IF NOT EXISTS sources (
    id          INTEGER PRIMARY KEY,
    name        TEXT NOT NULL UNIQUE,
    url         TEXT NOT NULL,
    category    TEXT NOT NULL,
    region      TEXT
);

CREATE TABLE IF NOT EXISTS articles (
    id            INTEGER PRIMARY KEY,
    source_id     INTEGER NOT NULL REFERENCES sources(id),
    url           TEXT NOT NULL UNIQUE,
    title         TEXT NOT NULL,
    summary       TEXT,
    published_at  TEXT,               -- ISO 8601, UTC
    fetched_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at);

CREATE TABLE IF NOT EXISTS companies (
    id       INTEGER PRIMARY KEY,
    name     TEXT NOT NULL UNIQUE,
    segment  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS article_companies (
    article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    company_id  INTEGER NOT NULL REFERENCES companies(id),
    PRIMARY KEY (article_id, company_id)
);

-- Filled by the Claude classification step (week 2).
CREATE TABLE IF NOT EXISTS article_tags (
    article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag         TEXT NOT NULL,
    PRIMARY KEY (article_id, tag)
);

CREATE TABLE IF NOT EXISTS article_scores (
    article_id   INTEGER PRIMARY KEY REFERENCES articles(id) ON DELETE CASCADE,
    importance   INTEGER NOT NULL CHECK (importance BETWEEN 1 AND 5),
    one_liner    TEXT,
    scored_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Filled by the daily brief step (week 3).
CREATE TABLE IF NOT EXISTS briefs (
    brief_date    TEXT PRIMARY KEY,   -- YYYY-MM-DD (IST)
    markdown      TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);
"""


def connect(path: Path) -> sqlite3.Connection:
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init(conn: sqlite3.Connection, sources: list[Source], companies: list[Company]) -> None:
    conn.executescript(SCHEMA)
    conn.executemany(
        """INSERT INTO sources (name, url, category, region) VALUES (?, ?, ?, ?)
           ON CONFLICT(name) DO UPDATE SET url = excluded.url,
               category = excluded.category, region = excluded.region""",
        [(s.name, s.url, s.category, s.region) for s in sources],
    )
    conn.executemany(
        """INSERT INTO companies (name, segment) VALUES (?, ?)
           ON CONFLICT(name) DO UPDATE SET segment = excluded.segment""",
        [(c.name, c.segment) for c in companies],
    )
    conn.commit()


def source_id(conn: sqlite3.Connection, name: str) -> int:
    return conn.execute("SELECT id FROM sources WHERE name = ?", (name,)).fetchone()["id"]


def insert_article(
    conn: sqlite3.Connection,
    source_id: int,
    url: str,
    title: str,
    summary: str | None,
    published_at: str | None,
    company_names: list[str],
) -> bool:
    """Insert an article and its company links. Returns False if the URL already exists."""
    cur = conn.execute(
        """INSERT INTO articles (source_id, url, title, summary, published_at)
           VALUES (?, ?, ?, ?, ?) ON CONFLICT(url) DO NOTHING""",
        (source_id, url, title, summary, published_at),
    )
    if cur.rowcount == 0:
        return False
    article_id = cur.lastrowid
    conn.executemany(
        """INSERT OR IGNORE INTO article_companies (article_id, company_id)
           SELECT ?, id FROM companies WHERE name = ?""",
        [(article_id, name) for name in company_names],
    )
    return True


def latest_articles(conn: sqlite3.Connection, limit: int = 20) -> list[sqlite3.Row]:
    return conn.execute(
        """SELECT a.title, a.url, a.published_at, s.name AS source,
                  GROUP_CONCAT(c.name, ', ') AS companies
           FROM articles a
           JOIN sources s ON s.id = a.source_id
           LEFT JOIN article_companies ac ON ac.article_id = a.id
           LEFT JOIN companies c ON c.id = ac.company_id
           GROUP BY a.id
           ORDER BY COALESCE(a.published_at, a.fetched_at) DESC
           LIMIT ?""",
        (limit,),
    ).fetchall()
