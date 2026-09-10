# Public Release Receipt Template

Use this after a public GitHub release/write to record what actually became public.

```text
RELEASE_ID:
ASSET_ID:
VERSION_OR_REVISION:
RELEASE_CLASS:
SOURCE_PROVENANCE:
BASE_IDENTITY:
CANDIDATE_IDENTITY:
PUBLIC_COMMIT_OR_TAG:
DECLARED_DELTA:
OBSERVED_DELTA:
TEST_STATUS:
INDEPENDENT_QA:
PRIVACY_CHECK:
SECRET_CHECK:
RIGHTS_CHECK:
MOAT_CHECK:
CLAIM_BOUNDARY:
UNSUPPORTED_CLAIMS:
PUBLIC_READBACK:
SUPERSEDES:
ROLLBACK_OR_REVOKE:
TERMINAL_STATUS:
```

## Terminal states

- `PUBLISHED_VERIFIED`: public object exists and matches the bounded expectation.
- `PUBLISHED_DEGRADED`: public object exists but a non-claim-critical derivative/readback is degraded.
- `FAILED_NO_PUBLIC_EFFECT`: release failed before public mutation.
- `UNKNOWN_PUBLIC_STATE`: effect may have occurred but readback cannot establish the final state.
- `REVOKED`: future distribution is disabled or an explicit removal/supersession was completed.

Do not call a release terminal `PUBLISHED_VERIFIED` merely because an API returned success. Direct public readback is part of the receipt.
