#!/usr/bin/env python3
"""Zero-dependency checks for the bounded PAI public asset catalog."""

from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "catalog" / "public-assets.yaml"
VALID_RELEASE = {"AUTO_RELEASE", "AUTO_RELEASE_AFTER_IQA", "HUMAN_GATE", "REJECT_AUTO"}


def fail(message):
    print(f"PUBLIC_INTEGRITY_FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


def parse_catalog(text):
    assets = []
    current = None
    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("- asset_id:"):
            if current:
                assets.append(current)
            current = {"asset_id": line.split(":", 1)[1].strip()}
        elif current and ":" in line:
            key, value = line.split(":", 1)
            if key in {"asset_class", "path", "version", "maturity", "release_class", "provenance", "license_source"}:
                current[key] = value.strip()
    if current:
        assets.append(current)
    return assets


def main():
    if not CATALOG.is_file():
        fail("catalog/public-assets.yaml missing")
    assets = parse_catalog(CATALOG.read_text(encoding="utf-8"))
    if not assets:
        fail("catalog has no assets")

    ids = set()
    paths = set()
    secret_patterns = [
        re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
        re.compile(r"\bgh[pousr]_[A-Za-z0-9]{20,}\b"),
        re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"),
        re.compile(r"(?i)(?:password|passwd|api[_-]?key|access[_-]?token|secret)\s*[:=]\s*['\"][^'\"]{8,}['\"]"),
    ]
    private_path = re.compile(r"(?i)\b[A-Z]:\\(?:Users|ProgramData)\\")

    for asset in assets:
        asset_id = asset.get("asset_id", "")
        rel = asset.get("path", "")
        release = asset.get("release_class", "")
        if not asset_id or asset_id in ids:
            fail(f"duplicate or missing asset_id: {asset_id!r}")
        ids.add(asset_id)
        if not rel or rel in paths:
            fail(f"duplicate or missing asset path: {rel!r}")
        paths.add(rel)
        if release not in VALID_RELEASE:
            fail(f"invalid release_class for {asset_id}: {release!r}")
        target = (ROOT / rel).resolve()
        try:
            target.relative_to(ROOT.resolve())
        except ValueError:
            fail(f"asset escapes repository root: {asset_id}")
        if not target.is_file():
            fail(f"catalog asset missing: {asset_id} -> {rel}")
        text = target.read_text(encoding="utf-8")
        if private_path.search(text):
            fail(f"private absolute path found in catalog asset: {asset_id}")
        for pattern in secret_patterns:
            if pattern.search(text):
                fail(f"credential-like material found in catalog asset: {asset_id}")

    md_link = re.compile(r"\[[^\]]+\]\((?!https?://|mailto:|#)([^)#]+)(?:#[^)]+)?\)")
    for doc in ROOT.rglob("*.md"):
        if any(part in {".git", ".agents"} for part in doc.parts):
            continue
        for rel in md_link.findall(doc.read_text(encoding="utf-8")):
            candidate = (doc.parent / rel).resolve()
            try:
                candidate.relative_to(ROOT.resolve())
            except ValueError:
                fail(f"local markdown link escapes repository: {doc.relative_to(ROOT)} -> {rel}")
            if not candidate.exists():
                fail(f"broken local markdown link: {doc.relative_to(ROOT)} -> {rel}")

    print(f"PUBLIC_INTEGRITY_PASS assets={len(assets)} markdown_links=checked")


if __name__ == "__main__":
    main()
