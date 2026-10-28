"""Turn a two-host podcast script into an MP3 with edge-tts + ffmpeg.

Script format (markdown): every spoken turn is a line like
    **MEERA:** text...
Other lines (headings, notes, blank lines) are ignored.

Usage:
    python tools/make_podcast.py weekly/week-01/podcast-script.md
    python tools/make_podcast.py --all            # every weekly/*/podcast*-script.md
<name>-script.md renders to <name>.mp3 (podcast-script.md -> podcast.mp3,
podcast-deep-dive-script.md -> podcast-deep-dive.mp3). An MP3 is rebuilt only when
the script (or voice config) changed; the rendered hash is kept in <name>.mp3.sha256.
"""

import argparse
import asyncio
import hashlib
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOICES = {
    "MEERA": "en-IN-NeerjaNeural",   # expert
    "ROHAN": "en-IN-PrabhatNeural",  # learner
}
RATE = "+0%"
PAUSE_SECONDS = 0.35

TURN_RE = re.compile(r"^\*\*([A-Z]+):\*\*\s*(.+)$")
# Written forms that text-to-speech reads badly.
PRONUNCIATION = {
    "SRAM": "S-RAM",
    "SiGe": "silicon-germanium",
}


def parse_script(text: str) -> list[tuple[str, str]]:
    turns = []
    for line in text.splitlines():
        m = TURN_RE.match(line.strip())
        if m:
            speaker, said = m.groups()
            if speaker not in VOICES:
                raise ValueError(f"Unknown speaker {speaker!r}; add a voice for it in VOICES")
            turns.append((speaker, said.strip()))
    return turns


def speakable(said: str) -> str:
    for written, spoken in PRONUNCIATION.items():
        said = re.sub(rf"\b{re.escape(written)}\b", spoken, said)
    return said


def fingerprint(script: str) -> str:
    config = f"{sorted(VOICES.items())}|{RATE}|{PAUSE_SECONDS}|{sorted(PRONUNCIATION.items())}"
    return hashlib.sha256((config + "\n" + script).encode()).hexdigest()


async def render(turns: list[tuple[str, str]], out_mp3: Path) -> None:
    import edge_tts  # imported here so parsing/tests don't need it

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        silence = tmp / "silence.mp3"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-f", "lavfi", "-i",
                        "anullsrc=r=24000:cl=mono", "-t", str(PAUSE_SECONDS), "-q:a", "9", str(silence)],
                       check=True)
        parts = []
        for i, (speaker, said) in enumerate(turns):
            clip = tmp / f"{i:04d}.mp3"
            await edge_tts.Communicate(speakable(said), VOICES[speaker], rate=RATE).save(str(clip))
            parts += [clip, silence]
            print(f"  [{i + 1}/{len(turns)}] {speaker}", flush=True)
        listing = tmp / "list.txt"
        listing.write_text("".join(f"file '{p}'\n" for p in parts))
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(listing),
                        "-ac", "1", "-ar", "24000", "-b:a", "64k", str(out_mp3)], check=True)


def build(script_path: Path, force: bool = False) -> bool:
    script = script_path.read_text(encoding="utf-8")
    stem = script_path.name.removesuffix("-script.md")
    out_mp3 = script_path.with_name(f"{stem}.mp3")
    sha_file = script_path.with_name(f"{stem}.mp3.sha256")
    digest = fingerprint(script)
    if not force and out_mp3.exists() and sha_file.exists() and sha_file.read_text().strip() == digest:
        print(f"{script_path}: up to date")
        return False
    turns = parse_script(script)
    if not turns:
        raise ValueError(f"{script_path}: no '**NAME:** text' turns found")
    print(f"{script_path}: rendering {len(turns)} turns")
    asyncio.run(render(turns, out_mp3))
    sha_file.write_text(digest + "\n")
    print(f"Wrote {out_mp3}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("scripts", nargs="*", type=Path)
    parser.add_argument("--all", action="store_true", help="build every weekly/*/podcast*-script.md")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    scripts = sorted(ROOT.glob("weekly/*/podcast*-script.md")) if args.all else args.scripts
    if not scripts:
        parser.error("give script paths or --all")
    for path in scripts:
        build(path, args.force)
    return 0


if __name__ == "__main__":
    sys.exit(main())
