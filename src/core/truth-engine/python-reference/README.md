 # TRUTH ENGINE - Python Reference Implementation
 
 This is the Python reference implementation for standalone deployment.
 The TypeScript version in `../core/` is functionally identical and runs in Lovable.
 
 ## Structure
 
 ```
 python-reference/
 ├── ontology.py          # The 9 base classes
 ├── ids.py               # Deterministic ID generation
 ├── invariants.py        # The 5 laws (hard stops)
 ├── append_only.py       # No delete. No update.
 ├── test_invariants.py   # pytest tests
 └── schemas/
     └── population_resident_v1.yaml
 ```
 
 ## The Five Laws
 
 ```python
 # These are HARD STOPS. Violation = rejection.
 
 INV-001: No object without temporal axis
 INV-002: No measure without unit
 INV-003: No value without source
 INV-004: No schema without definition
 INV-005: No invalid base class
 ```
 
 ## First Truth
 
 ```yaml
 Entity: Sweden (SE)
 Value: 10,551,707 persons
 Source: Statistics Sweden (SCB)
 Observed: 2023-12-31
 Coverage: 99%
 ```
 
 ## Usage
 
 ```bash
 # Install dependencies
 pip install pytest pyyaml
 
 # Run tests
 pytest test_invariants.py -v
 
 # All tests should pass. If they fail, the system is broken.
 ```
 
 ## API Parity
 
 | Python | TypeScript |
 |--------|------------|
 | `BaseType(Enum)` | `type BaseClass` |
 | `enforce_invariants()` | `enforceInvariants()` |
 | `AppendOnlyStore.create()` | `create()` |
 | `run_invariants()` | `runInvariants()` |
 
 ## Machine Readability
 
 All outputs are designed for AI consumption:
 - JSON-LD compatible structures
 - Schema.org aligned vocabulary
 - Deterministic content-addressable IDs
 - Zero ambiguity in error messages