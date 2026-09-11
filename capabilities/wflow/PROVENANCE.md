# W_Flow Core 0.1.0 provenance

Recovered source family: Google Drive folder `13Xg7kVFez0mTqUMc26eZOeO0EQUBUa53` (`PAI_WFLOW_LOOP_BUILDER_R1`).

The public package deliberately excludes PAI-internal portfolio/Notebook projection artifacts and reuses only the provider-neutral core.

| Public source | Drive ID | SHA-256 | Treatment |
| --- | --- | --- | --- |
| `loop_harness.py` | `1aJ5ZCI4iYH4i0Z3sxiX21ce4KSmkp6y_` | `0222569d09287ef4673378307e54c7c2c270adad614b14909a7c8d083ce87704` | byte-identical reuse |
| `test_loop_harness.py` | `17NCrANGb9aK-42rj_teFLIw2gAw7KypC` | `4658cb0610b9d32127e82ad4f0cd0e91e902ca79f667902ad3fc14a0c9ba3867` | byte-identical reuse |
| `LOOP_BLUEPRINT_SCHEMA.json` | `1IBJZhiU2aFQ7jAjc2FSp4xoJBL3HTf7s` | `bfa6106e835fca9753c3f9c981f540b14e6c4780abd9e4912d34c7564e4aa362` | byte-identical reuse |
| `LOOP_INSTANCE_TEMPLATE.json` | `1B9unrG4wFxWe_5i5n8ujJXNXXI-yWPEX` | `643babc3b48fd9b5bf09081244e186930662d4c119787d8f8ae164c4a8d80263` | byte-identical reuse |
| `LOOP_INSTANCE_SEMANTICS.json` | `1MluKmfJnvcypPwmUW-J_AlVFjAw43_VR` | `32533794c59242cba5cc09d6976f650f7573b585d2c99b27ffc01a74795ac058` | byte-identical reuse |

Recovered completion evidence reports `13/13 PASS` including the original `8/8` core suite and independent frozen-byte QA. The historical frozen QA manifest SHA-256 is `cf67370f6e81b51299a4654b8cba0177357505b9b06ee0f599512be5e1844538`; its independent QA script SHA-256 is `a84ebf80590ac1696f2cbf8d0ccce774e87e8628ad76d6cd87146aa5ad6d2c8d`.

Public-only additions are packaging metadata, standalone documentation, benchmark, public QA, example and Apache-2.0 license. They do not inherit private runtime authority.

Explicitly excluded from the public package: `LOOP_CARDS.json`, `LOOP_GARDEN_PROJECTION.json`, private integration handoff/runtime ownership, PAI Program/Claim/Farm internals and any customer/private state.
