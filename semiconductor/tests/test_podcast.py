import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import make_podcast  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent


def test_parse_script_reads_turns_and_ignores_other_lines():
    text = "# Title\n\n**MEERA:** Hello there.\nnote line\n**ROHAN:** Hi!\n"
    assert make_podcast.parse_script(text) == [("MEERA", "Hello there."), ("ROHAN", "Hi!")]


def test_unknown_speaker_is_an_error():
    with pytest.raises(ValueError, match="BOB"):
        make_podcast.parse_script("**BOB:** hi")


def test_speakable_expands_terms_on_word_boundaries():
    assert make_podcast.speakable("SRAM and SiGe") == "S-RAM and silicon-germanium"
    assert make_podcast.speakable("SRAMs") == "SRAMs"


@pytest.mark.parametrize("script", sorted(ROOT.glob("weekly/*/podcast-script.md")))
def test_weekly_scripts_parse(script):
    turns = make_podcast.parse_script(script.read_text(encoding="utf-8"))
    assert len(turns) >= 20
    assert {s for s, _ in turns} == set(make_podcast.VOICES)
