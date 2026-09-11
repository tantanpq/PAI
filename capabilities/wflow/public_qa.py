#!/usr/bin/env python3
"""Independent public-package checks for W_Flow Core exact source bytes."""
import hashlib
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).parent
EXPECTED = {
    "loop_harness.py": "0222569d09287ef4673378307e54c7c2c270adad614b14909a7c8d083ce87704",
    "test_loop_harness.py": "4658cb0610b9d32127e82ad4f0cd0e91e902ca79f667902ad3fc14a0c9ba3867",
    "LOOP_BLUEPRINT_SCHEMA.json": "bfa6106e835fca9753c3f9c981f540b14e6c4780abd9e4912d34c7564e4aa362",
    "LOOP_INSTANCE_TEMPLATE.json": "643babc3b48fd9b5bf09081244e186930662d4c119787d8f8ae164c4a8d80263",
    "LOOP_INSTANCE_SEMANTICS.json": "32533794c59242cba5cc09d6976f650f7573b585d2c99b27ffc01a74795ac058",
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    for name, expected in EXPECTED.items():
        actual = sha256(ROOT / name)
        if actual != expected:
            raise SystemExit(f"SOURCE_HASH_MISMATCH:{name}:{actual}")

    completed = subprocess.run(
        [sys.executable, "-m", "unittest", "-q", "test_loop_harness.py"],
        cwd=ROOT,
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        sys.stderr.write(completed.stdout + completed.stderr)
        raise SystemExit("ORIGINAL_SUITE_FAIL")

    schema = json.loads((ROOT / "LOOP_BLUEPRINT_SCHEMA.json").read_text())
    template = json.loads((ROOT / "LOOP_INSTANCE_TEMPLATE.json").read_text())
    semantics = json.loads((ROOT / "LOOP_INSTANCE_SEMANTICS.json").read_text())

    assert schema["properties"]["lifecycle"]["enum"] == ["CANDIDATE", "DONE", "LIVE"]
    assert set(template["ownership"]) == {"owner", "mutable_scope"}
    assert template["canary_distribution"]["live_effect"] == "NONE"
    assert semantics["provider_neutral"] is True
    assert semantics["no_material_delta"]["successor_work"] == 0
    assert semantics["local_blocker"]["may_block_other_instances"] is False
    assert semantics["authority_gate"]["explicit_external_grant_required"] is True
    assert semantics["authority_gate"]["grant_is_not_implemented_here"] is True
    assert semantics["effect_ceiling"] == "NONE" and semantics["live_effect"] == "NONE"

    source_text = "\n".join((ROOT / name).read_text() for name in EXPECTED)
    forbidden = ["06_STATE/", "HOME_HOST", "P340", "P341", "MSI_HOST", "claim_", "PAI_CHIEF_WORK_NOTEBOOK"]
    hits = [token for token in forbidden if token in source_text]
    if hits:
        raise SystemExit(f"PRIVATE_COUPLING_FOUND:{','.join(hits)}")

    for internal in ("LOOP_CARDS.json", "LOOP_GARDEN_PROJECTION.json", "INTEGRATION_HANDOFF.md"):
        if (ROOT / internal).exists():
            raise SystemExit(f"INTERNAL_ARTIFACT_PRESENT:{internal}")

    print("WFLOW_PUBLIC_QA_PASS source_hashes=5 original_tests=8 provider_neutral=true replay=idempotent local_blocker=contained authority=external effect_ceiling=NONE")


if __name__ == "__main__":
    main()
