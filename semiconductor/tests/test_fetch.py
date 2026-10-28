from pathlib import Path
from urllib.error import URLError

import pytest

from tracker import db
from tracker.config import Company, Source, load_sources, load_watchlist
from tracker.fetch import (
    fetch_all,
    is_relevant,
    match_companies,
    normalize_url,
    parse_feed,
)

FIXTURES = Path(__file__).parent / "fixtures"
BROAD = Source(name="Broad", url="https://example.com/feed", category="industry", filter=True)
FOCUSED = Source(name="Focused", url="https://example.com/chips", category="industry", filter=False)


@pytest.fixture
def companies():
    return load_watchlist()


@pytest.fixture
def conn(tmp_path, companies):
    c = db.connect(tmp_path / "test.db")
    db.init(c, [BROAD, FOCUSED], companies)
    return c


def feed_bytes():
    return (FIXTURES / "broad_feed.xml").read_bytes()


def test_config_files_load():
    sources, companies = load_sources(), load_watchlist()
    assert len(sources) >= 10
    assert len({s.name for s in sources}) == len(sources)
    assert len(companies) >= 25
    assert all(s.url.startswith("https://") for s in sources)


def test_parse_feed_cleans_html_and_skips_untitled():
    entries = parse_feed(feed_bytes())
    assert [e.title for e in entries][:2] == [
        "TSMC begins volume production of 2nm nanosheet chips",
        "SK hynix and Nvidia talk HBM4 supply",
    ]
    assert len(entries) == 3
    assert entries[0].summary == "The foundry says N2 yields are on track."
    assert entries[0].published_at == "2026-10-26T08:00:00Z"
    assert entries[0].url == "https://example.com/tsmc-2nm"


def test_normalize_url_keeps_real_params():
    assert normalize_url("https://x.com/a?id=5&utm_campaign=z#top") == "https://x.com/a?id=5"


def test_match_companies_is_case_sensitive_on_word_boundaries(companies):
    assert match_companies("SK hynix and Nvidia talk HBM4", companies) == ["Nvidia", "SK hynix"]
    assert match_companies("wear it on your arm", companies) == []
    assert match_companies("Arm unveils new cores", companies) == ["Arm"]
    assert match_companies("Intelligence report", companies) == []


def test_is_relevant():
    assert is_relevant("New EUV scanner", "New EUV scanner shipped", [])
    assert is_relevant("Quarterly results", "Quarterly results", ["TSMC"])
    assert not is_relevant("Best budget headphones", "Best budget headphones", [])


def test_deal_posts_are_noise_even_with_company_match():
    title = "Save $249 on 32GB of DDR5 with this 9800X3D bundle"
    assert not is_relevant(title, title, ["AMD"])
    assert not is_relevant("Black Friday GPU deals", "GPU deals", ["Nvidia"])


def test_fetch_filters_broad_sources_and_dedupes(conn, companies):
    results = fetch_all(conn, [BROAD], companies, download=lambda url: feed_bytes())
    assert (results[0].fetched, results[0].kept, results[0].new) == (3, 2, 2)

    rows = db.latest_articles(conn)
    assert [r["title"] for r in rows] == [
        "SK hynix and Nvidia talk HBM4 supply",
        "TSMC begins volume production of 2nm nanosheet chips",
    ]
    assert rows[0]["companies"] in ("Nvidia, SK hynix", "SK hynix, Nvidia")

    again = fetch_all(conn, [BROAD], companies, download=lambda url: feed_bytes())
    assert again[0].new == 0


def test_focused_source_keeps_everything(conn, companies):
    results = fetch_all(conn, [FOCUSED], companies, download=lambda url: feed_bytes())
    assert results[0].kept == 3


def test_failing_source_does_not_stop_others(conn, companies):
    def download(url):
        if url == BROAD.url:
            raise URLError("blocked")
        return feed_bytes()

    results = fetch_all(conn, [BROAD, FOCUSED], companies, download=download)
    assert results[0].error and "blocked" in results[0].error
    assert results[1].new == 3
